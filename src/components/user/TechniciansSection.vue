<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
    <path
      fill="#f43f5e"
      fill-opacity="1"
      d="M0,160L48,144C96,128,192,96,288,101.3C384,107,480,149,576,181.3C672,213,768,235,864,234.7C960,235,1056,213,1152,202.7C1248,192,1344,192,1392,192L1440,192L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
    ></path>
  </svg>
  <div class="justify-center">
    <h1 class="my-4 text-center text-5xl h-title">
      Our <span class="text-rose-500">Technicians</span>
    </h1>
    <div class="flex flex-col justify-center items-center gap-10">
      <div v-if="loading">
        <TechnicianSectionSkeleton />
      </div>
      <div v-else class="flex lg:flex-row flex-col lg:justify-evenly justify-center max-auto gap-10 lg:px-10">
        <div v-for="(technician, index) in technicians" :key="index" class="lg:w-1/3 w-2/3 mx-auto overflow-hidden shadow">
          <div class="rounded-lg h-full bg-white flex flex-col">
            <div class="h-[350px] overflow-hidden rounded-t-lg">
              <img
                :src="getImageUrl(technician.profile_image)"
                alt=""
                class="bg-cover bg-center bg-no-repeat h-full w-full rounded-t-lg"
              />
            </div>
            <div class="p-5 flex-grow">
              <h2 class="mb-5 font-semibold text-xl">{{ technician.full_name }}</h2>

              <div class="mb-4">
                <h4 class="mb-1 font-medium">Services Offered</h4>
                <span
                  v-for="(service, idx) in limitedServices(technician)"
                  :key="idx"
                  class="inline-block bg-gray-200 text-gray-900 rounded-full py-1 px-2 m-1 text-sm font-semibold"
                >
                  {{ service.name }}
                </span>
                <Button
                  v-if="technician.services.length > serviceLimit"
                  size="small"
                  rounded
                  class="text-xs ml-1 mt-1"
                  :label="servicesExpanded ? 'Show Less' : '+ More'"
                  @click="toggleServices(technician)"
                />
              </div>

              <div class="mb-4">
                <h4 class="mb-1 font-medium">Vehicle Types Mastery</h4>
                <span
                  v-for="(vehicle, idx) in limitedVehicles(technician)"
                  :key="idx"
                  class="inline-block bg-gray-200 text-gray-900 rounded-full py-1 px-2 m-1 text-sm font-semibold"
                >
                  {{ vehicle.type }}
                </span>
                <Button
                  v-if="technician.vehicle_types.length > vehicleLimit"
                  size="small"
                  rounded
                  class="text-xs ml-1 mt-1"
                  :label="vehiclesExpanded ? 'Show Less' : '+ More'"
                  @click="toggleVehicles(technician)"
                />
              </div>

              <div class="mb-4">
                <h4 class="mb-1 font-medium">Rating</h4>
                <span class="flex text-rose-500 space-x-1">
                  <i
                    v-for="star in 5"
                    :key="star"
                    :class="star <= calculateAverageRating(technician.ratings) ? 'pi pi-star-fill' : 'pi pi-star'"
                  ></i>
                </span>
              </div>
            </div>
            <div class="p-5 mt-auto">
              <div class="flex justify-between items-center gap-2">
                <Button size="small" @click="onBookNow(technician)">Book now</Button>
                <router-link :to="`/technician/details/${technician.id}`">
                  <Button outlined size="small">More details</Button>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <UserLoginDialog :visible="loginDialogVisible" @close="loginDialogVisible = false" />
    <div class="text-center my-5">
      <router-link
        to="technicians"
        class="go-btn rounded-lg bg-white text-rose-500 border border-rose-500 hover:bg-rose-500 hover:text-white shadow-sm"
      >
        <span>More Technicians</span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useGlobalStore } from '../../stores/global.store';
import { useAuthStore } from '../../stores/auth.store';
import { useRouter } from 'vue-router';
import TechnicianSectionSkeleton from '../../components/user/skeletons/TechnicianSectionSkeleton.vue';
import UserLoginDialog from '../../components/user/UserLoginDialog.vue';
import Button from 'primevue/button';
import axios from '../../services/axios';

const globalStore = useGlobalStore();
const authStore = useAuthStore();
const router = useRouter();
const technicians = ref([]);
const loading = ref(true);
const loginDialogVisible = ref(false);

const serviceLimit = ref(4);
const vehicleLimit = ref(4);

const servicesExpanded = ref(false);
const vehiclesExpanded = ref(false);

onMounted(() => {
  globalStore.fetchTechnicians().then(() => {
    technicians.value = globalStore.technicians.slice(0, 3);
    loading.value = false;
  });
});

const onBookNow = (technician) => {
  if (!authStore.token) {
    loginDialogVisible.value = true;
  } else {
    router.push({ name: 'Technicians' });
  }
};

const getImageUrl = (imagePath) => `${axios.defaults.baseURL}/storage/${imagePath}`;

const limitedServices = (technician) => {
  return servicesExpanded.value ? technician.services : technician.services.slice(0, serviceLimit.value);
};

const limitedVehicles = (technician) => {
  return vehiclesExpanded.value ? technician.vehicle_types : technician.vehicle_types.slice(0, vehicleLimit.value);
};

const toggleServices = () => {
  servicesExpanded.value = !servicesExpanded.value;
  if (!servicesExpanded.value) serviceLimit.value = 4;
};

const toggleVehicles = () => {
  vehiclesExpanded.value = !vehiclesExpanded.value;
  if (!vehiclesExpanded.value) vehicleLimit.value = 4;
};

const calculateAverageRating = (ratings) => {
  if (!ratings || ratings.length === 0) return 0;
  const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
  return Math.round(totalRating / ratings.length);
};
</script>
