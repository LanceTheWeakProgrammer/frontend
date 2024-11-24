<script setup>
import { ref, onMounted } from 'vue';
import axios from '../../services/axios';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import FileUpload from "primevue/fileupload";
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import Textarea from 'primevue/textarea';
import InputNumber from 'primevue/inputnumber';
import VehiclesServicesSkeleton from '../../components/admin/vehicles&services/Vehicles&ServicesSkeleton.vue';
import ToastComponent from '../../components/ToastComponent.vue'; 

const vehicles = ref([]);
const vehicleTypes = ref([]);
const vehicleVisible = ref(false);
const deleteVehicleDialogVisible = ref(false); 
const services = ref([]);
const serviceVisible = ref(false);
const deleteServiceDialogVisible = ref(false);

const vehicleForm = ref({
    make: '',
    model: '',
    vehicle_type: ''
});

const serviceForm = ref({
    name: '',
    fee: 0,
    icon: null,
    description: ''
});

const selectedVehicle = ref(null); 
const selectedService = ref(null);
const loading = ref(true);
const savingLoading = ref(false);
const toastComponent = ref(null);

const fetchVehicles = async () => {
    try {
        const response = await axios.get('/api/admin/v1/vehicle');
        if (response.data.success) {
            vehicles.value = response.data.data;
        }
    } catch (error) {
        console.error('Failed to fetch vehicle data:', error);
    } finally {
        loading.value = false;
    }
};

const fetchVehicleTypes = async () => {
    try {
        const response = await axios.get('/api/admin/v1/vehicle/types');
        if (response.data.success) {
            vehicleTypes.value = response.data.data;
        }
    } catch (error) {
        console.error('Failed to fetch vehicle types:', error);
    }
};

const fetchServices = async () => {
    try {
        const response = await axios.get('/api/admin/v1/service');
        if (response.data.success) {
            services.value = response.data.data;
        }
    } catch (error) {
        console.error('Failed to fetch service data:', error);
    } finally {
        loading.value = false;
    }
};

const showVehicleDialog = () => {
    vehicleForm.value = { make: '', model: '', vehicle_type: '' };
    vehicleVisible.value = true;
};

const showServiceDialog = () => {
    serviceForm.value = { name: '', fee: 0, icon: null, description: '' };
    serviceVisible.value = true;
};

const confirmDeleteVehicle = (vehicle) => {
    selectedVehicle.value = vehicle; 
    deleteVehicleDialogVisible.value = true; 
};

const saveVehicle = async () => {
    savingLoading.value = true;
    try {
        const payload = {
            make: vehicleForm.value.make,
            model: vehicleForm.value.model,
            vehicle_type: typeof vehicleForm.value.vehicle_type === 'object' 
                ? vehicleForm.value.vehicle_type.type 
                : vehicleForm.value.vehicle_type    
        };

        const response = await axios.post('/api/admin/v1/vehicle', payload);
        if (response.data.success) {
            vehicles.value.push(response.data.data);
            toastComponent.value?.showToast('success', 'Vehicle Added', 'Vehicle added successfully.');
            fetchVehicleTypes();
            vehicleVisible.value = false;
        }
    } catch (error) {
        console.error('Failed to add vehicle:', error);
        toastComponent.value?.showToast('error', 'Add Failed', 'Failed to add vehicle.');
    } finally {
        savingLoading.value = false;
    }
};

