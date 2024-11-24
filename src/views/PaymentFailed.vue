<template>
    <div class="payment-result failed">
      <h1 class="text-3xl font-bold mb-4">Payment Failed</h1>
      <p class="text-lg">We’re sorry, but your payment could not be processed.</p>
      <p class="text-md mt-2">Please try again or contact support if the issue persists.</p>
      <router-link to="/payment" class="retry-link mt-6">
        <button class="p-button p-button-primary">Try Again</button>
      </router-link>
      <router-link to="/" class="back-link mt-4">
        <button class="p-button p-button-secondary">Back to Home</button>
      </router-link>
    </div>
  </template>
  
  <script setup>
  // Optional: Additional JavaScript logic can go here
  </script>
  
  <style scoped>
  .payment-result {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    text-align: center;
  }
  
  .failed h1 {
    color: #dc3545;
  }
  
  .retry-link, .back-link {
    margin-top: 1rem;
  }
  </style>
  