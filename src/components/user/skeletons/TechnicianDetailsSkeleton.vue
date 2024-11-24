<template>
    <div class="mx-auto px-10 py-5">
      <div class="mb-5">
        <Skeleton width="30%" height="2rem" />
      </div>

      <div class="flex mb-5">
        <Skeleton width="15%" height="1.5rem" class="mr-2" />
        <Skeleton width="10%" height="1.5rem" />
      </div>
  
      <div class="flex flex-col lg:flex-row gap-20 justify-between card shadow">
        <div class="flex flex-col lg:w-1/3">
          <div class="flex lg:flex-row flex-col items-center lg:justify-between justify-evenly gap-4 mb-5">
            <Skeleton width="40%" height="2rem" />
            <div class="flex lg:flex-row lg:gap-4 gap-32">
              <Skeleton width="6rem" height="2.5rem" />
              <Skeleton width="6rem" height="2.5rem" />
            </div>
          </div>
          <div class="flex justify-center mb-3">
            <Skeleton width="300px" height="280px" borderRadius="12px" />
          </div>
          <Divider />
          <div class="flex flex-col justify-center">
            <Skeleton width="50%" height="1.5rem" class="mb-3" />
            <Skeleton width="80%" height="1.5rem" />
          </div>
        </div>
  
        <!-- Middle Section Skeleton -->
        <div class="lg:w-1/3">
          <div class="flex flex-col gap-16">
            <div>
              <Skeleton width="50%" height="2rem" class="mb-5" />
              <Divider />
              <Skeleton width="80%" height="1.5rem" class="mb-3" />
              <Skeleton width="60%" height="1.5rem" />
            </div>
            <div>
              <Skeleton width="50%" height="2rem" class="mb-5" />
              <Divider />
              <Skeleton width="70%" height="1.5rem" class="mb-3" />
              <Skeleton width="50%" height="1.5rem" />
            </div>
          </div>
        </div>

        <div class="lg:w-1/3">
          <Skeleton width="50%" height="2rem" class="mb-5" />
          <Divider />
          <div class="flex flex-col gap-10">
            <div>
              <Skeleton width="80%" height="1.5rem" class="mb-4" />
              <div class="flex flex-wrap gap-4">
                <Skeleton width="4rem" height="2rem" />
                <Skeleton width="4rem" height="2rem" />
                <Skeleton width="4rem" height="2rem" />
              </div>
            </div>
            <div>
              <Skeleton width="80%" height="1.5rem" class="mb-4" />
              <div class="flex flex-wrap gap-4">
                <Skeleton width="4rem" height="2rem" />
                <Skeleton width="4rem" height="2rem" />
                <Skeleton width="4rem" height="2rem" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col card shadow mt-5">
        <Skeleton width="30%" height="2rem" class="mb-5" />
        <div class="flex flex-col gap-4 overflow-auto custom-scrollbar h-[30rem]">
          <div class="w-full bg-white border rounded-md p-4">
            <div class="flex items-center gap-3 mb-3">
              <Skeleton width="3rem" height="3rem" shape="circle" />
              <Skeleton width="30%" height="1.5rem" />
            </div>
            <Skeleton width="50%" height="1.5rem" class="mb-3" />
            <Skeleton width="80%" height="1.5rem" />
          </div>
          <div class="w-full bg-white border rounded-md p-4">
            <div class="flex items-center gap-3 mb-3">
              <Skeleton width="3rem" height="3rem" shape="circle" />
              <Skeleton width="30%" height="1.5rem" />
            </div>
            <Skeleton width="50%" height="1.5rem" class="mb-3" />
            <Skeleton width="80%" height="1.5rem" />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import Skeleton from 'primevue/skeleton';
  import Divider from 'primevue/divider';
  </script>
  
  <style scoped>
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 4px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: #555;
  }
  </style>
  