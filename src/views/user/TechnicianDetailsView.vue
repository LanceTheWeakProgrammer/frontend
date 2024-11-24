<template>
  <div v-if="loading">
    <TechnicianDetailsSkeleton />
  </div>
  <div v-else>
    <div class="mx-auto px-10 py-5">
      <h1 ref="cancelFocus" class="font-semibold text-3xl ml-3">{{ technician.full_name }}</h1>
      <div class="flex flex-col lg:flex-row lg:items-center">
        <Breadcrumb :home="home" :model="items" class="!bg-transparent">
            <template #item="{ item, props }">
                <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                    <a :href="href" v-bind="props.action" @click="navigate">
                        <span :class="[item.icon, 'text-color']" />
                        <span class="text-primary font-semibold">{{ item.label }}</span>
                    </a>
                </router-link>
                <a v-else :href="item.url" :target="item.target" v-bind="props.action">
                    <span class="text-surface-700 dark:text-surface-0">{{ item.label }}</span>
                </a>
            </template>
        </Breadcrumb>
      </div>

      <div class="flex flex-col lg:flex-row gap-20 justify-between card shadow">
        <div class="flex flex-col lg:w-1/3">
          <div class="flex lg:flex-row flex-col items-center lg:justify-between justify-evenly gap-4 mb-5">
            <div class="flex items-center">
              <h2 class="font-semibold text-xl mr-2">Rating: </h2>
              <i v-for="n in technician.averageRating" :key="n" class="pi pi-star-fill text-yellow-500 mr-2"></i>
            </div>
            <div class="flex lg:flex-row lg:gap-4 gap-32">
              <Button label="Rate me" outlined icon="pi pi-star-fill" @click="openRatingModal" />
              <Button label="Book Now" @click="onBookNow" />
            </div>
          </div>
          <div class="flex justify-center mb-3">
            <img :src="technician.profile_image" width="300" class="object-cover rounded-lg h-[280px] shadow-md border border-gray-300" alt="Technician Image" />
          </div>
          <Divider />
          <div class="flex flex-col justify-center">
            <h2 class="font-semibold text-lg mb-3">Bio</h2>
            <p class="w-full text-gray-600 text-center">"{{ technician.bio }}"</p>
          </div>
        </div>

        <div class="lg:w-1/3">
          <div class="flex flex-col gap-16">
            <div>
              <h3 class="text-2xl mb-5 font-semibold">Personal Information</h3>
              <Divider />
              <h2 class="font-semibold block mb-3 text-lg">Complete Name</h2>
              <p class="mb-3 w-full bg-gray-50 px-3 py-2 rounded-md">{{ technician.full_name }}</p>
              <h2 class="font-semibold block mb-3 text-lg">Years of Experience</h2>
              <p class="mb-3 w-full bg-gray-50 px-3 py-2 rounded-md">{{ technician.year_experience }} years</p>
            </div>
            <div>
              <h3 class="text-2xl mb-5 font-semibold">Contact Information</h3>
              <Divider />
              <h2 class="font-semibold block mb-3 text-lg">Contact Number</h2>
              <p class="mb-3 w-full bg-gray-50 px-3 py-2 rounded-md flex items-center">
                <i class="pi pi-phone mr-2"></i>{{ technician.phone_number }}
              </p>
              <h2 class="font-semibold block mb-3 text-lg">Email</h2>
              <p class="mb-3 w-full bg-gray-50 px-3 py-2 rounded-md flex items-center">
                <i class="pi pi-envelope mr-2"></i>{{ technician.email }}
              </p>
            </div>
          </div>
        </div>

        <div class="lg:w-1/3">
          <h3 class="text-2xl mb-5 font-semibold">Skills and Mastery</h3>
          <Divider />
          <div class="flex flex-col gap-10">
            <div>
              <h2 class="font-semibold block text-lg mt-4 mb-3">Service Availability</h2>
              <div class="flex flex-wrap gap-4">
                <Tag v-for="service in technician.services" :key="service.id" severity="secondary">
                  <div class="flex items-center gap-2 px-1">
                    <img alt="Service Icon" :src="getImageUrl(service.icon)" style="width: 18px" />
                    <span>{{ service.name }}</span>
                  </div>
                </Tag>
              </div>
            </div>
            <div>
              <h2 class="font-semibold block text-lg mb-3">Vehicle Type Mastery</h2>
              <div class="flex flex-wrap">
                <Tag v-for="vehicle in technician.vehicle_types" :key="vehicle.id" severity="secondary" :value="vehicle.type" class="mr-4 mb-2" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div ref="focusedInput">
        <FillBookingDetailsSection 
          :visible="bookingDetailsVisible" 
          :technicianId="Number(technicianId)" 
          @cancel="cancelBooking" 
        />
      </div>

      <div class="flex flex-col card shadow">
        <h2 class="font-semibold text-2xl mb-3">Reviews</h2>
        <div class="flex flex-col gap-4 overflow-auto custom-scrollbar h-[30rem]">
          <div v-for="review in reviews" :key="review.id" class="w-full bg-white border rounded-md p-4">
            <div class="flex items-center gap-3 mb-3">
              <Avatar :image="review.user?.profile_image || '/src/test_images/avatar.jpg'" size="large" shape="circle" />
              <h2 class="text-lg">{{ review.user?.full_name || 'Anonymous' }}</h2>
            </div>
            <i v-for="n in review.rating" :key="n" class="pi pi-star-fill text-yellow-500 mr-2 mb-3"></i>
            <p class="mx-3">{{ review.feedback || 'No feedback provided.' }}</p>
          </div>
        </div>
      </div>

      <UserLoginDialog :visible="loginDialogVisible" @close="loginDialogVisible = false" />

      <Dialog header="Rate Technician" v-model:visible="rateModalVisible" class="lg:w-[50vw] md:w-[70vw] sm:w-[90vw] xs:w-[90vw]" :closable="true" :modal="true">
        <div v-if="ratingSuccess" class="flex flex-col items-center">
          <img src="../../test_images/rating.svg" alt="Rating Successful" class="w-[20rem] mb-4" />
          <h3 class="font-semibold text-xl mb-4 text-center">Rating Successful!</h3>
          <p class="text-gray-600 text-center">Thank you for your valuable feedback. It helps us improve our services.</p>
        </div>
        <div v-else class="flex lg:flex-row flex-col justify-center gap-6">
          <div class="lg:w-1/2 flex flex-col items-center">
            <img src="../../test_images/rating.svg" alt="Rating" class="w-[20rem]" />
            <div class="text-start">
              <h3 class="font-semibold text-xl mb-4">We value your feedback!</h3>
              <p class="text-gray-600 text-'sm'">
                Your feedback helps us improve our services. Please take a moment to rate this technician and leave your comments. Thank you for your time!
              </p>
            </div>
          </div>

          <div class="lg:w-1/2 flex flex-col justify-stretch gap-4">
            <h3 class="font-semibold text-lg mb-4">Rate this technician</h3>
            <div class="flex justify-center">
              <Rating v-model="userRating" :stars="5">
                <template #onicon>
                  <i class="pi pi-star-fill text-amber-400 mx-1" style="font-size: 3rem;"></i>
                </template>
                <template #officon>
                  <i class="pi pi-star text-amber-400 mx-1" style="font-size: 3rem;"></i>
                </template>
              </Rating>
            </div>
            <h3 class="font-semibold text-lg">Leave a comment</h3>
            <Textarea v-model="userComment" rows="4" placeholder="Write your feedback here..." class="w-full px-3 py-2 border rounded-md" />
          </div>
        </div>
        <template #footer v-if="!ratingSuccess">
          <Button label="Cancel" class="p-button-text" @click="rateModalVisible = false" />
          <Button label="Submit" class="p-button-primary" @click="submitRating" />
        </template>
      </Dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { useGlobalStore } from '../../stores/global.store';
