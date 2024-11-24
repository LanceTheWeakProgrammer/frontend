<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../../stores/auth.store';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import ToastComponent from '../../components/ToastComponent.vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const newPassword = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const toastComponent = ref(null);
const router = useRouter();

const newLogin = async () => {
  if (newPassword.value !== confirmPassword.value) {
    toastComponent.value.showToast('error', 'Error', 'Passwords do not match');
    return;
  }

  loading.value = true;
  const response = await authStore.newLogin(newPassword.value);

  if (response.success) {
    toastComponent.value.showToast('success', 'Success', response.message);
    router.push({ name: 'TechnicianDashboard' }); 
  } else {
    toastComponent.value.showToast('error', 'Error', response.message);
  }
  loading.value = false;
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 class="text-2xl font-bold text-center mb-6">Change Your Password</h2>

      <div class="mb-4">
        <label for="new_password" class="block text-sm font-medium text-gray-700">New Password</label>
        <InputText v-model="newPassword" id="new_password" type="password" class="mt-1 block w-full rounded-md shadow-sm sm:text-sm" />
      </div>

      <div class="mb-6">
        <label for="confirm_password" class="block text-sm font-medium text-gray-700">Confirm New Password</label>
        <InputText v-model="confirmPassword" id="confirm_password" type="password" class="mt-1 block w-full rounded-md shadow-sm sm:text-sm" />
      </div>

      <Button 
        :label="loading ? 'Changing Password...' : 'Change Password'"
        class="w-full py-2 px-4 rounded-md"
        :disabled="loading"
        :icon="loading ? 'pi pi-spin pi-spinner' : ''"
        @click="newLogin"
      />
      
      <ToastComponent ref="toastComponent" />
    </div>
  </div>
</template>

<style scoped>
.min-h-screen {
  background-image: url('/background.jpg');
  background-size: cover;
  background-position: center;
  height: 100vh;
}
</style>
