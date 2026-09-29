import api from '../../../shared/api/client';
import {
  clearAuthSession,
  getAuthSession,
  saveAuthSession,
} from './authStorage';


const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  signup: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },

  logout: () => {
    clearAuthSession();
  },

  isAuthenticated: () => {
    return Boolean(getAuthSession()?.token);
  },

  getUser: () => {
    const session = getAuthSession();
    return session?.user || null;
  },

  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  setUser: (data) => {
    return saveAuthSession(data);
  },
};

export default authService;
