<template>
  <!-- Deprecated -->
  <!-- <h2 class="mb-4 text-xl font-semibold">Guest Bookings</h2>
  <div class="card">
    <div class="grid grid-cols-1 gap-4">
      <DataTable 
        v-model:filters="filters" 
        :value="guestBookings" 
        paginator 
        :rows="10" 
        dataKey="id" 
        filterDisplay="menu"
        :globalFilterFields="['guest.guest_name', 'guest.guest_email', 'guest.guest_phone', 'vehicle_details[0].make', 'status', 'technician.full_name']"
      >
        <template #header>
          <div class="flex justify-between">
            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
            <IconField>
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
            </IconField>
          </div>
        </template>

        <template #empty> No guest bookings found. </template>

        <Column field="guest.guest_name" header="Guest Name" sortable style="min-width: 14rem">
          <template #body="{ data }">
            {{ data.guest?.guest_name || 'Unknown' }}
          </template>
          <template #filter="{ filterModel }">
            <InputText v-model="filterModel.value" type="text" placeholder="Search by guest name" />
          </template>
        </Column>

        <Column field="guest.guest_email" header="Guest Email" sortable style="min-width: 14rem">
          <template #body="{ data }">
            {{ data.guest?.guest_email || 'Unknown' }}
          </template>
          <template #filter="{ filterModel }">
            <InputText v-model="filterModel.value" type="text" placeholder="Search by guest email" />
          </template>
        </Column>

        <Column field="technician.full_name" header="Technician Name" sortable style="min-width: 14rem">
          <template #body="{ data }">
            {{ data.technician?.full_name || 'N/A' }}
          </template>
          <template #filter="{ filterModel }">
            <InputText v-model="filterModel.value" type="text" placeholder="Search by technician name" />
          </template>
        </Column>

        <Column field="booking_date" header="Booking Date" sortable style="min-width: 10rem">
          <template #body="{ data }">
            {{ formatDate(data.booking_date) }}
          </template>
          <template #filter="{ filterModel }">
            <DatePicker v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" />
          </template>
        </Column>

        <Column field="status" header="Status" sortable style="min-width: 10rem">
          <template #body="{ data }">
            <Tag :value="data.status" :severity="getSeverity(data.status)" />
          </template>
          <template #filter="{ filterModel }">
            <Select v-model="filterModel.value" :options="statuses" placeholder="Select Status" showClear />
          </template>
        </Column>

        <Column field="total_fee" header="Total Fee" sortable style="min-width: 10rem">
          <template #body="{ data }">
            {{ formatCurrency(data.total_fee) }}
          </template>
          <template #filter="{ filterModel }">
            <InputNumber v-model="filterModel.value" mode="currency" currency="USD" locale="en-US" />
          </template>
        </Column>

        <Column headerStyle="width: 5rem; text-align: center" bodyStyle="text-align: center; overflow: visible">
          <template #body="{ data }">
            <div class="flex justify-between gap-2 items-center">
              <Button 
                v-if="!data.technician_id" 
                type="button" 
                icon="pi pi-user-plus" 
                severity="info"
                rounded 
                @click="openAssignTechnicianModal(data.id)"
                v-tooltip.bottom="{ value: 'Assign Technician', showDelay: 600, hideDelay: 300 }" 
              />
              <Button 
                type="button" 
                icon="pi pi-times" 
                severity="danger"
                rounded 
                outlined
                v-tooltip.bottom="{ value: 'Decline Booking', showDelay: 600, hideDelay: 300 }" 
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>

  <ToastComponent ref="toastComponent" />

  <Dialog :visible.sync="showTechnicianModal" modal header="Assign Technician" style="width: 50vw">
    <DataTable :value="technicians" selectionMode="single" v-model:selection="selectedTechnician" dataKey="id">
      <Column field="full_name" header="Technician Name"></Column>
      <Column field="phone_number" header="Phone Number"></Column>
      <Column field="vehicle_types" header="Vehicle Mastery">
        <template #body="{ data }">
          {{ data.vehicle_types.map(type => type.type).join(', ') }}
        </template>
      </Column>
      <Column field="services" header="Services Available">
        <template #body="{ data }">
          {{ data.services.map(service => service.name).join(', ') }}
        </template>
      </Column>
    </DataTable>

    <template #footer>
      <Button label="Assign" icon="pi pi-check" @click="assignTechnician()" />
      <Button label="Cancel" icon="pi pi-times" @click="showTechnicianModal = false" class="p-button-text" />
    </template>
  </Dialog> -->

</template>

<script setup>
// Deprecated
// import { ref, onMounted } from 'vue';
// import { useAdminStore } from '../../../store/admin.store';
// import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
// import DataTable from 'primevue/datatable';
// import Column from 'primevue/column';
// import Button from 'primevue/button';
// import InputText from 'primevue/inputtext';
// import Select from 'primevue/select';
// import InputNumber from 'primevue/inputnumber';
// import IconField from 'primevue/iconfield';
// import InputIcon from 'primevue/inputicon';
// import DatePicker from 'primevue/datepicker';
// import Tag from 'primevue/tag';
// import Dialog from 'primevue/dialog';
// import ToastComponent from '../../ToastComponent.vue';

// const adminStore = useAdminStore();
// const guestBookings = ref([]);
// const technicians = ref([]);
// const showTechnicianModal = ref(false);
// const toastComponent = ref(null);
// const selectedTechnician = ref(null);
// const selectedBookingId = ref(null);
// const filters = ref({});
// const statuses = ref(['Pending', 'Completed', 'Canceled']);

// onMounted(async () => {
//   await adminStore.fetchGuestBookings();
//   guestBookings.value = adminStore.guestBookings;
// });

// const openAssignTechnicianModal = async (bookingId) => {
//   await adminStore.fetchTechnicians();
//   technicians.value = adminStore.technicians;
//   selectedBookingId.value = bookingId;
//   showTechnicianModal.value = true;
// };

// const assignTechnician = async () => {
//   try {
//     await adminStore.assignTechnicianToGuest(selectedBookingId.value, selectedTechnician.value.id);
//     toastComponent.value.showToast('success', 'Success', 'Technician assigned successfully');
//     showTechnicianModal.value = false;
//     await adminStore.fetchGuestBookings(); 
//   } catch (error) {
//     toastComponent.value.showToast('error', 'Error', error.message);
//   }
// };

// const initFilters = () => {
//   filters.value = {
//     global: { value: null, matchMode: FilterMatchMode.CONTAINS },
//     'guest.guest_name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
//     'guest.guest_email': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
//     'vehicle_details[0].make': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
//     booking_date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
//     total_fee: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
//     status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
//     'technician.full_name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
//   };
// };
// initFilters();

// const formatDate = (value) => {
//   return new Date(value).toLocaleDateString('en-US', {
//     day: '2-digit',
//     month: '2-digit',
//     year: 'numeric'
//   });
// };

// const formatCurrency = (value) => {
//   return value.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' });
// };

// const clearFilter = () => {
//   initFilters();
// };

// const getSeverity = (status) => {
//   switch (status) {
//     case 'Pending':
//       return 'info';
//     case 'Completed':
//       return 'success';
//     case 'Canceled':
//       return 'danger';
//     default:
//       return null;
//   }
// };
</script>
