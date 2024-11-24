<script setup>
import { ref } from 'vue';
import axios from '../../../services/axios';
import dayjs from '../../../services/dayjs';

import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import DatePicker from 'primevue/datepicker';
import FileUpload from 'primevue/fileupload';
import Checkbox from 'primevue/checkbox';
import Button from 'primevue/button';

import ToastComponent from "../../ToastComponent.vue";

const props = defineProps({
  visible: Boolean,
  vehicles: Array,
  services: Array,
});

const toastComponent = ref(null);
const emit = defineEmits(['update:visible', 'save']);

const technicianForm = ref({
  name: '',
  email: '',
  phone_number: '',
  date_of_birth: '',
  year_experience: '',
  profile_image: null,
  vehicle_ids: [], 
  service_ids: [],  
});

const imagePreviewUrl = ref(null);

const close = () => {
  emit('update:visible', false);
  resetForm();
};

const resetForm = () => {
  technicianForm.value = {
    name: '',
    email: '',
    phone_number: '',
    date_of_birth: '',
    year_experience: '',
    profile_image: null,
    vehicle_ids: [],
    service_ids: [],
  };
  imagePreviewUrl.value = null;
};

const saveTechnician = async () => {
  if (!technicianForm.value.name || !technicianForm.value.email) {
    console.error("Required fields are missing");
    return;
  }

  try {
    const formData = new FormData();
    formData.append('name', technicianForm.value.name);
    formData.append('email', technicianForm.value.email);
    formData.append('phone_number', technicianForm.value.phone_number);
    const formattedDate = dayjs(technicianForm.value.date_of_birth).format('YYYY-MM-DD');
    formData.append('date_of_birth', formattedDate);
    formData.append('year_experience', technicianForm.value.year_experience);
    formData.append('vehicle_type_ids', JSON.stringify(technicianForm.value.vehicle_ids)); 
    formData.append('service_ids', JSON.stringify(technicianForm.value.service_ids));

    if (technicianForm.value.profile_image) {
      formData.append('profile_image', technicianForm.value.profile_image);
    }

    const response = await axios.post('/api/admin/v1/technician', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data.success) {
      emit('save', response.data.data);
      toastComponent.value.showToast('success', 'Technician Added', response.data.message);
      close();
    } else {
      console.error('Failed to save technician:', response.data.message);
      toastComponent.value.showToast('error', 'Failed to add technician.', response.data.message);
    }
  } catch (error) {
    console.error('Error saving technician:', error);
  }
};

const onFileSelect = (event) => {
  technicianForm.value.profile_image = event.files[0];
};
</script>

<template>
  <div v-bind="$attrs">
    <Dialog 
        :visible="visible" 
        @hide="close" 
        :closable="false" 
        modal 
        header="Add Technician" 
        :style="{ width: '60vw' }"
    >
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div class="flex flex-col">
          <label for="name" class="font-semibold">Technician Name</label>
          <InputText id="name" class="flex-auto" autocomplete="off" v-model="technicianForm.name" />
        </div>
        <div class="flex flex-col">
          <label for="email" class="font-semibold">Email</label>
          <InputText id="email" class="flex-auto" autocomplete="off" v-model="technicianForm.email" />
        </div>
        <div class="flex flex-col">
          <label for="phone_number" class="font-semibold">Phone Number</label>
          <InputText id="phone_number" class="flex-auto" autocomplete="off" v-model="technicianForm.phone_number" />
        </div>
        <div class="flex flex-col">
          <label for="date_of_birth" class="font-semibold">Date of Birth</label>
          <DatePicker id="date_of_birth" dateFormat="yy/mm/dd" class="flex-auto" autocomplete="off" v-model="technicianForm.date_of_birth" />
        </div>
        <div class="flex flex-col">
          <label for="year_experience" class="font-semibold">Years of Experience</label>
          <InputText id="year_experience" class="flex-auto" autocomplete="off" v-model="technicianForm.year_experience" />
        </div>
      </div>

      <div class="flex flex-col">
        <label for="profile_image" class="font-semibold">Profile Image</label>
        <FileUpload name="profile_image" accept="image/*" maxFileSize="2000000" customUpload @select="onFileSelect" class="w-1/5" />
      </div>

      <div class="flex flex-col">
        <label class="font-semibold my-2">Select Vehicle Types</label>
        <div class="flex flex-wrap gap-4">
          <div v-for="vehicle in vehicles" :key="vehicle.id" class="lg:w-1/5 w-full flex items-center gap-2">
            <Checkbox v-model="technicianForm.vehicle_ids" :value="vehicle.id" />
            <label>{{ vehicle.type }}</label>
          </div>
        </div>
      </div>

      <div class="flex flex-col">
        <label class="font-semibold my-2">Select Services Offered</label>
        <div class="flex flex-wrap gap-4">
          <div v-for="service in services" :key="service.id" class="lg:w-1/5 w-full flex items-center gap-2">
            <Checkbox v-model="technicianForm.service_ids" :value="service.id" />
            <label>{{ service.name }}</label>
          </div>
        </div>
      </div>

      <div class="flex justify-end gap-2">
        <Button type="button" label="Cancel" severity="secondary" @click="close" />
        <Button type="button" label="Save" @click="saveTechnician" />
      </div>
    </Dialog>
  </div>
  <ToastComponent ref="toastComponent" />
</template>
