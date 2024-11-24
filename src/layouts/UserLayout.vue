<template>
  <div>
    <ProgressBar v-if="loading" mode="indeterminate" style="height: 6px; position: fixed; top: 0; width: 100%; z-index: 50;" />
    <div v-if="!route.meta.hideHeader" class="sticky top-0 z-20 follow-me bg-white shadow-md">
      <Menubar :model="items" class="shadow-md bg-white">
        <template #start>
          <router-link :to="{ name: 'Home' }">
            <img src="./../../src/logo.svg" alt="Logo Image" width="70px" height="10px">
          </router-link>
        </template>

        <template #item="{ item, props }">
          <router-link v-slot="{ href, navigate }" :to="item.route" custom>
            <a v-ripple :href="href" v-bind="props.action" @click="navigate">
              <span class="mx-1 font-semibold">{{ item.label }}</span>
            </a>
          </router-link>
        </template>

        <template #end>
          <div class="flex items-center gap-2 py-1">
            <template v-if="isUserLoggedIn">
              <div class="relative">
                <OverlayBadge v-if="unreadMessagesCount > 0" :value="unreadMessagesCount" severity="danger" size="small">
                  <Button
                    icon="pi pi-comments"
                    rounded
                    severity="secondary"
                    aria-label="Messages"
                    @click="openMessages"
                  />
                </OverlayBadge>
                <Button
                  v-else
                  icon="pi pi-comments"
                  rounded
                  severity="secondary"
                  aria-label="Messages"
                  @click="openMessages"
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
                  <ul class="list-none h-80 overflow-y-auto custom-scrollbar">
                    <li
                      v-for="(notification, index) in notifications"
                      :key="notification.id || index"
                      class="cursor-pointer p-3"
                      :class="{'bg-gray-100': !notification.read_at}" 
                      @click="openBooking(notification.id)"
                    >
                      <p class="text-gray-800 font-semibold">{{ notification.data?.message || 'Notification' }}</p>
                      <p class="text-gray-500 text-sm">{{ new Date(notification.created_at).toLocaleString() }}</p>
                    </li>
                    <div v-if="index < notifications.length - 1" class="border-t border-gray-200 my-2"></div>
                    <li v-if="notifications.length === 0" class="p-4 text-gray-500 text-center">
                      No notifications
                    </li>
                  </ul>
                </div>
              </div>

              <Drawer v-model:visible="visible">
                <template #header>
                  <div class="flex items-center gap-2">
                    <Avatar :image="user?.avatar || '/src/test_images/avatar.jpg'" shape="circle" />
                    <span class="font-bold">{{ user?.name }}</span>
                  </div>
                </template>
                <div class="flex flex-col gap-2 items-center">
                  <router-link
                    class="flex flex-col w-full"
                    to="/profile"
                    @mouseover="hovered = 'profile'"
                    @mouseleave="hovered = null"
                  >
                    <Button
                      label="Profile"
                      icon="pi pi-user"
                      :outlined="hovered !== 'profile'"
                    ></Button>
                  </router-link>
                  <router-link
                    class="flex flex-col w-full"
                    to="/bookings"
                    @mouseover="hovered = 'bookings'"
                    @mouseleave="hovered = null"
                  >
                    <Button
                      label="Bookings"
                      icon="pi pi-calendar"
                      :outlined="hovered !== 'bookings'"
                    ></Button>
                  </router-link>
                  <router-link
                    class="flex flex-col w-full"
                    to="/transactions"
                    @mouseover="hovered = 'transactions'"
                    @mouseleave="hovered = null"
                  >
                    <Button
                      label="Transactions"
                      icon="pi pi-calendar"
                      :outlined="hovered !== 'transactions'"
                    ></Button>
                  </router-link>
                </div>
                <template #footer>
                  <div class="flex items-center gap-2">
                    <Button label="Logout" icon="pi pi-sign-out" class="flex-auto" severity="danger" text @click="logout"></Button>
                  </div>
                </template>
              </Drawer>

              <Button icon="pi pi-user" @click="toggleDrawer" rounded outlined>
                <Avatar :image="user?.avatar || '/src/test_images/avatar.jpg'" shape="circle" size="large" />
              </Button>
            </template>
            <template v-else>
              <router-link to="/register">
                <Button label="Register" size="small" icon="pi pi-user-plus"></Button>
              </router-link>
              <router-link to="/login">
                <Button label="Sign in" size="small" outlined icon="pi pi-sign-in" class="mr-2"></Button>
              </router-link>
            </template>
          </div>
        </template>
      </Menubar>
    </div>

    <div class="svg-background">
      <div class="justify-center">
        <router-view></router-view>
      </div>
    </div>

    <ScrollTop />

    <div class="p-10 px-5" v-if="!route.meta.hideFooter">
      <footer>
        <div class="mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <h2 class="text-xl font-bold mb-4">{{ appInfo?.appTitle || 'Default Title' }}</h2>
            <p class="text-gray-600">{{ appInfo?.appAbout || 'Providing reliable automobile services for our valued customers.' }}</p>
          </div>
          <div class="lg:mx-32">
            <h2 class="text-xl font-semibold mb-4">Links</h2>
            <ul>
              <li class="mb-2"><a href="#" class="text-gray-600 hover:text-gray-900">Home</a></li>
              <li class="mb-2"><a href="#" class="text-gray-600 hover:text-gray-900">Technicians</a></li>
              <li class="mb-2"><a href="#" class="text-gray-600 hover:text-gray-900">Services</a></li>
              <li class="mb-2"><a href="#" class="text-gray-600 hover:text-gray-900">Contact Us</a></li>
              <li class="mb-2"><a href="#" class="text-gray-600 hover:text-gray-900">About</a></li>
            </ul>
          </div>
          <div class="lg:mx-20">
            <h2 class="text-xl font-semibold mb-4">Follow Us</h2>
            <ul>
              <li class="mb-2">
                <a :href="url(contactInfo?.twt)" target="_blank" class="flex items-center text-gray-600 hover:text-gray-900">
                  <i class="pi pi-twitter mr-2"></i> Twitter
                </a>
              </li>
              <li class="mb-2">
                <a :href="url(contactInfo?.fb)" target="_blank" class="flex items-center text-gray-600 hover:text-gray-900">
                  <i class="pi pi-facebook mr-2"></i> Facebook
                </a>
              </li>
              <li class="mb-2">
                <a :href="url(contactInfo?.ig)" target="_blank" class="flex items-center text-gray-600 hover:text-gray-900">
                  <i class="pi pi-instagram mr-2"></i> Instagram
                </a>
              </li>
            </ul>
          </div>
          <div class="flex flex-col items-center">
            <h2 class="text-xl font-semibold mb-4">Rate Our Service!</h2>
            <Button class="px-4 w-full rounded" @click="showRateDialog = true">
              Rate us
            </Button>

            <Dialog
              header="Rate Us!"
              v-model:visible="showRateDialog"
              :modal="true"
              :closable="true"
              :class="[showSuccessMessage ? 'lg:w-[40vw] w-[60vw]' : 'lg:w-[80vw] w-[95vw]']"
            >
            <template #header>
                <div class="items-center justify-center gap-2">
                    <img src="/logo.svg" width="70">
                </div>
            </template>
              <div v-if="!showSuccessMessage" class="flex lg:flex-row flex-col items-center gap-4">
                <div class="flex flex-col w-full items-center justify-center">
                    <img src="../test_images/rating.svg" alt="" width="400">
                </div>
                <div class="flex flex-col justify-center gap-6 w-full">
                  <div class="card shadow">
                    <p class="text-gray-700 text-sm">
                      We value your feedback! Please take a moment to rate your experience with our service.
                    </p>
                    <div class="flex flex-col justify-stretch gap-4 mt-4">
                      <div class="flex justify-center">
                        <Rating v-model="userRating" :stars="5">
                          <template #onicon>
                            <i class="pi pi-star-fill text-amber-400 mx-1" style="font-size: 2.5rem;"></i>
                          </template>
                          <template #officon>
                            <i class="pi pi-star text-amber-400 mx-1" style="font-size: 2.5rem;"></i>
                          </template>
                        </Rating>
                      </div>
                      <h3 class="font-semibold">Leave a comment</h3>
                      <Textarea v-model="userComment" rows="3" cols="30" placeholder="Write your feedback here..." />
                      <Divider />
                      <div class="flex flex-col gap-2 mt-4">
                        <h1 class="font-semibold text-lg">Tell us more about yourself</h1>
                        <p class="text-gray-600 text-sm">
                          Sharing more about yourself helps us personalize your experience and provide tailored recommendations.
                        </p>
                      </div>

                      <div class="flex flex-col gap-3">
                        <h3 class="font-semibold">Name</h3>
                        <InputText />
                        <h3 class="font-semibold">Email</h3>
                        <InputText />
                      </div>
                    </div>
                    <div class="flex items-center gap-2 mt-4">
                      <Button label="Submit Feedback" @click="submitFeedback" />
                      <Button label="Cancel" severity="secondary" outlined @click="showRateDialog = false" />
                    </div>
                  </div>
                </div>
              </div>

              <div v-else class="flex flex-col items-center justify-center gap-6">
                <img src="../test_images/rating.svg" alt="Success" class="w-1/3">
                <h1 class="text-3xl font-semibold text-rose-500">Thank you for your feedback!</h1>
                <p class="text-gray-700 text-center">
                  Your feedback is valuable to us and helps improve our service.
                </p>
                <Button label="Close" @click="showRateDialog = false" class="mt-4" />
              </div>
            </Dialog>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useAuthStore } from '../stores/auth.store';
