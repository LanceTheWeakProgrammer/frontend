<template>
    <div class="w-full flex flex-col lg:flex-row gap-3">
      <div class="w-full lg:w-1/4 flex flex-col gap-4">
        <div class="card shadow w-full border p-4">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">Availability</h2>
            <Skeleton width="50px" height="24px" class="rounded-full" />
          </div>
        </div>

        <div class="card shadow w-full border p-4 h-auto lg:h-[435px]">
          <h2 class="text-xl font-semibold mb-4">Assignments</h2>
          <div class="overflow-y-auto h-[calc(100%-3rem)] hide">
            <div v-for="i in 3" :key="i" class="mb-4">
              <Skeleton width="80%" height="20px" class="mb-2" />
              <Skeleton width="60%" height="20px" class="mb-2" />
              <div class="flex flex-col gap-2 ml-4">
                <Skeleton width="70%" height="16px" class="mb-1" />
                <Skeleton width="50%" height="16px" />
              </div>
            </div>
          </div>
        </div>

        <div class="card shadow w-full border p-4 overflow-y-auto h-auto lg:h-[350px]">
          <h2 class="text-xl font-semibold mb-4">Tasks This Week</h2>
          <div v-for="i in 2" :key="i" class="mb-2">
            <Skeleton width="80%" height="20px" class="mb-1" />
            <Skeleton width="60%" height="16px" />
          </div>
        </div>
      </div>

      <div class="card shadow w-full lg:w-3/4 border p-4">
        <h2 class="text-xl font-semibold mb-4">Calendar</h2>
        <Skeleton width="100%" height="95%" />
      </div>
    </div>
  </template>
  
  <script setup>
  import Skeleton from 'primevue/skeleton';
  </script>
  
  <style scoped>
  .hide::-webkit-scrollbar {
    display: none; 
  }
  </style>
  