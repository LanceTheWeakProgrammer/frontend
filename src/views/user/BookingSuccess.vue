<template>
  <div class="h-[90vh] flex justify-center items-center" v-if="loading">
    <div class="loader"></div>
  </div>
  <div v-else>
    <div class="container mx-auto p-4">
      <h1 class="font-semibold text-3xl text-center">Booking Successful!</h1>
      <p class="text-center my-4 text-gray-600">
        Please wait for technician approval before proceeding to make the payment.
      </p>
      <div v-if="bookingDetails" ref="bookingReceipt" class="bg-white shadow-md rounded-lg p-6 max-w-lg mx-auto booking-receipt">
        <div class="flex flex-col items-center gap-2">
          <!-- Include your logo here -->
          <img src="/logo.svg" alt="Logo" width="100">
          <h2 class="font-bold text-2xl mb-4">Booking Summary</h2>
        </div>
        <ul class="space-y-3">
          <li class="flex justify-between">
            <span class="font-medium text-gray-700">Technician Name:</span>
            <span>{{ bookingDetails.technician?.full_name ?? 'N/A' }}</span>
          </li>
          <li class="flex justify-between">
            <span class="font-medium text-gray-700">Make & Model:</span>
            <span>{{ makeAndModel }}</span>
          </li>
          <li class="flex justify-between">
            <span class="font-medium text-gray-700">Booking Date:</span>
            <span>{{ formattedBookingDate }}</span>
          </li>
        </ul>
        <div class="my-6 border-t border-gray-300"></div>
        <ul class="space-y-3">
          <span class="font-medium text-gray-700">Services:</span>
          <li v-for="(service, index) in bookingDetails.services" :key="index" class="flex justify-between">
            <span>{{ service.name }}</span>
            <span>₱{{ service.fee.toFixed(2) }}</span>
          </li>
        </ul>
        <div class="my-6 border-t border-gray-300"></div>
        <div class="flex flex-col gap-4">
          <div class="flex justify-between">
            <span class="font-medium text-gray-700">Base Cost:</span>
            <span>₱{{ basedCost.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium text-gray-700">VAT Amount (12%):</span>
            <span>₱{{ vat.toFixed(2) }}</span>
          </div>
        </div>
        <div class="my-6 border-t border-gray-300"></div>
        <div class="flex justify-between font-bold text-lg">
          <span>Total Cost (incl. VAT):</span>
          <span>₱{{ totalCostWithTax.toFixed(2) }}</span>
        </div>
      </div>
      <div class="flex gap-2 justify-center text-center mt-8">
        <Button @click="downloadReceipt" severity="contrast" icon="pi pi-file-pdf" outlined label="Download" />
        <router-link to="/bookings">
          <Button severity="info" icon="pi pi-arrow-up-right" label="Go to Bookings" />
        </router-link>
      </div>
    </div>
  </div>
</template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import { useBookingStore } from '../../stores/booking.store';
  import dayjs from '../../services/dayjs';
  import html2PDF from 'jspdf-html2canvas';
  import Button from 'primevue/button';
  
  const route = useRoute();
  const bookingStore = useBookingStore();
  const loading = ref(true);
  
  const bookingId = route.params.bookingId;
  const bookingDetails = ref(null);
  const bookingReceipt = ref(null);
  
  const formattedBookingDate = computed(() => {
    if (bookingDetails.value) {
      return dayjs(bookingDetails.value.booking_date).format('MMMM D, YYYY');
    }
    return 'N/A';
  });
  
  const makeAndModel = computed(() => {
    if (bookingDetails.value && bookingDetails.value.vehicle_detail) {
      const { make, model } = bookingDetails.value.vehicle_detail;
      return make && model ? `${make} ${model}` : 'N/A';
    }
    return 'N/A';
  });
  
  const basedCost = computed(() => {
    if (bookingDetails.value) {
      const totalServiceFee = bookingDetails.value.services.reduce((acc, service) => acc + (service.fee || 0), 0);
      return totalServiceFee * 0.88; 
    }
    return 0;
  });
  
  const vat = computed(() => {
    if (bookingDetails.value) {
      const totalServiceFee = bookingDetails.value.services.reduce((acc, service) => acc + (service.fee || 0), 0);
      return totalServiceFee * 0.12;
    }
    return 0;
  });
  
  const totalCostWithTax = computed(() => {
    return basedCost.value + vat.value;
  });
  
  const downloadReceipt = () => {
    html2PDF(bookingReceipt.value, {
      jsPDF: {
        format: 'a4',
      },
      imageType: 'image/jpeg',
      html2canvas: {
        scale: 2.0, 
      },
      output: 'Booking_Receipt.pdf',
    });
  };
  
  onMounted(async () => {
    try {
    const response = await bookingStore.fetchBookingById(bookingId);
      if (response.success) {
        bookingDetails.value = bookingStore.bookingDetails;
      }
    } catch (error) {
      console.error('Error fetching booking details:', error);
    } finally {
      loading.value = false; 
    }
  });
  </script>

<style scoped>

</style>

  