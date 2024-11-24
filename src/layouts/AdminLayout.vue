<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useAuthStore } from '../stores/auth.store';
import { useRouter, useRoute } from 'vue-router';
import Button from 'primevue/button';
import PanelMenu from 'primevue/panelmenu';
import Dialog from 'primevue/dialog';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const isSidebarVisible = ref(false);
const isLargeScreen = ref(window.innerWidth >= 1024);
const isSessionExpired = ref(false);
const isLoginPage = ref(route.name === 'AdminLogin');

const toggleSidebar = () => {
  if (!isLargeScreen.value) {
    isSidebarVisible.value = !isSidebarVisible.value;
  }
};

const logout = async () => {
  await authStore.adminLogout();
  router.push({ name: 'AdminLogin' });
};

const updateScreenSize = () => {
  isLargeScreen.value = window.innerWidth >= 1024;
  if (isLargeScreen.value) {
    isSidebarVisible.value = true;
  } else {
    isSidebarVisible.value = false;
  }
};

watch(route, () => {
  isLoginPage.value = route.name === 'AdminLogin';
  if (isLoginPage.value) {
    isSessionExpired.value = false; 
  }
});

onMounted(async () => {
  window.addEventListener('resize', updateScreenSize);
  updateScreenSize();

  const isValidSession = await authStore.checkAuth();
  if (!isValidSession && !isLoginPage.value) {
    isSessionExpired.value = true;
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateScreenSize);
});

watch(() => authStore.token, (newToken) => {
  if (!newToken && !isLoginPage.value) {
    isSessionExpired.value = true;
  }
});

const items = ref([
  { label: 'Dashboard', icon: 'pi pi-fw pi-home', route: '/admin/dashboard' },
  { 
    label: 'Bookings', 
    icon: 'pi pi-fw pi-calendar', 
    items: [
      { label: 'All Bookings', icon: 'pi pi-fw pi-list', route: '/admin/bookings' },
      // { label: 'Guest Bookings', icon: 'pi pi-fw pi-user', route: '/admin/guest-bookings' },
      { label: 'Active Bookings', icon: 'pi pi-fw pi-user-edit', route: '/admin/active_bookings' }
    ]
  },
  { label: 'Technicians', icon: 'pi pi-fw pi-id-card', route: '/admin/technician' },
  { label: 'Vehicles and Services', icon: 'pi pi-fw pi-car', route: '/admin/vehicles_&_services' },
  { label: 'Settings', icon: 'pi pi-fw pi-cog', route: '/admin/settings' },
  { label: 'Carousel', icon: 'pi pi-fw pi-image', route: '/admin/carousel' },
  { label: 'Users', icon: 'pi pi-fw pi-users', route: '/admin/users' },
  { label: 'Testimonials', icon: 'pi pi-fw pi-star', route: '/admin/testimonials' },
  { label: 'User Queries', icon: 'pi pi-fw pi-question-circle', route: '/admin/user_queries' }
]);
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <header v-if="!isLoginPage" class="bg-rose-500 text-white py-4 px-8 flex justify-between items-center sticky top-0 z-10">
      <h1 class="text-3xl font-bold h-title">JH Paints</h1>
      <div class="flex items-center gap-2">
        <Button
          icon="pi pi-bars"
          @click="toggleSidebar"
          class="lg:!hidden"
          severity="secondary"
        />
        <Button
          @click="logout"
          severity="secondary"
          label="Logout"
          icon="pi pi-sign-out"
        />
      </div>
    </header>

    <div class="flex-grow flex min-h-screen">
      <div class="flex fixed z-10 flex-col lg:w-1/6 w-full h-50vh lg:h-full bg-white">
        <PanelMenu 
          v-if="!isLoginPage && (isSidebarVisible || isLargeScreen)" 
          :model="items" 
          class="h-full !p-2"
        >
          <template #item="{ item }">
            <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
              <a v-ripple class="flex items-center cursor-pointer text-surface-700 dark:text-surface-0 px-4 py-2" :href="href" @click="navigate">
                <span :class="item.icon" />
                <span class="ml-2">{{ item.label }}</span>
              </a>
            </router-link>
            <a v-else v-ripple class="flex items-center cursor-pointer text-surface-700 dark:text-surface-0 px-4 py-2" :href="item.url" :target="item.target">
              <span :class="item.icon" />
              <span class="ml-2">{{ item.label }}</span>
              <span v-if="item.items" class="pi pi-angle-down text-primary ml-auto" />
            </a>
          </template>
        </PanelMenu>
      </div>

      <div class="flex-grow p-6 bg-gray-100">
        <Dialog 
          v-model:visible="isSessionExpired" 
          header="Session Expired"
          :closable="false"
          :modal="true"
        >
          <p>Your session has expired. Please log in again to continue.</p>
          <template #footer>
            <Button label="Logout" icon="pi pi-sign-out" @click="logout" class="p-button-danger" />
          </template>
        </Dialog> 

        <div class="mx-auto pl-4">
          <div class="flex flex-col lg:w-5/6 w-full lg:ml-auto overflow-hidden">
            <router-view />
          </div>
        </div>
      </div>
    </div>

    <div class="text-end bottom-4 right-4 text-gray-600 text-sm z-20">
      <span><a href="#" class="hover:underline">Contact Developer</a> &bull; &copy; BERNAXX 2024</span>
    </div>
  </div>
</template>

<style scoped>

</style>
