<template>
  <div>
    <h1 class="font-semibold text-2xl p-6">User Profile</h1>
    <div class="flex flex-col lg:flex-row gap-4 px-4">
      <div class="lg:w-1/3 w-full mb-4">
        <div class="card shadow">
          <div class="text-end">
            <Button
              v-if="!isEditing"
              label="Edit"
              icon="pi pi-pencil"
              size="small"
              @click="toggleEdit"
            />
            <Button
              v-if="isEditing"
              label="Save"
              icon="pi pi-check"
              size="small"
              @click="saveChanges"
              class="mr-2"
            />
            <Button
              v-if="isEditing"
              label="Cancel"
              icon="pi pi-times"
              size="small"
              severity="danger"
              @click="toggleEdit"
            />
          </div>
          <div>
            <div class="flex justify-center mb-6">
              <Image
                :src="src || userProfile?.profile_image || defaultAvatar"
                width="250"
                imageClass="rounded-full"
                preview
              />
            </div>
            <div v-if="isEditing">
              <div class="flex flex-col items-center gap-6">
                <FileUpload mode="basic" accept="image/*" @select="onFileSelect" customUpload auto />
              </div>
            </div>
            <div class="space-y-6">
              <div>
                <p class="text-sm font-semibold text-gray-500 mb-2">Name</p>
                <InputText
                  v-if="isEditing"
                  v-model="editableProfile.full_name"
                  class="w-full"
                  fluid
                />
                <p v-else class="text-lg font-normal">{{ editableProfile.full_name || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-sm font-semibold text-gray-500 mb-2">Date of Birth</p>
                <Datepicker
                  v-if="isEditing"
                  v-model="editableProfile.date_of_birth"
                  class="w-full"
                  dateFormat="mm/dd/yy"
                />
                <p v-else class="text-lg font-normal">
                  {{ formatDOB(editableProfile.date_of_birth) || 'N/A' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col lg:w-2/3 w-full">
        <div class="card shadow">
          <div class="flex w-full">
            <div class="space-y-6">
              <div class="flex flex-col flex-wrap flex-1">
                <p class="text-sm font-semibold text-gray-500 mb-2">Complete Address</p>
                <InputText
                  v-if="isEditing"
                  v-model="editableProfile.address"
                  class="w-full"
                />
                <p v-else class="text-lg font-normal">{{ editableProfile.address || 'N/A' }}</p>
              </div>
              <div class="flex flex-wrap flex-col">
                <p class="text-sm font-semibold text-gray-500 mb-2">Barangay</p>
                <InputText
                  v-if="isEditing"
                  v-model="editableProfile.barangay"
                  class="w-full"
                />
                <p v-else class="text-lg font-normal">{{ editableProfile.barangay || 'N/A' }}</p>
              </div>
              <div class="flex flex-wrap flex-col">
                <p class="text-sm font-semibold text-gray-500 mb-2">City</p>
                <InputText
                  v-if="isEditing"
                  v-model="editableProfile.city"
                  class="w-full"
                />
                <p v-else class="text-lg font-normal">{{ editableProfile.city || 'N/A' }}</p>
              </div>
              <div class="flex flex-wrap flex-col">
                <p class="text-sm font-semibold text-gray-500 mb-2">Province</p>
                <InputText
                  v-if="isEditing"
                  v-model="editableProfile.province"
                  class="w-full"
                />
                <p v-else class="text-lg font-normal">{{ editableProfile.province || 'N/A' }}</p>
              </div>
              <div class="flex flex-wrap flex-col">
                <p class="text-sm font-semibold text-gray-500 mb-2">Zip Code</p>
                <InputText
                  v-if="isEditing"
                  v-model="editableProfile.zip_code"
                  class="w-full"
                />
                <p v-else class="text-lg font-normal">{{ editableProfile.zip_code || 'N/A' }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="card shadow">
          <div class="flex">
            <div class="space-y-6">
              <div class="flex flex-wrap flex-col">
                <p class="text-sm font-semibold text-gray-500 mb-2">Phone Number</p>
                <InputText
                  v-if="isEditing"
                  v-model="editableProfile.phone_number"
                  class="w-full"
                />
                <p v-else class="text-lg font-normal">{{ editableProfile.phone_number || 'N/A' }}</p>
              </div>
              <div class="flex flex-wrap flex-col">
                <p class="text-sm font-semibold text-gray-500 mb-2">Email</p>
                <InputText
                  v-if="isEditing"
                  v-model="editableProfile.email"
                  class="w-full"
                />
                <p v-else class="text-lg font-normal">{{ editableProfile.email || 'N/A' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useUserProfileStore } from '../../stores/user.profile.store';
import { useAuthStore } from '../../stores/auth.store';
import Image from 'primevue/image';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import FileUpload from 'primevue/fileupload';
import Datepicker from 'primevue/datepicker';
import dayjs from 'dayjs';

const userProfileStore = useUserProfileStore();
const authStore = useAuthStore();
const defaultAvatar = '/src/test_images/avatar.jpg';

const src = ref(null);
const isEditing = ref(false);
const editableProfile = reactive({});

function onFileSelect(event) {
  const file = event.files[0];
  const reader = new FileReader();
  reader.onload = async (e) => {
    src.value = e.target.result;
  };
  reader.readAsDataURL(file);
}

const toggleEdit = () => {
  if (isEditing.value) {
    Object.assign(editableProfile, userProfileStore.user?.profile);
    src.value = null;
  }
  isEditing.value = !isEditing.value;
};

const saveChanges = async () => {
  try {
    await userProfileStore.updateUserProfile(authStore.id, editableProfile);
    isEditing.value = false;
  } catch (error) {
    console.error('Failed to save profile:', error);
  }
};

onMounted(async () => {
  await userProfileStore.fetchUserProfile(authStore.id);
  Object.assign(editableProfile, userProfileStore.user.profile, userProfileStore.user);
});

const formatDOB = (dob) => (dob ? dayjs(dob).format('MMMM D, YYYY') : null);
</script>
