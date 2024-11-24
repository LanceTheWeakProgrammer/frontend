<template>
  <div class="mx-auto p-20">
    <!-- Title -->
    <h1 class="my-4 text-center text-5xl h-title">
      <span class="text-rose-500">Reach </span>Us
    </h1>

    <div v-for="contact in contacts" :key="contact.contactID">
      <div class="flex flex-col lg:flex-row gap-8">
        <div class="flex-1 shadow card">
          <iframe
            class="w-full h-[330px] rounded-md"
            :src="contact.iframe"
            loading="lazy"
          ></iframe>
        </div>

        <div class="flex-1 lg:max-w-md flex flex-col gap-5">
          <div class="shadow card">
            <h2 class="text-xl font-bold mt-4 mb-2">Call Us</h2>
            <div class="flex flex-col gap-2 mt-6">
              <div class="flex items-center">
                <i class="pi pi-phone px-2"></i>
                <a :href="contact.tel1" class="text-gray-700">{{ contact.tel1 }}</a>
              </div>
              <div class="flex items-center">
                <i class="pi pi-phone px-2"></i>
                <a :href="contact.tel2" class="text-gray-700">{{ contact.tel2 }}</a>
              </div>
            </div>
          </div>

          <div class="shadow card">
            <h3 class="text-xl font-bold mt-4 mb-2">Follow Us</h3>
            <div class="flex flex-col gap-2 mt-6">
              <div class="flex items-center">
                <i class="pi pi-twitter mr-2"></i>
                <a :href="url(contact.twt)" class="text-gray-700">Twitter</a>
              </div>
              <div class="flex items-center">
                <i class="pi pi-facebook mr-2"></i>
                <a :href="url(contact.fb)" class="text-gray-700">Facebook</a>
              </div>
              <div class="flex items-center">
                <i class="pi pi-instagram mr-2"></i>
                <a :href="url(contact.ig)" class="text-gray-700">Instagram</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useGlobalStore } from '../../stores/global.store';

const globalStore = useGlobalStore();
const contacts = ref([]);

onMounted(() => {
  globalStore.fetchContactInfo().then(() => {
    contacts.value = globalStore.contactInfo;
  });
});

const url = (url) => {
  if (!url) return '#';
  return url.startsWith('http') ? url : `https://${url}`;
};
</script>

<style scoped>

</style>
