import axios from 'axios';
import CryptoCache from '../models/cryptoCache.model.js';
import CoinPrice from '../models/coinPrice.model.js';
import env from '../config/env.js';

const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';

// Cache durations — longer windows = fewer API calls = fewer 429s
const CACHE_SHORT  = 60_000;         // 1 min  – market prices
const CACHE_MEDIUM = 5 * 60_000;     // 5 min  – coin details
const CACHE_LONG   = 15 * 60_000;    // 15 min – historical charts
const CACHE_THRESHOLD = CACHE_SHORT; // kept for legacy refs

// Build default headers, attaching the API key when available
const cgHeaders = () => {
  const headers = { Accept: 'application/json' };
  if (env.COINGECKO_API_KEY) {
    headers['x-cg-demo-api-key'] = env.COINGECKO_API_KEY;
  }
  return headers;
};

/**
 * Wraps an axios call with retry logic.
 * On a 429 response it waits `retryDelay` ms before trying again (up to `maxRetries` times).
 */
const withRetry = async (fn, maxRetries = 2, retryDelay = 2000) => {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const is429 = err.response?.status === 429;
      if (is429 && attempt < maxRetries) {
        const wait = retryDelay * Math.pow(2, attempt); // exponential back-off
        console.warn(`CoinGecko 429 – retrying in ${wait}ms (attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(res => setTimeout(res, wait));
      } else {
        throw err;
      }
    }
  }
};

const cryptoService = {
  getMarketData: async (vsCurrency = 'inr', perPage = 25, page = 1, ids = '') => {
    // If specific IDs are requested, we can try to get them from granular cache first
    if (ids) {
      const idArray = ids.split(',').filter(id => id.trim());
      const cachedCoins = await CoinPrice.find({
        coinId: { $in: idArray },
        lastUpdated: { $gt: new Date(Date.now() - CACHE_THRESHOLD) }
      });

      // If we found all coins in cache, return them
      if (cachedCoins.length === idArray.length) {
        return cachedCoins.map(c => ({
          id: c.coinId,
          symbol: c.symbol,
          name: c.name,
          image: c.image,
          current_price: c.currentPrice,
          market_cap: c.marketCap,
          market_cap_rank: c.marketCapRank,
          price_change_percentage_24h: c.priceChangePercentage24h,
          last_updated: c.lastUpdated
        }));
      }
    }

    // Normal list request or missing specific IDs
    const cacheKey = `market_${vsCurrency}_${perPage}_${page}_${ids}`;
    try {
      const cached = await CryptoCache.findOne({ key: cacheKey });
      if (cached && (Date.now() - new Date(cached.lastUpdated).getTime() < CACHE_SHORT)) {
        return cached.data;
      }

      const response = await withRetry(() =>
        axios.get(`${COINGECKO_BASE_URL}/coins/markets`, {
          headers: cgHeaders(),
          params: {
            vs_currency: vsCurrency,
            ids: ids || undefined,
            order: 'market_cap_desc',
            per_page: perPage,
            page: page,
            sparkline: false,
          },
        })
      );

      const coins = response.data;

      // Update granular cache for each coin fetched
      const bulkOps = coins.map(coin => ({
        updateOne: {
          filter: { coinId: coin.id },
          update: {
            coinId: coin.id,
            symbol: coin.symbol,
            name: coin.name,
            image: coin.image,
            currentPrice: coin.current_price,
            marketCap: coin.market_cap,
            marketCapRank: coin.market_cap_rank,
            priceChangePercentage24h: coin.price_change_percentage_24h,
            lastUpdated: new Date()
          },
          upsert: true
        }
      }));
      
      if (bulkOps.length > 0) {
        await CoinPrice.bulkWrite(bulkOps);
      }

      // Update the list cache
      await CryptoCache.findOneAndUpdate(
        { key: cacheKey },
        { data: coins, lastUpdated: new Date() },
        { upsert: true, new: true }
      );

      return coins;
    } catch (error) {
      console.error('Error in cryptoService.getMarketData:', error.message);
      const fallback = await CryptoCache.findOne({ key: cacheKey });
      if (fallback) return fallback.data;
      throw error;
    }
  },

  getTrendingData: async () => {
    const cacheKey = 'trending_data';
    
    try {
      const cached = await CryptoCache.findOne({ key: cacheKey });
      
      if (cached && (Date.now() - new Date(cached.lastUpdated).getTime() < CACHE_MEDIUM)) {
        return cached.data;
      }

      const response = await withRetry(() =>
        axios.get(`${COINGECKO_BASE_URL}/search/trending`, { headers: cgHeaders() })
      );

      await CryptoCache.findOneAndUpdate(
        { key: cacheKey },
        { data: response.data, lastUpdated: new Date() },
        { upsert: true, new: true }
      );

      return response.data;
    } catch (error) {
      console.error('Error in cryptoService.getTrendingData:', error.message);
      const fallback = await CryptoCache.findOne({ key: cacheKey });
      if (fallback) return fallback.data;
      throw error;
    }
  },

  getGlobalData: async () => {
    const cacheKey = 'global_market_data';
    try {
      const cached = await CryptoCache.findOne({ key: cacheKey });
      if (cached && (Date.now() - new Date(cached.lastUpdated).getTime() < CACHE_MEDIUM)) {
        return cached.data;
      }

      const response = await withRetry(() =>
        axios.get(`${COINGECKO_BASE_URL}/global`, { headers: cgHeaders() })
      );
      await CryptoCache.findOneAndUpdate(
        { key: cacheKey },
        { data: response.data, lastUpdated: new Date() },
        { upsert: true, new: true }
      );
      return response.data;
    } catch (error) {
      console.error('Error in cryptoService.getGlobalData:', error.message);
      const fallback = await CryptoCache.findOne({ key: cacheKey });
      if (fallback) return fallback.data;
      throw error;
    }
  },

  getFearGreedIndex: async () => {
    const cacheKey = 'fear_greed_index';
    try {
      const cached = await CryptoCache.findOne({ key: cacheKey });
      if (cached && (Date.now() - new Date(cached.lastUpdated).getTime() < CACHE_MEDIUM)) {
        return cached.data;
      }

      const response = await axios.get('https://api.alternative.me/fng/');
      await CryptoCache.findOneAndUpdate(
        { key: cacheKey },
        { data: response.data, lastUpdated: new Date() },
        { upsert: true, new: true }
      );
      return response.data;
    } catch (error) {
      console.error('Error in cryptoService.getFearGreedIndex:', error.message);
      const fallback = await CryptoCache.findOne({ key: cacheKey });
      if (fallback) return fallback.data;
      throw error;
    }
  },

  getCoinHistory: async (coinId, days = 7) => {
    const cacheKey = `history_${coinId}_${days}`;
    try {
      const cached = await CryptoCache.findOne({ key: cacheKey });
      if (cached && (Date.now() - new Date(cached.lastUpdated).getTime() < CACHE_LONG)) {
        return cached.data;
      }

      const response = await withRetry(() =>
        axios.get(`${COINGECKO_BASE_URL}/coins/${coinId}/market_chart`, {
          headers: cgHeaders(),
          params: {
            vs_currency: 'inr',
            days: days,
          },
        })
      );

      await CryptoCache.findOneAndUpdate(
        { key: cacheKey },
        { data: response.data, lastUpdated: new Date() },
        { upsert: true, new: true }
      );
      return response.data;
    } catch (error) {
      console.error(`Error in cryptoService.getCoinHistory for ${coinId}:`, error.message);
      const fallback = await CryptoCache.findOne({ key: cacheKey });
      if (fallback) return fallback.data;
      throw error;
    }
  },

  getCoinById: async (coinId) => {
    const cacheKey = `coin_detail_${coinId}`;
    try {
      const cached = await CryptoCache.findOne({ key: cacheKey });
      if (cached && (Date.now() - new Date(cached.lastUpdated).getTime() < CACHE_MEDIUM)) {
        return cached.data;
      }

      const response = await withRetry(() =>
        axios.get(`${COINGECKO_BASE_URL}/coins/${coinId}`, {
          headers: cgHeaders(),
          params: {
            localization: false,
            tickers: true,
            market_data: true,
            community_data: false,
            developer_data: false,
            sparkline: false,
          },
        })
      );

      await CryptoCache.findOneAndUpdate(
        { key: cacheKey },
        { data: response.data, lastUpdated: new Date() },
        { upsert: true, new: true }
      );
      return response.data;
    } catch (error) {
      console.error(`Error in cryptoService.getCoinById for ${coinId}:`, error.message);
      const fallback = await CryptoCache.findOne({ key: cacheKey });
      if (fallback) return fallback.data;
      throw error;
    }
  }
};

export default cryptoService;
