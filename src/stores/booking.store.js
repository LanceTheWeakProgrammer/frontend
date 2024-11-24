import { defineStore } from 'pinia';
import axios from '../services/axios';
import dayjs from '../services/dayjs';

export const useBookingStore = defineStore('booking', {
  state: () => ({
    bookings: [],
    loading: false,
    error: null,
  }),

  actions: {
    async createRegisteredUserBooking({ user_id, technician_id, service_ids, vehicle_id, booking_date, total_fee, additional_info = '', attachments = [] }) {
      this.loading = true;
      this.error = null;

      try {
        const formattedDate = dayjs(booking_date).format('YYYY-MM-DD');

        const formData = new FormData();
        formData.append('user_id', user_id);
        formData.append('technician_id', technician_id);
        formData.append('booking_date', formattedDate);
        formData.append('vehicle_id', vehicle_id); 
        formData.append('service_ids', JSON.stringify(service_ids)); 
        formData.append('total_fee', total_fee);
        formData.append('additional_info', additional_info);

        attachments.forEach((file, index) => {
          formData.append(`attachments[${index}]`, file);
        });

        const response = await axios.post('/api/v1/booking/registered', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status === 201) {
          this.booking = response.data.booking;
          return {
            success: true,
            message: response.data.message,
            booking: response.data.booking, 
        };
        } else {
          this.error = response.data.message;
          return { success: false, message: response.data.message };
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'An error occurred during booking.';
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    },

    // Deprecated
    // async createGuestBooking({ guest, technician_id, service_ids, vehicle_id, booking_date, total_fee, additional_info = '' }) {
    //   this.loading = true;
    //   this.error = null;

    //   try {
    //     const formattedDate = dayjs(booking_date).format('YYYY-MM-DD');

    //     const payload = {
    //       technician_id,
    //       booking_date: formattedDate,
    //       vehicle_id, 
    //       service_ids: JSON.stringify(service_ids),
    //       total_fee,
    //       additional_info,
    //       guest_name: guest.name,
    //       guest_email: guest.email,
    //       guest_phone: guest.phone,
    //     };

    //     const response = await axios.post('/api/v1/booking/guest', payload);

    //     if (response.status === 201) {
    //       this.booking = response.data.booking;
    //       return { success: true, message: 'Booking created successfully for guest user!' };
    //     } else {
    //       this.error = response.data.message;
    //       return { success: false, message: response.data.message };
    //     }
    //   } catch (error) {
    //     this.error = error.response?.data?.message || 'An error occurred during guest booking.';
    //     return { success: false, message: this.error };
    //   } finally {
    //     this.loading = false;
    //   }
    // },

    // async transferBooking({ guest_token, user_id }) {
    //   this.loading = true;
    //   this.error = null;

    //   try {
    //     const payload = {
    //       guest_token,
    //       user_id,
    //     };

    //     const response = await axios.post('/api/v1/booking/transfer', payload);

    //     if (response.status === 200) {
    //       this.booking = response.data.bookings;
    //       return { success: true, message: 'Booking transferred successfully!' };
    //     } else {
    //       this.error = response.data.message;
    //       return { success: false, message: response.data.message };
    //     }
    //   } catch (error) {
    //     this.error = error.response?.data?.message || 'An error occurred during transfer.';
    //     return { success: false, message: this.error };
    //   } finally {
    //     this.loading = false;
    //   }
    // },

    async requestReschedule(bookingId, requestedDate, justification) {
      this.loading = true;
      this.error = null;

      try {
        const payload = {
          requested_date: requestedDate,
          justification: justification,
        };

        const response = await axios.post(`/api/v1/bookings/${bookingId}/request-reschedule`, payload);

        if (response.status === 200) {
          return { success: true, message: 'Reschedule request submitted successfully!' };
        } else {
          this.error = response.data.message;
          return { success: false, message: response.data.message };
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'An error occurred while submitting the reschedule request.';
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    },

    async requestCancelBooking(bookingId) {
      this.loading = true;
      this.error = null;
    
      try {
        const response = await axios.put(`/api/v1/bookings/${bookingId}/cancel-request`);
    
        if (response.status === 200) {
          return { success: true, message: 'Your cancellation request has been submitted.' };
        } else {
          this.error = response.data.message;
          return { success: false, message: response.data.message };
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'An error occurred while requesting the cancellation.';
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    },    
    
    async fetchUserBookings() {
      this.loading = true;
      this.error = null;
    
      try {
        const response = await axios.get('/api/v1/booking'); 
    
        if (response.status === 200) {
          this.bookings = response.data.bookings; 
          return { success: true, message: 'Bookings retrieved successfully!' };
        } else {
          this.error = response.data.message;
          return { success: false, message: response.data.message };
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'An error occurred while fetching the bookings.';
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    },

    async fetchBookingById(bookingId) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.get(`/api/v1/booking/${bookingId}`);

        if (response.status === 200) {
          this.bookingDetails = response.data.booking;
          return { success: true, message: 'Booking details retrieved successfully!' };
        } else {
          this.error = response.data.message;
          return { success: false, message: response.data.message };
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'An error occurred while fetching the booking details.';
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    },
  },
});
