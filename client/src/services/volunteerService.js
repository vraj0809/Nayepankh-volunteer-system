import api from './api';

export const volunteerService = {
  getProfile: async () => {
    const response = await api.get('/volunteers/profile');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put('/volunteers/profile', data);
    return response.data;
  },

  getStatus: async () => {
    const response = await api.get('/volunteers/status');
    return response.data;
  },
};

export default volunteerService;
