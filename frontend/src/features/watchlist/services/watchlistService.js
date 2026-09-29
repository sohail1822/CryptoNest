import api from '../../../shared/api/client';

const watchlistService = {
  getWatchlist: async () => {
    const response = await api.get('/user/watchlist');
    return response.data;
  },

  addCoin: async (coinId) => {
    const response = await api.post('/user/watchlist/add', { coinId });
    return response.data;
  },

  removeCoin: async (coinId) => {
    const response = await api.post('/user/watchlist/remove', { coinId });
    return response.data;
  },
};

export default watchlistService;
