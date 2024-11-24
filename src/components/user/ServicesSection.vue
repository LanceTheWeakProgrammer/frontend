<template>
  <div class="pt-40">
    <h1 class="my-4 text-center text-5xl h-title">Our <span class="text-rose-500">Services</span></h1>
    <div class="flex flex-row justify-evenly mx-auto gap-4">
        <div class="flex flex-wrap lg:flex-row flex-col justify-evenly">
          <div v-for="(service, index) in services" :key="index" class="p-5 w-80">
            <div class="service-item bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
              <img :src="getImageUrl(service.icon)" :alt="service.name" class="mb-3" width="100" />
              <h5 class="mt-3 text-lg text-center">{{ service.name }}</h5>
            </div>
          </div>
        </div>
      
    </div>
    <div class="text-center my-5">
      <router-link to="services" class="go-btn rounded-lg bg-white text-rose-500 border border-rose-500 hover:bg-rose-500 hover:text-white shadow-sm">
        <span>More Services</span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useGlobalStore } from '../../stores/global.store';
import axios from '../../services/axios';

const globalStore = useGlobalStore();
const services = ref([]);

onMounted(() => {
  globalStore.fetchServices().then(() => {
    services.value = globalStore.services.slice(0, 5);
  });
});

const getImageUrl = (imagePath) => `${axios.defaults.baseURL}/storage/${imagePath}`;
</script>

<style scoped>
/* Add your styles here */
</style>
