import api from '../../../shared/api/client';

const portfolioService = {
  getPortfolio: async () => {
    const response = await api.get('/user/portfolio');
    return response.data;
  },

  buyCoin: async (coinId, quantity) => {
    const response = await api.post('/user/stock/add', { stockId: coinId, quantity });
    return response.data;
  },

  sellCoin: async (coinId, quantity) => {
    const response = await api.post('/user/stock/remove', { stockId: coinId, quantity });
    return response.data;
  },

  getTransactions: async (page = 1, limit = 50) => {
    const response = await api.get('/user/transactions', { params: { page, limit } });
    return response.data;
  },
};

export default portfolioService;
