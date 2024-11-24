import { defineStore } from 'pinia';
import axios from '../services/axios';

export const useUserProfileStore = defineStore('userProfileStore', {
  state: () => ({
    user: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchUserProfile(id) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`/api/v1/users/${id}`);
        this.user = response.data.user;
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to fetch user profile';
      } finally {
        this.loading = false;
      }
    },

    async updateUserProfile(id, profileData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.put(`/api/v1/users/${id}`, profileData);
        this.user = response.data.user;
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to update user profile';
      } finally {
        this.loading = false;
      }
    },
  },
});
