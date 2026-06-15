import api from './api';

export const adminService = {
  getAllVolunteers: async (params = {}) => {
    const response = await api.get('/admin/volunteers', { params });
    return response.data;
  },

  getVolunteerById: async (id) => {
    const response = await api.get(`/admin/volunteers/${id}`);
    return response.data;
  },

  updateVolunteerStatus: async (id, status, adminNote = '') => {
    const response = await api.put(`/admin/volunteers/${id}/status`, { status, adminNote });
    return response.data;
  },

  deleteVolunteer: async (id) => {
    const response = await api.delete(`/admin/volunteers/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },
};

export default adminService;
