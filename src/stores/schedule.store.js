import { defineStore } from 'pinia';
import axios from '../services/axios';

const API_BASE_URL = '/api/technician/v1';

export const useScheduleStore = defineStore('schedule', {
  state: () => ({
    bookings: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchBookings() {
      this.loading = true;
      this.error = null;
      try {
          const response = await axios.get(`${API_BASE_URL}/bookings`);
          if (response.status === 200) {
              this.bookings = response.data.data; 
          }
      } catch (error) {
          this.error = error.response?.data?.message || 'Failed to fetch bookings.';
      } finally {
          this.loading = false;
      }
  },
  
  async fetchSchedules() {
      this.loading = true;
      this.error = null;
      try {
          const response = await axios.get(`${API_BASE_URL}/bookings`);
          if (response.status === 200) {
              this.bookings = response.data.data; 
          }
      } catch (error) {
          this.error = error.response?.data?.message || 'Failed to fetch schedules.';
      } finally {
          this.loading = false;
      }
  },
  

    async approveBooking(bookingId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.put(`${API_BASE_URL}/bookings/${bookingId}/approve`);
        if (response.status === 200) {
          const updatedBooking = response.data.booking;
          this.bookings = this.bookings.map(booking =>
            booking.id === bookingId ? updatedBooking : booking
          );
          return { success: true, message: 'Booking approved successfully.' };
        } else {
          this.error = 'Failed to approve booking.';
          return { success: false, message: this.error };
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to approve booking.';
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    },

    async declineBooking(bookingId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.put(`${API_BASE_URL}/bookings/${bookingId}/decline`);
        if (response.status === 200) {
          const updatedBooking = response.data.booking;
          this.bookings = this.bookings.map(booking =>
            booking.id === bookingId ? updatedBooking : booking
          );
          return { success: true, message: 'Booking declined successfully.' };
        } else {
          this.error = 'Failed to decline booking.';
          return { success: false, message: this.error };
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to decline booking.';
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    },

    async approveCancelRequest(bookingId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.put(`${API_BASE_URL}/bookings/${bookingId}/approve-cancel`);
        if (response.status === 200) {
          const updatedBooking = response.data.booking;
          this.bookings = this.bookings.map(booking =>
            booking.id === bookingId ? updatedBooking : booking
          );
          return { success: true, message: 'Cancellation request approved successfully.' };
        } else {
          this.error = 'Failed to approve cancellation request.';
          return { success: false, message: this.error };
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to approve cancellation request.';
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    },

    async declineCancelRequest(bookingId, declineReason = '') {
        this.loading = true;
        this.error = null;
        try {
            const response = await axios.post(`${API_BASE_URL}/bookings/${bookingId}/decline-cancel`, {
                decline_reason: declineReason,
            });
            if (response.status === 200) {
                const updatedBooking = response.data.booking;
                this.bookings = this.bookings.map(booking =>
                    booking.id === bookingId ? updatedBooking : booking
                );
                return { success: true, message: 'Cancellation request declined successfully.' };
            } else {
                this.error = 'Failed to decline cancellation request.';
                return { success: false, message: this.error };
            }
        } catch (error) {
            this.error = error.response?.data?.message || 'Failed to decline cancellation request.';
            return { success: false, message: this.error };
        } finally {
            this.loading = false;
        }
    },

    async rescheduleBooking(bookingId, newBookingDate) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.post(`${API_BASE_URL}/bookings/${bookingId}/reschedule`, {
          new_booking_date: newBookingDate,
        });
        if (response.status === 200) {
          const updatedBooking = response.data.booking;
          this.bookings = this.bookings.map(booking =>
            booking.id === bookingId ? updatedBooking : booking
          );
          return { success: true, message: 'Booking rescheduled successfully.' };
        } else {
          this.error = 'Failed to reschedule booking.';
          return { success: false, message: this.error };
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to reschedule booking.';
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    },

    async approveRescheduleRequest(bookingId) {
      this.loading = true;
      this.error = null;
      try {
          const response = await axios.put(`${API_BASE_URL}/bookings/${bookingId}/approve-reschedule`);
          if (response.status === 200) {
              const updatedBooking = response.data.booking;
              this.bookings = this.bookings.map(booking =>
                  booking.id === bookingId ? updatedBooking : booking
              );
              return { success: true, message: 'Reschedule request approved successfully.' };
          } else {
              this.error = 'Failed to approve reschedule request.';
              return { success: false, message: this.error };
          }
      } catch (error) {
          this.error = error.response?.data?.message || 'Failed to approve reschedule request.';
          return { success: false, message: this.error };
      } finally {
          this.loading = false;
      }
    },
    
    async declineRescheduleRequest(bookingId, declineReason = '') {
        this.loading = true;
        this.error = null;
        try {
            const response = await axios.post(`${API_BASE_URL}/bookings/${bookingId}/decline-reschedule`, {
                decline_reason: declineReason,
            });
            if (response.status === 200) {
                const updatedBooking = response.data.booking;
                this.bookings = this.bookings.map(booking =>
                    booking.id === bookingId ? updatedBooking : booking
                );
                return { success: true, message: 'Reschedule request declined successfully.' };
            } else {
                this.error = 'Failed to decline reschedule request.';
                return { success: false, message: this.error };
            }
        } catch (error) {
            this.error = error.response?.data?.message || 'Failed to decline reschedule request.';
            return { success: false, message: this.error };
        } finally {
            this.loading = false;
        }
    },

    async markAsInProgress(bookingId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.put(`${API_BASE_URL}/bookings/${bookingId}/in-progress`);
        if (response.status === 200) {
          const updatedBooking = response.data.booking;
          this.bookings = this.bookings.map(booking =>
            booking.id === bookingId ? updatedBooking : booking
          );
          return { success: true, message: 'Booking marked as In Progress.' };
        } else {
          this.error = 'Failed to mark booking as In Progress.';
          return { success: false, message: this.error };
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to mark booking as In Progress.';
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    },

    async markAsCompleted(bookingId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.put(`${API_BASE_URL}/bookings/${bookingId}/completed`);
        if (response.status === 200) {
          const updatedBooking = response.data.booking;
          this.bookings = this.bookings.map(booking =>
            booking.id === bookingId ? updatedBooking : booking
          );
          return { success: true, message: 'Booking marked as Completed.' };
        } else {
          this.error = 'Failed to mark booking as Completed.';
          return { success: false, message: this.error };
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to mark booking as Completed.';
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    },

    async markAsNoShow(bookingId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.put(`${API_BASE_URL}/bookings/${bookingId}/no-show`);
        if (response.status === 200) {
          const updatedBooking = response.data.booking;
          this.bookings = this.bookings.map(booking =>
            booking.id === bookingId ? updatedBooking : booking
          );
          return { success: true, message: 'Booking marked as No Show.' };
        } else {
          this.error = 'Failed to mark booking as No Show.';
          return { success: false, message: this.error };
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to mark booking as No Show.';
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    },

    async toggleAvailability(technicianId, status) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.put(
          `${API_BASE_URL}/technician/${technicianId}/toggle-availability/${status}`
        );
        if (response.status === 200) {
          return { success: true, message: response.data.message };
        } else {
          this.error = 'Failed to toggle availability.';
          return { success: false, message: this.error };
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to toggle availability.';
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    },
  },
});
