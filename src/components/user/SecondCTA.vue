<template>
  <div class="mx-auto">
    <div class="relative bg-cover bg-center bg-no-repeat py-24 cta-background">
      <!-- Dark overlay for background image -->
      <div class="absolute inset-0 bg-black opacity-50"></div>

      <div class="relative flex flex-col lg:flex-row items-center justify-center lg:justify-between">
        <div class="hidden lg:block lg:w-1/2"></div>
        <div class="flex justify-center lg:w-1/2">
          <div class="text-center lg:text-left">
            <h2 class="text-8xl font-bold mb-5 text-rose-500">Ready to take the next step?</h2>
            <p class="text-2xl text-white mb-6">
              We provide top-notch services with our skilled technicians who ensure your car runs like new! Book your appointment now and experience exceptional service quality!
            </p>
            <p class="text-2xl text-white">
              Don't wait any longer—schedule your service today!
            </p>
            <div class="text-center mt-10">
              <router-link :to="{ name: 'Technicians' }">
                <Button label="Choose a Technician" class="font-semibold mt-4" size="large" severity="secondary" rounded />
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import Button from 'primevue/button';
import { useGlobalStore } from '../../stores/global.store';

const globalStore = useGlobalStore();

onMounted(() => {
  globalStore.fetchVehicleTypes();  
});
</script>

<style scoped>
.cta-background {
  background-image: url('/second-cta.jpg');
  position: relative;
}

.cta-background::before {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.2); /* Adjust opacity for desired darkness */
}
</style>
