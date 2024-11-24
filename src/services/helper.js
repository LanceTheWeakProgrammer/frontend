import axios from './axios';

export const getSeverity = (status) => {
  switch (status) {
    case 'Pending': return 'info';
    case 'Approved': return 'success';
    case 'In Progress': return 'secondary';
    case 'Completed': return 'success';
    case 'Cancelled': return 'danger';
    case 'Declined': return 'secondary';
    case 'Rescheduled': return 'warn';
    case 'No Show': return 'danger';
    case 'Cancellation Requested': return 'warn';
    case 'Reschedule Requested': return 'warn';
    default: return 'info';
  }
};

export const getImageUrl = (imagePath) => `${axios.defaults.baseURL}/storage/${imagePath}`;

export const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
};

export const formatCurrency = (value) => {
    if (!value && value !== 0) return "₱ 0.00";
    return `₱ ${value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
  };
