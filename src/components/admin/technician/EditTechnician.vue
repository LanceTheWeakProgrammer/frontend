<script setup>
import { ref, watch, onMounted } from 'vue';
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
  technicianId: Number,
  vehicles: Array,
  services: Array,
});

const toastComponent = ref(null);
const emit = defineEmits(['update:visible', 'update']);

const technicianForm = ref({
  name: '',
  phone_number: '',
  date_of_birth: '',
  year_experience: '',
  profile_image: null,
  vehicle_ids: [], 
  service_ids: [], 
  user_id: null, 
  email: '', 
});

const imagePreviewUrl = ref(null);

const fetchTechnician = async () => {
  if (!props.technicianId) return;

  try {
    const response = await axios.get(`/api/admin/v1/technician/${props.technicianId}`);
    if (response.data.success) {
      const technician = response.data.data;

      technicianForm.value.name = technician.full_name;
      technicianForm.value.email = technician.user?.email || '';
      technicianForm.value.user_id = technician.user_id; 
      technicianForm.value.phone_number = technician.phone_number;
      technicianForm.value.date_of_birth = dayjs(technician.date_of_birth).toDate();
      technicianForm.value.year_experience = technician.year_experience;
      technicianForm.value.vehicle_ids = technician.vehicle_type_ids || [];
      technicianForm.value.service_ids = technician.service_ids || []; 
      imagePreviewUrl.value = technician.profile_image ? `/storage/${technician.profile_image}` : null;
    }
  } catch (error) {
    console.error('Failed to fetch technician data:', error);
  }
};

const close = () => {
  emit('update:visible', false);
};

const updateTechnician = async () => {
  if (!technicianForm.value.name || !technicianForm.value.email) {
    console.error("Required fields are missing");
    return;
  }

  try {
    const formData = new FormData();
    formData.append('id', props.technicianId); 
    formData.append('user_id', technicianForm.value.user_id); 
    formData.append('name', technicianForm.value.name);
    formData.append('email', technicianForm.value.email); 
    formData.append('phone_number', technicianForm.value.phone_number);
    const formattedDate = dayjs(technicianForm.value.date_of_birth).format('YYYY-MM-DD');
    formData.append('date_of_birth', formattedDate);
    formData.append('year_experience', technicianForm.value.year_experience);
    formData.append('vehicle_type_ids', JSON.stringify(technicianForm.value.vehicle_ids)); 
    formData.append('service_ids', JSON.stringify(technicianForm.value.service_ids));

    if (technicianForm.value.profile_image instanceof File) {
      formData.append('profile_image', technicianForm.value.profile_image);
    }

    const response = await axios.post('/api/admin/v1/technician/update', formData); 

    if (response.data.success) {
      emit('update', response.data.data);
      toastComponent.value.showToast('success', 'Technician Updated', response.data.message);
      close();
    } else {
      console.error('Failed to update technician:', response.data.message);
      toastComponent.value.showToast('error', 'Failed to update technician.', response.data.message);
    }
  } catch (error) {
    console.error('Error updating technician:', error);
    toastComponent.value.showToast('error', 'Failed to update technician.', 'An error occurred while updating the technician.');
  }
};

const onFileSelect = (event) => {
  technicianForm.value.profile_image = event.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreviewUrl.value = e.target.result;
  };
  reader.readAsDataURL(event.files[0]);
};

watch(() => props.technicianId, () => {
  if (props.visible) {
    fetchTechnician();
  }
});

onMounted(() => {
  if (props.visible) {
    fetchTechnician();
  }
});
</script>

<template>
  <Dialog 
    :visible="visible" 
    @hide="close" 
    :closable="false" 
    modal 
    header="Edit Technician" 
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
        <InputText id="year_experience" showButtons class="flex-auto" autocomplete="off" v-model="technicianForm.year_experience" />
      </div>
    </div>

    <div class="flex flex-col">
      <label for="profile_image" class="font-semibold">Profile Image</label>
      <FileUpload mode="basic" name="profile_image" accept="image/*" maxFileSize="2000000" customUpload @select="onFileSelect" class="w-1/5" />
    </div>

    <div class="flex flex-col">
      <label class="font-semibold my-2">Select Vehicle Types</label>
      <div class="flex flex-wrap gap-4">
        <div v-for="vehicle in vehicles" :key="vehicle.id" class="w-1/5 flex items-center gap-2">
          <Checkbox v-model="technicianForm.vehicle_ids" :value="vehicle.id" />
          <label>{{ vehicle.type }}</label>
        </div>
      </div>
    </div>

    <div class="flex flex-col">
      <label class="font-semibold my-2">Select Services Offered</label>
      <div class="flex flex-wrap gap-4">
        <div v-for="service in services" :key="service.id" class="w-1/5 flex items-center gap-2">
          <Checkbox v-model="technicianForm.service_ids" :value="service.id" />
          <label>{{ service.name }}</label>
        </div>
      </div>
    </div>

    <div class="flex justify-end gap-2">
      <Button type="button" label="Cancel" severity="secondary" @click="close" />
      <Button type="button" label="Update" @click="updateTechnician" />
    </div>
    <ToastComponent ref="toastComponent" />
  </Dialog>
</template>