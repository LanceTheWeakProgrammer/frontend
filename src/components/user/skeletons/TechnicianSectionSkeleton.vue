<template>
  <div class="flex flex-wrap justify-center">
    <div v-for="index in 3" :key="index" class="p-5 max-w-md">
      <div class="shadow-md rounded-lg h-full bg-white flex flex-col">
        <!-- Skeleton for image -->
        <div class="h-[350px] overflow-hidden rounded-t-lg">
          <Skeleton shape="rectangle" height="350px" width="350px" />
        </div>

        <div class="p-5 flex-grow">
          <!-- Skeleton for technician name -->
          <Skeleton width="70%" class="mb-5" />

          <div>
            <Skeleton width="70%" class="mb-5" />
            <Skeleton width="50%" class="mb-4" />
            <Skeleton width="80%" class="mb-4" />
            <Skeleton width="60%" class="mb-4" />
          </div>
        </div>

        <!-- Skeleton for buttons -->
        <div class="p-5 mt-auto">
          <div class="flex justify-between items-center gap-2">
            <Skeleton width="40%" height="30px" />
            <Skeleton width="40%" height="30px" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Skeleton from 'primevue/skeleton';
</script>
