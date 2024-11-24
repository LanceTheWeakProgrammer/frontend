<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from '../../../services/axios';
import dayjs from '../../../services/dayjs';
import Breadcrumb from 'primevue/breadcrumb';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Tag from 'primevue/tag';
import ToastComponent from '../../ToastComponent.vue';
import TechnicianDetailsSkeleton from './TechnicianDetailsSkeleton.vue';
import avatarPlaceholder from '../../../test_images/avatar.jpg';
import EditTechnician from './EditTechnician.vue';

const toastComponent = ref(null);
const loading = ref(true);
const editVisible = ref(false);

const router = useRouter();
const route = useRoute();
const technicianId = route.params.id;
const selectedTechnicianId = ref(null);

const items = ref([
    { label: 'Technician', route: '/admin/technician' },
    { label: 'View Details', route: `/admin/technician/${technicianId}` },
]);

const technician = reactive({
    id: 0,
    name: '',
    email: '',
    phone_number: '',
    date_of_birth: '',
    year_experience: '',
    vehicles: [], 
    services: [], 
    profile_image: null,
    user: {
        email: '',
    }
});

const vehicles = ref([]);
const services = ref([]);
const email = ref([]);

const getTechnicianDetails = async () => {
    try {
        const response = await axios.get(`/api/admin/v1/technician/${technicianId}`);
        const data = response.data.data;

        technician.id = data.id;
        technician.name = data.full_name;
        if (data.user) {
            technician.user.email = data.user.email;
        }
        technician.phone_number = data.phone_number;
        technician.date_of_birth = dayjs(data.date_of_birth).format('MMMM DD, YYYY');
        technician.year_experience = data.year_experience;
        technician.vehicles = data.vehicle_types; 
        technician.services = data.services; 
        technician.profile_image = data.profile_image ? getAvatarUrl(data.profile_image) : avatarPlaceholder;
    } catch (error) {
        console.error('Failed to fetch technician details:', error);
    } finally {
        loading.value = false;
    }
};

const fetchVehicles = async () => {
    try {
        const response = await axios.get('/api/admin/v1/vehicle/types');
        if (response.data.success) {
            vehicles.value = response.data.data;
        }
    } catch (error) {
        console.error('Failed to fetch vehicles:', error);
    }
};

const fetchServices = async () => {
    try {
        const response = await axios.get('/api/admin/v1/service');
        if (response.data.success) {
            services.value = response.data.data;
        }
    } catch (error) {
        console.error('Failed to fetch services:', error);
    }
};

const getAvatarUrl = (profile_image) => {
    return profile_image ? `http://localhost:8000/storage/${profile_image}` : avatarPlaceholder;
};

const openEditDialog = (id) => {
    selectedTechnicianId.value = id;
    editVisible.value = true;
};

onMounted(() => {
    getTechnicianDetails();
    fetchVehicles();
    fetchServices();
});
</script>

<template>
    <TechnicianDetailsSkeleton v-if="loading" />
    <div v-else>
        <div class="mx-auto p-4">
            <div class="flex flex-row">
                <div class="flex flex-col w-full lg:ml-auto">
                    <Breadcrumb :model="items" class="border-0 text-base !bg-transparent">
                        <template #item="{ item, props }">
                            <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                                <a :href="href" v-bind="props.action" @click="navigate">
                                    <span> {{ item.label }} </span>
                                </a>
                            </router-link>
                            <a v-else :href="item.url" :target="item.target" v-bind="props.action">
                                <span>{{ item.label }}</span>
                            </a>
                        </template>
                    </Breadcrumb>
        
                    <div class="card border-0 shadow-sm p-4 rounded-lg">
                        <div class="flex justify-end">
                            <div class="flex flex-row-reverse items-end gap-4">
                                <Button 
                                    label="Edit" 
                                    severity="primary" 
                                    icon="pi pi-pencil" 
                                    @click="openEditDialog(technician.id)" 
                                />
                            </div>
                        </div>

                        <div class="flex lg:flex-row flex-col lg:gap-10 gap-4 items-start">
                            <div class="flex flex-col items-center lg:w-2/3 my-auto w-full">
                                <img :src="technician.profile_image" alt="Profile Image" width="300" class="mx-auto rounded-full object-cover border-2">
                            </div>

                            <div class="flex flex-col lg:w-2/3 w-full">
                                <div class="p-3">
                                    <label for="name">Name</label>
                                    <InputText v-model="technician.name" class="!bg-neutral-100 !border-0 w-full my-1" :disabled="true" />
                                </div>
                                <div class="p-3">
                                    <label for="email">Email</label>
                                    <InputText v-model="technician.user.email" class="!bg-neutral-100 !border-0 w-full my-1" :disabled="true" />
                                </div>
                                <div class="p-3">
                                    <label for="phone number">Phone Number</label>
                                    <InputText v-model="technician.phone_number" class="!bg-neutral-100 !border-0 w-full my-1" :disabled="true" />
                                </div>
                                <div class="p-3">
                                    <label for="date_of_birth">Date of Birth</label>
                                    <InputText v-model="technician.date_of_birth" class="!bg-neutral-100 !border-0 w-full my-1" :disabled="true" />
                                </div>
                                <div class="p-3">
                                    <label for="year_experience">Years of Experience</label>
                                    <InputText v-model="technician.year_experience" class="!bg-neutral-100 !border-0 w-full my-1" :disabled="true" />
                                </div>
                            </div>
                        </div>

                        <div class="flex flex-col mt-4">
                            <h3 class="font-semibold text-3xl my-5">Vehicle Mastery</h3>
                            <div class="flex flex-wrap gap-4">
                                <Tag 
                                    v-for="vehicle in technician.vehicles" 
                                    :key="vehicle.id" 
                                    :value="vehicle.type" 
                                    class="p-tag p-tag-rounded p-tag-primary">
                                    {{ vehicle.type }}
                                </Tag>
                            </div>
                        </div>

                        <div class="flex flex-col mt-4">
                            <h3 class="font-semibold text-3xl my-5">Services Offered</h3>
                            <div class="flex flex-wrap gap-4">
                                <Tag 
                                    v-for="service in technician.services" 
                                    :key="service.id" 
                                    :value="service.name" 
                                    class="p-tag p-tag-rounded p-tag-primary">
                                    {{ service.name }}
                                </Tag>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <EditTechnician
                :visible="editVisible"
                :technicianId="selectedTechnicianId"
                :vehicles="vehicles"
                :services="services"
                @update:visible="editVisible = $event"
                @update="getTechnicianDetails"
            />

            <ToastComponent ref="toastComponent" />
        </div>
    </div>
</template>
