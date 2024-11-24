<script setup>
import { ref, onMounted } from 'vue';
import { useBookingStore } from '../../stores/booking.store';
import { useAuthStore } from '../../stores/auth.store';
import DataView from 'primevue/dataview';
import SelectButton from 'primevue/selectbutton';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Dialog from 'primevue/dialog';
import Datepicker from 'primevue/datepicker';
import Select from 'primevue/select';
import Textarea from 'primevue/textarea';
import ToastComponent from '../../components/ToastComponent.vue';
import dayjs from '../../services/dayjs';

const layout = ref('grid');
const options = ['grid', 'list'];
const bookings = ref([]);
const loading = ref(false);
const selectedBookingId = ref(null);
const toastComponent = ref(null);
const isCancelDialogVisible = ref(false);
const isRescheduleDialogVisible = ref(false);
const rescheduleDate = ref(null);

const justificationText = ref('');

const auth = useAuthStore();
const profile_id = ref(auth.profile_id);

const bookingStore = useBookingStore();

const getSeverity = (item) => {
  switch (item.status) {
    case 'Pending': return 'info';
    case 'Approved': return 'success';
    case 'In Progress': return 'secondary';
    case 'Completed': return 'success';
    case 'Cancelled': return 'danger';
    case 'Declined': return 'secondary';
    case 'Rescheduled': return 'warn';
    case 'No Show': return 'danger';
    case 'Cancellation Requested': return 'warn';
    case 'Reschedule Requested': return 'warn';
    default: return 'info';
  }
};

const calculateAverageRating = (ratings) => {
  if (!ratings || ratings.length === 0) return 0;
  const total = ratings.reduce((acc, rating) => acc + rating.rating, 0);
  return total / ratings.length;
};

const showCancelDialog = (bookingId) => {
  selectedBookingId.value = bookingId;
  isCancelDialogVisible.value = true;
};

const showRescheduleDialog = (bookingId) => {
  selectedBookingId.value = bookingId;
  isRescheduleDialogVisible.value = true;
  rescheduleDate.value = null;
  justificationText.value = '';
};

const formatBookingDate = (date) => {
  return dayjs(date).format('MMMM D, YYYY');
};

const confirmCancelBooking = async () => {
  if (selectedBookingId.value) {
    const response = await bookingStore.requestCancelBooking(selectedBookingId.value);

    if (response.success) {
      toastComponent.value.showToast('success', 'Cancellation Requested', response.message);
    } else {
      toastComponent.value.showToast('error', 'Error', response.message);
    }

    isCancelDialogVisible.value = false;
    selectedBookingId.value = null;
  }
};

const confirmRescheduleBooking = async () => {
  if (selectedBookingId.value && rescheduleDate.value) {
    const formattedDate = dayjs(rescheduleDate.value).format('YYYY-MM-DD HH:mm:ss');

    const response = await bookingStore.requestReschedule(
      selectedBookingId.value,
      formattedDate,
      justificationText.value
    );

    if (response.success) {
      toastComponent.value.showToast('success', 'Reschedule Requested', response.message);
    } else {
      toastComponent.value.showToast('error', 'Error', response.message);
    }

    isRescheduleDialogVisible.value = false;
    selectedBookingId.value = null;
  }
};

