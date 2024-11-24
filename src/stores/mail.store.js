import { defineStore } from 'pinia';
import axios from '../services/axios'; 

export const useMailStore = defineStore('mail', {
  actions: {
    async verifyOtp(otp, email) {
      try {
        const response = await axios.post('/api/v1/verify-email', {
          email,
          verification_code: otp,
        });
        return { success: true, message: 'Verification successful' };
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || 'Verification failed. Please try again.',
        };
      }
    },
  },
});
