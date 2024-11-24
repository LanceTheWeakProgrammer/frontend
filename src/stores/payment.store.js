import { defineStore } from 'pinia';
import axios from '../services/axios';

export const usePaymentStore = defineStore('payment', {
  state: () => ({
    loading: false,
    error: null,
    clientKey: null,
    paymentIntentId: null,
    nextActionUrl: null,
    status: null,
    amount: null,
    currency: null,
    description: null,
    createdAt: null,
  }),

  actions: {
    async createPaymentIntent({ amount, currency, paymentMethodType, bookingId, description, metadata }) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.post('/api/v1/payment/create-intent', {
          amount,
          currency,
          payment_method_type: paymentMethodType,
          booking_id: bookingId, 
          description,
          metadata,
        });

        this.clientKey = response.data.client_key;
        this.paymentIntentId = response.data.payment_intent_id;
      } catch (error) {
        this.error = error.response?.data?.error || 'An error occurred while creating the payment intent.';
        throw new Error(this.error); 
      } finally {
        this.loading = false;
      }
    },

    async attachPaymentMethod({ paymentMethodType, paymentIntentId, billingDetails, cardDetails = null }) {
      this.loading = true;
      this.error = null;
    
      try {
        const data = {
          payment_intent_id: paymentIntentId,
          payment_method_type: paymentMethodType,
          billing_name: billingDetails.name,
          billing_email: billingDetails.email,
          billing_phone: billingDetails.phone,
        };
    
        if (paymentMethodType === 'card' && cardDetails) {
          data.card_number = cardDetails.cardNumber;
          data.exp_month = cardDetails.expMonth;
          data.exp_year = cardDetails.expYear;
          data.cvc = cardDetails.cvc;
        }
    
        const response = await axios.post('/api/v1/payment/attach-method', data);
        this.nextActionUrl = response.data.next_action_url;
        this.status = response.data.status;
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to attach payment method';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async retrievePaymentStatus(paymentIntentId) {
      this.loading = true;
      this.error = null;
    
      try {
        const response = await axios.get('/api/v1/payment/retrieve-intent', {
          params: { payment_intent_id: paymentIntentId },
        });
    
        this.status = response.data.updated_status;
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to retrieve payment status';
      } finally {
        this.loading = false;
      }
    }    
  },
});
