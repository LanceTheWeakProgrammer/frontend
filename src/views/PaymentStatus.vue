<template>
    <div class="h-[90vh] flex justify-center items-center">
        <div v-if="loading" class="loader"></div>
        <div v-else>
            <div v-if="status === 'Paid'" class="payment-result success">
                <h1 class="text-3xl font-bold mb-4">Payment Successful!</h1>
                <p class="text-lg">Thank you for your payment.</p>
                <img src="../../src/test_images/a.svg" alt="Payment Success Icon" class="payment-icon mt-4" />
            </div>

            <div v-else-if="status === 'Paused'" class="payment-result awaiting-next-action">
                <h1 class="text-3xl font-bold mb-4">Payment Processing Issue</h1>
                <p class="text-lg">There was an issue with processing your payment. Please try again.</p>
                <img src="../../src/test_images/error.svg" alt="Payment Error Icon" class="payment-icon mt-4" />
            </div>

            <div v-else-if="status === 'bad_respond'" class="payment-result bad-respond">
                <h1 class="text-3xl font-bold mb-4">Payment Intent Error</h1>
                <p class="text-lg">
                    Oops! Something went wrong while processing your payment. 
                    It seems we’re missing some details. Please try again or contact our support team for help.
                </p>
                <img src="../../src/test_images/error.svg" alt="Payment Intent Error Icon" class="payment-icon mt-4" />
            </div>

            <div v-else class="payment-result unknown">
                <h1 class="text-3xl font-bold mb-4">Unknown Payment Status</h1>
                <p class="text-lg">The payment status is currently unknown. Please contact support for assistance.</p>
                <img src="../../src/test_images/unknown.svg" alt="Unknown Status Icon" class="payment-icon mt-4" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { usePaymentStore } from '../stores/payment.store';
import { useRoute } from 'vue-router';

const paymentStore = usePaymentStore();
const route = useRoute();
const loading = ref(true); 
const status = computed(() => paymentStore.status);

onMounted(async () => {
    const paymentIntentId = route.query.payment_intent_id;

    if (!paymentIntentId) {
        paymentStore.status = 'bad_respond';
        loading.value = false;
        return;
    }

    try {
        await paymentStore.retrievePaymentStatus(paymentIntentId);
    } catch (error) {
        paymentStore.status = 'bad_respond';
    } finally {
        loading.value = false; 
    }
});
</script>

<style scoped>
.loader {
  width: 40px;
  aspect-ratio: 1;
  position: relative;
  margin: 2rem auto;
}
.loader:before,
.loader:after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  margin: -8px 0 0 -8px;
  width: 16px;
  aspect-ratio: 1;
  background: #3FB8AF;
  animation:
    l2-1 2s  infinite,
    l2-2 1s infinite ;
}
.loader:after {
  background:#FF3D7F;
  animation-delay: -1s,0s;
}
@keyframes l2-1 {
  0%   {top:0   ;left:0}
  25%  {top:100%;left:0}
  50%  {top:100%;left:100%}
  75%  {top:0   ;left:100%}
  100% {top:0   ;left:0}
}
@keyframes l2-2 {
   40%,50% {transform: rotate(0.25turn) scale(0.5)}
   100%    {transform: rotate(0.5turn) scale(1)}
}

.payment-result {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    text-align: center;
}

.success h1 {
    color: #28a745;
}

.awaiting-next-action h1 {
    color: #ffc107;
}

.bad-respond h1 {
    color: #dc3545;
}

.unknown h1 {
    color: #6c757d;
}

.payment-icon {
    max-width: 150px;
    margin-top: 1rem;
}
</style>
