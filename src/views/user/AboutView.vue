<script setup>
import { ref, onMounted } from 'vue';
import { useGlobalStore } from '../../stores/global.store';
import axios from '../../services/axios';

const globalStore = useGlobalStore();
const teamInfo = ref([]);

onMounted(async () => {
  await globalStore.fetchTeamInfo();
  teamInfo.value = globalStore.teamInfo;
});

const getImageUrl = (imagePath) => `${axios.defaults.baseURL}/storage/${imagePath}`;
</script>

<template>
    <div class="p-5">
      <div class="h-title text-5xl text-center">ABOUT US</div>
      <div class="h-line bg-black"></div>
      <p class="text-center mt-10">
        We are dedicated to providing seamless and reliable automobile services. 
        From quick repairs to comprehensive servicing, we’ve got your car covered!<br>
        With expert technicians and a customer-first approach, getting your vehicle in top shape has never been easier.
        Book with us today and drive with confidence tomorrow!
      </p>
    </div>
  
    <div class="flex justify-center pt-24">
      <div class="w-11/12">
        <div class="grid lg:grid-cols-2 md:grid-cols-1 gap-4 items-center">
          <div class="lg:order-1 order-2 lg:mb-4 lg:pb-0 pb-20">
            <p class="font-semibold text-5xl mb-2 h-title">Our Commitment to Quality</p>
            <p class="text-lg text-gray-400">
              We take pride in delivering top-tier automobile services that ensure your vehicle’s longevity and performance. 
              Our experienced team guarantees swift, reliable, and stress-free service every time.
            </p>
          </div>
          <div class="lg:order-2 order-1 mb-4">
            <img src="/src/test_images/about.png" class="w-full">
          </div>
        </div>
      </div>
    </div>
  
    <div class="flex justify-center mt-40">
      <div class="w-11/12">
        <div class="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-4 gap-12">
          <div class="bg-white border-rose-500 transition hover:border-rose-700 rounded shadow-md step-item border-t-4 p-8 text-center">
            <img src="/src/test_images/about.jpg" width="70px" class="mx-auto">
            <p class="mt-3 text-2xl font-semibold">100+ CERTIFIED TECHNICIANS</p>
          </div>
          <div class="bg-white border-rose-500 transition hover:border-rose-700 rounded shadow-md step-item border-t-4 p-8 text-center">
            <img src="/src/test_images/about.jpg" width="70px" class="mx-auto">
            <p class="mt-3 text-2xl font-semibold">EXCELLENT USER FEEDBACK</p>
          </div>
          <div class="bg-white border-rose-500 transition hover:border-rose-700 rounded shadow-md step-item border-t-4 p-8 text-center">
            <img src="/src/test_images/about.jpg" width="70px" class="mx-auto">
            <p class="mt-3 text-2xl font-semibold">THOUSANDS OF VEHICLES SERVICED</p>
          </div>
          <div class="bg-white border-rose-500 transition hover:border-rose-700 rounded shadow-md step-item border-t-4 p-8 text-center">
            <img src="/src/test_images/about.jpg" width="70px" class="mx-auto">
            <p class="mt-3 text-2xl font-semibold">4.9/5 CUSTOMER SATISFACTION</p>
          </div>
        </div>
      </div>
    </div>
  
    <div class="flex flex-col justify-center mt-40">
       <div class="flex flex-col">
            <div class="h-title text-5xl text-center">MEET OUR TEAM</div>
            <div class="h-line bg-black"></div>
        </div>
        <div class="flex  flex-wrap mt-12 justify-center gap-10 mb-6 px-10">
            <div 
            v-for="(member, index) in teamInfo" 
            :key="index" 
            class="bg-white border-rose-500 transition hover:border-rose-700 rounded shadow-md step-item border-t-4 p-8 text-center lg:w-1/4 md:w-1/3 w-full"
            >
            <img 
                :src="getImageUrl(member.memberImg)" 
                :alt="member.memberName" 
                class="w-40 h-40 object-cover rounded-full mx-auto"
            />
            <p class="mt-3 text-2xl font-semibold">{{ member.memberName }}</p>
            <p class="text-gray-500">{{ member.memberRole }}</p>
            </div>
        </div>
    </div>
  </template>
