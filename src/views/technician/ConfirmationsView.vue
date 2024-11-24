<template>
  <div class="w-full">
    <div class="max-w-7xl mx-auto">
      <h3 class="mb-4 text-2xl font-semibold">Booking Confirmations</h3>
      <div class="card border-0 shadow-sm rounded-lg">
        <div class="grid grid-cols-1 gap-4">
          <DataTable 
            :value="bookings" 
            scrollable 
            scrollHeight="1000px" 
            stripedRows 
            tableStyle="min-width: 50rem" 
            paginator 
            :rows="5"
          >
            <Column header="Client Name" sortable>
              <template #body="slotProps">
                <div class="flex items-center gap-2">
                  <Avatar 
                    :label="slotProps.data.user_profile.full_name.charAt(0)" 
                    class="mr-2" 
                    shape="circle" 
                  />
                  {{ slotProps.data.user_profile.full_name }}
                </div>
              </template>
            </Column>

            <Column header="Email">
              <template #body="slotProps">
                {{ slotProps.data.user_profile.user.email }}
              </template>
            </Column>

            <Column field="vehicle_detail" header="Vehicle">
              <template #body="slotProps">
                {{ slotProps.data.vehicle_detail.make }} {{ slotProps.data.vehicle_detail.model }}
              </template>
            </Column>

            <Column field="booking_date" header="Booking Date" sortable>
              <template #body="slotProps">
                {{ formatDate(slotProps.data.booking_date) }}
              </template>
            </Column>

            <Column bodyStyle="text-align: center;">
              <template #body="slotProps">
                <Tag
                  :severity="getSeverity(slotProps.data.status)"
                  :value="slotProps.data.status"
                  class="uppercase"
                />
              </template>
            </Column>

            <Column bodyStyle="text-align: center;">
              <template #body="slotProps">
                <Button
                  icon="pi pi-search"
                  class="p-button-rounded p-button-secondary"
                  aria-label="Show more details"
                  @click="displayServices($event, slotProps.data.services)"
                />
              </template>
            </Column>

            <Column header="Action" bodyStyle="text-align: center;">
              <template #body="slotProps">
                <div v-if="isActionable(slotProps.data.status)" class="flex gap-2">
                  <Button
                    icon="pi pi-check"
                    severity="success"
                    @click="handleApproval(slotProps.data)"
                  />
                  <Button
                    icon="pi pi-times"
                    severity="danger"
                    outlined
                    @click="handleDecline(slotProps.data)"
                  />
                </div>
              </template>
            </Column>
          </DataTable>

          <ToastComponent ref="toastComponent" />

          <Popover ref="popoverRef">
            <ul class="list-none p-0 m-0">
              <li 
                v-for="(service, index) in additionalServices" 
                :key="index"
                class="py-1"
              >
                <Tag :value="`${service.name} (${service.fee})`" :severity="'info'" />
              </li>
            </ul>
          </Popover>

          <Dialog
            v-model:visible="showDialog"
            header="Decline Request"
            modal
            :closable="false"
            :style="{ width: '400px' }"
          >
            <p>Are you sure you want to decline this booking request?</p>
            <div class="flex justify-end gap-2 mt-4">
              <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="cancelDecline" />
              <Button label="Confirm" icon="pi pi-check" class="p-button-danger" @click="confirmDecline" />
            </div>
          </Dialog>

          <Dialog
            v-model:visible="showDialogWithReason"
            header="Decline Request"
            modal
            :closable="false"
            :style="{ width: '400px' }"
          >
            <p>Are you sure you want to decline this request?</p>
            <TextArea
              v-model="declineReason"
              rows="3"
              placeholder="State your reason for declining..."
              class="w-full mt-3"
            ></TextArea>
            <div class="flex justify-end gap-2 mt-4">
              <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="cancelDecline" />
              <Button label="Confirm" icon="pi pi-check" class="p-button-danger" @click="confirmDecline" />
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import Avatar from 'primevue/avatar';
import Popover from 'primevue/popover';
import Dialog from 'primevue/dialog';
import TextArea from 'primevue/textarea';
import { useScheduleStore } from '../../stores/schedule.store';
import dayjs from '../../services/dayjs';
import ToastComponent from '../../components/ToastComponent.vue';

