<script setup>
import { ref } from 'vue';
import InputOtp from 'primevue/inputotp';
import Button from 'primevue/button';
import ToastComponent from '../../components/ToastComponent.vue';
import { useMailStore } from '../../stores/mail.store';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const mailStore = useMailStore();
const toastComponent = ref(null);

const otpCode = ref('');
const showErrors = ref(false);

const submitOtp = async () => {
  showErrors.value = true;
  
  if (otpCode.value.length === 6) {
    const response = await mailStore.verifyOtp(otpCode.value, route.query.email);
    if (response.success) {
        toastComponent.value.showToast('success', 'Login Successful', response.message);
      router.push({ name: 'Bookings' });
    } else {
        toastComponent.value.showToast('error', 'Login Failed', response.message);
    }
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
      <h2 class="text-2xl font-semibold text-center mb-6">Verify Your Account</h2>
      <p class="text-center text-gray-600 mb-6">Please enter the 6-digit verification code sent to your email.</p>
      <div class="grid gap-6">
        <InputOtp 
          v-model="otpCode" 
          :length="6"
          class="w-full justify-between" 
          :invalid="!otpCode && showErrors"
        />
        <small v-if="!otpCode && showErrors" class="p-error">OTP code is required.</small>
        <Button 
          label="Verify" 
          class="w-full" 
          @click="submitOtp" 
          :disabled="otpCode.length !== 6"
        />
        <ToastComponent ref="toastComponent" />
      </div>
    </div>
  </div>
</template>

<style scoped>
  .p-error {
    color: #f44336;
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }
</style>
