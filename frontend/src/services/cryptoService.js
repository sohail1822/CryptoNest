import api from './api';

const cryptoService = {
  // ─── Market data APIs ─────────────────────────────────
  getCoins: async (page = 1, perPage = 25) => {
    const response = await api.get('/crypto/markets', {
      params: {
        currency: 'INR',
        limit: perPage,
        page,
      },
    });

    return response.data.data;
  },

  getCoinById: async (coinId) => {
    const response = await api.get(`/crypto/coin/${coinId}`);
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
  getPortfolio: async () => {
    const response = await api.get('/user/portfolio');
    return response.data;
  },

  buyStock: async (stockId, quantity) => {
    const response = await api.post('/user/stock/add', {
      stockId,
      quantity,
    });
    return response.data;
  },

  sellStock: async (stockId, quantity) => {
    const response = await api.post('/user/stock/remove', {
      stockId,
      quantity,
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

  fetchCoinData: async (coinIds) => {
    if (!coinIds) return {};
    
    try {
      const ids = [...new Set(
        String(coinIds)
          .split(',')
          .map((id) => id.trim())
          .filter(Boolean),
      )];
      const coinMap = {};

      for (let index = 0; index < ids.length; index += 100) {
        const response = await api.get('/crypto/markets', {
          params: {
            currency: 'INR',
            coinIds: ids.slice(index, index + 100).join(','),
            limit: 100,
          },
        });

        (response.data.data || []).forEach((coin) => {
          coinMap[coin.id] = coin;
        });
      }

      return coinMap;
    } catch (error) {
      console.error('Error fetching coin data:', error);
      return {};
    }
  },
};

export const { fetchCoinData, addToWatchlist, removeFromWatchlist, getWatchlist } = cryptoService;
export default cryptoService;