import { useAuthStore } from '../../stores/auth.store';
import { useRatingStore } from '../../stores/rating.store'; 
import axios from '../../services/axios';
import FillBookingDetailsSection from '../../components/user/FillBookingDetailsSection.vue';
import TechnicianDetailsSkeleton from '../../components/user/skeletons/TechnicianDetailsSkeleton.vue';
import UserLoginDialog from '../../components/user/UserLoginDialog.vue';
import Breadcrumb from 'primevue/breadcrumb';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Divider from 'primevue/divider';
import Avatar from 'primevue/avatar';
import Textarea from 'primevue/textarea';
import Dialog from 'primevue/dialog';
import Rating from 'primevue/rating';

const route = useRoute();
const globalStore = useGlobalStore();
const authStore = useAuthStore();
const ratingStore = useRatingStore();

const technicianId = Number(route.params.id);
const bookingDetailsVisible = ref(false);
const loginDialogVisible = ref(false);
const rateModalVisible = ref(false);
const ratingSuccess = ref(false); 
const userRating = ref(0);
const userComment = ref('');
const loading = ref(true);
const reviews = ref([]);

const cancelBooking = () => {
  bookingDetailsVisible.value = false; 

  window.scrollTo({
    top: 0,
    behavior: 'smooth', 
  });
};

