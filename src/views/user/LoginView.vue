<template>
  <main class="gradient">
    <div class="min-h-screen min-w-screen flex lg:mx-20 lg:py-4">
      <div class="w-full md:w-1/2 flex bg-white items-center justify-center p-4 relative z-10">
        <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 class="text-2xl font-bold text-center mb-6">Sign in to your account</h2>
          <Divider />
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <InputText v-model="email" id="email" class="mt-1 block w-full rounded-md shadow-sm sm:text-sm" :class="{ 'p-invalid': !emailValid && showErrors }" />
            <small v-if="!email && showErrors" class="p-error">Email is required.</small>
            <small v-if="!emailValid && email && showErrors" class="p-error">Please enter a valid email address.</small>
          </div>
          <div class="mb-6">
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <InputText type="password" v-model="password" id="password" class="mt-1 block w-full rounded-md shadow-sm sm:text-sm" :class="{ 'p-invalid': !password && showErrors }" />
            <small v-if="!password && showErrors" class="p-error">Password is required.</small>
          </div>
          <Button :label="buttonLabel" :icon="buttonIcon" :disabled="loading" class="w-full py-2 px-4 rounded-md" @click="handleLogin" />
          <div class="text-center mt-4">
            <p class="text-sm text-gray-600">
              Don't have an account?
              <router-link to="/register" class="text-rose-500 hover:underline">Register</router-link>
            </p>
          </div>
        </div>
      </div>
      <div class="hidden md:block md:w-1/2 bg-white relative overflow-hidden">
        <img src="../../test_images/3.jpg" alt="Car Image" class="absolute inset-0 w-full h-full object-cover z-10 p-2 rounded-xl" />
        <div class="relative z-20 h-full flex flex-col items-end justify-end p-8">
          <div class="text-white text-right max-w-lg mb-8">
            <h2 class="text-5xl font-bold mb-4">Book a Technician</h2>
            <p class="text-lg text-gray-300">Get expert help at your doorstep with just one click. Book a certified technician for your car service needs.</p>
          </div>
        </div>
      </div>
    </div>
  </main>
  <ToastComponent ref="toastComponent" />

</template>

<script setup>
import { ref, computed } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import ToastComponent from '../../components/ToastComponent.vue';
import { useAuthStore } from '../../stores/auth.store';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const loading = ref(false); 
const showErrors = ref(false);
const toastComponent = ref(null);
const router = useRouter();

const buttonLabel = computed(() => loading.value ? 'Signing in...' : 'Sign in');
const buttonIcon = computed(() => loading.value ? 'pi pi-spin pi-spinner' : '');

const authStore = useAuthStore();

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const emailValid = computed(() => emailPattern.test(email.value));

const handleLogin = async () => {
  showErrors.value = true;

  if (!emailValid.value || !email.value || !password.value) {
    return;
  }

  loading.value = true;
  
  const result = await authStore.userLogin(email.value, password.value, 'user');

  if (result.success) {
    toastComponent.value.showToast('success', 'Login Successful', result.message);
    router.push({ name: 'Bookings' });
  } else {
    toastComponent.value.showToast('error', 'Login Failed', result.message);
  }

  loading.value = false;
};

</script>

<style scoped>

  .gradient {
      background: linear-gradient(-45deg, #929292, #ff5858, #808080, #000000);
      background-size: 400% 400%;
      animation: gradientMove 15s ease infinite;
  }
  
  @keyframes gradientMove {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
  }
</style>
