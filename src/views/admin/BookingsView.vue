<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAdminStore } from '../../stores/admin.store';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Tag from 'primevue/tag';
import { getSeverity, formatDate, formatCurrency } from '../../services/helper';

const dt = ref();
const adminStore = useAdminStore();

onMounted(() => {
  adminStore.fetchRegisteredBookings();
});

const bookings = computed(() => adminStore.registeredBookings);
const loading = computed(() => adminStore.loading);

// Filters
const filters = ref({
  global: { value: null, matchMode: 'contains' },
});

// Export data as CSV
const exportCSV = () => {
    dt.value.exportCSV();
};

</script>

<template>
    <div class="card">
        <div class="grid grid-cols-1">
        <DataTable
          :value="bookings"
          :loading="loading"
          tableStyle="min-width: 80rem"
          paginator
          ref="dt" 
          :rows="10"
          dataKey="id"
          v-model:filters="filters"
          filterDisplay="row"
          :globalFilterFields="['user.email', 'technician.full_name', 'status', 'booking_date']"
          sortable
        >
          <template #header>
            <div class="flex justify-between items-center">
              <div>
                <Button icon="pi pi-external-link" label="Export" size="small" @click="exportCSV" />
              </div>
              <div>
                <InputText
                  v-model="filters['global'].value"
                  placeholder="Search"
                  class="p-input-icon-right"
                >
                  <i class="pi pi-search" />
                </InputText>
              </div>
            </div>
          </template>
  
          <!-- Columns -->
          <Column field="id" header="ID" sortable></Column>
          <Column field="user.email" header="User" sortable></Column>
          <Column field="technician.full_name" header="Technician" sortable></Column>
          <Column field="booking_date" header="Date" sortable>
            <template #body="slotProps">
              {{ formatDate(slotProps.data.booking_date) }}
            </template>
          </Column>
          <Column field="status" header="Status" sortable>
            <template #body="slotProps">
              <Tag :value="slotProps.data.status" :severity="getSeverity(slotProps.data.status)" class="uppercase" />
            </template>
          </Column>
          <Column field="total_fee" header="Fee / Payment" sortable>
            <template #body="slotProps">
              <div class="flex items-center gap-2">
                <span>{{ formatCurrency(slotProps.data.total_fee) }}</span>
                <Tag
                  :value="slotProps.data.payments?.[0]?.status || 'No Payment'"
                  :severity="getSeverity(slotProps.data.payments?.[0]?.status || 'unknown')"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </template>
  
  
