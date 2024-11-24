import { defineStore } from 'pinia';
import axios from '../services/axios';

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchNotifications() {
      if (this.loading) return; 
      this.loading = true;
      this.error = null;
      try {
          const response = await axios.get('/api/v1/notifications');
          if (response.status === 200) {
              this.notifications = response.data.all_notifications;
              this.unreadCount = response.data.unread_notifications.length;
          }
      } catch (error) {
          this.error = 'Error fetching notifications';
          console.error('Error fetching notifications:', error);
          setTimeout(() => this.fetchNotifications(), 5000); 
      } finally {
          this.loading = false;
      }
  },

    addNotification(notification) {
      this.notifications.unshift({
        id: notification.id || '',
        data: notification.data || {},
        created_at: notification.created_at || new Date().toISOString(),
        read_at: notification.read_at || null
      });
      this.unreadCount++;
    },

    async markAsRead(notificationId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.post(`/api/v1/notifications/${notificationId}/mark-as-read`);
        if (response.status === 200) {
          const notification = this.notifications.find(n => n.id === notificationId);
          if (notification) {
            notification.read_at = new Date();
            this.unreadCount--;
          }
        }
      } catch (error) {
        this.error = 'Error marking notification as read';
        console.error('Error marking notification as read:', error);
      } finally {
        this.loading = false;
      }
    },

    async markAllAsRead() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.post('/api/v1/notifications/mark-all-as-read');
        if (response.status === 200) {
          this.notifications.forEach(n => {
            n.read_at = new Date();
          });
          this.unreadCount = 0;
        }
      } catch (error) {
        this.error = 'Error marking all notifications as read';
        console.error('Error marking all notifications as read:', error);
      } finally {
        this.loading = false;
      }
    },

    async deleteNotification(notificationId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.delete(`/api/v1/notifications/${notificationId}`);
        if (response.status === 200) {
          this.notifications = this.notifications.filter(n => n.id !== notificationId);
          if (!this.notifications.some(n => n.read_at === null)) this.unreadCount--;
        }
      } catch (error) {
        this.error = 'Error deleting notification';
        console.error('Error deleting notification:', error);
      } finally {
        this.loading = false;
      }
    },
  },
});
