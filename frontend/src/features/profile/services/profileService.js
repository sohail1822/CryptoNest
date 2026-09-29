import api from '../../../shared/api/client';

const profileService = {
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
};

export default profileService;
