<script setup>
import { ref, onMounted } from "vue";
import axios from '../../services/axios';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import InputText from 'primevue/inputtext';
import InputMask from 'primevue/inputmask';
import Textarea from 'primevue/textarea';
import FileUpload from 'primevue/fileupload';
import SettingsSkeleton from '../../components/admin/settings/SettingsSkeleton.vue';
import ToastComponent from '../../components/ToastComponent.vue';
import avatarPlaceholder from '../../test_images/avatar.jpg';

const settingsVisible = ref(false);
const contactVisible =ref(false);
const addTeamVisible = ref(false);
const confirmRemoveVisible = ref(false);

const teamMembers = ref([]);
const selectedMemberId = ref(null);

const loading = ref(true);
const toastComponent = ref(null);

const appInfo = ref({
  appTitle: '',
  appAbout: ''
});

const contactInfo = ref({
    address : '',
    gmap : '',
    tel1 : '',
    tel2 : '',
    email : '',
    twt : '',
    fb : '',
    ig : '',
    iframe : ''
});

const memberInfo = ref({
  memberName: '',
  memberRole: '',
  memberImg: null, 
});

const appForm = ref({
  appTitle: '',
  appAbout: ''
});

const contactForm = ref({
    address : '',
    gmap : '',
    tel1 : '',
    tel2 : '',
    email : '',
    twt : '',
    fb : '',
    ig : '',
    iframe : ''
});

const fetchAppInfo = async () => {
  try {
        const response = await axios.get('/api/admin/v1/settings/app');
        if (response.data.success && response.data.data.length > 0) {
        appInfo.value = response.data.data[0];
        }
    } catch (error) {
     console.error('Failed to fetch app information:', error);
    } finally {
        loading.value = false;
    }
};

const fetchContactInfo = async () => {
  try {
        const response = await axios.get('/api/admin/v1/settings/contact');
        if (response.data.success && response.data.data.length > 0) {
        contactInfo.value = response.data.data[0];
        }
    } catch (error) {
     console.error('Failed to fetch contact information:', error);
    } finally {
        loading.value = false;
    }
};

const fetchTeamMembers = async () => {
    try {
        const response = await axios.get('/api/admin/v1/teams');
        if (response.data.success) {
            teamMembers.value = response.data.data;
        }
    } catch (error) {
        console.error('Failed to fetch team members:', error);
    } finally {
        loading.value = false;
    }
};

const showAddTeamDialog = () => {
    memberInfo.value = { memberName: '', memberRole: '', memberImg: null };
    addTeamVisible.value = true;
};

const onFileSelect = (event) => {
    memberInfo.value.memberImg = event.files[0];
};

const onUpload = () => {};

const showSettings = () => {
  appForm.value.appTitle = appInfo.value.appTitle;
  appForm.value.appAbout = appInfo.value.appAbout;
  settingsVisible.value = true;
};

const showContacts = () => {
  contactForm.value.address = contactInfo.value.address;
  contactForm.value.gmap = contactInfo.value.gmap;
  contactForm.value.tel1 = contactInfo.value.tel1;
  contactForm.value.tel2 = contactInfo.value.tel2;
  contactForm.value.email = contactInfo.value.email;
  contactForm.value.twt = contactInfo.value.twt;
  contactForm.value.fb = contactInfo.value.fb;
  contactForm.value.ig = contactInfo.value.ig;
  contactForm.value.iframe = contactInfo.value.iframe;
  contactVisible.value = true;
};

