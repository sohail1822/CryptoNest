import axios from "axios";
import CryptoCache from "../models/cryptoCache.model.js";
import CoinPrice from "../models/coinPrice.model.js";
import env from "../config/env.js";

const COINSTATS_BASE_URL = "https://api.coinstats.app/v1";
const CACHE_VERSION = "coinstats_v1";

const CACHE_SHORT = 60_000;
const CACHE_MEDIUM = 5 * 60_000;
const CACHE_LONG = 15 * 60_000;

const coinstatsClient = axios.create({
  baseURL: COINSTATS_BASE_URL,
  timeout: 10_000,
  headers: {
    Accept: "application/json",
    "X-API-KEY": env.COINSTATS_API_KEY,
  },
});

const cacheKeyFor = (key) => `${CACHE_VERSION}:${key}`;

const serviceError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const isFresh = (cached, duration) =>
  cached && Date.now() - new Date(cached.lastUpdated).getTime() < duration;

const normalisePositiveInteger = (value, fallback, maximum) => {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return Math.min(parsed, maximum);
};

const normaliseCurrency = (currency = "INR") =>
  String(currency).trim().toUpperCase() || "INR";

const toMarketCoin = (coin) => ({
  id: coin.id,
  symbol: coin.symbol,
  name: coin.name,
  image: coin.icon || null,
  currentPrice: coin.price ?? null,
  marketCap: coin.marketCap ?? null,
  rank: coin.rank ?? null,
  volume: coin.volume ?? null,
  change1h: coin.priceChange1h ?? null,
  change24h: coin.priceChange1d ?? null,
  change7d: coin.priceChange1w ?? null,
  change30d: coin.priceChange1m ?? null,
  allTimeHigh: coin.allTimeHigh ?? null,
  allTimeLow: coin.allTimeLow ?? null,
});

const toCachedMarketCoin = (coin) => ({
  id: coin.coinId,
  symbol: coin.symbol,
  name: coin.name,
  image: coin.image || null,
  currentPrice: coin.currentPrice ?? null,
  marketCap: coin.marketCap ?? null,
  rank: coin.marketCapRank ?? null,
  volume: coin.totalVolume ?? null,
  change1h: coin.priceChange1h ?? null,
  change24h: coin.priceChangePercentage24h ?? null,
  change7d: coin.priceChange7d ?? null,
  change30d: coin.priceChange30d ?? null,
  allTimeHigh: coin.allTimeHigh ?? null,
  allTimeLow: coin.allTimeLow ?? null,
});

const toCoinDetail = (coin, currency) => ({
  ...toMarketCoin(coin),
  currency,
  websiteUrl: coin.websiteUrl || null,
  redditUrl: coin.redditUrl || null,
  twitterUrl: coin.twitterUrl || null,
  explorers: coin.explorers || [],
  availableSupply: coin.availableSupply ?? null,
  totalSupply: coin.totalSupply ?? null,
  fullyDilutedValuation: coin.fullyDilutedValuation ?? null,
  updatedAt: new Date().toISOString(),
});

const periodForDays = (days) => {
  const parsedDays = normalisePositiveInteger(days, 7, 3650);
  if (parsedDays <= 1) return "24h";
  if (parsedDays <= 7) return "1w";
  if (parsedDays <= 30) return "1m";
  if (parsedDays <= 90) return "3m";
  if (parsedDays <= 365) return "1y";
  return "all";
};

const withRetry = async (request, maxRetries = 2) => {
  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    try {
      return await request();
    } catch (error) {
      const status = error.response?.status;
      const retryable = status === 429 || (status >= 500 && status < 600) || !status;

      if (!retryable || attempt === maxRetries) throw error;

      const retryAfter = Number(error.response?.headers?.["retry-after"]);
      const waitMs = Number.isFinite(retryAfter)
        ? retryAfter * 1000
        : 1_000 * 2 ** attempt;

      console.warn(
        `CoinStats request failed with ${status || "a network error"}. Retrying in ${waitMs}ms.`,
      );
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
  }
};

const getCachedOrFallback = async (cacheKey, duration, request) => {
  const cached = await CryptoCache.findOne({ key: cacheKey });
  if (isFresh(cached, duration)) return cached.data;

  try {
    const data = await request();
    await CryptoCache.findOneAndUpdate(
      { key: cacheKey },
      { data, lastUpdated: new Date() },
      { upsert: true, new: true },
    );
    return data;
  } catch (error) {
    if (cached) return cached.data;
    throw error;
  }
};

