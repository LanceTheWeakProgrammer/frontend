<script setup>
import { ref, onMounted } from 'vue';
import axios from '../../services/axios';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import ToggleButton from 'primevue/togglebutton'; 
import Tag from 'primevue/tag'; 
import Tooltip from 'primevue/tooltip';
import ToastComponent from '../../components/ToastComponent.vue';
import { useRouter } from 'vue-router'; 

import AddTechnician from '../../components/admin/technician/AddTechnician.vue';
import EditTechnician from '../../components/admin/technician/EditTechnician.vue';
import TechnicianSkeleton from '../../components/admin/technician/TechnicianSkeleton.vue';

const technicians = ref([]);
const vehicles = ref([]);
const services = ref([]);
const technicianVisible = ref(false); 
const editTechnicianVisible = ref(false); 
const selectedTechnicianId = ref(null); 
const toastComponent = ref(null);
const loading = ref(true);
let cooldownActive = false; 
const COOLDOWN_TIME = 10000;

const router = useRouter(); 

const fetchTechnicians = async () => {
    try {
        const response = await axios.get('/api/admin/v1/technician'); 
        if (response.data.success) {
            technicians.value = response.data.data;
        }
    } catch (error) {
        console.error('Failed to fetch technician data:', error);
    } finally {
        loading.value = false;
    }
};

const fetchVehicles = async () => {
    const response = await axios.get('/api/admin/v1/vehicle/types');
    if (response.data.success) vehicles.value = response.data.data;

    loading.value = false;
};

const fetchServices = async () => {
    const response = await axios.get('/api/admin/v1/service');
    if (response.data.success) services.value = response.data.data;

    loading.value = false;
};

const toggleTechnicianStatus = async (technician) => {
    if (cooldownActive) {
        toastComponent.value.showToast('warn', 'Warning', 'Please wait a moment before trying again.');
        return;
    }

    cooldownActive = true;

    try {
        const response = await axios.put(`/api/admin/v1/technician/toggle-active/${technician.id}`);
        if (response.data.success) {
            toastComponent.value.showToast('success', 'Success', 'Changes saved successfully');
            fetchTechnicians(); 
        }
    } catch (error) {
        console.error('Failed to update technician status:', error);
        toastComponent.value.showToast('error', 'Error', error.response.data.message || 'Failed to update status.');
    } finally {
        setTimeout(() => {
            cooldownActive = false; 
        }, COOLDOWN_TIME);
    }
};
const removeTechnician = async (id) => {
    try {
        const response = await axios.put(`/api/admin/v1/technician/${id}`);
        if (response.data.success) {
            toastComponent.value.showToast('success', 'Success', 'Technician removed successfully.');
            fetchTechnicians(); 
        }
    } catch (error) {
        console.error('Failed to remove technician:', error);

        if (error.response && error.response.status === 400) {
            toastComponent.value.showToast('error', 'Error', 'Cannot remove an active technician. Please deactivate the technician first.');
        } else {
            toastComponent.value.showToast('error', 'Error', error.response.data.message || 'Failed to remove technician.');
        }
    }
};

const technicianDetails = (id) => {
    router.push({ name: 'TechnicianAdminDetails', params: { id } });
};

const editTechnician = (id) => {
    selectedTechnicianId.value = id;
    editTechnicianVisible.value = true; 
};

const resetEdit = () => {
    selectedTechnicianId.value = null; 
    editTechnicianVisible.value = false; 
    fetchTechnicians(); 
};

onMounted(() => {
    fetchTechnicians();
    fetchVehicles();
    fetchServices();
});
</script>

<template>
    <TechnicianSkeleton v-if="loading" />
    <div v-else>
        <h3 class="mb-4 text-xl font-semibold">Manage Technicians</h3>
        <div class="card">
            <div class="flex justify-end mb-3">
                <Button
                    @click="technicianVisible = true"
                    severity="secondary"
                    icon="pi pi-plus"
                    class="px-3 py-1 text-sm rounded shadow"
                    size="small"
                    label="Add Technician">
                </Button>
            </div>
            <div class="grid grid-cols-1 gap-4">
                <DataTable :value="technicians" scrollable scrollHeight="1000px" stripedRows tableStyle="min-width: 50rem" paginator :rows="8">
                    <Column field="full_name" header="Technician Name" sortable></Column>
                    <Column field="user.email" header="Email" sortable></Column>
                    <Column field="phone_number" header="Phone Number" sortable></Column>

                    <Column>
                        <template #body="slotProps">
                            <Tag
                            :severity="slotProps.data.avail_status === 1 ? 'info' : (slotProps.data.avail_status === 0 ? 'warn' : 'secondary')"
                            :value="slotProps.data.avail_status === 1 ? 'ACTIVE' : (slotProps.data.avail_status === 0 ? 'BUSY' : 'INACTIVE')"
                            />
                        </template>
                    </Column>

                    <Column>
                        <template #body="slotProps">
                            <ToggleButton 
                                v-model="slotProps.data.user.is_active"
                                onLabel="Inactive"
                                offLabel="Active"
                                onIcon="pi pi-eye-slash" 
                                offIcon="pi pi-eye"
                                @change="toggleTechnicianStatus(slotProps.data)"
                                outlined
                            />
                        </template>
                    </Column>

                    <Column header="Actions">
                        <template #body="slotProps">
                            <div class="flex gap-2">
                                <Button
                                    v-tooltip.left="{ value: 'Edit technician', showDelay: 600, hideDelay: 300 }" 
                                    severity="info"
                                    icon="pi pi-pencil" 
                                    @click="editTechnician(slotProps.data.id)"
                                />
                                <Button
                                    v-tooltip.bottom="{ value: 'Remove technician', showDelay: 600, hideDelay: 300 }" 
                                    icon="pi pi-trash" 
                                    severity="danger"
                                    @click="removeTechnician(slotProps.data.id)"
                                />
                                <Button
                                    v-tooltip="{ value: 'View more details', showDelay: 600, hideDelay: 300 }" 
                                    severity="contrast"
                                    outlined
                                    icon="pi pi-user" 
                                    @click="technicianDetails(slotProps.data.id)"
                                />
                            </div>
                        </template>
                    </Column>
                </DataTable>

                <AddTechnician
                    :visible="technicianVisible"
                    :vehicles="vehicles"
                    :services="services"
                    @update:visible="technicianVisible = $event"
                    @save="fetchTechnicians"
                    class="px-10"
                    v-bind="$attrs"
                />

                <EditTechnician
                    :visible="editTechnicianVisible"
                    :technicianId="selectedTechnicianId"
                    :vehicles="vehicles"
                    :services="services"
                    @update:visible="editTechnicianVisible = $event"
                    @update="resetEdit"
                    class="px-10"
                    v-bind="$attrs"
                />
            </div>
        </div>
    <ToastComponent ref="toastComponent" />
    </div>
</template>
