import { defineStore } from 'pinia';
import axios from '../services/axios';

export const useAdminStore = defineStore('admin', {
  state: () => ({
    registeredBookings: [],
    activeBookings: [],
    technicians: [],
    dashboardData: null, 
    loading: false,
    error: null,
  }),
  actions: {
    async fetchRegisteredBookings() {
      try {
        this.loading = true;
        const response = await axios.get('api/admin/v1/bookings/registered');
        this.registeredBookings = response.data.data;
        this.loading = false;
      } catch (error) {
        this.error = error.response ? error.response.data.message : error.message;
        this.loading = false;
      }
    },
    async fetchActiveBookings() {
      try {
        this.loading = true;
        const response = await axios.get('api/admin/v1/bookings/active');
        this.activeBookings = response.data.data;
        this.loading = false;
      } catch (error) {
        this.error = error.response ? error.response.data.message : error.message;
        this.loading = false;
      }
    },

    async fetchTechnicians() {
      try {
        this.loading = true;
        const response = await axios.get('api/admin/v1/technician');
        this.technicians = response.data.data;
        this.loading = false;
      } catch (error) {
        this.error = error.response ? error.response.data.message : error.message;
        this.loading = false;
      }
    },

    async fetchDashboardData(range = 'all') {
      try {
        this.loading = true;
        const response = await axios.get(`api/admin/v1/dashboard?filter=${range}`);
        this.dashboardData = response.data;
        this.loading = false;
      } catch (error) {
        this.error = error.response ? error.response.data.message : error.message;
        this.loading = false;
      } 
    },

  },
});