const scheduleStore = useScheduleStore();
const bookings = ref([]);
const toastComponent = ref(null);
const popoverRef = ref(null);
const additionalServices = ref([]);
const showDialog = ref(false);
const showDialogWithReason = ref(false);
const declineReason = ref('');
const bookingToDecline = ref(null);

const displayServices = (event, services) => {
  additionalServices.value = services;
  popoverRef.value.toggle(event);
};

const formatDate = (date) => {
  return dayjs(date).format('MMMM D, YYYY');
};

onMounted(async () => {
  await scheduleStore.fetchBookings();
  bookings.value = scheduleStore.bookings;
});

const getSeverity = (status) => {
  switch (status) {
    case 'Pending': return 'info';
    case 'Approved': return 'success';
    case 'Assigned': return 'help';
    case 'In Progress': return 'secondary';
    case 'Completed': return 'success';
    case 'Rescheduled': return 'warn';
    case 'Cancelled': return 'danger';
    case 'Declined': return 'secondary';
    case 'No Show': return 'danger';
    case 'Cancellation Requested': return 'help';
    case 'Reschedule Requested': return 'help';
    default: return 'info';
  }
};

const isActionable = (status) => {
  return status === 'Pending' || status === 'Cancellation Requested' || status === 'Reschedule Requested';
};

const handleApproval = async (booking) => {
  let response;
  if (booking.status === 'Pending') {
    response = await scheduleStore.approveBooking(booking.id);
  } else if (booking.status === 'Cancellation Requested') {
    response = await scheduleStore.approveCancelRequest(booking.id);
  } else if (booking.status === 'Reschedule Requested') {
    response = await scheduleStore.approveRescheduleRequest(booking.id);
  }
  
  if (response.success) {
    updateBookingStatus(booking.id, booking.status === 'Reschedule Requested' ? 'Rescheduled' : 'Approved');
    toastComponent.value.showToast('success', 'Action Successful', response.message);
  } else {
    toastComponent.value.showToast('error', 'Error', response.message);
  }
};

const handleDecline = (booking) => {
  bookingToDecline.value = booking;
  if (booking.status === 'Pending') {
    showDialog.value = true;
  } else {
    showDialogWithReason.value = true;
  }
};

const confirmDecline = async () => {
  if (!bookingToDecline.value) return;

  let response;
  if (bookingToDecline.value.status === 'Cancellation Requested') {
    response = await scheduleStore.declineCancelRequest(bookingToDecline.value.id, declineReason.value);
  } else if (bookingToDecline.value.status === 'Reschedule Requested') {
    response = await scheduleStore.declineRescheduleRequest(bookingToDecline.value.id, declineReason.value);
  } else {
    response = await scheduleStore.declineBooking(bookingToDecline.value.id);
  }

  if (response.success) {
    updateBookingStatus(bookingToDecline.value.id, 'Approved');
    toastComponent.value.showToast('info', 'Action Successful', response.message);
  } else {
    toastComponent.value.showToast('error', 'Error', response.message);
  }

  resetDeclineDialog();
};

const cancelDecline = () => {
  resetDeclineDialog();
};

const resetDeclineDialog = () => {
  showDialog.value = false;
  showDialogWithReason.value = false;
  declineReason.value = '';
  bookingToDecline.value = null;
};

const updateBookingStatus = (bookingId, newStatus) => {
  const bookingIndex = bookings.value.findIndex((b) => b.id === bookingId);
  if (bookingIndex !== -1) {
    bookings.value[bookingIndex].status = newStatus;
  }
};
</script>
