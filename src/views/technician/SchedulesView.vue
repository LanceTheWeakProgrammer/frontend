<template>
  <div class="w-full">
    <Message 
      v-if="!checked" 
      severity="warn" 
      class="mb-4 p-3"
      icon="pi pi-exclamation-triangle"
      size="large"
      closable
    >
    Your availability is currently set to unavailable. Customers will not be able to see or book your services until you mark yourself as available, or until you complete one of your assignments.
    </Message>
    <ScheduleSkeleton v-if="loading" />
    <div v-else>
      <div class="mx-auto flex flex-col lg:flex-row gap-3">
        <div class="w-full lg:w-1/4 flex flex-col">
          <div class="card shadow w-full border p-4">
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-semibold text-gray-800">Availability</h2>
              <ToggleSwitch v-model="checked" @change="toggleAvailability">
                <template #handle="{ checked }">
                  <i :class="['!text-xs pi', { 'pi-check': checked, 'pi-times': !checked }]" />
                </template>
              </ToggleSwitch>
            </div>
          </div>

          <div class="card shadow w-full border p-4">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Assignments</h2>
            <div class="overflow-y-auto h-[calc(100%-3rem)] hide">
              <Fieldset v-for="booking in scheduleStore.bookings.filter(b => 
                ['Approved', 'In Progress', 'Completed', 'Cancellation Requested', 'Rescheduled'].includes(b.status))" 
                :key="booking.id" 
                :legend="getCustomerName(booking)" 
                :toggleable="true">
                <div class="flex flex-col gap-2">
                  <p><i class="mr-2 pi pi-calendar"></i> {{ formatDate(booking.booking_date) }}</p>
                  <p><i class="mr-2 pi pi-car"></i> {{ booking.vehicle_detail.make }} {{ booking.vehicle_detail.model }}</p>
                  <ul class="list-disc list-inside">
                    <li v-for="service in booking.services" :key="service.id">
                      {{ service.name }}
                    </li>
                  </ul>
                  <div class="flex justify-center">
                    <SelectButton  
                      v-model="booking.status" 
                      :options="statusOptions" 
                      optionValue="value" 
                      dataKey="value" 
                      @change="handleStatusChange(booking.id, booking.status)"
                    >
                      <template #option="slotProps">
                        <div v-tooltip.bottom="`Mark as ${slotProps.option.value}`">
                          <i :class="slotProps.option.icon" class="mx-4"></i>
                        </div>
                      </template>
                    </SelectButton>
                  </div>
                </div>
              </Fieldset>
            </div>
          </div>

          <div class="card shadow w-full border p-4 overflow-y-auto h-auto hide">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Tasks This Week</h2>
            <ul class="list-disc list-inside" v-for="task in tasksThisWeek" :key="task.id">
                {{ formatDate(task.booking_date) }}
                <li v-for="service in task.services" :key="service.id">
                  {{ service.name }}
                </li>
            </ul>
          </div>
        </div>

        <div class="card shadow w-full lg:w-3/4 border p-4">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Calendar</h2>
          <FullCalendar :options="calendarOptions" />
        </div>
      </div>
    </div>
    <Dialog v-model:visible="dialogVisible" :modal="true" :closable="true" class="max-w-lg w-full">
      <div class="p-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-semibold text-gray-800">Booking Details</h2>
          <Tag :severity="dialogData.status === 'Pending' ? 'info' : 'success'" :value="dialogData.status" class="my-3"></Tag>
        </div>
        <div class="flex justify-between items-center mb-4">
          <p class="text-lg text-gray-600 font-semibold">Booking Date</p>
          <div class="flex items-center space-x-2">
            <p class="text-lg font-semibold text-gray-800">{{ formatDate(dialogData.booking_date) }}</p>
          </div>
        </div>
        <div class="flex justify-between mb-4 border-b pb-2">
          <p class="text-lg text-gray-600 font-semibold">Total Fee</p>
          <p class="text-lg font-semibold text-green-600">${{ dialogData.totalFee }}</p>
        </div>
        <div class="mb-4">
          <p class="text-gray-600 font-semibold mb-1">Vehicle</p>
          <p class="text-gray-800">{{ dialogData.vehicle }}</p>
        </div>
        <div class="mb-4">
          <p class="text-gray-600 font-semibold mb-1">Services</p>
          <ul class="list-none">
            <li v-for="service in dialogData.services" :key="service.id" class="flex justify-between text-gray-700 py-1">
              <span>{{ service.name }}</span>
              <span class="text-gray-800">${{ service.fee }}</span>
            </li>
          </ul>
        </div>
        <div class="mb-4">
          <p class="text-gray-600 font-semibold mb-1">Additional Info</p>
          <p class="italic text-gray-700">{{ dialogData.additionalInfo }}</p>
        </div>
        <div class="mb-4">
          <p class="text-gray-600 font-semibold mb-1">Attachments</p>
          <div v-if="dialogData.attachments.length > 0">
            <ul class="flex flex-wrap gap-4">
              <li v-for="attachment in dialogData.attachments" :key="attachment.id" class="overflow-hidden rounded-md shadow-sm w-24 h-24">
                <Image :alt="`Attachment ${attachment.id}`" preview>
                  <template #previewicon>
                      <i class="pi pi-search"></i>
                  </template>
                  <template #image>
                      <img :src="getAttachmentUrl(attachment.image)" :alt="`Dialog Attachment ${attachment.id}`" class="w-full h-full object-cover" />
                  </template>
                  <template #preview="slotProps">
                      <img :src="getAttachmentUrl(attachment.image)" :alt="`Dialog Attachment ${attachment.id}`" class="w-full h-full object-cover" />
                  </template>
              </Image>
              </li>
            </ul>
          </div>
          <p v-else class="text-gray-700 italic">No attachments</p>
        </div>

        <div class="mt-4">
          <p class="text-lg text-gray-600 font-semibold mb-2">Select a New Date</p>
          <DatePicker v-model="selectedDate" inline class="w-full sm:w-[30rem]" />
          <div v-if="selectedDate" class="mt-3 flex justify-end">
            <Button label="Reschedule" icon="pi pi-calendar" @click="showConfirmReschedule" class="p-button-primary" />
          </div>
        </div>
      </div>
    </Dialog>

    <Dialog v-model:visible="confirmDialogVisible" :modal="true" :closable="false" header="Confirm Reschedule">
      <p>Do you want to reschedule this booking to <strong>{{ formatDate(newBookingDate) }}?</strong></p>
      <template #footer>
        <Button label="No" icon="pi pi-times" @click="cancelReschedule" text />
        <Button label="Yes" icon="pi pi-check" @click="confirmReschedule" autoFocus />
      </template>
    </Dialog>

    <ToastComponent ref="toastComponent" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useScheduleStore } from '../../stores/schedule.store';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import Fieldset from 'primevue/fieldset';
