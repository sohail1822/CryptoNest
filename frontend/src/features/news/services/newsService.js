import axios from "axios";
import { STORAGE_KEYS } from '../../../shared/constants/storage';

// NewsData.io API
const API_KEY = process.env.REACT_APP_NEWSDATA_API_KEY;
const NEWS_URL = "https://newsdata.io/api/1/news";
const CACHE_DURATION = 60 * 60 * 1000; // 60 minutes

const newsService = {
  // Helper to get from cache
  getFromCache: (key) => {
    const storageKey = `${STORAGE_KEYS.newsPrefix}${key}`;
    const cached = localStorage.getItem(storageKey);
    if (!cached) return null;

    try {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp <= CACHE_DURATION) return data;
      localStorage.removeItem(storageKey);
    } catch {
      localStorage.removeItem(storageKey);
    }
    return null;
  },

  // Helper to save to cache
  saveToCache: (key, data) => {
    const cacheData = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(`${STORAGE_KEYS.newsPrefix}${key}`, JSON.stringify(cacheData));
  },

  // Fetch latest crypto news
  getCryptoNews: async (page = null) => {
    const cacheKey = `news_main_${page || '1'}`;
    const cachedData = newsService.getFromCache(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await axios.get(NEWS_URL, {
        params: {
          apikey: API_KEY,
          q: "crypto OR cryptocurrency OR bitcoin OR ethereum",
          language: "en",
          page: page && page !== 1 ? page : undefined,
        },
      });

      if (response.data.status !== "success") {
        throw new Error(response.data.message || "Failed to fetch news");
      }

      const articles = (response.data.results || []).map((article) => ({
        title: article.title,
        description: article.description || article.title,
        image: article.image_url || "https://images.unsplash.com/photo-1621761191319-c6fb62b55886?w=400",
        url: article.link,
        source: { name: article.source_id || "Crypto News" },
        publishedAt: article.pubDate,
      }));

      const result = {
        articles,
        totalArticles: response.data.totalResults,
        nextPage: response.data.nextPage,
      };

      newsService.saveToCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error("News fetch failed:", error);
      throw error;
    }
  },

  // Search crypto news
  searchNews: async (query, page = null) => {
    const cacheKey = `news_search_${query}_${page || '1'}`;
    const cachedData = newsService.getFromCache(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await axios.get(NEWS_URL, {
        params: {
          apikey: API_KEY,
          q: query,
          language: "en",
          page: page && page !== 1 ? page : undefined,
        },
      });

      if (response.data.status !== "success") {
        throw new Error(response.data.message || "Failed to fetch news");
      }

      const articles = (response.data.results || []).map((article) => ({
        title: article.title,
        description: article.description || article.title,
        image: article.image_url || "https://images.unsplash.com/photo-1621761191319-c6fb62b55886?w=400",
        url: article.link,
        source: { name: article.source_id || "Crypto News" },
        publishedAt: article.pubDate,
      }));

      const result = {
        articles,
        totalArticles: response.data.totalResults,
        nextPage: response.data.nextPage,
      };

      newsService.saveToCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error("News search failed:", error);
      throw error;
    }
  },
};

export default newsService;
