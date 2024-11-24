<template>
  <div class="payment-container grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 bg-gray-50">

    <!-- Booking Summary -->
    <div v-if="bookingDetails" class="flex flex-col">
      
      <!-- Registered User Card -->
      <div class="card shadow p-4 mb-4">
        <h3 class="text-xl font-semibold mb-2">Registered User Details</h3>
        <div class="space-y-2">
          <p><strong>Name:</strong> {{ bookingDetails.user_profile.full_name }}</p>
          <p><strong>Email:</strong> {{ bookingDetails.user_profile.user.email }}</p>
          <p v-if="bookingDetails.user_profile.phone_number">
            <strong>Phone:</strong> {{ bookingDetails.user_profile.phone_number }}
          </p>
        </div>
      </div>

      <!-- Booking Summary Card -->
      <div class="card shadow p-4 mb-4">
        <div class="flex flex-col gap-4 mb-4">
          <h3 class="text-xl font-semibold">Booking Summary</h3>
          <span class="h-line-thick bg-black" />
        </div>
        <div class="space-y-2">
          <p class="text-2xl font-semibold mb-4"> {{ bookingDetails.reference_number }}</p>
        <div class="flex justify-between gap-4">
          <p class="text-lg"> {{ formatDate(bookingDetails.booking_date) }}</p>
          <Tag :value="bookingDetails.status" :severity="getSeverity(bookingDetails.status)" class="uppercase"/>
        </div>
          <p>
            Vehicle: {{ bookingDetails.vehicle_detail.make }}
            {{ bookingDetails.vehicle_detail.model }}
          </p>
          <div>
            <ul class="space-y-3">
              <span>Services:</span>
              <li v-for="service in bookingDetails.services" :key="service.id" class="flex justify-between">
                <span>{{ service.name }}</span>
                <span>{{ formatCurrency(service.fee) }}</span>
              </li>
            </ul>
          </div>
          <Divider />
          <div class="flex justify-between">
            <span>Total Fee:</span> 
            <p>{{ formatCurrency(bookingDetails.total_fee) }}</p>
          </div>
        </div>
      </div>
    </div>

        <!-- Payment Form -->
        <div class="flex flex-col">
      <div class="card shadow p-6">
        <h2 class="text-2xl font-semibold">Checkout</h2>
        <Divider />
        <form @submit.prevent="submitPayment">
          <!-- Billing Information -->
          <div class="mb-6">
            <h3 class="text-xl mb-8">Billing Information</h3>
            <div class="space-y-8">
              <FloatLabel>
                <InputText
                  class="w-full"
                  v-model="billingName"
                  id="full_name"
                />
                <label for="full_name">Full Name</label>
              </FloatLabel>
              <FloatLabel>
                <InputText
                  class="w-full"
                  v-model="billingEmail"
                  type="email"
                  id="email"
                  placeholder="Email Address"
                />
                <label for="email">Email</label>
              </FloatLabel>
              <FloatLabel>
                <InputText
                  class="w-full"
                  v-model="billingPhone"
                  type="tel"
                  id="phone"
                />
                <label for="phone">Phone Number</label>
              </FloatLabel>
            </div>
          </div>

          <!-- Payment Details -->
          <div v-if="method === 'card'" class="mb-6">
            <Divider />
            <h3 class="text-xl font-medium mb-8">Card Details</h3>
            <Fluid>
              <div class="space-y-4">
                <InputMask
                  class="w-full"
                  v-model="cardNumber"
                  mask="9999-9999-9999-9999"
                  placeholder="Card Number"
                  required
                />
                <div class="flex gap-4">
                  <InputMask
                    class="flex-1"
                    v-model="expirationMonth"
                    mask="99"
                    placeholder="MM"
                  />
                  <InputMask
                    class="flex-1"
                    v-model="expirationYear"
                    mask="9999"
                    placeholder="YYYY"
                  />
                </div>
                <InputMask
                  class="w-full"
                  v-model="cvc"
                  mask="999"
                  placeholder="CVC"
                  required
                />
              </div>
            </Fluid>
          </div>

          <!-- Submit Button -->
          <Button
            icon="pi pi-credit-card"
            label="Go to Payment"
            class="w-auto"
            type="submit"
          />
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePaymentStore } from '../../stores/payment.store';
import { useBookingStore } from '../../stores/booking.store';
import { formatDate, getSeverity, formatCurrency } from '../../services/helper';
import InputText from 'primevue/inputtext';
import InputMask from 'primevue/inputmask';
import FloatLabel from 'primevue/floatlabel';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Fluid from 'primevue/fluid';
import Divider from 'primevue/divider';

const route = useRoute();
const router = useRouter();
const paymentStore = usePaymentStore();
const bookingStore = useBookingStore();

const method = ref(route.query.method || 'gcash');
const bookingId = ref(route.query.bookingId || null);
const paymentIntentId = ref(route.query.paymentIntentId || null);

const billingName = ref('');
const billingEmail = ref('');
const billingPhone = ref('');
const cardNumber = ref('');
const expirationMonth = ref('');
const expirationYear = ref('');
const cvc = ref('');
const bookingDetails = ref(null);

onMounted(async () => {
  if (bookingId.value) {
    try {
      const response = await bookingStore.fetchBookingById(bookingId.value);
      if (response.success) {
        bookingDetails.value = bookingStore.bookingDetails;
      } else {
        console.error('Failed to fetch booking details:', response.message);
      }
    } catch (error) {
      console.error('Error fetching booking details:', error);
    }
  }
});

const submitPayment = async () => {
  try {
    if (method.value === 'gcash') {
      await paymentStore.attachPaymentMethod({
        paymentMethodType: 'gcash',
        paymentIntentId: paymentIntentId.value,
        billingDetails: {
          name: billingName.value,
          email: billingEmail.value,
          phone: billingPhone.value,
        },
      });
    } else if (method.value === 'card') {
      const cleanedExpMonth = parseInt(expirationMonth.value, 10);
      const cleanedExpYear = parseInt(expirationYear.value, 10);

      await paymentStore.attachPaymentMethod({
        paymentMethodType: 'card',
        paymentIntentId: paymentIntentId.value,
        billingDetails: {
          name: billingName.value,
          email: billingEmail.value,
          phone: billingPhone.value,
        },
        cardDetails: {
          cardNumber: cardNumber.value.replace(/\D/g, ''), 
          expMonth: cleanedExpMonth,
          expYear: cleanedExpYear,
          cvc: cvc.value,
        },
      });
    }

    if (paymentStore.nextActionUrl) {
      window.location.href = paymentStore.nextActionUrl;
    } else {
      router.push({ name: 'PaymentStatus' });
    }
  } catch (error) {
    console.error('Payment submission failed:', error);
  }
};
</script>
