<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 class="text-2xl font-bold text-center mb-6">Admin Login</h2>
      <div class="mb-4">
        <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
        <InputText v-model="username" id="username" class="mt-1 block w-full rounded-md shadow-sm sm:text-sm" />
      </div>
      <div class="mb-6">
        <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
        <InputText type="password" v-model="password" id="password" class="mt-1 block w-full rounded-md shadow-sm sm:text-sm" />
      </div>
      <Button :label="buttonLabel" :icon="buttonIcon" :disabled="loading" class="w-full py-2 px-4 rounded-md" @click="login" />
      <ToastComponent ref="toastComponent" />
    </div>

    <div class="fixed bottom-4 right-4 text-gray-600 text-sm">
      <span><a href="#" class="hover:underline">Contact Developer</a> &bull; &copy; BERNAXX 2024</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import ToastComponent from '../../components/ToastComponent.vue';
import { useAuthStore } from '../../stores/auth.store';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const loading = ref(false); 
const toastComponent = ref(null);
const router = useRouter();

const buttonLabel = computed(() => loading.value ? 'Logging in...' : 'Login');
const buttonIcon = computed(() => loading.value ? 'pi pi-spin pi-spinner' : '');

const authStore = useAuthStore();

const login = async () => {
  loading.value = true;

  const result = await authStore.adminLogin(username.value, password.value, 'admin');

  if (result.success) {
    toastComponent.value.showToast('success', 'Login Successful', result.message);
    router.push({ name: 'Dashboard' });
  } else {
    toastComponent.value.showToast('error', 'Login Failed', result.message);
  }

  loading.value = false;
};
</script>
