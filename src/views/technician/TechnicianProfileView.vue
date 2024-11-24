<template>
    <div class="w-full p-2">
      <div class="grid grid-cols-1 md:grid-cols-3">
        <div class="col-span-1 bg-white p-8 rounded-lg shadow lg:mr-4 lg:mb-0 mb-4">
          <div class="flex justify-between items-center mb-6">
            <div class="flex">
              <i class="pi pi-star-fill text-yellow-400 mr-1" v-for="star in 5" :key="star"></i>
            </div>
            <Button label="View Reviews" icon="pi pi-comments" size="small" severity="success"/>
          </div>

          <div class="flex justify-center my-12">
            <img
              src="https://via.placeholder.com/150"
              alt="Technician"
              class="rounded-lg shadow-md w-60 h-60"
            />
          </div>

          <div class="grid grid-cols-3 gap-4 w-full mb-6">
            <div class="col-span-2">
                <div class="font-bold text-lg">Name</div>
                <div>{{ technician.name }}</div>
            </div>

            <div class="col-span-1">
                <div class="font-bold text-lg">Age</div>
                <div>{{ technician.age }}</div>
            </div>
          </div>
          <div class="mt-6">
            <h3 class="font-bold text-lg">Bio</h3>
            <p class="text-gray-600 text-sm">{{ technician.bio }}</p>
          </div>
        </div>

        <div class="col-span-2 grid grid-cols-1 gap-4">
          <div class="bg-white p-8 rounded-lg shadow">
            <h3 class="font-bold text-xl">Contact Details</h3>
            <Divider />
            <div class="flex flex-col space-y-6">
              <div class="flex flex-col mb-4">
                <span class="font-semibold text-lg">Email</span>
                <span>{{ technician.email }}</span>
              </div>
              <div class="flex flex-col">
                <span class="font-semibold text-lg">Phone Number</span>
                <span>{{ technician.phone }}</span>
              </div>
            </div>
          </div>

          <div class="bg-white p-8 rounded-lg shadow">
            <h3 class="font-bold text-xl">Expertise</h3>
            <Divider />
            <div class="mb-6">
              <h4 class="font-semibold mb-4 text-lg">Vehicle Mastery</h4>
              <div class="flex flex-wrap gap-4 mt-2">
                <Tag v-for="vehicle in technician.vehicleMastery" :key="vehicle" severity="secondary">
                {{ vehicle }}
                </Tag>
              </div>
            </div>
            <div>
              <h4 class="font-semibold mb-4 text-lg">Services Offered</h4>
              <div class="flex flex-wrap gap-4 mt-2">
                <Tag v-for="service in technician.servicesOffered" :key="service" severity="secondary">
                {{ service }}
                </Tag>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import Button from 'primevue/button';
  import Tag from 'primevue/tag';
  import Divider from 'primevue/divider';
  
  const technician = ref({
    name: 'John Doe',
    age: 31,
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cumque labore voluptatibus nostrum natus esse quisquam perspiciatis temporibus animi. Unde, voluptatum.',
    email: 'johndoe@example.com',
    phone: '+9287398065',
    vehicleMastery: ['Sedan', 'SUV', 'Van'],
    servicesOffered: ['Car Repair', 'Car Maintenance', 'Car Paint'],
  });
  </script>
  
  <style scoped>
  /* Custom styles (if any) */
  </style>
  