const saveService = async () => {
    savingLoading.value = true;
    try {
        const formData = new FormData();
        formData.append('name', serviceForm.value.name);
        formData.append('fee', serviceForm.value.fee);
        formData.append('description', serviceForm.value.description);

        if (serviceForm.value.icon) {
            formData.append('icon', serviceForm.value.icon);
        }

        const response = await axios.post('/api/admin/v1/service', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if (response.data.success) {
            services.value.push(response.data.data);
            toastComponent.value?.showToast('success', 'Service Added', 'Service data added successfully.');
            serviceVisible.value = false;
        }
    } catch (error) {
        console.error('Failed to add service:', error);
        toastComponent.value?.showToast('error', 'Add Failed', 'Failed to add service.');
    } finally {
        savingLoading.value = false;
    }
};

const deleteVehicle = async () => {
    if (!selectedVehicle.value) return;
    try {
        const response = await axios.delete(`/api/admin/v1/vehicle/${selectedVehicle.value.id}`);
        if (response.data.success) {
            vehicles.value = vehicles.value.filter(vehicle => vehicle.id !== selectedVehicle.value.id);
            toastComponent.value?.showToast('success', 'Vehicle Deleted', 'Vehicle data deleted successfully.');
            deleteVehicleDialogVisible.value = false;
        }
    } catch (error) {
        console.error('Failed to delete vehicle:', error);
        toastComponent.value?.showToast('error', 'Delete Failed', 'Failed to delete vehicle data.');
    }
};

const deleteService = async () => {
    if (!selectedService.value) return;
    try {
        const response = await axios.delete(`/api/admin/v1/service/${selectedService.value.id}`);
        if (response.data.success) {
            services.value = services.value.filter(service => service.id !== selectedService.value.id);
            toastComponent.value?.showToast('success', 'Service Deleted', 'Service data deleted successfully.');
            deleteServiceDialogVisible.value = false;
        }
    } catch (error) {
        console.error('Failed to delete service:', error);
        toastComponent.value?.showToast('error', 'Delete Failed', 'Failed to delete service data.');
    }
};

const onFileSelect = (event) => {
    serviceForm.value.icon = event.files[0];
};

onMounted(() => {
    fetchVehicles();
    fetchVehicleTypes();
    fetchServices();
});
</script>

<template>
    <VehiclesServicesSkeleton v-if="loading" />

    <div v-else>
        <div>
            <div class="flex flex-col w-full overflow-hidden">
                <h3 class="mb-4 text-xl font-semibold">Vehicles and Services</h3>
                <div class="card">
                    <div class="flex items-center justify-between mb-3">
                        <h5 class="font-semibold text-lg m-0">Vehicle Data</h5>
                        <Button @click="showVehicleDialog" severity="secondary" class="rounded shadow" icon="pi pi-plus" label="Add Vehicle" size="small" />
                    </div>

                    <Dialog v-model:visible="vehicleVisible" header="Add Vehicle" :modal="true" :style="{ width: '30vw' }">
                        <div class="flex flex-col gap-4">
                            <div class="flex flex-col">
                                <label for="make" class="font-semibold">Make</label>
                                <InputText id="make" v-model="vehicleForm.make" />
                            </div>
                            <div class="flex flex-col">
                                <label for="model" class="font-semibold">Model</label>
                                <InputText id="model" v-model="vehicleForm.model" />
                            </div>
                            <div class="flex flex-col">
                                <label for="vehicleType" class="font-semibold">Vehicle Type</label>
                                <Select v-model="vehicleForm.vehicle_type" :options="vehicleTypes" optionLabel="type" placeholder="Select or Add Vehicle Type" :editable="true" />
                            </div>
                        </div>
                        <div class="flex justify-end mt-4">
                            <Button label="Cancel" severity="secondary" @click="vehicleVisible = false" />
                            <Button label="Save" :loading="savingLoading" :disabled="savingLoading" @click="saveVehicle" />
                        </div>
                    </Dialog>

                    <div class="grid grid-cols-1">
                        <DataTable :value="vehicles" size="small" scrollable scrollHeight="1000px" stripedRows tableStyle="min-width: 50rem" paginator :rows="5">
                            <Column field="vehicle_type.type" header="Type" sortable></Column>
                            <Column field="make" header="Make" sortable></Column>
                            <Column field="model" header="Model" sortable></Column>
                            <Column header="Action" bodyStyle="text-align: center;">
                                <template #body="slotProps">
                                    <Button icon="pi pi-trash" severity="danger" @click="confirmDeleteVehicle(slotProps.data)" />
                                </template>
                            </Column>
                        </DataTable>
                    </div>

                    <Dialog v-model:visible="deleteVehicleDialogVisible" modal header="Confirm Delete" :style="{ width: '30vw' }">
                        <span>Are you sure you want to delete this vehicle?</span>
                        <div class="flex justify-end gap-2">
                            <Button type="button" label="Cancel" severity="secondary" @click="deleteVehicleDialogVisible = false" />
                            <Button type="button" label="Delete" severity="danger" @click="deleteVehicle" />
                        </div>
                    </Dialog>
                </div>
            </div>

            <div class="flex flex-col w-full overflow-hidden">
                <div class="card">
                    <div class="flex items-center justify-between mb-3">
                        <h5 class="font-semibold text-lg m-0">Services Data</h5>
                        <Button @click="showServiceDialog" severity="secondary" icon="pi pi-plus" class="px-3 py-1 text-sm rounded shadow" size="small" label="Add Service" />
                    </div>

                    <Dialog v-model:visible="serviceVisible" modal header="Add Service" :style="{ width: '40rem' }">
                        <div class="flex flex-col gap-4 mb-4">
                            <div class="flex flex-col">
                                <label for="name" class="font-semibold">Service Name</label>
                                <InputText id="name" v-model="serviceForm.name" />
                            </div>
                            <div class="flex flex-col">
                                <label for="fee" class="font-semibold">Service Fee</label>
                                <InputNumber id="fee" mode="currency" currency="PHP" v-model="serviceForm.fee" />
                            </div>
                            <div class="flex flex-col">
                                <label for="description" class="font-semibold">Description</label>
                                <Textarea id="description" v-model="serviceForm.description" />
                            </div>
                            <div class="flex flex-col">
                                <label for="icon" class="font-semibold">Icon</label>
                                <FileUpload name="icon" accept="image/*" customUpload @select="onFileSelect" />
                            </div>
                        </div>
                        <div class="flex justify-end gap-2">
                            <Button label="Cancel" severity="secondary" @click="serviceVisible = false" />
                            <Button label="Save" :loading="savingLoading" :disabled="savingLoading" @click="saveService" />
                        </div>
                    </Dialog>

                    <div class="grid grid-cols-1">
                        <DataTable :value="services" size="small" scrollable scrollHeight="1000px" stripedRows tableStyle="min-width: 50rem" paginator :rows="5">
                            <Column field="name" header="Service Name" sortable></Column>
                            <Column field="fee" header="Service Fee" sortable></Column>
                            <Column field="description" header="Description" sortable></Column>
                            <Column header="Action" bodyStyle="text-align: center;">
                                <template #body="slotProps">
                                    <Button icon="pi pi-trash" severity="danger" @click="confirmDeleteService(slotProps.data)" />
                                </template>
                            </Column>
                        </DataTable>
                    </div>

                    <Dialog v-model:visible="deleteServiceDialogVisible" modal header="Confirm Delete" :style="{ width: '30vw' }">
                        <span>Are you sure you want to delete this service?</span>
                        <div class="flex justify-end gap-2">
                            <Button type="button" label="Cancel" severity="secondary" @click="deleteServiceDialogVisible = false" />
                            <Button type="button" label="Delete" severity="danger" @click="deleteService" />
                        </div>
                    </Dialog>
                </div>
            </div>

            <ToastComponent ref="toastComponent" />
        </div>
    </div>
</template>