import Dialog from 'primevue/dialog';
import Message from 'primevue/message';
import Tag from 'primevue/tag';
import Image from 'primevue/image';
import SelectButton from 'primevue/selectbutton';
import DatePicker from 'primevue/datepicker';
import Button from 'primevue/button';
import ToggleSwitch from 'primevue/toggleswitch';
import ToastComponent from '../../components/ToastComponent.vue';
import { useTechnicianProfileStore } from '../../stores/technician.profile.store';
import ScheduleSkeleton from '../../components/technician/skeletons/ScheduleSkeleton.vue';
import axios from '../../services/axios';
import dayjs from '../../services/dayjs';

const loading = ref(true);
const scheduleStore = useScheduleStore();
const technicianProfileStore = useTechnicianProfileStore();
const dialogVisible = ref(false);
const confirmDialogVisible = ref(false);
const originalBookingDate = ref(null);
const selectedDate = ref(null);
const dialogData = ref({
  totalFee: null,
  vehicle: null,
  services: [],
  additionalInfo: null,
  attachments: []
});
const tasksThisWeek = ref([]);
const draggedBooking = ref(null);
const newBookingDate = ref(null);
const checked = ref(false);
const statusOptions = ref([
  { icon: 'pi pi-clock', value: 'In Progress' },
  { icon: 'pi pi-check', value: 'Completed' },
  { icon: 'pi pi-times', value: 'No Show' }
]);
const toastComponent = ref(null);

const getAttachmentUrl = (path) => `${axios.defaults.baseURL}/storage/${path}`;
const formatDate = (date) => dayjs(date).format('MMMM D, YYYY');

const filterTasksThisWeek = () => {
  const startOfWeek = dayjs().startOf('week');
  const endOfWeek = dayjs().endOf('week');
  tasksThisWeek.value = scheduleStore.bookings.filter(booking =>
    dayjs(booking.booking_date).isBetween(startOfWeek, endOfWeek, null, '[]')
  );
};

const toggleAvailability = async () => {
  const status = checked.value ? 'active' : 'inactive';
  try {
    const technicianId = scheduleStore.bookings[0]?.technician?.id; 
    if (!technicianId) {
      throw new Error('Technician ID not found.');
    }
    const response = await scheduleStore.toggleAvailability(technicianId, status);
    if (response.success) {
      toastComponent.value.showToast('success', 'Availability Updated', response.message);
    } else {
      toastComponent.value.showToast('error', 'Error', response.message);
    }
  } catch (error) {
    toastComponent.value.showToast(
      'error',
      'Error',
      error.message || 'Failed to update availability.'
    );
  }
};

