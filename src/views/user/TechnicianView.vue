<template>
  <div class="p-5">
    <div class="text-5xl font-bold text-center h-title">TECHNICIANS</div>
    <div class="h-1 bg-opacity-90 bg-black mx-auto mt-2 w-24"></div>
  </div>

  <div class="flex justify-center pt-10">
    <div class="w-11/12">
      <div class="flex flex-wrap justify-between">
        <!-- Filters Section -->
        <div class="lg:w-1/4 w-full mb-4 px-10">
          <div class="bg-white shadow-md rounded-lg p-4 mb-4 border border-gray-200">
            <p class="text-2xl font-semibold">FILTERS</p>

            <div class="bg-gray-100 mt-4 p-4 rounded-lg">
              <p class="text-xl font-semibold">Vehicle Type Mastery</p>
              <div class="mt-3">
                <div v-for="vehicleItem in vehicleTypes" :key="vehicleItem.key" class="flex items-center mb-2">
                  <Checkbox v-model="selectedVehicles" :inputId="vehicleItem.key" :value="vehicleItem.name" />
                  <label :for="vehicleItem.key" class="ml-2">{{ vehicleItem.name }}</label>
                </div>
              </div>
            </div>

            <div class="bg-gray-100 mt-4 p-4 rounded-lg">
              <p class="text-xl font-semibold">Service Availability</p>
              <div class="mt-3">
                <div v-for="serviceItem in servicesOffered" :key="serviceItem.key" class="flex items-center mb-2">
                  <Checkbox v-model="selectedServices" :inputId="serviceItem.key" :value="serviceItem.name" />
                  <label :for="serviceItem.key" class="ml-2">{{ serviceItem.name }}</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Technicians List Section -->
        <div class="lg:w-3/4 w-full px-10">
          <div v-for="technician in paginatedTechnicians" :key="technician.id" class="bg-white shadow-md rounded-lg mb-4 p-4 border border-gray-200">
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
              <div class="lg:col-span-1 col-span-2 flex justify-center lg:justify-start">
                <img :src="getImageUrl(technician.profile_image)" class="w-full lg:w-72 lg:h-72 h-auto object-cover rounded-lg" alt="Technician Image" />
              </div>

              <div class="col-span-2 lg:px-4">
                <h3 class="text-2xl mb-2">{{ technician.full_name }}</h3>
                <div class="mb-4">
                  <h5 class="text-lg font-semibold mb-2">Vehicle Type Mastery</h5>
                  <Badge 
                    v-for="vehicle in technician.vehicle_types" 
                    :key="vehicle.id" 
                    :value="vehicle.type" 
                    severity="secondary"
                    class="mr-1 mb-1"
                  />
                </div>
                <div class="mb-4">
                  <h5 class="text-lg font-semibold mb-2">Services</h5>
                  <Badge 
                    v-for="service in technician.services" 
                    :key="service.id" 
                    :value="service.name" 
                    severity="secondary"
                    class="mr-1 mb-1"
                  />
                </div>
              </div>

              <div class="flex flex-col justify-center lg:items-end items-center lg:col-span-1 col-span-2">
                <Button label="Book Now" size="small" class="mb-2 w-full" @click="onBookNow(technician)" />
                <router-link :to="`/technician/details/${technician.id}`" class="w-full">
                  <Button label="More Details" size="small" class="w-full" outlined />
                </router-link>
              </div>
            </div>
          </div>

          <div class="flex flex-col shadow-md mt-5">
            <Paginator 
              v-model:first="first" 
              :rows="rowsPerPage" 
              :totalRecords="filteredTechnicians.length" 
            />
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Login Dialog -->
  <UserLoginDialog :visible="loginDialogVisible" @close="loginDialogVisible = false" />
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useGlobalStore } from '../../stores/global.store';
import { useAuthStore } from '../../stores/auth.store';
import Checkbox from 'primevue/checkbox';
import Badge from 'primevue/badge';
import Button from 'primevue/button';
import Paginator from 'primevue/paginator';
import UserLoginDialog from '../../components/user/UserLoginDialog.vue';
import axios from '../../services/axios';

const router = useRouter();
const globalStore = useGlobalStore();
const authStore = useAuthStore();
const selectedVehicles = ref([]);
const selectedServices = ref([]);
const first = ref(0);
const rowsPerPage = ref(3); 
const technicians = computed(() => globalStore.technicians);
const loginDialogVisible = ref(false);

onMounted(() => {
  globalStore.fetchTechnicians();
});

const vehicleTypes = computed(() => {
  const vehiclesSet = new Set();
  technicians.value.forEach(technician => {
    technician.vehicle_types.forEach(vehicle => vehiclesSet.add(vehicle.type));
  });
  return Array.from(vehiclesSet).map(type => ({ name: type, key: type }));
});

const servicesOffered = computed(() => {
  const servicesSet = new Set();
  technicians.value.forEach(technician => {
    technician.services.forEach(service => servicesSet.add(service.name));
  });
  return Array.from(servicesSet).map(service => ({ name: service, key: service }));
});

const filteredTechnicians = computed(() => {
  return technicians.value.filter(technician => {
    const matchesVehicle = selectedVehicles.value.length
      ? technician.vehicle_types.some(vehicle => selectedVehicles.value.includes(vehicle.type))
      : true;
    const matchesService = selectedServices.value.length
      ? technician.services.some(service => selectedServices.value.includes(service.name))
      : true;
    return matchesVehicle && matchesService;
  });
});

const paginatedTechnicians = computed(() => {
  const start = first.value * rowsPerPage.value;
  const end = start + rowsPerPage.value;
  return filteredTechnicians.value.slice(start, end);
});

const getImageUrl = (imagePath) => `${axios.defaults.baseURL}/storage/${imagePath}`;

const onBookNow = (technician) => {
  if (!authStore.token) {
    loginDialogVisible.value = true;
  } else {
    router.push({ name: 'BookingForm', params: { id: technician.id } });
  }
};
</script>


<style scoped>

</style>
