<template>
  <div class="w-[90vw] h-[calc(100vh-4.5rem)] pt-5 mx-auto">
    <div>
      <div class="card border-0 shadow-sm rounded-lg h-[80vh]">
        <h3 class="mb-4 text-2xl font-semibold">MANAGE PAYMENTS</h3>
        <DataTable :value="bookings" scrollable scrollHeight="420px" stripedRows tableStyle="min-width: 50rem" paginator :rows="7">
          <Column header="Technician" field="technician.full_name">
            <template #body="slotProps">
              <div class="flex items-center gap-2">
                <Avatar :image="slotProps.data.technician.profile_image ? getImageUrl(slotProps.data.technician.profile_image) : defaultAvatar" shape="circle" />
                {{ slotProps.data.technician.full_name }}
              </div>
            </template>
          </Column>
          <Column header="Booking Date" field="booking_date" sortable>
            <template #body="slotProps">
              {{ formatDate(slotProps.data.booking_date) }}
            </template>
          </Column>
          <Column header="Service Fee" field="total_fee" sortable>
            <template #body="slotProps">
              ₱{{ Number(slotProps.data.total_fee).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
            </template>
          </Column>
          <Column header="Payment Status" sortable>
            <template #body="slotProps">
              <Tag :severity="getSeverity(slotProps.data.payments[0]?.status)" :value="slotProps.data.payments[0]?.status" class="uppercase"/>
            </template>
          </Column>
          <Column header="Action">
            <template #body="slotProps">
              <div v-if="slotProps.data.payments[0]?.status !== 'Paid'">
                <Button label="Proceed to Pay" size="small" icon="pi pi-credit-card" severity="primary" @click="handlePayment(slotProps.data)" />
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>

    <Dialog header="Select Payment Method" v-model:visible="showPaymentDialog" modal @hide="closeDialog">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        <div
          class="border border-gray-300 rounded-lg text-center p-4 cursor-pointer transform transition-transform hover:scale-105"
          @click="proceedToPayment('card')"
        >
          <img src="../../assets/gcash.svg" alt="GCash" class="w-24 h-24 mx-auto mb-4" />
          <h4 class="text-lg font-semibold">Credit/Debit Card</h4>
        </div>
        <div
          class="border border-gray-300 rounded-lg text-center p-4 cursor-pointer transform transition-transform hover:scale-105"
          @click="proceedToPayment('gcash')"
        >
          <img src="../../assets/credit-card.svg" alt="Credit or Debit Card" class="w-24 h-24 mx-auto mb-4" />
          <h4 class="text-lg font-semibold">GCash</h4>
        </div>
        <div
          class="border border-gray-300 rounded-lg text-center p-4 cursor-pointer transform transition-transform hover:scale-105"
          @click="proceedToPayment('pay_at_store')"
        >
          <img src="../../assets/in-store_payment.svg" alt="Pay at Store" class="w-24 h-24 mx-auto mb-4" />
          <h4 class="text-lg font-semibold">Pay at Store</h4>
        </div>
      </div>
    </Dialog>

    <ToastComponent ref="toastComponent" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Avatar from 'primevue/avatar';
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import { useBookingStore } from '../../stores/booking.store';
import { usePaymentStore } from '../../stores/payment.store';
import ToastComponent from '../../components/ToastComponent.vue';
import dayjs from '../../services/dayjs';
import axios from '../../services/axios';

const bookingStore = useBookingStore();
const paymentStore = usePaymentStore();
const router = useRouter();
const bookings = ref([]);
const defaultAvatar = 'https://via.placeholder.com/40';
const showPaymentDialog = ref(false);
const selectedBooking = ref(null);
const toastComponent = ref(null);

onMounted(async () => {
  await bookingStore.fetchUserBookings();
  bookings.value = bookingStore.bookings;
});

const formatDate = (date) => dayjs(date).format('MMMM D, YYYY');

const getSeverity = (status) => {
  switch (status) {
    case 'Not Paid': return 'contrast';
    case 'Paid': return 'success';
    default: return 'info';
  }
};

const handlePayment = (booking) => {
  selectedBooking.value = booking;
  showPaymentDialog.value = true;
};

const closeDialog = () => {
  showPaymentDialog.value = false;
};

const proceedToPayment = async (method) => {
  closeDialog();

  try {
    await paymentStore.createPaymentIntent({
      amount: selectedBooking.value.total_fee,
      currency: 'PHP',
      paymentMethodType: method,
      bookingId: selectedBooking.value.id,
    });

    if (paymentStore.paymentIntentId) {
      router.push({
        name: 'Payment',
        query: { 
          method, 
          bookingId: selectedBooking.value.id, 
          paymentIntentId: paymentStore.paymentIntentId 
        },
      });
    }
  } catch (error) {
    toastComponent.value.showToast('error', 'Payment Error', error.message || 'Failed to process your payment.');
    console.error('Failed to create PaymentIntent:', error);
  }
};


const getImageUrl = (imagePath) => `${axios.defaults.baseURL}/storage/${imagePath}`;
</script>
