import { defineStore } from 'pinia';
import axios from '../services/axios';
import echoInstance from '../services/echo';

export const useMessageStore = defineStore('message', {
  state: () => ({
    messages: [],
    loading: false,
  }),
  actions: {
    async sendMessage(receiverId, content) {
      try {
        this.loading = true;
        const response = await axios.post('/api/v1/messages/send', {
          receiver_id: receiverId,
          content,
        });
        this.messages.push(response.data.data);
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.error('Error sending message:', error);
      }
    },
    async fetchMessages(userId) {
      try {
        this.loading = true;
        const response = await axios.get(`/api/v1/messages/${userId}`);
        this.messages = response.data.data;
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.error('Error fetching messages:', error);
      }
    },
    listenForIncomingMessages(receiverId) {
      echoInstance.leave(`chat.${receiverId}`); 
      echoInstance.private(`chat.${receiverId}`)
        .listen('MessageSent', (event) => {
          this.messages.push(event.message);
        });
    },
  },
});