import { defineStore } from 'pinia';
import axios from '../services/axios';
import echoInstance from '../services/echo'; 

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
    id: localStorage.getItem('id') || null,
    profile_id: localStorage.getItem('profile_id') || null,
    role: localStorage.getItem('role') || null,
  }),
  persist: {
    key: 'auth',
    storage: window.localStorage,
  },
  actions: {
    async adminLogin(username, password) {
      try {
        const response = await axios.post('/api/admin/v1/login', {
          credential: username,
          password,
          role: 'admin',
        });

        this.token = response.data.token;
        this.user = response.data.user;
        this.id = response.data.user.id;
        this.profile_id = response.data.user.profile_id;
        this.role = 'admin';

        localStorage.setItem('token', this.token);
        localStorage.setItem('user', JSON.stringify(this.user));
        localStorage.setItem('id', this.id);
        localStorage.setItem('profile_id', this.profile_id);
        localStorage.setItem('role', this.role);

        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;

        return { success: true, message: response.data.message };
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || 'An error occurred. Please try again.',
        };
      }
    },

    async userLogin(email, password) {
      try {
        const response = await axios.post('/api/v1/login', {
          credential: email,
          password,
          role: 'user',
        });

        this.token = response.data.token;
        this.user = response.data.user;
        this.id = response.data.user.id;
        this.profile_id = response.data.user.profile_id;
        this.role = response.data.role;

        localStorage.setItem('token', this.token);
        localStorage.setItem('user', JSON.stringify(this.user));
        localStorage.setItem('id', this.id);
        localStorage.setItem('profile_id', this.profile_id);
        localStorage.setItem('role', this.role);

        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;

        return { success: true, message: response.data.message };
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || 'An error occurred. Please try again.',
        };
      }
    },

    async technicianLogin(account_number, password) {
      try {
        const response = await axios.post('/api/technician/v1/login', {
          credential: account_number,
          password,
          role: 'technician',
        });

        this.token = response.data.token;
        this.user = response.data.user;
        this.id = response.data.user.id;
        this.profile_id = response.data.user.profile_id;
        this.role = 'technician';

        localStorage.setItem('token', this.token);
        localStorage.setItem('user', JSON.stringify(this.user));
        localStorage.setItem('id', this.id);
        localStorage.setItem('profile_id', this.profile_id);
        localStorage.setItem('role', this.role);

        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;

        if (response.data.user.is_first_login) {
          return { success: true, message: 'First login detected', redirect: 'TechnicianChangePassword' };
        } else {
          return { success: true, message: response.data.message, redirect: 'TechnicianDashboard' };
        }
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || 'An error occurred. Please try again.',
        };
      }
    },

    async technicianLogout() {
      try {
        if (!this.token || this.role !== 'technician') {
          throw new Error('No token found or not a technician, cannot logout.');
        }

        await axios.post('/api/technician/v1/logout', {}, {
          headers: {
            'Authorization': `Bearer ${this.token}`,
          },
        });

        this.clearAuthState();

        return { success: true, message: 'Technician logged out successfully.' };
      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.clearAuthState();
        }

        return {
          success: false,
          message: error.response?.data?.message || 'An error occurred. Please try again.',
        };
      }
    },

    async newLogin(newPassword) {
      try {
        const response = await axios.post('api/technician/v1/change-password', {
          new_password: newPassword,
          new_password_confirmation: newPassword,
        });

        return { success: true, message: response.data.message };
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || 'Failed to change password.',
        };
      }
    },

    async register(payload) {
      try {
        const response = await axios.post('/api/v1/register', payload);
        return { success: true, message: 'Registration successful' };
      } catch (error) {
        return { success: false, message: error.response.data.message || 'Registration failed' };
      }
    },

    async adminLogout() {
      try {
        if (!this.token || this.role !== 'admin') {
          throw new Error('No token found or not an admin, cannot logout.');
        }

        await axios.post('/api/admin/v1/logout', {}, {
          headers: {
            'Authorization': `Bearer ${this.token}`,
          },
        });

        this.clearAuthState();

        return { success: true, message: 'Admin logged out successfully.' };
      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.clearAuthState();
        }

        return {
          success: false,
          message: error.response?.data?.message || 'An error occurred. Please try again.',
        };
      }
    },

    async userLogout() {
      try {
        if (!this.token || this.role !== 'user') {
          throw new Error('No token found or not a user, cannot logout.');
        }

        await axios.post('/api/v1/logout', {}, {
          headers: {
            'Authorization': `Bearer ${this.token}`,
          },
        });

        this.clearAuthState();

        return { success: true, message: 'User logged out successfully.' };
      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.clearAuthState();
        }

        return {
          success: false,
          message: error.response?.data?.message || 'An error occurred. Please try again.',
        };
      }
    },

    clearAuthState() {
      this.token = null;
      this.user = null;
      this.id = null;
      this.profile_id = null;
      this.role = null;
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('id');
      localStorage.removeItem('profile_id');
      localStorage.removeItem('role');

      if (echoInstance) {
        echoInstance.leave();
      }
    },

    checkAuth() {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      const id = localStorage.getItem('id');
      const profile_id = localStorage.getItem('profile_id');

      if (token && role && id) {
        this.token = token;
        this.role = role;
        this.id = id;
        this.profile_id = profile_id;
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return true;
      } else {
        this.clearAuthState();
        return false;
      }
    },
  },
});
