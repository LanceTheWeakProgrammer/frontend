import { defineStore } from 'pinia';
import axios from '../services/axios';

export const useRatingStore = defineStore('ratings', {
  state: () => ({
    ratings: [],
    userRatings: [],
    ratingDetails: null,
  }),
  actions: {
    async fetchAllRatings() {
      try {
        const response = await axios.get('/api/v1/ratings');
        this.ratings = response.data;
        return { success: true, data: this.ratings };
      } catch (error) {
        console.error('Failed to fetch all ratings:', error.response?.data?.message || error.message);
        return { success: false, message: error.response?.data?.message || 'Failed to fetch ratings.' };
      }
    },
    async fetchRatingsByUserId(userId) {
      try {
        const response = await axios.get(`/api/v1/ratings/${userId}`);
        this.userRatings = response.data;
        return { success: true, data: this.userRatings };
      } catch (error) {
        console.error('Failed to fetch ratings for user:', error.response?.data?.message || error.message);
        return { success: false, message: error.response?.data?.message || 'Failed to fetch user ratings.' };
      }
    },
    async addRating(payload) {
      try {
        const response = await axios.post('/api/v1/ratings', payload);
        this.ratings.push(response.data.rating);
        return { success: true, message: response.data.message, data: response.data.rating };
      } catch (error) {
        console.error('Failed to add rating:', error.response?.data?.message || error.message);
        return { success: false, message: error.response?.data?.message || 'Failed to create rating.' };
      }
    },
    async updateRating(ratingId, payload) {
      try {
        const response = await axios.put(`/api/v1/ratings/${ratingId}`, payload);
        const updatedRatingIndex = this.ratings.findIndex((rating) => rating.id === ratingId);
        if (updatedRatingIndex !== -1) {
          this.ratings[updatedRatingIndex] = response.data.rating;
        }
        return { success: true, message: response.data.message, data: response.data.rating };
      } catch (error) {
        console.error('Failed to update rating:', error.response?.data?.message || error.message);
        return { success: false, message: error.response?.data?.message || 'Failed to update rating.' };
      }
    },
    async deleteRating(ratingId) {
      try {
        const response = await axios.delete(`/api/v1/ratings/${ratingId}`);
        this.ratings = this.ratings.filter((rating) => rating.id !== ratingId);
        return { success: true, message: response.data.message };
      } catch (error) {
        console.error('Failed to delete rating:', error.response?.data?.message || error.message);
        return { success: false, message: error.response?.data?.message || 'Failed to delete rating.' };
      }
    },
  },
});
