import api from './api';

const cryptoService = {
  // ─── CoinGecko APIs ──────────────────────────────────
  // Fetch market data from backend (cached)
  getCoins: async (page = 1, perPage = 25) => {
    const response = await api.get('/crypto/markets', {
      params: {
        vs_currency: 'inr',
        per_page: perPage,
        page,
      },
    });

    return response.data.data;
  },

  getCoinById: async (coinId) => {
    const response = await api.get(`/crypto/coin/${coinId}`);
    return response.data.data;
  },

  getTrendingCoins: async () => {
    const response = await api.get('/crypto/trending');
    return response.data.data;
  },

  getGlobalData: async () => {
    const response = await api.get('/crypto/global');
    return response.data.data;
  },

  getMarketSentiment: async () => {
    const response = await api.get('/crypto/sentiment');
    return response.data.data;
  },

  getCoinHistory: async (coinId, days = 7) => {
    const response = await api.get(`/crypto/history/${coinId}`, {
      params: { days }
    });
    return response.data.data;
  },

  // ─── Portfolio APIs ──────────────────────────────────
  getPortfolio: async (userId) => {
    const response = await api.post('/user/portfolio', { userId });
    return response.data;
  },

  buyStock: async (userId, stockId, quantity, currentPrice) => {
    const response = await api.post('/user/stock/add', {
      userId,
      stockId,
      quantity,
      current_price: currentPrice,
    });
    return response.data;
  },

  sellStock: async (userId, stockId, quantity, currentPrice) => {
    const response = await api.post('/user/stock/remove', {
      userId,
      stockId,
      quantity,
      current_price: currentPrice,
    });
    return response.data;
  },

  // ─── Watchlist APIs ──────────────────────────────────
  getWatchlist: async () => {
    const response = await api.get('/user/watchlist');
    return response.data;
  },

  addToWatchlist: async (coinId) => {
    const response = await api.post('/user/watchlist/add', { coinId });
    return response.data;
  },

  removeFromWatchlist: async (coinId) => {
    const response = await api.post('/user/watchlist/remove', { coinId });
    return response.data;
  },

  getTransactions: async () => {
    const response = await api.get('/user/transactions');
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  changePassword: async (currentPassword, newPassword) => {
    const response = await api.post('/user/change-password', { currentPassword, newPassword });
    return response.data;
  },

  updateSubscription: async (tier) => {
    const response = await api.post('/user/update-subscription', { tier });
    return response.data;
  },

  fetchCoinData: async (coinIds) => {
    if (!coinIds) return {};
    
    try {
      const response = await api.get('/crypto/markets', {
        params: {
          vs_currency: 'inr',
          ids: coinIds,
          per_page: 250,
        },
      });
      
      const coinMap = {};
      const data = response.data.data || [];
      data.forEach((coin) => {
        coinMap[coin.id] = coin;
      });
      return coinMap;
    } catch (error) {
      console.error('Error fetching coin data:', error);
      return {};
    }
  },
};

export const { fetchCoinData, addToWatchlist, removeFromWatchlist, getWatchlist } = cryptoService;
export default cryptoService;
