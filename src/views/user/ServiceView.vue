<script setup>
import { onMounted } from 'vue';
import { useGlobalStore } from '../../stores/global.store'; 
import axios from '../../services/axios';
const getImageUrl = (imagePath) => `${axios.defaults.baseURL}/storage/${imagePath}`;

const globalStore = useGlobalStore();

onMounted(() => {
  globalStore.fetchServices();
});
</script>

<template>
  <div class="p-5">
    <div class="h-title text-5xl text-center">OUR SERVICES</div>
    <div class="h-line bg-black"></div>
    <p class="text-center mt-10">
      We offer a wide range of services to keep your vehicle running smoothly and safely. From routine maintenance and diagnostics to complex repairs,<br>
      our expert technicians are equipped to handle it all. Whether you need a quick tune-up or a comprehensive service, we've got your car covered!
    </p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 px-6 lg:grid-cols-2 gap-6 justify-items-center pt-20 pb-5">
    <div 
      v-for="(service, index) in globalStore.services" 
      :key="index" 
      class="p-10 rounded-t-md bg-white shadow border-t-4 border-rose-500 transition hover:border-rose-700 w-full"
    >
      <div class="flex items-center space-x-4">
        <img :src="getImageUrl(service.icon)" class="w-10 h-10" :alt="service.name" />
        <p class="text-xl font-bold">{{ service.name }}</p>
      </div>
      <p class="mt-4 text-gray-600">{{ service.description }}</p>
    </div>
  </div>
</template>

