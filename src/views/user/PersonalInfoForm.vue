<!-- Deprecated -->
<!-- <template>
  <div class="container mx-auto p-20">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <div class="card shadow-md">
          <h1 class="text-4xl font-bold mb-5 text-center">Fill in Your Information</h1>

          <form @submit.prevent="submitForm">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-3.5">
                <div>
                  <label for="vehicle-make-model">Vehicle Make & Model</label>
                  <Select
                    v-model="selectedVehicle"
                    :options="vehicleMakeModelOptions"
                    optionLabel="label"
                    placeholder="Select Vehicle Make & Model"
                    class="form-input w-full"
                  />
                </div>

                <div>
                  <label for="services">Select Service</label>
                  <Select
                    v-model="selectedService"
                    :options="serviceOptions"
                    optionLabel="name"
                    placeholder="Select Service"
                    class="form-input w-full"
                  />
                </div>

                <div>
                  <label for="additional-info">Additional Information</label>
                  <Textarea v-model="additionalInfo" id="additional-info" placeholder="Any additional information" class="form-textarea w-full" />
                </div>
              </div>

              <div class="space-y-6">
                <div>
                  <label for="name">Name</label>
                  <InputText v-model="guest.name" id="name" placeholder="Your full name" class="form-input w-full" />
                </div>

                <div>
                  <label for="email">Email</label>
                  <InputText v-model="guest.email" id="email" type="email" placeholder="Your email" class="form-input w-full" />
                </div>

                <div>
                  <label for="phone">Phone</label>
                  <InputText v-model="guest.phone" id="phone" type="tel" placeholder="Your phone number" class="form-input w-full" />
                </div>
                <div class="flex justify-end space-x-4">
                  <Button label="Go Back" icon="pi pi-arrow-left" class="p-button-secondary" @click="goBack" />
                  <Button 
                    label="Confirm Booking" 
                    icon="pi pi-check" 
                    class="p-button-primary" 
                    type="submit"
                    :disabled="!selectedVehicle || !selectedService"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        <div class="card shadow-md p-4 flex items-center">
          <i class="pi pi-calendar text-2xl mr-4"></i>
          <p class="text-lg">
            Your service starts at 
            <strong>{{ dayjs(bookingDate).format('dddd, D MMMM YYYY') }}</strong>
          </p>
        </div>
      </div>

      <div class="card shadow-md p-6">
        <h2 class="text-2xl font-bold mb-4">Booking Summary</h2>
        <ul class="space-y-2 mb-2">
          <li class="flex justify-between">
            <span>Vehicle Type: </span>
            <span>{{ globalStore.selectedVehicleTypeName }}</span>
          </li>
          <li class="flex justify-between">
            <span>Booking Date: </span>
            <span>{{ formattedBookingDate }}</span>
          </li>
       </ul>
       <Divider />
        <ul class="space-y-2">
          <li v-if="selectedService" class="flex justify-between">
            <span>{{ selectedService.name }}</span>
            <span>₱{{ selectedService.fee.toLocaleString() }}</span>
          </li>
        </ul>
        <hr class="my-4">
        <div class="flex justify-between font-bold text-lg">
          <span>Total Cost (incl. VAT):</span>
          <span>₱{{ totalCostWithTax.toLocaleString() }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGlobalStore } from '../../store/global.store';
import { useBookingStore } from '../../store/booking.store'; 
import Select from 'primevue/select';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Divider from 'primevue/divider';
import Button from 'primevue/button';
import dayjs from '../../services/dayjs';

const route = useRoute();
const router = useRouter();

const globalStore = useGlobalStore();
const bookingStore = useBookingStore(); 

const selectedVehicleType = ref(route.query.vehicleType ? route.query.vehicleType[0] : null);
const bookingDate = route.query.bookingDate || null;
const formattedBookingDate = bookingDate ? dayjs(bookingDate).format('YYYY-MM-DD') : '';

const selectedVehicle = ref(null);
const vehicleMakeModelOptions = ref([]);
const serviceOptions = ref([]);
const selectedService = ref(null);

const guest = ref({
  name: '',
  email: '',
  phone: ''
});
const additionalInfo = ref('');

const fetchVehicleMakeModelOptions = async () => {
  await globalStore.fetchVehicles(selectedVehicleType.value);
  vehicleMakeModelOptions.value = globalStore.vehicles;
};

const fetchServices = async () => {
  await globalStore.fetchServices();
  serviceOptions.value = globalStore.services;
};

const totalCost = computed(() => {
  return selectedService.value ? selectedService.value.fee : 0;
});

const totalCostWithTax = computed(() => {
  const vat = 0.12;
  return totalCost.value + totalCost.value * vat;
});

onMounted(() => {
  if (!selectedVehicleType.value || !bookingDate) {
    router.push({ name: 'Home' });
  } else {
    fetchVehicleMakeModelOptions();
    fetchServices();
  }
});

const submitForm = async () => {
  if (!selectedVehicle.value || !selectedService.value) {
    console.error('Please select a vehicle and a service before submitting the form.');
    return;
  }

  try {
    const bookingPayload = {
      vehicle_id: selectedVehicle.value.value,
      service_ids: [selectedService.value.id],
      guest: guest.value,
      booking_date: formattedBookingDate,
      total_fee: totalCostWithTax.value,
      additional_info: additionalInfo.value,
    };

    const response = await bookingStore.createGuestBooking(bookingPayload);
    if (response.success) {
      console.log('Booking created successfully:', response.message);
    } else {
      console.error('Booking creation failed:', response.message);
    }
  } catch (error) {
    console.error('An error occurred during booking:', error);
  }
};

const goBack = () => {
  router.back();
};
</script>

<style scoped>
</style> -->
