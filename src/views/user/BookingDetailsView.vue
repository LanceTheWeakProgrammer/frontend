  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import { useBookingStore } from '../../stores/booking.store';
  import Timeline from 'primevue/timeline';
  import DatePicker from 'primevue/datepicker';
  import Divider from 'primevue/divider';
  import Tag from 'primevue/tag';
  import Avatar from 'primevue/avatar';
  import Accordion from 'primevue/accordion';
  import AccordionPanel from 'primevue/accordionpanel';
  import AccordionHeader from 'primevue/accordionheader';
  import AccordionContent from 'primevue/accordioncontent';
  import Dialog from 'primevue/dialog';
  import Button from 'primevue/button';
  import axios from '../../services/axios';

  const bookingDetails = ref(null);
  const loading = ref(true);
  const error = ref(null);
  const isAlternateLayout = ref(false);
  const showAttachmentsDialog = ref(false);
  const selectedDate = ref(null);
  const datePickerOptions = ref({});
  const isExpanded = ref(false);

  const route = useRoute();
  const bookingStore = useBookingStore();

  const toggleExpanded = () => {
    isExpanded.value = !isExpanded.value;
  };

  const toggleAttachmentsDialog = () => {
    showAttachmentsDialog.value = !showAttachmentsDialog.value;
  };

  const getImageUrl = (imagePath) => `${axios.defaults.baseURL}/storage/${imagePath}`;
  const getSeverity = (status) => {
    switch (status) {
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

  const fetchBookingDetails = async () => {
    const bookingId = route.params.id;
    loading.value = true;

    try {
      const response = await bookingStore.fetchBookingById(bookingId);
      if (response.success) {
        bookingDetails.value = bookingStore.bookingDetails;
        selectedDate.value = new Date(bookingDetails.value.booking_date);
      } else {
        error.value = response.message;
      }
    } catch (err) {
      error.value = err.message || 'Failed to fetch booking details.';
    } finally {
      loading.value = false;
      navigateToBookingDate();
    }
  };

  const navigateToBookingDate = () => {
    if (selectedDate.value) {
      datePickerOptions.value = {
        monthNavigator: true,
        yearNavigator: true,
        inline: true,
        defaultDate: selectedDate.value,
      };
    }
  };

  const updateLayout = () => {
    isAlternateLayout.value = window.matchMedia('(max-width: 960px)').matches;
  };

  onMounted(() => {
    fetchBookingDetails();
    updateLayout();
    window.addEventListener('resize', updateLayout);
  });

  const timelineEvents = computed(() => {
    if (!bookingDetails.value) return [];

    const baseTimeline = [
      { status: 'Pending', icon: 'pi pi-clock', color: '#9C27B0', isGrayedOut: true },
      { status: 'Approved', icon: 'pi pi-check', color: '#673AB7', isGrayedOut: true },
      { status: 'In Progress', icon: 'pi pi-cog', color: '#FF9800', isGrayedOut: true },
      { status: 'Completed', icon: 'pi pi-flag', color: '#607D8B', isGrayedOut: true },
    ];

    const currentStatus = bookingDetails.value.status;
    let isCurrentPhase = false;

    baseTimeline.forEach((phase) => {
      if (phase.status === currentStatus) {
        isCurrentPhase = true;
        phase.isGrayedOut = false;
      } else if (!isCurrentPhase) {
        phase.isGrayedOut = false;
      } else {
        phase.isGrayedOut = true;
      }
    });

    switch (currentStatus) {
      case 'Cancellation Requested': {
        const approvedIndex = baseTimeline.findIndex((item) => item.status === 'Approved');
        baseTimeline.splice(approvedIndex + 1, 0, {
          status: 'Cancellation Requested',
          icon: 'pi pi-times-circle',
          color: '#e91e63',
          isGrayedOut: false,
        });
        baseTimeline.slice(approvedIndex + 2).forEach((item) => (item.isGrayedOut = true));
        break;
      }
      case 'Cancelled': {
        const approvedIndex = baseTimeline.findIndex((item) => item.status === 'Approved');
        const cancellationRequestedExists = baseTimeline.some((item) => item.status === 'Cancellation Requested');
        if (!cancellationRequestedExists) {
          baseTimeline.splice(approvedIndex + 1, 0, {
            status: 'Cancellation Requested',
            icon: 'pi pi-times-circle',
            color: '#e91e63',
            isGrayedOut: false,
          });
        }
        const cancellationRequestedIndex = baseTimeline.findIndex((item) => item.status === 'Cancellation Requested');
        baseTimeline.splice(cancellationRequestedIndex + 1, 0, {
          status: 'Cancelled',
          icon: 'pi pi-times',
          color: '#f44336',
          isGrayedOut: false,
        });
        baseTimeline.slice(cancellationRequestedIndex + 2).forEach((item) => (item.isGrayedOut = true));
        break;
      }
      case 'Reschedule Requested': {
        const approvedIndex = baseTimeline.findIndex((item) => item.status === 'Approved');
        baseTimeline.splice(approvedIndex + 1, 0, {
          status: 'Reschedule Requested',
          icon: 'pi pi-refresh',
          color: '#03a9f4',
          isGrayedOut: false,
        });
        baseTimeline.splice(approvedIndex + 2, 0, {
          status: 'Rescheduled',
          icon: 'pi pi-calendar',
          color: '#4caf50',
          isGrayedOut: true,
        });
        baseTimeline.slice(approvedIndex + 2).forEach((item) => {
          item.isGrayedOut = true;
        });
        break;
      }
      case 'Rescheduled': {
        const approvedIndex = baseTimeline.findIndex((item) => item.status === 'Approved');
        const rescheduleRequestedExists = baseTimeline.some((item) => item.status === 'Reschedule Requested');
        if (!rescheduleRequestedExists) {
          baseTimeline.splice(approvedIndex + 1, 0, {
            status: 'Reschedule Requested',
            icon: 'pi pi-refresh',
            color: '#03a9f4',
            isGrayedOut: false,
          });
        }
        const rescheduleRequestedIndex = baseTimeline.findIndex((item) => item.status === 'Reschedule Requested');
        baseTimeline.splice(rescheduleRequestedIndex + 1, 0, {
          status: 'Rescheduled',
          icon: 'pi pi-calendar',
          color: '#4caf50',
          isGrayedOut: false,
        });
        baseTimeline.slice(rescheduleRequestedIndex + 2).forEach((item) => {
          item.isGrayedOut = true;
        });
        break;
      }
      case 'Declined': {
        const pendingIndex = baseTimeline.findIndex((item) => item.status === 'Pending');
        baseTimeline.splice(pendingIndex + 1, 0, {
          status: 'Declined',
          icon: 'pi pi-times',
          color: '#e91e63',
          isGrayedOut: false,
        });
        baseTimeline.slice(pendingIndex + 2).forEach((item) => (item.isGrayedOut = true));
        break;
      }
      case 'No Show': {
        const approvedIndex = baseTimeline.findIndex((item) => item.status === 'Approved');
        baseTimeline.splice(approvedIndex + 1, 0, {
          status: 'No Show',
          icon: 'pi pi-calendar-times',
          color: '#f44336',
          isGrayedOut: false,
        });
        baseTimeline.slice(approvedIndex + 2).forEach((item) => (item.isGrayedOut = true));
        break;
      }
    }

    return baseTimeline;
  });
  </script>

  <template>
    <div class="mx-auto p-4 flex flex-col gap-6">
      <div v-if="loading" class="text-center">
        <div class="loader"></div>
      </div>
      <div v-else-if="error" class="text-center text-red-500">
        <p>{{ error }}</p>
      </div>
      <div v-else>
        <div class="card shadow p-4">
          <h3 class="text-2xl font-semibold mb-3">Booking Timeline</h3>
          <Timeline
            :value="timelineEvents"
            :layout="isAlternateLayout ? 'vertical' : 'horizontal'"
            :align="isAlternateLayout ? 'alternate' : 'top'"
          >
            <template #marker="slotProps">
              <span
                class="flex w-9 h-8 items-center justify-center text-white rounded-full z-10 shadow-sm"
                :style="{ backgroundColor: slotProps.item.isGrayedOut ? '#cfd8dc' : slotProps.item.color }"
              >
                <i :class="slotProps.item.icon" class="!text-lg"></i>
              </span>
            </template>
            <template #content="slotProps">
              <div class="font-semibold mt-2">{{ slotProps.item.status }}</div>
            </template>
          </Timeline>
        </div>

        <div class="flex flex-col md:flex-row lg:gap-4">
          <div class="md:w-1/3 w-full flex flex-col">
            <div class="card shadow">
              <h3 class="text-2xl font-semibold mb-3">Booking Date</h3>
              <Divider />
                <div class="relative">
                  <DatePicker
                    v-model="selectedDate"
                    class="w-full"
                    inline
                    :monthNavigator="true"
                    :yearNavigator="true"
                    size="large"
                    :navigatorButtonProps="{ style: { display: 'none' } }"
                  />
                  <div class="absolute inset-0 bg-transparent"></div>
                </div>
            </div>
          </div>
          <div class="card shadow p-4 lg:w-2/3 w-full flex flex-col flex-grow">
            <div class="overflow-auto transition-all duration-500">
              <div class="flex flex-row items-center gap-4 mb-4">
                <h3 class="text-2xl font-semibold">Booking Details</h3>
                <Tag
                  :value="bookingDetails?.status"
                  :severity="getSeverity(bookingDetails?.status)"
                  class="uppercase"
                />
              </div>
              <Divider />
              <div class="flex flex-col gap-4">
                <div class="flex flex-row items-center gap-2">
                  <i class="pi pi-calendar"></i>
                  <p class="text-lg">
                    {{ new Date(bookingDetails?.booking_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) || 'N/A' }}
                  </p>
                </div>
                <div class="flex flex-row gap-4 p-2">
                  <div class="w-1/2">
                    <p class="text-lg font-semibold mb-3">Technician</p>
                    <div class="flex flex-col gap-3">
                    <div class="flex items-center bg-gray-50 p-2 rounded-md shadow">
                      <Avatar :image=getImageUrl(bookingDetails?.technician?.profile_image) class="mr-2" shape="circle" />
                      <p class="text-lg"> {{ bookingDetails?.technician?.full_name || 'N/A' }}</p>
                    </div>
                    <div class="flex items-center bg-gray-50 p-2 gap-3 rounded-md shadow">
                      <i class="pi pi-envelope ml-2"></i>
                      <p class="text-lg"> {{ bookingDetails?.technician?.user?.email || 'N/A' }}</p>
                    </div>
                    <div class="flex items-center bg-gray-50 p-2 gap-3 rounded-md shadow">
                      <i class="pi pi-phone ml-2"></i>
                      <p class="text-lg"> {{ bookingDetails?.technician?.phone_number || 'N/A' }}</p>
                    </div>
                    </div>
                  </div>
                  <div class="flex flex-row gap-2">
                    <div class="w-full">
                      <p class="text-lg font-semibold mb-3">Services</p>
                      <div class="flex flex-wrap gap-4">
                        <div
                          class="flex items-center bg-gray-50 rounded-md p-2 shadow w-auto"
                          v-for="(service, index) in bookingDetails?.services || []"
                          :key="index"
                        >
                          <Avatar :image="getImageUrl(service.icon)" class="mr-2" />
                          <h3 class="text-base">{{ service.name }}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex flex-row gap-4 p-2">
                  <div class="flex flex-row gap-2">
                    <div>
                      <p class="text-lg font-semibold mb-3">Vehicle Details</p>
                      <div class="flex gap-4 items-center">
                        <div
                          class="flex items-center bg-gray-50 rounded-md p-2 shadow w-auto"
                        >
                          <i class="pi pi-car mr-2"></i>
                          <p class="text-base">
                            {{ (bookingDetails?.vehicle_detail?.make || 'N/A') 
                            + ' ' + 
                                (bookingDetails?.vehicle_detail?.model || 'N/A') 
                            + ' - ' + 
                            (bookingDetails?.vehicle_detail?.vehicle_type?.type || 'N/A') }}
                          </p>
                        </div>
                        <div>
                          <Button label="View Attachments" severity="contrast" icon="pi pi-image" text @click="toggleAttachmentsDialog"/>
                          <Dialog
                            v-model:visible="showAttachmentsDialog"
                            header="Uploaded Attachments"
                            modal
                            :closable="true"
                            class="lg:w-[40vw] md:w-[70vw] sm:w-[90vw] xs:w-[90vw]"
                          >
                            <div v-if="bookingDetails?.attachments?.length">
                              <div class="flex flex-wrap gap-4 justify-evenly">
                                <div
                                  v-for="(attachment, index) in bookingDetails.attachments"
                                  :key="index"
                                  class="flex flex-col items-center gap-2"
                                >
                                  <img
                                    :src="getImageUrl(attachment.image)"
                                    alt="Attachment"
                                    class="w-48 h-48 object-cover rounded-md shadow-md border"
                                  />
                                </div>
                              </div>
                            </div>
                            <div v-else>
                              <p class="text-center text-gray-500">No attachments available for this booking.</p>
                            </div>
                            <Divider />
                            <Button label="Close" icon="pi pi-times" @click="toggleAttachmentsDialog" severity="secondary" />
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Accordion value="0" class="mt-auto">
              <AccordionPanel value="0">
                  <AccordionHeader>
                    <span class="flex items-center w-full">
                      <Avatar icon="pi pi-info-circle" style="background-color: transparent" shape="circle" />
                      <span class="font-bold whitespace-nowrap">More Infromation</span>
                  </span>
                  </AccordionHeader>
                  <AccordionContent>
                    <div class="flex flex-col gap-2">
                      <div class="flex justify-between items-center">
                        <span class="font-semibold">Service</span>
                        <span class="font-semibold">Cost</span>
                      </div>
                      <div 
                        v-for="(service, index) in bookingDetails?.services || []" 
                        :key="index" 
                        class="flex justify-between items-center"
                      >
                        <span>{{ service.name }}</span>
                        <span>P{{ service.fee.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
                      </div>
                      <Divider />
                      <div class="flex justify-between items-center">
                        <span class="font-bold text-lg">Total Cost</span>
                        <div class="flex gap-3">
                          <Tag 
                            :value="bookingDetails?.payments?.[0]?.status || 'No Status'" 
                            :severity="bookingDetails?.payments?.[0]?.status === 'Paid' 
                              ? 'success' 
                              : bookingDetails?.payments?.[0]?.status === 'Not Paid' 
                              ? 'contrast' 
                              : 'info'" 
                            class="uppercase"
                          />
                          <span class="font-bold text-lg">P {{ bookingDetails?.total_fee.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
                        </div>
                      </div>
                      <Divider />
                      <div class="flex flex-col w-full">
                        <div class="flex gap-2 items-center mb-3">
                          <i class="pi pi-pen-to-square"></i>
                          <span class="font-semibold">Additional Information</span>
                        </div>
                        <p class="italic text-gray-500">
                          {{ bookingDetails?.additional_info }}
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
              </AccordionPanel>
          </Accordion>
          </div>
        </div>
      </div>
    </div>
  </template>

  <style scoped>
  .slide-fade-enter-active,
  .slide-fade-leave-active {
    transition: all 0.3s ease;
  }

  .slide-fade-enter-from,
  .slide-fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }
  </style>
