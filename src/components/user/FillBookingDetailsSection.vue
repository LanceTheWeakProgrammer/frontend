<template>
  <div v-if="visible" class="mt-4 flex gap-4 flex-col md:flex-row">
    <div class="md:w-3/4 w-full pr-4 card shadow">
      <h2 class="font-semibold text-2xl mb-3">Booking Details</h2>
      <h4 class="font-medium mb-3 text-gray-600">Please fill out the form to complete your booking.</h4>
      <div class="flex lg:flex-row flex-col gap-4 mb-4">
        <div class="mb-4 flex flex-col flex-grow gap-4">
          <label  class="text-lg font-semibold" for="vehicle">Select Vehicle Type</label>
          <Select 
            v-model="selectedVehicleType" 
            :options="vehicleTypes" 
            optionLabel="type"  
            placeholder="Select Vehicle Type" 
            class="w-full"
            @change="fetchVehicleDetails"
          />
        </div>

        <div class="mb-4 flex flex-col flex-grow gap-4">
          <label  class="text-lg font-semibold" for="vehicle-details">Select Vehicle Make & Model</label>
          <Select 
            v-model="selectedVehicleDetail" 
            :options="vehicleDetails" 
            optionLabel="label"  
            placeholder="Select Vehicle Make & Model" 
            class="w-full"
            :disabled="!selectedVehicleType"
          />
        </div>
        <div class="mb-4 flex flex-col flex-grow gap-4">
          <label  class="text-lg font-semibold" for="services">Select Services</label>
          <MultiSelect
            v-model="selectedServices"
            :options="serviceOptions"
            optionLabel="name"
            placeholder="Select Services"
            class="w-full"
            display="chip"
            :maxSelectedLabels="3"
          />
        </div>
      </div>

      <div class="mb-4 flex flex-col flex-grow gap-4">
        <label  class="text-lg font-semibold" for="booking-date">Select Booking Date</label>
        <DatePicker 
          v-model="selectedBookingDate" 
          placeholder="Select Booking Date" 
          class="w-full" 
          showIcon
          inline
        />
      </div>

      <div class="mb-4 flex flex-col flex-grow gap-4">
        <label  class="text-lg font-semibold" for="attachments">Upload Attachments</label>
        <FileUpload 
          ref="fileUpload"
          name="attachments[]"
          :multiple="true"
          accept="image/*"
          :maxFileSize="1000000"
          customUpload
          @select="onFileSelect"
        >
          <template #empty>
            <span>Drag and drop files here to upload.</span>
          </template>
        </FileUpload>
      </div>

      <div class="mb-4 flex flex-col gap-4">
        <label  class="text-lg font-semibold" for="additional-info">Additional Information</label>
        <Textarea v-model="additionalInfo" id="additional-info" placeholder="Any additional information" class="form-textarea w-full" />
      </div>

      <div class="mt-4 justify-end gap-4 hidden lg:flex">
        <Button label="Cancel" @click="cancelBooking" class="p-button-secondary" />
        <Button :label="buttonLabel" :icon="buttonIcon" :disabled="loading" @click="submitBooking" />
      </div>

      <ToastComponent ref="toastComponent" />
    </div>

    <div class="md:w-2/5 w-full flex flex-col">
      <div class="card shadow">
        <div class="flex flex-row items-center gap-4">
          <i class="pi pi-calendar" style="font-size: 2.5rem;"></i>
          <h3 class="text-xl">
            <template v-if="selectedBookingDate">
              Your booking starts at <strong>{{ dayjs(selectedBookingDate).format('MMMM D, YYYY') }}</strong>
            </template>
            <template v-else>
              Select a booking date
            </template>
          </h3>
        </div>
      </div>
      <div class="card shadow">
        <h2 class="text-2xl font-bold mb-4">Booking Summary</h2>
        <ul class="space-y-2 mb-2">
          <li class="flex justify-between">
            <span>Vehicle Type:</span>
            <span>{{ selectedVehicleType ? selectedVehicleType.type : 'Not Selected' }}</span>
          </li>
          <li class="flex justify-between" v-if="selectedVehicleDetail">
            <span>Make & Model:</span>
            <span>{{ selectedVehicleDetail ? selectedVehicleDetail.label : 'Not Selected' }}</span>
          </li>
          <li class="flex justify-between">
            <span>Booking Date:</span>
            <span>{{ selectedBookingDate ? dayjs(selectedBookingDate).format('MMMM D, YYYY') : 'Not Selected' }}</span>
          </li>
        </ul>
        <Divider />
        <ul class="space-y-2">
          <li class="font-semibold text-lg">Services</li>
          <li class="flex justify-between" v-for="(service, index) in selectedServices" :key="index">
            <span>{{ service.name }}</span>
            <span>₱{{ service.fee.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
          </li>
        </ul>
        <hr class="my-4">
        <div class="flex flex-col gap-2">
          <div class="flex justify-between">
            <span>Base Cost:</span>
            <span>₱{{ basedCost.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between">
            <span>VAT Amount (12%):</span>
            <span>₱{{ vat.toFixed(2) }}</span>
          </div>
        </div>
        <Divider />
        <div class="flex justify-between items-end font-bold text-lg">
          <span>Total Cost (incl. VAT):</span>
          <span>₱{{ totalCostWithTax.toFixed(2) }}</span>
        </div>
        <div class="mt-20">
          <h3 class="text-lg italic text-gray-600">Note: We do not provide towing services. If your vehicle requires towing, please arrange for a towing service before proceeding with your booking.</h3>
        </div>
        <div class="mt-4 flex justify-end gap-4 lg:hidden">
          <Button label="Cancel" @click="cancelBooking" class="p-button-secondary" />
          <Button :label="buttonLabel" :icon="buttonIcon" :disabled="loading" @click="submitBooking" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, defineProps, defineEmits } from 'vue';
import { useRouter } from 'vue-router';
import Select from 'primevue/select';
import Divider from 'primevue/divider';
import MultiSelect from 'primevue/multiselect';
import DatePicker from 'primevue/datepicker';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import FileUpload from 'primevue/fileupload';
import ToastComponent from '../../components/ToastComponent.vue';
import { useGlobalStore } from '../../stores/global.store';
import { useBookingStore } from '../../stores/booking.store';
import { useAuthStore } from '../../stores/auth.store';
import dayjs from '../../services/dayjs';

const router = useRouter();
const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  technicianId: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['cancel']);

const selectedVehicleType = ref(null);
const selectedVehicleDetail = ref(null);
const selectedServices = ref([]);
const selectedBookingDate = ref(null);
const additionalInfo = ref('');
const uploadedFiles = ref([]);

const vehicleTypes = ref([]);
const vehicleDetails = ref([]);
const serviceOptions = ref([]);

const toastComponent = ref(null);
const fileUpload = ref(null);
const globalStore = useGlobalStore();
const bookingStore = useBookingStore();
const authStore = useAuthStore();

const loading = ref(false);
const buttonLabel = computed(() => (loading.value ? 'Submitting...' : 'Submit'));
const buttonIcon = computed(() => (loading.value ? 'pi pi-spin pi-spinner' : ''));

const totalServiceFee = ref(0);
const totalCostWithTax = ref(0);
const basedCost = ref(0);
const vat = ref(0);

onMounted(async () => {
  await globalStore.fetchTechnicianById(props.technicianId);

  if (globalStore.technicianDetails) {
    vehicleTypes.value = globalStore.technicianDetails.vehicle_types.map(vehicleType => ({
      type: vehicleType.type,
      id: vehicleType.id
    }));

    serviceOptions.value = globalStore.technicianDetails.services.map(service => ({
      name: service.name,
      id: service.id,
      fee: service.fee || 0
    }));
  }
});

const calculateTotalCost = () => {
  totalServiceFee.value = selectedServices.value.reduce((acc, service) => acc + (service.fee || 0), 0);
  basedCost.value = totalServiceFee.value * 0.88; 
  vat.value = totalServiceFee.value * 0.12;
  totalCostWithTax.value = basedCost.value + vat.value;
};

watch(selectedServices, calculateTotalCost);

const fetchVehicleDetails = async () => {
  if (selectedVehicleType.value) {
    await globalStore.fetchVehicles(selectedVehicleType.value.id);
    vehicleDetails.value = globalStore.vehicles;
  }
};

const onFileSelect = (event) => {
  uploadedFiles.value = event.files; 
};

const resetForm = () => {
  selectedVehicleType.value = null;
  selectedVehicleDetail.value = null;
  selectedServices.value = [];
  selectedBookingDate.value = null;
  additionalInfo.value = '';
  uploadedFiles.value = [];
  fileUpload.value.clear();
};

const submitBooking = async () => {
  loading.value = true;
  const userId = authStore.user?.id || null;

  calculateTotalCost();

  const response = await bookingStore.createRegisteredUserBooking({
    user_id: userId,
    technician_id: props.technicianId,
    service_ids: selectedServices.value.map(service => service.id),
    vehicle_id: selectedVehicleDetail.value.value,
    booking_date: selectedBookingDate.value,
    total_fee: totalCostWithTax.value,
    additional_info: additionalInfo.value,
    attachments: uploadedFiles.value,
  });

  console.log(response); 

  if (response.success && response.booking?.id) {
    const bookingId = response.booking.id;
    router.push({ name: 'BookingSuccess', params: { bookingId } });
  } else {
    toastComponent.value.showToast('error', 'Booking Failed', response.message);
  }
  loading.value = false;
};

const cancelBooking = () => {
  resetForm(); 
  emit('cancel');
};
</script>

<style scoped>
</style>