onMounted(async () => {
  loading.value = true;

  try {
    const response = await bookingStore.fetchUserBookings();
    if (response.success) {
      bookings.value = bookingStore.bookings.map((booking) => ({
        ...booking,
        averageRating: calculateAverageRating(booking.technician?.ratings || [])
      }));
    }
  } catch (error) {
    console.error('Error fetching bookings:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="h-auto px-5 pt-5 pb-6">
    <div v-if="loading" class="flex items-center justify-center w-full h-[90vh]">
      <div class="loader"></div>
    </div>

    <div v-else-if="bookings.length === 0" class="mx-auto min-h-screen flex items-center justify-center">
      <div class="flex flex-col justify-center items-center text-center">
        <img src="/calendar-person.svg" alt="Calendar person" width="250" class="mb-4" />

        <h2 class="lg:text-2xl text-lg font-semibold mb-4">
          It’s quiet here... almost like a <em class="text-rose-500">whoosh</em> of wind.
        </h2>
        <h3 class="lg:text-base text-sm text-gray-700 mb-6">
          Ready to book a service? Start by creating a booking and we'll guide you through the process.
        </h3>

        <router-link to="/technicians">
          <Button label="Create a Booking" icon="pi pi-calendar-plus" rounded />
        </router-link>
      </div>
    </div>
    <div v-else class="mx-auto justify-center items-center">
      <div class="card shadow">
        <DataView :value="bookings" :layout="layout" paginator :rows="6">
          <template #header>
            <div class="flex justify-between">
              <h1 class="font-semibold text-2xl">BOOKINGS</h1>
              <div>
                <SelectButton v-model="layout" :options="options" :allowEmpty="false">
                  <template #option="{ option }">
                    <i :class="[option === 'list' ? 'pi pi-bars' : 'pi pi-table']" />
                  </template>
                </SelectButton>
              </div>
            </div>
          </template>

          <template #list="slotProps">
            <div class="flex flex-col">
              <div
                v-for="(item, index) in slotProps.items"
                :key="index"
                class="flex flex-col sm:flex-row sm:items-center p-6 gap-4"
                :class="{ 'border-t border-surface-200 dark:border-surface-700': index !== 0 }"
              >
                <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6">
                  <div class="flex flex-row md:flex-col justify-between items-start gap-2">
                    <div>
                      <span class="font-medium text-lg text-surface-500 dark:text-surface-400">
                        {{ formatBookingDate(item.booking_date) }}
                      </span>
                      <div class="text-2xl font-bold mt-1">
                        {{ item.technician ? item.technician.full_name : 'N/A' }}
                      </div>
                      <Tag :value="item.status" :severity="getSeverity(item)" class="mt-2 uppercase"></Tag>
                    </div>
                  </div>
                  <div class="flex flex-col gap-6">
                    <div class="flex justify-end items-end">
                      <div class="mt-2">
                        <span class="flex text-yellow-500">
                          <i
                            v-for="star in Math.floor(item.averageRating)"
                            :key="star"
                            class="mx-0.5 pi pi-star-fill"
                          ></i>
                          <i
                            v-for="star in 5 - Math.floor(item.averageRating)"
                            :key="`empty-${star}`"
                            class="mx-0.5 pi pi-star"
                          ></i>
                        </span>
                      </div>
                    </div>
                    <div class="flex gap-4">
                      <Button
                        icon="pi pi-info-circle"
                        class="w-4"
                        outlined
                        @click="$router.push({ name: 'BookingDetails', params: { id: item.id } })"
                      />
                      <Button
                        icon="pi pi-calendar-minus"
                        label="Cancel Booking"
                        class="whitespace-nowrap"
                        severity="secondary"
                        @click="showCancelDialog(item.id)"
                      ></Button>
                      <Button
                        icon="pi pi-calendar-clock"
                        label="Request Reschedule"
                        class="whitespace-nowrap"
                        @click="showRescheduleDialog(item.id)"
                      ></Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <template #grid="slotProps">
            <div class="grid grid-cols-12 gap-4">
              <div
                v-for="(item, index) in slotProps.items"
                :key="index"
                class="col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-6 p-2"
              >
                <div class="p-6 border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 rounded flex flex-col">
                  <div class="pt-6">
                    <div class="flex flex-row justify-between items-center gap-2">
                      <span class="font-medium text-lg text-surface-500 dark:text-surface-400">
                        {{ formatBookingDate(item.booking_date) }}
                      </span>
                      <Tag :value="item.status" :severity="getSeverity(item)" class="uppercase" />
                    </div>
                    <div class="text-2xl font-bold mt-1">
                      {{ item.technician ? item.technician.full_name : 'N/A' }}
                    </div>
                    <div class="mt-2">
                      <span class="flex text-yellow-500">
                        <i
                          v-for="star in Math.floor(item.averageRating)"
                          :key="star"
                          class="mx-0.5 pi pi-star-fill"
                        ></i>
                        <i
                          v-for="star in 5 - Math.floor(item.averageRating)"
                          :key="`empty-${star}`"
                          class="mx-0.5 pi pi-star"
                        ></i>
                      </span>
                    </div>
                  </div>
                  <div class="flex flex-row gap-4 mt-4">
                    <Button
                      icon="pi pi-info-circle"
                      class="w-4"
                      outlined
                      @click="$router.push({ name: 'BookingDetails', params: { id: item.id } })"
                    />
                    <Button
                      icon="pi pi-calendar-minus"
                      label="Cancel Booking"
                      class="whitespace-nowrap"
                      severity="secondary"
                      @click="showCancelDialog(item.id)"
                    ></Button>
                    <Button
                      icon="pi pi-calendar-clock"
                      label="Request Reschedule"
                      class="whitespace-nowrap"
                      @click="showRescheduleDialog(item.id)"
                    ></Button>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </DataView>
      </div>
    </div>
    <ToastComponent ref="toastComponent" />
  </div>

  <Dialog v-model:visible="isCancelDialogVisible" header="Confirm Cancellation" :modal="true" :closable="false" class="lg:w-[30rem] md:w-[30rem] sm:w-[30rem]">
    <div class="text-center">
      <p>Are you sure you want to cancel this booking?</p>
      <div class="flex justify-end mt-4">
        <Button label="No" icon="pi pi-times" severity="secondary" class="mr-2" @click="isCancelDialogVisible = false" />
        <Button label="Yes" icon="pi pi-check" severity="danger" @click="confirmCancelBooking" />
      </div>
    </div>
  </Dialog>

  <Dialog v-model:visible="isRescheduleDialogVisible" header="Request Reschedule" :modal="true" :closable="false" class="lg:w-[40vw] md:w-[70vw] sm:w-[90vw] xs:w-[90vw]">
    <div>
      <div class="flex flex-col mb-4">
        <label for="rescheduleDate" class="mb-2">Select New Date</label>
        <Datepicker v-model="rescheduleDate" inline id="rescheduleDate" :minDate="new Date()" showIcon />
      </div>
      <div class="flex flex-col mb-4">
        <label for="justificationText" class="mb-2">Justification</label>
        <Textarea v-model="justificationText" id="justificationText" rows="3" autoResize placeholder="Add justification for rescheduling" />
      </div>
      <div class="flex justify-end mt-4">
        <Button label="Cancel" icon="pi pi-times" severity="secondary" class="mr-2" @click="isRescheduleDialogVisible = false" />
        <Button label="Submit" icon="pi pi-check" severity="primary" @click="confirmRescheduleBooking" :disabled="!rescheduleDate" />
      </div>
    </div>
  </Dialog>
</template>

<style scoped>
</style>