const getImageUrl = (imagePath) => `${axios.defaults.baseURL}/storage/${imagePath}`;

const home = ref({
    icon: 'pi pi-home',
    route: '/'
});
const items = ref([
    { label: 'Technician', route: '/technicians' },
    { label: globalStore.technicianDetails?.full_name, route: '/' }
]);

onMounted(async () => {
  try {
    await globalStore.fetchTechnicianById(technicianId);
    reviews.value = globalStore.technicianDetails?.ratings || []; 
  } catch (error) {
    console.error('Error fetching technician details:', error);
    reviews.value = []; 
  } finally {
    loading.value = false;
  }
});

const technician = computed(() => ({
  full_name: globalStore.technicianDetails?.full_name ?? 'N/A',
  phone_number: globalStore.technicianDetails?.phone_number ?? 'N/A',
  email: globalStore.technicianDetails?.user?.email ?? 'N/A',
  year_experience: globalStore.technicianDetails?.year_experience ?? 0,
  vehicle_types: globalStore.technicianDetails?.vehicle_types ?? [],
  services: globalStore.technicianDetails?.services ?? [],
  bio: globalStore.technicianDetails?.bio ?? 'Bio not available',
  profile_image: globalStore.technicianDetails?.profile_image
    ? getImageUrl(globalStore.technicianDetails.profile_image)
    : '/src/test_images/avatar.jpg',
  averageRating: Math.round(
    reviews.value.reduce((acc, review) => acc + review.rating, 0) / reviews.value.length || 0
  ),
}));

const focusedInput = ref(null);

const toggleBookingDetails = async () => {
  bookingDetailsVisible.value = !bookingDetailsVisible.value; 
  await nextTick(() => {
    if (focusedInput.value) {
      focusedInput.value.scrollIntoView({ behavior: 'smooth' });
    }
  });
};

const onBookNow = () => {
  if (!authStore.token) {
    loginDialogVisible.value = true;
  } else {
    toggleBookingDetails();
  }
};

const openRatingModal = () => {
  rateModalVisible.value = true;
  ratingSuccess.value = false; 
};

const submitRating = async () => {
  if (!userRating.value) {
    alert('Please provide a rating.');
    return;
  }

  try {
    const payload = {
      user_id: authStore.profile_id,
      technician_id: technicianId,
      rating: userRating.value,
      feedback: userComment.value,
    };

    const response = await ratingStore.addRating(payload);
    const newRating = response.data;

    reviews.value.unshift(newRating);

    technician.value.averageRating = Math.round(
      reviews.value.reduce((sum, review) => sum + review.rating, 0) / reviews.value.length
    );

    userRating.value = 0;
    userComment.value = '';
    ratingSuccess.value = true;
  } catch (error) {
    console.error('Error submitting rating:', error);
    alert('Failed to submit the rating. Please try again.');
  }
};
</script>

<style scoped>
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
