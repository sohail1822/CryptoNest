import api from '../../../shared/api/client';

const marketService = {
  getCoins: async (page = 1, perPage = 25) => {
    const response = await api.get('/crypto/markets', {
      params: { currency: 'INR', limit: perPage, page },
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
    const response = await api.get(`/crypto/history/${coinId}`, { params: { days } });
    return response.data.data;
  },

  getCoinsByIds: async (coinIds) => {
    const ids = [...new Set(
      (Array.isArray(coinIds) ? coinIds : String(coinIds || '').split(','))
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
  },
};

export default marketService;
