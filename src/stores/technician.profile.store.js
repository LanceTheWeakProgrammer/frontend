import { defineStore } from 'pinia';
import axios from '../services/axios';

export const useTechnicianProfileStore = defineStore('technicianProfileStore', {
  state: () => ({
    technician: null, 
    loading: false,
    error: null,
  }),

  actions: {
    async fetchTechnicianProfile(id) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`/api/technician/v1/technicians/${id}`);
        this.technician = response.data.technician;
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to fetch technician profile';
      } finally {
        this.loading = false;
      }
    },

    async updateTechnicianBio(id, bio) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.put(`/api/technician/v1/technicians/${id}`, { bio });
        this.technician = response.data.technician;
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to update technician bio';
      } finally {
        this.loading = false;
      }
    },
  },
});
