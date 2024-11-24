<script setup>
import { useAuthStore } from '../../stores/auth.store';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import ToastComponent from '../../components/ToastComponent.vue';

const authStore = useAuthStore();
const accountNumber = ref('');
const password = ref('');
const router = useRouter();
const loading = ref(false);
const toastComponent = ref(null);

const login = async () => {
  loading.value = true;

  const response = await authStore.technicianLogin(accountNumber.value, password.value);

  if (response.success) {
    toastComponent.value.showToast('success', 'Login Successful', response.message);

    if (response.redirect === 'TechnicianChangePassword') {
      router.push({ name: 'TechnicianChangePassword' });
    } else {
      router.push({ name: 'TechnicianDashboard' });
    }
  } else {
    toastComponent.value.showToast('error', 'Login Failed', response.message);
  }

  loading.value = false;
};


</script>

<template>
  <div class="body min-h-screen flex items-center justify-center">
    <div class="bg-white/70 backdrop-blur-sm p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 class="text-2xl font-bold text-center mb-6">Sign in as a Technician</h2>
      
      <div class="mb-4">
        <label for="account_number" class="block text-sm font-medium text-gray-700">Account Number</label>
        <InputText v-model="accountNumber" id="account_number" class="mt-1 block w-full rounded-md shadow-sm sm:text-sm" />
      </div>

      <div class="mb-6">
        <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
        <InputText type="password" v-model="password" id="password" class="mt-1 block w-full rounded-md shadow-sm sm:text-sm" />
      </div>

      <Button 
        :label="loading ? 'Signing in...' : 'Sign in'" 
        class="w-full py-2 px-4 rounded-md" 
        @click="login" 
        :disabled="loading"
        :icon="loading ? 'pi pi-spin pi-spinner' : ''"
      />
      <ToastComponent ref="toastComponent" />
    </div>
  </div>
</template>

<style scoped>
.body {
  margin: 0;
  padding: 0;
  background-image: url('/background.jpg');
  background-size: cover;
  background-position: center;
  height: 100vh;
}
</style>
