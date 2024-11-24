<template>
  <Dialog 
    :visible="visible"
    modal 
    :closable="false"
    pt:mask:class="backdrop-blur-sm"
    @hide="onClose"
    :style="{ width: dialogWidth }" 
  >
    <template #container>
      <div class="flex flex-col px-8 py-8 gap-6 rounded-2xl">
        <div class="flex items-center justify-center">
          <img src="../../logo.svg" alt="Logo Image" width="120">
        </div>
        <div class="inline-flex flex-col gap-2">
          <label for="email">Email</label>
          <InputText id="email" v-model="email" placeholder="Enter your email" class="w-full" :class="{ 'p-invalid': !emailValid && showErrors }" />
          <small v-if="!email && showErrors" class="p-error">Email is required.</small>
          <small v-if="!emailValid && email && showErrors" class="p-error">Please enter a valid email address.</small>
        </div>
        <div class="inline-flex flex-col gap-2">
          <label for="password">Password</label>
          <InputText id="password" v-model="password" type="password" placeholder="Enter your password" class="w-full" :class="{ 'p-invalid': !password && showErrors }" />
          <small v-if="!password && showErrors" class="p-error">Password is required.</small>
        </div>
        <div class="flex items-center gap-4">
          <Button label="Cancel" class="w-full" @click="onClose" text />
          <Button label="Sign in" class="w-full" icon="pi pi-user" @click="login" />
        </div>
      </div>
    </template>
  </Dialog>
  
  <ToastComponent ref="toastComponent" />
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { useAuthStore } from '../../stores/auth.store';
import ToastComponent from '../../components/ToastComponent.vue';

const toastComponent = ref(null);

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
});
const emit = defineEmits(['close']);

const authStore = useAuthStore();
const email = ref('');
const password = ref('');
const showErrors = ref(false);

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const emailValid = computed(() => emailPattern.test(email.value));

const windowWidth = ref(window.innerWidth);

const dialogWidth = computed(() => {
  if (windowWidth.value >= 1024) {
    return '25vw';
  } else if (windowWidth.value >= 768) {
    return '50vw';
  } else if (windowWidth.value >= 640) {
    return '50vw';
  } else {
    return '70vw';
  }
});

const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener('resize', updateWindowWidth);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateWindowWidth);
});

const login = async () => {
  showErrors.value = true;

  if (!emailValid.value || !email.value || !password.value) return;

  const result = await authStore.userLogin(email.value, password.value);
  if (result.success) {
    toastComponent.value.showToast('success', 'Login Successful', result.message);
    onClose();
  } else {
    toastComponent.value.showToast('error', 'Login Failed', result.message);
    console.error(result.message);
  }
};

const onClose = () => {
  showErrors.value = false;
  email.value = '';
  password.value = '';
  emit('close');
};
</script>

<style scoped>
.p-error {
  color: red;
  font-size: 0.875rem;
}
</style>