import { useGlobalStore } from '../stores/global.store';
import { useNotificationStore } from '../stores/notification.store';
import echoInstance from '../services/echo';
import { useRouter, useRoute } from 'vue-router';
import Menubar from 'primevue/menubar';
import Button from 'primevue/button';
import ProgressBar from 'primevue/progressbar';
import Dialog from 'primevue/dialog';
import Avatar from 'primevue/avatar';
import OverlayBadge from 'primevue/overlaybadge';
import Drawer from 'primevue/drawer';
import Rating from 'primevue/rating';
import ScrollTop from 'primevue/scrolltop';
import Textarea from 'primevue/textarea';
import InputText from 'primevue/inputtext';
import Divider from 'primevue/divider';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const hovered = ref(null);
const notificationStore = useNotificationStore();

const showRateDialog = ref(false);
const showSuccessMessage = ref(false);
const userRating = ref(0);
const userComment = ref('');

const submitFeedback = () => {
  // Frontend logic to switch view to success message
  showSuccessMessage.value = true;
};
const items = ref([
  { label: 'Home', route: '/' },
  { label: 'Technicians', route: '/technicians' },
  { label: 'Services', route: '/services' },
  { label: 'Contact', route: '/contact' },
  { label: 'About', route: '/about' }
]);

const globalStore = useGlobalStore();
const appInfo = ref(null);
const contactInfo = ref(null);