const cryptoService = {
  getMarketData: async (currency = "INR", limit = 25, page = 1, coinIds = "") => {
    const normalisedCurrency = normaliseCurrency(currency);
    const normalisedLimit = normalisePositiveInteger(limit, 25, 100);
    const normalisedPage = normalisePositiveInteger(page, 1, 1000);
    const ids = String(coinIds || "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean)
      .slice(0, 100);

    if (ids.length > 0) {
      const cachedCoins = await CoinPrice.find({
        provider: "coinstats",
        coinId: { $in: ids },
        lastUpdated: { $gt: new Date(Date.now() - CACHE_SHORT) },
      });

      if (cachedCoins.length === ids.length) {
        const coinsById = new Map(cachedCoins.map((coin) => [coin.coinId, coin]));
        return ids.map((id) => toCachedMarketCoin(coinsById.get(id)));
      }
    }

    const cacheKey = cacheKeyFor(
      `markets:${normalisedCurrency}:${normalisedLimit}:${normalisedPage}:${ids.join(",")}`,
    );

    return getCachedOrFallback(cacheKey, CACHE_SHORT, async () => {
      const response = await withRetry(() =>
        coinstatsClient.get("/coins", {
          params: {
            currency: normalisedCurrency,
            page: normalisedPage,
            limit: normalisedLimit,
            coinIds: ids.length > 0 ? ids.join(",") : undefined,
            sortBy: "marketCap",
            sortDir: "desc",
          },
        }),
      );

      const coins = (response.data.result || []).map(toMarketCoin);
      const bulkOperations = coins.map((coin) => ({
        updateOne: {
          filter: { coinId: coin.id },
          update: {
            provider: "coinstats",
            coinId: coin.id,
            symbol: coin.symbol,
            name: coin.name,
            image: coin.image,
            currentPrice: coin.currentPrice,
            marketCap: coin.marketCap,
            marketCapRank: coin.rank,
            totalVolume: coin.volume,
            priceChange1h: coin.change1h,
            priceChangePercentage24h: coin.change24h,
            priceChange7d: coin.change7d,
            priceChange30d: coin.change30d,
            allTimeHigh: coin.allTimeHigh,
            allTimeLow: coin.allTimeLow,
            lastUpdated: new Date(),
          },
          upsert: true,
        },
      }));

      if (bulkOperations.length > 0) {
        await CoinPrice.bulkWrite(bulkOperations);
      }

      return coins;
    });
  },

  getGlobalData: async () => {
    const cacheKey = cacheKeyFor("global-market");

    return getCachedOrFallback(cacheKey, CACHE_MEDIUM, async () => {
      const response = await withRetry(() => coinstatsClient.get("/markets"));
      const market = response.data;

      return {
        currency: "USD",
        marketCap: market.marketCap ?? null,
        volume: market.volume ?? null,
        btcDominance: market.btcDominance ?? null,
        marketCapChange: market.marketCapChange ?? null,
        volumeChange: market.volumeChange ?? null,
        btcDominanceChange: market.btcDominanceChange ?? null,
        updatedAt: new Date().toISOString(),
      };
    });
  },

  getFearGreedIndex: async () => {
    const cacheKey = cacheKeyFor("fear-greed");

    return getCachedOrFallback(cacheKey, CACHE_MEDIUM, async () => {
      const response = await withRetry(() =>
        coinstatsClient.get("/insights/fear-and-greed"),
      );
      const sentiment = response.data;

      return {
        value: sentiment.now?.value ?? null,
        classification: sentiment.now?.value_classification || null,
        updatedAt: sentiment.now?.update_time || null,
      };
    });
  },

  getCoinHistory: async (coinId, days = 7) => {
    const currency = "INR";
    const period = periodForDays(days);
    const cacheKey = cacheKeyFor(`history:${coinId}:${currency}:${period}`);

    return getCachedOrFallback(cacheKey, CACHE_LONG, async () => {
      const response = await withRetry(() =>
        coinstatsClient.get(`/coins/${encodeURIComponent(coinId)}/charts`, {
          params: { currency, period },
        }),
      );

      const prices = (response.data || [])
        .filter((point) => Array.isArray(point) && point.length >= 2)
        .map(([timestamp, price]) => [
          timestamp < 1_000_000_000_000 ? timestamp * 1000 : timestamp,
          price,
        ]);

      return {
        coinId,
        currency,
        period,
        prices,
        updatedAt: new Date().toISOString(),
      };
    });
  },

  getTradeQuote: async (coinId, currency = "INR") => {
    const normalisedCurrency = normaliseCurrency(currency);

    try {
      const response = await withRetry(() =>
        coinstatsClient.get(`/coins/${encodeURIComponent(coinId)}`, {
          params: { currency: normalisedCurrency },
        }),
      );
      const coin = toCoinDetail(response.data, normalisedCurrency);

      if (!Number.isFinite(coin.currentPrice) || coin.currentPrice <= 0) {
        throw serviceError("A valid current price is not available for this coin.", 400);
      }

      return coin;
    } catch (error) {
      if (error.statusCode) throw error;

      console.error(`Unable to get trade quote for ${coinId}:`, error.message);
      throw serviceError(
        "Unable to retrieve the latest market price. Please try again in a moment.",
        503,
      );
    }
  },

  getCoinById: async (coinId, currency = "INR") => {
    const normalisedCurrency = normaliseCurrency(currency);
    const cacheKey = cacheKeyFor(`coin:${coinId}:${normalisedCurrency}`);

    return getCachedOrFallback(cacheKey, CACHE_MEDIUM, async () => {
      const response = await withRetry(() =>
        coinstatsClient.get(`/coins/${encodeURIComponent(coinId)}`, {
          params: { currency: normalisedCurrency },
        }),
      );

      return toCoinDetail(response.data, normalisedCurrency);
    });
  },
};

export default cryptoService;
