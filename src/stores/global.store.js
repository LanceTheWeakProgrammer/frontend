import { defineStore } from 'pinia';
import axios from '../services/axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export const useGlobalStore = defineStore('globalStore', {
  state: () => ({
    carousels: [],
    services: [],
    appInfo: [],
    contactInfo: [],
    teamInfo: [],
    technicians: [],
    vehicles: [],
    testimonials: [],
    vehicleTypes: [],
    selectedVehicleTypeName: '', 
    loading: false,
    error: null,
    technicianDetails: null,
  }),
  actions: {
    async fetchAppInfo() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`${API_BASE_URL}/app-info`);
        this.appInfo = response.data;
      } catch (error) {
        this.error = error.response ? error.response.data.message : error.message;
      } finally {
        this.loading = false;
      }
    },

    async fetchCarousels() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`${API_BASE_URL}/carousel`);
        this.carousels = response.data;
      } catch (error) {
        this.error = error.response ? error.response.data.message : error.message;
      } finally {
        this.loading = false;
      }
    },

    async fetchServices() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`${API_BASE_URL}/services`);
        this.services = response.data;
      } catch (error) {
        this.error = error.response ? error.response.data.message : error.message;
      } finally {
        this.loading = false;
      }
    },

    async fetchVehicleTypes() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`${API_BASE_URL}/vehicle/types`);
        this.vehicleTypes = response.data.data;
      } catch (error) {
        this.error = error.response ? error.response.data.message : error.message;
      } finally {
        this.loading = false;
      }
    },

    async fetchVehicles(vehicleTypeId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`${API_BASE_URL}/vehicle/details/${vehicleTypeId}`);
        this.vehicles = response.data.data.map(vehicle => ({
          label: `${vehicle.make} ${vehicle.model}`,
          value: vehicle.id
        }));
      } catch (error) {
        this.error = error.response ? error.response.data.message : error.message;
      } finally {
        this.loading = false;
      }
    },

    async fetchVehicleTypeById(vehicleTypeId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`${API_BASE_URL}/vehicle/type/${vehicleTypeId}`);
        this.selectedVehicleTypeName = response.data.data.type;
      } catch (error) {
        this.error = error.response ? error.response.data.message : error.message;
      } finally {
        this.loading = false;
      }
    },

    async fetchTechnicians() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`${API_BASE_URL}/technicians`);
        this.technicians = response.data;
      } catch (error) {
        this.error = error.response ? error.response.data.message : error.message;
      } finally {
        this.loading = false;
      }
    },

    async fetchTechnicianById(id) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`${API_BASE_URL}/technicians/${id}`);
        this.technicianDetails = response.data.data;
      } catch (error) {
        this.error = error.response ? error.response.data.message : error.message;
      } finally {
        this.loading = false;
      }
    },

    async fetchContactInfo() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`${API_BASE_URL}/contact-info`);
        this.contactInfo = response.data;
      } catch (error) {
        this.error = error.response ? error.response.data.message : error.message;
      } finally {
        this.loading = false;
      }
    },

    async fetchTeamInfo() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`${API_BASE_URL}/team-info`);
        this.teamInfo = response.data;
      } catch (error) {
        this.error = error.response ? error.response.data.message : error.message;
      } finally {
        this.loading = false;
      }
    },

    async fetchTestimonials() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`${API_BASE_URL}/testimonials`);
        this.testimonials = response.data.data; 
      } catch (error) {
        this.error = error.response ? error.response.data.message : error.message;
      } finally {
        this.loading = false;
      }
    },
  }
});
