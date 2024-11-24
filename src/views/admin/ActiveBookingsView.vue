<script setup>
import { ref, onMounted, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useAdminStore } from '../../stores/admin.store'; 
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Tag from 'primevue/tag';
import { getSeverity, formatDate, formatCurrency } from '../../services/helper';

const toast = useToast();
const adminStore = useAdminStore();

onMounted(() => {
  adminStore.fetchActiveBookings();
});

const bookings = computed(() => adminStore.activeBookings);
const loading = computed(() => adminStore.loading);

const filters = ref({
  global: { value: null, matchMode: 'contains' },
  user: { value: null, matchMode: 'startsWith' },
  status: { value: null, matchMode: 'equals' },
  booking_date: { value: null, matchMode: 'equals' },
});

const expandedRows = ref({});

const expandAll = () => {
  expandedRows.value = bookings.value.reduce((acc, b) => (acc[b.id] = true) && acc, {});
};
const collapseAll = () => {
  expandedRows.value = null;
};

const onRowExpand = (event) => {
  toast.add({ severity: 'info', summary: 'Booking Expanded', detail: `Booking ID: ${event.data.id}`, life: 3000 });
};
const onRowCollapse = (event) => {
  toast.add({ severity: 'success', summary: 'Booking Collapsed', detail: `Booking ID: ${event.data.id}`, life: 3000 });
};

</script>

<template>
    <div class="card">
        <div class="grid grid-cols-1">
      <DataTable
        v-model:expandedRows="expandedRows"
        :value="bookings"
        dataKey="id"
        v-model:filters="filters"
        paginator
        :rows="10"
        :loading="loading"
        tableStyle="min-width: 80rem"
        filterDisplay="row"
        :globalFilterFields="['user.email', 'technician.full_name', 'status', 'booking_date']"
        @rowExpand="onRowExpand"
        @rowCollapse="onRowCollapse"
      >
        <template #header>
          <div class="flex justify-between gap-4">
            <div>
              <Button text icon="pi pi-plus" label="Expand All" @click="expandAll" />
              <Button text icon="pi pi-minus" label="Collapse All" @click="collapseAll" />
            </div>
            <div>
              <InputText
                v-model="filters['global'].value"
                placeholder="Keyword Search"
                class="p-input-icon-right"
              >
                <i class="pi pi-search" />
              </InputText>
            </div>
          </div>
        </template>
  
        <!-- Columns -->
        <Column expander style="width: 3rem" />
        <Column field="id" header="ID" style="width: 4rem;" />
        <Column field="user.email" header="User" style="width: 15rem;" filter />
        <Column field="technician.full_name" header="Technician" style="width: 10rem;" />
        <Column header="Date" style="width: 12rem;">
          <template #body="slotProps">
            {{ formatDate(slotProps.data.booking_date) }}
          </template>
        </Column>
        <Column header="Status" style="width: 13rem;">
          <template #body="slotProps">
            <Tag :value="slotProps.data.status" :severity="getSeverity(slotProps.data.status)" class="uppercase" />
          </template>
        </Column>
        <Column header="Fee / Payment" style="width: 12rem;">
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
  
        <!-- Expanded Content -->
        <template #expansion="slotProps">
          <div class="p-4">
            <h5>Details for Booking ID: {{ slotProps.data.id }}</h5>
            <ul>
              <li><strong>Additional Info:</strong> {{ slotProps.data.additional_info }}</li>
              <li>
                <strong>Vehicle:</strong> {{ slotProps.data.vehicle_detail.make }}
                {{ slotProps.data.vehicle_detail.model }}
              </li>
              <li>
                <strong>Services:</strong>
                <ul>
                  <li v-for="service in slotProps.data.services" :key="service.id">
                    {{ service.name }} ({{ formatCurrency(service.pivot.service_fee) }})
                  </li>
                  </ul>
              </li>
              <li>
                <strong>Attachments:</strong>
                <ul>
                  <li v-for="attachment in slotProps.data.attachments" :key="attachment.id">
                    <img
                      :src="attachment.image"
                      alt="Attachment Image"
                      style="width: 50px; height: auto;"
                    />
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </template>
      </DataTable>
      </div>
    </div>
  </template>
  
