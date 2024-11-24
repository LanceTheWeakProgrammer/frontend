<template>
  <div class="w-full body min-h-screen">
    <header v-if="!isLoginPage" class="bg-rose-500 text-white py-4 px-8 flex justify-between items-center sticky top-0 z-20">
      <div class="flex items-center gap-4">
        <h1 class="text-3xl font-bold h-title">JH Paints</h1>
        <Button 
          icon="pi pi-bars" 
          @click="toggleSidebar" 
          class="lg:!hidden mr-2" 
          severity="secondary"
        />
      </div>
      <div class="flex items-center gap-4">

        <div class="relative">
          <OverlayBadge v-if="unreadMessagesCount > 0" :value="unreadMessagesCount" severity="danger" size="small">
            <Button
              icon="pi pi-comments"
              rounded
              severity="secondary"
              aria-label="Messages"
              @click="navigateToMessages"
            />
          </OverlayBadge>
          <Button
            v-else
            icon="pi pi-comments"
            rounded
            severity="secondary"
            aria-label="Messages"
            @click="navigateToMessages"
          />
        </div>

        <div class="relative">
          <OverlayBadge v-if="unreadCount > 0" :value="unreadCount" severity="danger" size="small">
            <Button
              icon="pi pi-bell"
              rounded
              severity="secondary"
              aria-label="Notifications"
              @click="toggleNotifications"
            />
          </OverlayBadge>
          <Button
            v-else
            icon="pi pi-bell"
            rounded
            severity="secondary"
            aria-label="Notifications"
            @click="toggleNotifications"
          />

          <div
            v-if="showNotifications"
            class="absolute right-0 mt-2 w-96 bg-white shadow-md rounded-md overflow-hidden z-30"
          >
            <div class="p-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-800">Notifications</h3>
            </div>
            <ul class="list-none p-4 h-80 overflow-y-auto custom-scrollbar">
              <li
                v-for="(notification, index) in notifications"
                :key="notification.id || index"
                class="cursor-pointer"
                @click="markNotificationAsRead(notification.id)"
              >
                <p class="text-gray-800 font-semibold">{{ notification.data?.message || 'Notification' }}</p>
                <p class="text-gray-500 text-sm">{{ new Date(notification.created_at).toLocaleString() }}</p>

                <Divider v-if="index < notifications.length - 1" />
              </li>
              <li v-if="notifications.length === 0" class="p-4 text-gray-500 text-center">
                No notifications
              </li>
            </ul>
          </div>
        </div>

        <Button @click="logout" severity="secondary" label="Logout" icon="pi pi-sign-out" />
      </div>
    </header>

    <div class="flex-grow flex">
      <transition name="slide">
        <div 
          v-if="isSidebarVisible || isLargeScreen"
          class="sidebar fixed z-10 flex flex-col lg:w-1/6 w-full lg:h-full bg-white"
        >
          <PanelMenu v-if="!isLoginPage" :model="items" class="h-full !p-2">
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
      </transition>

      <div class="flex-grow">
        <Dialog v-model:visible="isSessionExpired" header="Session Expired" :closable="false" :modal="true">
          <p>Your session has expired. Please log in again to continue.</p>
          <template #footer>
            <Button label="Logout" icon="pi pi-sign-out" @click="logout" class="p-button-danger" />
          </template>
        </Dialog> 

        <div class="mx-auto p-4">
          <div class="flex flex-col lg:w-5/6 w-full lg:ml-auto overflow-hidden">
            <router-view />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useAuthStore } from '../stores/auth.store';
import { useNotificationStore } from '../stores/notification.store';
import echoInstance from '../services/echo';
import { useRouter, useRoute } from 'vue-router';
import Button from 'primevue/button';
import PanelMenu from 'primevue/panelmenu';
import Dialog from 'primevue/dialog';
import OverlayBadge from 'primevue/overlaybadge';
import Divider from 'primevue/divider';

const authStore = useAuthStore();
const notificationStore = useNotificationStore();
const router = useRouter();
const route = useRoute();

const isSidebarVisible = ref(false);
const isLargeScreen = ref(window.innerWidth >= 1024);
const isSessionExpired = ref(false);
const isLoginPage = ref(route.name === 'TechnicianLogin');
const showNotifications = ref(false);
const notifications = computed(() => notificationStore.notifications);
const unreadCount = computed(() => notificationStore.unreadCount);
const unreadMessagesCount = ref(0); 

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
};
const toggleSidebar = () => {
  if (!isLargeScreen.value) {
    isSidebarVisible.value = !isSidebarVisible.value;
  }
};

const navigateToMessages = () => {
  router.push({ name: 'TechnicianMessages' });
};

const logout = async () => {
  await authStore.technicianLogout();
  router.push({ name: 'TechnicianLogin' });
};

const updateScreenSize = () => {
  isLargeScreen.value = window.innerWidth >= 1024;
  isSidebarVisible.value = isLargeScreen.value;
};
watch(route, () => {
  isLoginPage.value = route.name === 'TechnicianLogin';
  if (isLoginPage.value) {
    isSessionExpired.value = false;
  }
});

const initialized = ref(false);

const initializeNotifications = () => {
  if (initialized.value) return;

  notificationStore.fetchNotifications();

  const channelName = `App.Models.User.${authStore.user.id}`;
  echoInstance
    .private(channelName)
    .notification((notification) => {
      const notified = {
        id: notification.id,
        data: {
          booking_id: notification.booking_id,
          message: notification.message || 'New notification received',
        },
        created_at: notification.created_at || new Date().toISOString(),
        read_at: notification.read_at || null,
      };
      
      notificationStore.addNotification(notified);
    });

  initialized.value = true;
};

onMounted(() => {
  window.addEventListener('resize', updateScreenSize);
  updateScreenSize();

  const isValidSession = authStore.checkAuth();
  if (!isValidSession && !isLoginPage.value) {
    isSessionExpired.value = true;
  }

  if (authStore.user) {
    initializeNotifications();
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateScreenSize);
});

watch(
  () => authStore.user,
  (newUser) => {
    if (newUser) {
      initializeNotifications();
    } else {
      initialized.value = false; 
    }
  }
);

const markNotificationAsRead = async (notificationId) => {
  await notificationStore.markAsRead(notificationId);
};

const items = ref([
  { label: 'Dashboard', icon: 'pi pi-fw pi-home', route: '/technician/dashboard' },
  { label: 'Confirmations', icon: 'pi pi-fw pi-list-check', route: '/technician/confirmations' },
  { label: 'Schedules', icon: 'pi pi-fw pi-calendar', route: '/technician/schedules' },
  { label: 'Profile', icon: 'pi pi-fw pi-user', route: '/technician/profile' },
]);
</script>

<style scoped>
.body {
  background-color: #f3f4f6;
}

.slide-enter-active, .slide-leave-active {
  transition: transform 300ms ease, opacity 300ms ease;
}

.slide-enter-from, .slide-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-enter-to, .slide-leave-from {
  transform: translateY(0);
  opacity: 1;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}
</style>