const loading = ref(false);

const visible = ref(false);
const showNotifications = ref(false);

const toggleDrawer = () => {
  visible.value = !visible.value;
};

const openMessages = () => {
  router.push({ name: 'Messages' }); 
};

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
};

router.beforeEach((to, from, next) => {
  loading.value = true; 
  next();
});

router.afterEach(() => {
  loading.value = false; 
});

const isUserLoggedIn = computed(() => authStore.role === 'user' && authStore.token !== null);
const user = computed(() => authStore.user);
const notifications = computed(() => notificationStore.notifications);
const unreadCount = computed(() => notificationStore.unreadCount);

const logout = async () => {
  await authStore.userLogout();
  router.push({ name: 'Home' });
};

const openBooking = async (notificationId) => {
  await notificationStore.markAsRead(notificationId);
  router.push({ name: 'Bookings' }); 
};

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
  if (authStore.user) {
    initializeNotifications();
  }
});

const url = (url) => {
  if (!url) return '#';
  return url.startsWith('http') ? url : `https://${url}`;
};

onMounted(async () => {
  await globalStore.fetchAppInfo();
  await globalStore.fetchContactInfo();

  appInfo.value = globalStore.appInfo[0]; 
  contactInfo.value = globalStore.contactInfo[0]; 
});

watch(
  () => authStore.user,
  (newUser) => {
    if (newUser) {
      initializeNotifications();
    } else {
      console.log("User logged out; stopping notifications.");
      initialized.value = false; 
    }
  }
);
</script>

<style scoped>
.svg-background {
  background-image: url('../assets/background.svg');
  background-size: auto;
  background-repeat: repeat;
  background-position: center;
}

.follow-me {
  position: sticky;
  top: 0;
  z-index: 20;
}

.notification-dropdown {
  width: 24ch;
  text-align: left;
  padding: 10px;
  font-size: 16px;
  background-color: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
