<script setup>
import { ref, onMounted } from 'vue';
import axios from '../../../services/axios';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import ToastComponent from '../../../components/ToastComponent.vue'; 
import InputText from 'primevue/inputtext';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import UsersTableSkeleton from '../../../components/admin/users/UsersTableSkeleton.vue';
import { FilterMatchMode } from '@primevue/core/api';

const users = ref([]);
const expandedRows = ref({});
const toastComponent = ref(null);
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    'profile.full_name': { value: null, matchMode: FilterMatchMode.CONTAINS },
    email: { value: null, matchMode: FilterMatchMode.CONTAINS },
    is_active: { value: null, matchMode: FilterMatchMode.EQUALS },
});
const loading = ref(true);

onMounted(() => {
    fetchUsers();
});

const fetchUsers = async () => {
    try {
        const response = await axios.get('/api/admin/v1/users');
        if (response.data.success) {
            users.value = response.data.data;
        }
        loading.value = false;
    } catch (error) {
        console.error('Failed to fetch user data:', error);
        loading.value = false;
    }
};

const onRowExpand = (event) => {
    if (toastComponent.value) {
        toastComponent.value.showToast('info', 'User Expanded', `Profile expanded for ${event.data.profile.full_name ?? 'N/A'}`);
    }
};

const onRowCollapse = (event) => {
    if (toastComponent.value) {
        toastComponent.value.showToast('success', 'User Collapsed', `Profile collapsed for ${event.data.profile.full_name ?? 'N/A'}`);
    }
};

const expandAll = () => {
    expandedRows.value = users.value.reduce((acc, user) => (acc[user.id] = true) && acc, {});
};

const collapseAll = () => {
    expandedRows.value = null;
};
</script>

<template>
    <UsersTableSkeleton v-if="loading" />
    <div v-else>
        <h3 class="mb-4 text-xl font-semibold">Manage Users</h3>
        <div class="card">
            <div class="grid grid-cols-1">
                <DataTable v-model:expandedRows="expandedRows" :value="users" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20]" dataKey="id"
                        @rowExpand="onRowExpand" @rowCollapse="onRowCollapse" :filters="filters"
                        tableStyle="min-width: 60rem" :globalFilterFields="['profile.full_name', 'email', 'is_active']">
                    <template #header>
                        <div class="flex flex-wrap justify-between items-center">
                            <div class="flex flex-wrap sm:justify-start xs:justify-normal justify-between">
                                <h3 class="lg:mb-0 mb-2 text-semibold">Users Data</h3>
                            </div>
                            <div class="flex flex-wrap justify-end sm:justify-center xs:justify-normal gap-2">
                                <IconField>
                                    <InputIcon>
                                        <i class="pi pi-search" />
                                    </InputIcon>
                                    <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                                </IconField>
                                <Button text size="small" class="xs:!hidden" icon="pi pi-plus" label="Expand All" @click="expandAll" />
                                <Button text size="small" class="xs:!hidden" icon="pi pi-minus" label="Collapse All" @click="collapseAll" />
                            </div>
                        </div>
                    </template>

                    <Column expander style="width: 5rem" />
                    <Column field="profile.full_name" header="Full Name" sortable filterField="profile.full_name">
                        <template #body="slotProps">
                            {{ slotProps.data.profile?.full_name ?? 'N/A' }}
                            <i :class="{
                                'pi pi-check-circle text-blue-500 ml-2': slotProps.data.is_verified,
                                'pi pi-check-circle text-gray-500 ml-2': !slotProps.data.is_verified
                            }"></i>
                        </template>
                    </Column>
                    <Column field="email" header="Email" sortable filterField="email" />
                    <Column header="Phone Number">
                        <template #body="slotProps">
                            {{ slotProps.data.profile?.phone_number ?? 'N/A' }}
                        </template>
                    </Column>
                    
                    <template #expansion="slotProps">
                        <div class="p-4">
                            <h5>Profile Details for {{ slotProps.data.profile?.full_name ?? 'N/A' }}</h5>
                            <DataTable :value="[slotProps.data.profile]" style="min-width: 30rem">
                                <Column header="Address">
                                    <template #body="slotProps">
                                        {{ slotProps.data?.address ?? 'N/A' }}
                                    </template>
                                </Column>
                                <Column header="City">
                                    <template #body="slotProps">
                                        {{ slotProps.data?.city ?? 'N/A' }}
                                    </template>
                                </Column>
                                <Column header="State">
                                    <template #body="slotProps">
                                        {{ slotProps.data?.state ?? 'N/A' }}
                                    </template>
                                </Column>
                                <Column header="Country">
                                    <template #body="slotProps">
                                        {{ slotProps.data?.country ?? 'N/A' }}
                                    </template>
                                </Column>
                                <Column header="Zip Code">
                                    <template #body="slotProps">
                                        {{ slotProps.data?.zip_code ?? 'N/A' }}
                                    </template>
                                </Column>
                                <Column header="Profile Image">
                                    <template #body="slotProps">
                                        <img v-if="slotProps.data?.profile_image" :src="slotProps.data.profile_image" class="shadow-lg" width="64" />
                                        <span v-else>N/A</span>
                                    </template>
                                </Column>
                                <Column header="Date of Birth">
                                    <template #body="slotProps">
                                        {{ slotProps.data?.date_of_birth ? new Date(slotProps.data.date_of_birth).toLocaleDateString() : 'N/A' }}
                                    </template>
                                </Column>
                            </DataTable>
                        </div>
                    </template>
                </DataTable>
                <ToastComponent ref="toastComponent" />
            </div>
        </div>
    </div>
</template>