const addTeamMember = async () => {
    if (!memberInfo.value.memberName || !memberInfo.value.memberRole || !memberInfo.value.memberImg) {
        toastComponent.value.showToast('error', 'Validation Failed', 'Please fill all fields and select an image.');
        return;
    }

    const formData = new FormData();
    formData.append('memberName', memberInfo.value.memberName);
    formData.append('memberRole', memberInfo.value.memberRole);
    formData.append('memberImg', memberInfo.value.memberImg);

    try {
        const response = await axios.post('/api/admin/v1/teams', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        if (response.data.success) {
            teamMembers.value.push(response.data.data);
            toastComponent.value.showToast('success', 'Member Added', response.data.message);
            addTeamVisible.value = false;
        }
    } catch (error) {
        console.error('Failed to add team member:', error);
        toastComponent.value.showToast('error', 'Add Failed', 'Failed to add team member.');
    }
};

const saveSettings = async () => {
  try {
    const response = await axios.put('/api/admin/v1/settings/app', {
      appID: appInfo.value.appID, 
      appTitle: appForm.value.appTitle,
      appAbout: appForm.value.appAbout
    });
    if (response.data.success) {
      appInfo.value = response.data.data;
      settingsVisible.value = false;
      toastComponent.value.showToast('success', 'Update Successful', response.data.message);
    }
  } catch (error) {
    console.error('Failed to save app information:', error);
    toastComponent.value.showToast('error', 'Update Failed', response.data.message);
  }
};

const saveContacts = async () => {
  try {
    const response = await axios.put('/api/admin/v1/settings/contact', {
      contactID: contactInfo.value.contactID, 
      address: contactForm.value.address,
      gmap: contactForm.value.gmap,
      tel1: contactForm.value.tel1,
      tel2: contactForm.value.tel2,
      email: contactForm.value.email,
      twt: contactForm.value.twt,
      fb: contactForm.value.fb,
      ig: contactForm.value.ig,
      iframe: contactForm.value.iframe,
    });
    if (response.data.success) {
      contactInfo.value = response.data.data;
      contactVisible.value = false;  
      toastComponent.value.showToast('success', 'Update Successful', response.data.message);
    }
  } catch (error) {
    console.error('Failed to save contact information:', error);
    toastComponent.value.showToast('error', 'Update Failed', response.data.message);
  }
};

const confirmRemoveMember = (id) => {
    selectedMemberId.value = id;
    confirmRemoveVisible.value = true;
};

const removeTeamMember = async () => {
    try {
        const response = await axios.delete(`/api/admin/v1/teams/${selectedMemberId.value}`);
        if (response.data.success) {
            teamMembers.value = teamMembers.value.filter(member => member.id !== selectedMemberId.value);
            toastComponent.value.showToast('success', 'Member Removed', response.data.message);
            confirmRemoveVisible.value = false;
        }
    } catch (error) {
        console.error('Failed to remove team member:', error);
        toastComponent.value.showToast('error', 'Remove Failed', 'Failed to remove team member.');
    }
};

const getAvatarUrl = (memberImg) => {
    return memberImg ? `http://localhost:8000/storage/${memberImg}` : avatarPlaceholder;
};

onMounted(() => {
  fetchAppInfo();
  fetchContactInfo();
  fetchTeamMembers();
});
</script>

<template>
    <SettingsSkeleton v-if="loading" />
    <div v-else>
        <div class="container mx-auto p-4">
            <div class="flex flex-col overflow-hidden">
                <h3 class="mb-4 text-xl font-semibold">Settings</h3>

                <!-- GENERAL -->
                <div class="card border-0 shadow-sm mb-4 p-4 rounded-lg">
                    <div class="flex items-center justify-between mb-3">
                        <h5 class="font-semibold text-lg m-0">General Settings</h5>
                        <Button
                            @click="showSettings"
                            severity="secondary" 
                            icon="pi pi-pencil"
                            class="px-3 py-1 text-sm rounded shadow"
                            size="small"
                            label="Edit"> 
                        </Button>
                        <Dialog v-model:visible="settingsVisible" modal header="Edit Site" :style="{ width: '40rem' }">
                            <span class="text-surface-500 dark:text-surface-400 block mb-8">Update website information.</span>
                            <div class="flex flex-col gap-2 mb-4">
                                <label for="appTitle" class="font-semibold w-24">App Title</label>
                                <InputText id="appTitle" class="flex-auto" autocomplete="off" v-model="appForm.appTitle" />
                            </div>
                            <div class="flex flex-col gap-2 mb-8">
                                <label for="appAbout" class="font-semibold w-24">App About</label>
                                <Textarea id="appAbout" class="flex-auto" autocomplete="off" v-model="appForm.appAbout" />
                            </div>
                            <div class="flex justify-end gap-2">
                                <Button type="button" label="Cancel" severity="secondary" @click="settingsVisible = false"></Button>
                                <Button type="button" label="Save" @click="saveSettings"></Button>
                            </div>
                        </Dialog>
                    </div>
                    <Divider />
                    <h6 class="font-semibold mb-1">Site Title</h6>
                    <p id="appTitle" class="mb-4">{{ appInfo.appTitle || '[Placeholder for App Title]' }}</p>
                    <h6 class="font-semibold mb-1">About us</h6>
                    <p id="appAbout">{{ appInfo.appAbout || '[Placeholder for About Us]' }}</p>
                </div>

                <!-- CONTACT -->
                <div class="card border-0 shadow-sm mb-4 p-4 rounded-lg">
                    <div class="flex items-center justify-between mb-3">
                        <h5 class="font-semibold text-lg m-0">Contacts Settings</h5>
                        <Button
                            @click="showContacts" 
                            severity="secondary" 
                            icon="pi pi-pencil"
                            class="px-3 py-1 text-sm rounded shadow"
                            size="small"
                            label="Edit"> 
                        </Button>
                        <Dialog v-model:visible="contactVisible" modal header="Edit Contact" :style="{ width:'60rem'}">
                            <span class="text-surface-500 dark:text-surface-400 block mb-8">Update contact information.</span>
                            <div class="grid grid-cols-2 gap-4 mb-4">
                                <div class="col-span-1">
                                    <label for="address" class="font-semibold">Address</label>
                                    <InputText id="address" class="w-full mt-1" autocomplete="off" v-model="contactForm.address" />
                                </div>
                                <div class="col-span-1">
                                    <label for="gmap" class="font-semibold">Gmap Link</label>
                                    <InputText id="gmap" class="w-full mt-1" autocomplete="off" v-model="contactForm.gmap" />
                                </div>
                                <div class="col-span-1">
                                    <label for="tel1" class="font-semibold">Telephone Number 1</label>
                                    <InputMask mask="9999-999-9999" placeholder="9999-999-9999" id="tel1" class="w-full mt-1" autocomplete="off" v-model="contactForm.tel1" />
                                </div>
                                <div class="col-span-1">
                                    <label for="tel2" class="font-semibold">Telephone Number 2</label>
                                    <InputMask mask="9999-999-9999" placeholder="9999-999-9999" id="tel2" class="w-full mt-1" autocomplete="off" v-model="contactForm.tel2" />
                                </div>
                                <div class="col-span-1">
                                    <label for="email" class="font-semibold">Email</label>
                                    <InputText id="email" class="w-full mt-1" autocomplete="off" v-model="contactForm.email" />
                                </div>
                                <div class="col-span-1">
                                    <label for="twt" class="font-semibold">Twitter Link</label>
                                    <InputText id="twt" class="w-full mt-1" autocomplete="off" v-model="contactForm.twt" />
                                </div>
                                <div class="col-span-1">
                                    <label for="fb" class="font-semibold">Facebook Link</label>
                                    <InputText id="fb" class="w-full mt-1" autocomplete="off" v-model="contactForm.fb" />
                                </div>
                                <div class="col-span-1">
                                    <label for="ig" class="font-semibold">Instagram Link</label>
                                    <InputText id="ig" class="w-full mt-1" autocomplete="off" v-model="contactForm.ig" />
                                </div>
                            </div>
                            <div class="grid grid-cols-1 gap-4 mb-4">
                                <div class="col-span-2">
                                    <label for="iframe" class="font-semibold">iFrame Embed Link</label>
                                    <Textarea id="iframe" class="w-full mt-1" autocomplete="off" v-model="contactForm.iframe" />
                                </div>
                            </div>
                            <div class="flex justify-end gap-2">
                                <Button type="button" label="Cancel" severity="secondary" @click="contactVisible = false"></Button>
                                <Button type="button" label="Save" @click="saveContacts"></Button>
                            </div>
                        </Dialog>
                    </div>
                    <Divider />
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                            <div class="mb-4">
                                <h6 class="font-semibold mb-1">Address</h6>
                                <p id="address">{{ contactInfo.address }}</p>
                            </div>
                            <div class="mb-4">
                                <h6 class="font-semibold mb-1">Google Map</h6>
                                <p id="gmap">{{ contactInfo.gmap }}</p>
                            </div>
                            <div class="mb-4">
                                <h6 class="font-semibold mb-1">Phone Numbers</h6>
                                <p class="mb-2">
                                    <i class="pi pi-phone mr-1"></i>
                                    <span id="tel1">{{ contactInfo.tel1 }}</span>
                                </p>
                                <p>
                                    <i class="pi pi-phone mr-1"></i>
                                    <span id="tel2">{{ contactInfo.tel2 }}</span>
                                </p>
                            </div>
                            <div class="mb-4">
                                <h6 class="font-semibold mb-1">Email</h6>
                                <p id="email">{{ contactInfo.email }}</p>
                            </div>
                        </div>
                        <div>
                            <div class="mb-4">
                                <h6 class="font-semibold mb-1">Social Links</h6>
                                <p class="mb-2">
                                    <i class="pi pi-twitter mr-1"></i>
                                    <span id="twt">{{ contactInfo.twt }}</span>
                                </p>
                                <p class="mb-2">
                                    <i class="pi pi-facebook mr-1"></i>
                                    <span id="fb">{{ contactInfo.fb }}</span>
                                </p>
                                <p>
                                    <i class="pi pi-instagram mr-1"></i>
                                    <span id="ig">{{ contactInfo.ig }}</span>
                                </p>
                            </div>
                            <div class="mb-4">
                                <h6 class="font-semibold mb-1">iFrame</h6>
                                <iframe :src="contactInfo.iframe" id="iframe" class="border p-2 w-full h-40" loading="lazy"></iframe>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- MANAGEMENT TEAM -->
                <div class="card border-0 shadow-sm mb-4 p-4 rounded-lg">
                    <div class="flex items-center justify-between mb-3">
                        <h5 class="font-semibold text-lg m-0">Management Team</h5>
                        <Button
                            @click="showAddTeamDialog"
                            severity="secondary" 
                            icon="pi pi-plus-circle"
                            class="px-3 py-1 text-sm rounded shadow"
                            size="small"
                            label="Add"
                            > 
                        </Button>
                        <Dialog v-model:visible="addTeamVisible" modal header="Add Team Member" :style="{ width: '25rem' }">
                            <div class="flex flex-col gap-4">
                                <div class="flex flex-col gap-4">
                                    <div class="flex flex-col">
                                        <label for="memberName" class="font-semibold">Name</label>
                                        <InputText id="memberName" class="w-full mt-1" autocomplete="off" v-model="memberInfo.memberName" />
                                    </div>
                                    <div class="flex flex-col">
                                        <label for="memberRole" class="font-semibold">Role</label>
                                        <InputText id="memberRole" class="w-full mt-1" autocomplete="off" v-model="memberInfo.memberRole" />
                                    </div>
                                </div>
                                <div class="flex flex-col gap-2">
                                    <label for="memberImg" class="font-semibold">Image</label>
                                    <FileUpload
                                        mode="basic"
                                        name="memberImg"
                                        accept="image/*"
                                        maxFileSize="2000000"
                                        customUpload
                                        :auto="false"
                                        :chooseLabel="'Choose Image'"
                        
                                        @upload="onUpload"
                                        @select="onFileSelect"
                                    />
                                </div>
                                <div class="flex justify-end gap-2 mt-4">
                                    <Button type="button" label="Cancel" severity="secondary" @click="addTeamVisible = false"></Button>
                                    <Button type="button" label="Add" @click="addTeamMember"></Button>
                                </div>
                            </div>
                        </Dialog>
                    </div>
                    <Divider />
                    <div class="grid grid-cols-3 gap-4" id="team-data">
                        <div v-for="member in teamMembers" :key="member.id" class="relative bg-white rounded-lg shadow-md mb-8">
                            <img :src="getAvatarUrl(member.memberImg)" alt="Avatar" class="w-full h-80 object-cover rounded-t-lg" />
                            <Button 
                                icon="pi pi-trash" 
                                severity="danger" 
                                @click="confirmRemoveMember(member.id)" 
                                class="!absolute !top-2 !right-2 p-1"
                                outlined
                                >
                            </Button>
                            <Dialog v-model:visible="confirmRemoveVisible" modal header="Confirm Remove" :style="{ width: '30rem' }">
                                <span class="block mb-8">Are you sure you want to remove this team member?</span>
                                <div class="flex justify-end gap-2">
                                    <Button type="button" label="Cancel" severity="secondary" @click="confirmRemoveVisible = false"></Button>
                                    <Button type="button" label="Remove" severity="danger" @click="removeTeamMember"></Button>
                                </div>
                            </Dialog>
                            <h6 class="text-lg font-semibold text-center mt-1">{{ member.memberName }}</h6>
                            <p class="text-center mb-1">{{ member.memberRole }}</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <ToastComponent ref="toastComponent" />
    </div>
</template>
