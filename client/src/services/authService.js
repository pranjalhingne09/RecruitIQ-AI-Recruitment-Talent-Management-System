import api from './api';

export const authService = {
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    if (res.token) {
      localStorage.setItem('recruitiq_token', res.token);
      localStorage.setItem('recruitiq_user', JSON.stringify(res.user));
    }
    return res;
  },

  registerCandidate: async (data) => {
    const res = await api.post('/auth/register/candidate', data);
    if (res.token) {
      localStorage.setItem('recruitiq_token', res.token);
      localStorage.setItem('recruitiq_user', JSON.stringify(res.user));
    }
    return res;
  },

  registerRecruiter: async (data) => {
    const res = await api.post('/auth/register/recruiter', data);
    if (res.token) {
      localStorage.setItem('recruitiq_token', res.token);
      localStorage.setItem('recruitiq_user', JSON.stringify(res.user));
    }
    return res;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('recruitiq_token');
      localStorage.removeItem('recruitiq_user');
    }
  },

  getMe: async () => {
    return await api.get('/auth/me');
  },
};
