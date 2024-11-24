<script setup>
    import InputText from 'primevue/inputtext';
    import FloatLabel from 'primevue/floatlabel';
    import Textarea from 'primevue/textarea';
    import Button from 'primevue/button';

    import { ref, onMounted } from 'vue';
    import { useGlobalStore } from '../../stores/global.store';

    const globalStore = useGlobalStore();
    const contactInfo = ref(null);

    onMounted(async () => {
    await globalStore.fetchContactInfo();
    contactInfo.value = globalStore.contactInfo[0]; 
    });
</script>

<template>
    <div class="p-5">
      <div class="h-title text-5xl text-center h-title">CONTACT US</div>
      <div class="h-line bg-black"></div>
      <p class="text-center mt-10">
        Have questions about your vehicle service or need assistance with booking? Our team is here to help! <br>
        Reach out to us for any inquiries, and we’ll get back to you as soon as possible.
        Your satisfaction and your car's health are our top priorities.
      </p>
    </div>
    
    <div class="container mx-auto px-10 my-8 pb-5">
      <div class="grid grid-cols-1 lg:grid-cols-2 shadow-md rounded-lg">
        <div class="bg-white p-6">
          <iframe
            v-if="contactInfo?.iframe"
            height="320px"
            class="w-full rounded-lg"
            :src="contactInfo.iframe"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
  
          <!-- Dynamic Address -->
          <p class="font-bold text-xl mt-6">Address</p>
          <a :href="contactInfo?.gmap" class="block no-underline text-gray-900 mb-2">
            <i class="pi pi-map-marker text-lg"></i> {{ contactInfo?.address || 'Default Address' }}
          </a>
  
          <!-- Dynamic Phone Numbers -->
          <p class="font-bold text-xl mt-6">Call Us</p>
          <a :href="`tel:${contactInfo?.tel1}`" class="block no-underline text-gray-900 mb-2" v-if="contactInfo?.tel1">
            <i class="pi pi-phone text-xl"></i> {{ contactInfo.tel1 }}
          </a>
          <a :href="`tel:${contactInfo?.tel2}`" class="block no-underline text-gray-900 mb-2" v-if="contactInfo?.tel2">
            <i class="pi pi-phone text-xl"></i> {{ contactInfo.tel2 }}
          </a>
  
          <!-- Dynamic Email -->
          <p class="font-bold text-xl mt-6">Email Us</p>
          <a :href="`mailto:${contactInfo?.email}`" class="block no-underline text-gray-900 mb-2" v-if="contactInfo?.email">
            <i class="pi pi-envelope text-xl"></i> {{ contactInfo.email }}
          </a>
  
          <!-- Dynamic Social Links -->
          <p class="font-bold text-xl mt-6">Follow Us</p>
          <a :href="contactInfo?.fb" target="_blank" class="inline-block no-underline text-gray-900 mb-2" v-if="contactInfo?.fb">
            <i class="pi pi-facebook text-xl"></i>
          </a>
          <a :href="contactInfo?.twt" target="_blank" class="inline-block no-underline text-gray-900 mb-2 ml-3" v-if="contactInfo?.twt">
            <i class="pi pi-twitter text-xl"></i>
          </a>
          <a :href="contactInfo?.ig" target="_blank" class="inline-block no-underline text-gray-900 mb-2 ml-3" v-if="contactInfo?.ig">
            <i class="pi pi-instagram text-xl"></i>
          </a>
        </div>
  
        <!-- Right Side -->
        <div class="bg-rose-500 backdrop-blur-sm p-6">
          <form>
            <p class="font-bold text-xl text-white mb-6">Send a message</p>
            <FloatLabel>
              <div class="my-8">
                <InputText id="name" v-model="name" class="w-full px-3 py-2 rounded-md" />
                <label for="name" class="block ">Name</label>
              </div>
            </FloatLabel>
            <FloatLabel>
              <div class="my-8">
                <InputText id="subject" v-model="subject" class="w-full px-3 py-2 rounded-md" />
                <label for="subject" class="block ">Subject</label>
              </div>
            </FloatLabel>
            <FloatLabel>
              <div class="my-8">
                <Textarea v-model="message" id="message" rows="5" class="w-full px-3 py-2 rounded-md" />
                <label for="message" class="block ">Message</label>
              </div>
            </FloatLabel>
            <Button label="Submit" class="w-28 px-3" severity="secondary" />
          </form>
        </div>
      </div>
    </div>
  </template>
  