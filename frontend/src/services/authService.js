import api from './api';


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
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    localStorage.removeItem('first_name');
    localStorage.removeItem('last_name');
    window.location.href = '/';
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getUser: () => {
    const fName = localStorage.getItem('first_name') || localStorage.getItem('firstName');
    const lName = localStorage.getItem('last_name') || localStorage.getItem('lastName');
    
    return {
      userId: localStorage.getItem('userId')?.replace(/['"]+/g, ''),
      email: localStorage.getItem('email'),
      firstName: (fName === 'undefined' || !fName) ? '' : fName,
      lastName: (lName === 'undefined' || !lName) ? '' : lName,
      subscription: localStorage.getItem('subscription'),
      token: localStorage.getItem('token'),
    };
  },

  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  setUser: (data) => {
    if (data.token) localStorage.setItem('token', data.token);
    if (data.userId || data._id) localStorage.setItem('userId', JSON.stringify(data.userId || data._id));
    if (data.email) localStorage.setItem('email', data.email);
    
    // Support both snake_case (from backend) and camelCase (from frontend state)
    const fName = data.first_name || data.firstName;
    const lName = data.last_name || data.lastName;
    
    if (fName && fName !== 'undefined') {
      localStorage.setItem('first_name', fName);
      localStorage.setItem('firstName', fName);
    }
    if (lName && lName !== 'undefined') {
      localStorage.setItem('last_name', lName);
      localStorage.setItem('lastName', lName);
    }
    if (data.subscription) localStorage.setItem('subscription', data.subscription);
  },
};

export default authService;
