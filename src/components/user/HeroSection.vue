<template>
  <div class="justify-center mx-auto">
    <div class="flex flex-row">
      <div class="w-full z-10 relative">
        <div>
          <swiper
            :modules="modules"
            :space-between="30"
            :centered-slides="true"
            :scrollbar="{ draggable: true }"
            :autoplay="{ delay: 2500, disableOnInteraction: false }"
            :effect="'fade'"
            class="bg-cover bg-center bg-no-repeat bg-primary h-[700px] p-2"
          >
            <swiper-slide v-for="(slide, index) in carouselSlides" :key="index">
              <div class="relative w-full h-full">
                <img 
                  :src="getImageUrl(slide.carousel_image)" 
                  :alt="'Slide ' + (index + 1)" 
                  class="w-full h-full object-cover"
                />
                <div class="absolute inset-0 bg-black opacity-50"></div>
                <div class="absolute inset-0 flex items-center flex-col gap-4 justify-center z-20">
                  <h1 class="lg:text-8xl text-7xl xs:text-5xl font-bold text-center text-white">
                    Keep Your Car Running Like New <br />
                    <strong class="text-gray-300 lg:text-5xl sm:text-3xl xs:text-2xl font-semibold">
                      Schedule Expert Service with Our
                      <span class="text-rose-500">Top Technicians</span> Today!
                    </strong>
                  </h1>
                  <div class="text-center">
                      <router-link :to="{ name: 'Technicians' }">
                        <button class="group px-8 py-4 text-xl bg-rose-500 text-white rounded-full hover:bg-rose-600 focus:outline-none focus:ring-4 focus:ring-rose-300 flex items-center">
                            Choose a Technician 
                            <i class="pi pi-arrow-right ml-2 transform transition-transform delay-150 duration-300 ease-in-out group-hover:translate-x-1.5"></i>
                        </button>
                      </router-link>
                    </div>
                </div>
              </div>
            </swiper-slide>
          </swiper> 

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, Pagination, Navigation, EffectFade, EffectCoverflow } from 'swiper/modules';
import Button from 'primevue/button';
import { useGlobalStore } from '../../stores/global.store';
import axios from '../../services/axios';

const globalStore = useGlobalStore();

const carouselSlides = computed(() => globalStore.carousels);

onMounted(() => {
  globalStore.fetchCarousels();
  globalStore.fetchVehicleTypes();  
});

const getImageUrl = (imagePath) => `${axios.defaults.baseURL}/storage/${imagePath}`;

const modules = [Autoplay, Pagination, Navigation, EffectFade, EffectCoverflow];
</script>

<style scoped>
</style>
