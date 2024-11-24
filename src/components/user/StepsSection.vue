<template>
  <!-- Static Section -->
  <div class="pt-40 bg-rose-500">
    <h1 class="my-4 text-center text-5xl h-title">How do I <span class="text-white h-title">Book</span>?</h1>

    <div class="flex flex-col lg:flex-row justify-center items-center lg:-space-x-9 lg:space-y-0">
      <!-- Step 1 -->
      <div class="step-item">
        <div class="step-card">
          <Card style="width: 20rem; overflow: hidden">
            <template #header>
              <div class="flex flex-col items-center text-center p-10">
                <img alt="Step 1" src="../../test_images/1.svg" width="100"/>
              </div>
            </template>
            <template #title><div class="font-semibold h-title">Choose a Technician</div></template>
            <template #content>
              <p class="m-0">
                Select a technician based on their expertise in your required service n to ensure your vehicle gets the best care.
              </p>
            </template>
          </Card>
        </div>
      </div>

      <div class="lg:pl-8 lg:pt-0 pt-10 lg:right-10 relative">
        <div class="relative lg:right-1 arrow-large hidden lg:block bg-black border"></div> 
        <div class="relative bottom-10 arrow-medium lg:hidden block bg-black border"></div> 
      </div>

      <!-- Step 2 -->
      <div class="step-item">
        <div class="step-card">
          <Card style="width: 20rem; overflow: hidden">
            <template #header>
              <div class="flex flex-col items-center text-center p-10">
                <img alt="Step 2" src="../../test_images/2.svg" width="100"/>
              </div>
            </template>
            <template #title><div class="font-semibold h-title">Select Vehicle & Service</div></template>
            <template #content>
              <p class="m-0">
                Choose your vehicle make and model, and pick the service(s) needed to keep it running smoothly.
              </p>
            </template>
          </Card>
        </div>
      </div>

      <div class="lg:pl-8 lg:pt-0 pt-10 lg:right-10 relative">
        <div class="relative lg:right-1 arrow-large hidden lg:block bg-black border"></div> 
        <div class="relative bottom-10 arrow-medium lg:hidden block bg-black border"></div> 
      </div>

      <!-- Step 3 -->
      <div class="step-item">
        <div class="step-card">
          <Card style="width: 20rem; overflow: hidden">
            <template #header>
              <div class="flex flex-col items-center text-center p-10">
                <img alt="Step 3" src="../../test_images/3.svg" width="100"/>
              </div>
            </template>
            <template #title><div class="font-semibold h-title">Confirm Payment</div></template>
            <template #content>
              <p class="m-0">
                After completing your booking, confirm your payment to proceed. You'll receive a confirmation shortly after.
              </p>
            </template>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Card from 'primevue/card';
</script>

<style scoped>
.arrow-large {
  --t: 45%; 
  --h: 40%;
  aspect-ratio: 4/3;
  width: 110px;
  clip-path: polygon(0 calc(50% - var(--t)/2),calc(100% - var(--h)) calc(50% - var(--t)/2),calc(100% - var(--h)) 0,100% 50%,calc(100% - var(--h)) 100%,calc(100% - var(--h)) calc(50% + var(--t)/2),0 calc(50% + var(--t)/2));
}

.arrow-medium {
  --t: 45%; 
  --h: 40%;
  aspect-ratio: 4/4;
  height: 90px;
  clip-path: polygon(calc(50% - var(--t)/2) 0,calc(50% - var(--t)/2) calc(100% - var(--h)),0 calc(100% - var(--h)),50% 100%,100% calc(100% - var(--h)),calc(50% + var(--t)/2) calc(100% - var(--h)),calc(50% + var(--t)/2) 0);
}
</style>