const handleStatusChange = async (bookingId, status) => {
  try {
    let response;
    if (status === 'In Progress') {
      response = await scheduleStore.markAsInProgress(bookingId);
    } else if (status === 'Completed') {
      response = await scheduleStore.markAsCompleted(bookingId);
    } else if (status === 'No Show') {
      response = await scheduleStore.markAsNoShow(bookingId);
    }

    if (response?.success) {
      toastComponent.value.showToast('success', 'Status Updated', `Booking status updated to ${status}.`);
    } else {
      toastComponent.value.showToast('error', 'Error', 'Failed to update booking status.');
    }
  } catch (error) {
    toastComponent.value.showToast('error', 'Error', `Failed to update status: ${error.message}`);
  }
};

const calendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,dayGridWeek,dayGridDay',
  },
  selectable: true,
  editable: true,
  events: [],
  eventDrop: (info) => {
    draggedBooking.value = info.event;
    newBookingDate.value = info.event.start;
    originalBookingDate.value = info.oldEvent.start;
    confirmDialogVisible.value = true;
  },
  eventContent: function(arg) {
    let servicesList = `<ul class="ml-1 list-disc list-inside">`;
    arg.event.extendedProps.services.forEach(service => {
      servicesList += `<li>${service.name}</li>`;
    });
    servicesList += '</ul>';
    return {
      html: `<div class="py-1 pr-11 bg-green-500 border border-green-500 text-white cursor-pointer hover:bg-green-600 hover:border-green-600">
              <strong>${arg.event.title}</strong>
              ${servicesList}
            </div>`
    };
  },
  eventClick: (info) => {
    const { extendedProps } = info.event;
    dialogData.value = {
      totalFee: extendedProps.totalFee,
      vehicle: extendedProps.vehicle,
      services: extendedProps.services,
      additionalInfo: extendedProps.additionalInfo || 'None',
      attachments: extendedProps.attachments || [],
      status: extendedProps.status,
      booking_date: extendedProps.booking_date,
      id: extendedProps.bookingId
    };
    dialogVisible.value = true;
  }
});

const showConfirmReschedule = () => {
  newBookingDate.value = selectedDate.value;
  confirmDialogVisible.value = true;
};

const confirmReschedule = async () => {
  const bookingId = draggedBooking.value ? draggedBooking.value.extendedProps.bookingId : dialogData.value.id;
  const formattedDate = dayjs(newBookingDate.value).format('YYYY-MM-DD');

  try {
    const response = await scheduleStore.rescheduleBooking(bookingId, formattedDate);

    if (response.success) {
      toastComponent.value.showToast('success', 'Rescheduled', 'Booking rescheduled successfully.');
      confirmDialogVisible.value = false;
      updateCalendarEvents(scheduleStore.bookings);
    } else {
      toastComponent.value.showToast('error', 'Error', response.message);
      if (draggedBooking.value) draggedBooking.value.setStart(originalBookingDate.value);
    }
  } catch (error) {
    toastComponent.value.showToast('error', 'Error', 'Failed to reschedule booking.');
    if (draggedBooking.value) draggedBooking.value.setStart(originalBookingDate.value);
  }
};

const cancelReschedule = () => {
  confirmDialogVisible.value = false;
  if (draggedBooking.value) draggedBooking.value.setDates(originalBookingDate.value, originalBookingDate.value);;
};

const updateCalendarEvents = (bookings) => {
  calendarOptions.value.events = bookings.map(booking => ({
    id: booking.id,
    title: getCustomerName(booking),
    start: booking.booking_date,
    extendedProps: {
      bookingId: booking.id,
      totalFee: booking.total_fee,
      vehicle: `${booking.vehicle_detail.make} ${booking.vehicle_detail.model}`,
      additionalInfo: booking.additional_info || 'None',
      status: booking.status,
      services: booking.services,
      attachments: booking.attachments
    }
  }));
};

const getCustomerName = (booking) => booking.user_profile?.full_name || booking.guest?.guest_name || 'N/A';

onMounted(async () => {
  loading.value = true;

  try {
    await scheduleStore.fetchSchedules();
    updateCalendarEvents(scheduleStore.bookings);
    filterTasksThisWeek();

    const technician = scheduleStore.bookings[0]?.technician;
    if (technician) {
      checked.value = technician.avail_status === 1; 
    } else {
      toastComponent.value.showToast('warn', 'Warning', 'Technician data not found.');
    }
  } catch (error) {
    toastComponent.value.showToast('error', 'Error', 'Failed to fetch schedules.');
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.hide::-webkit-scrollbar {
  display: none; 
}
</style>
