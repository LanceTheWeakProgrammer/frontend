<script setup>
import { ref, computed, onMounted } from 'vue';
import Chart from 'primevue/chart';
import Button from 'primevue/button';
import Select from 'primevue/select';
import Divider from 'primevue/divider';
import { useAdminStore } from '../../stores/admin.store';
import axios from '../../services/axios';

const selectedOption = ref('month');

const selectOptions = [
  { label: 'All Time', value: 'all' },
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
  { label: 'Last 3 Months', value: '3_months' },
  { label: 'Last 6 Months', value: '6_months' },
];

const adminStore = useAdminStore();

const chartOptions = ref(null);

const getImageUrl = (imagePath) => `${axios.defaults.baseURL}/storage/${imagePath}`;

const formatNumber = (value) => {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  } else if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  } else {
    return value.toString();
  }
};

const sales = computed(() => {
  const totalSales = adminStore.dashboardData?.total_sales || 0;
  return `₱ ${formatNumber(totalSales)}`;
});

const activeBookings = computed(() => adminStore.dashboardData?.total_bookings || 0);
const technicians = computed(() => adminStore.dashboardData?.total_technicians || 0);
const users = computed(() => adminStore.dashboardData?.total_users || 0);
const topVehicleTypes = computed(() => adminStore.dashboardData?.top_vehicles || []);
const topServices = computed(() => adminStore.dashboardData?.top_services || []);
const monthlyBookings = computed(() => adminStore.dashboardData?.monthly_bookings || {});

const ratingsChartData = ref({
  labels: ['5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star'],
  datasets: [
    {
      data: [120, 80, 40, 20, 10],
      backgroundColor: ['#22c55e', '#3b82f6', '#facc15', '#f97316', '#ef4444'],
      hoverBackgroundColor: ['#16a34a', '#2563eb', '#eab308', '#ea580c', '#dc2626'],
    },
  ],
});

const chartData = computed(() => {
  if (!Object.keys(monthlyBookings.value).length) {
    return {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'No Data',
          data: Array(12).fill(0),
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    };
  }
    const color = [
      '#22c55e', 
      '#3b82f6', 
      '#facc15', 
      '#f97316', 
      '#ef4444' 
    ];

    const datasets = Object.entries(monthlyBookings.value).map(([year, months], index) => {
    const monthlyData = Object.values(months);

    return {
      label: year,
      data: monthlyData,
      backgroundColor: color[index % color.length],
    };
  });

  return {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets,
  };
});

const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--p-text-color');
  const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
  const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

  return {
    plugins: {
      legend: {
        labels: {
          color: textColor,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
    },
  };
};

const fetchFilteredData = async () => {
  await adminStore.fetchDashboardData(selectedOption.value);
  chartOptions.value = setChartOptions();
};

onMounted(fetchFilteredData);
</script>

<template>
  <div class="mx-auto lg:mr-0 mr-4">
    <div class="card shadow">
      <div class="flex justify-between items-center">
        <h1 class="text-4xl font-semibold">Welcome, Admin!</h1>
        <Select
          v-model="selectedOption"
          :options="selectOptions"
          option-label="label" 
          option-value="value"
          placeholder="Select a date range"
          @change="fetchFilteredData"
        />
      </div>
    </div>
    <div class="flex flex-col">
      <div class="lg:grid lg:grid-cols-4 md:grid md:grid-cols-2 grid grid-cols-1 gap-4 mb-4">
        <div class="bg-orange-500 pb-8 pt-4 border-white border-4 px-6 rounded-lg shadow flex flex-col justify-between">
          <h3 class="text-white text-lg font-semibold">Sales</h3>
          <div class="flex justify-between items-center">
            <p class="text-white text-3xl font-bold">{{ sales }}</p>
            <i class="pi pi-dollar text-white ml-6" style="font-size: 4rem;"></i>
          </div>
        </div>

        <div class="bg-red-500 pb-8 pt-4 border-white border-4 px-6 rounded-lg shadow flex flex-col justify-between">
          <h3 class="text-white text-lg font-semibold">Bookings</h3>
          <div class="flex justify-between items-center">
            <p class="text-white text-3xl font-bold">{{ activeBookings }}</p>
            <i class="pi pi-calendar text-white" style="font-size: 4rem;"></i>
          </div>
        </div>

        <div class="bg-blue-500 pb-8 pt-4 border-white border-4 px-6 rounded-lg shadow flex flex-col justify-between">
          <h3 class="text-white text-lg font-semibold">Technicians</h3>
          <div class="flex justify-between items-center">
            <p class="text-white text-3xl font-bold">{{ technicians }}</p>
            <i class="pi pi-user text-white" style="font-size: 4rem;"></i>
          </div>
        </div>

        <div class="bg-green-500 pb-8 pt-4 border-white border-4 px-6 rounded-lg shadow flex flex-col justify-between">
          <h3 class="text-white text-lg font-semibold">Users</h3>
          <div class="flex justify-between items-center">
            <p class="text-white text-3xl font-bold">{{ users }}</p>
            <i class="pi pi-users text-white" style="font-size: 4rem;"></i>
          </div>
        </div>
      </div>

      <div class="flex flex-col md:flex-col lg:flex-row lg:gap-4">
        <div class="flex flex-col w-full lg:w-2/3">
          <div class="flex flex-col md:flex-row md:gap-4">
            <div class="card shadow flex-1">
              <h3 class="text-xl font-semibold mb-4">Top Vehicle Types</h3>
              <ul v-if="topVehicleTypes.length > 0">
                <div v-for="(vehicle, index) in topVehicleTypes" :key="index" >
                  <li class="flex justify-between my-4 text-lg">
                    <span>{{ vehicle.type }}</span>
                    <span>{{ vehicle.count }}</span>
                  </li>
                  <Divider />
              </div>
              </ul>
              <p v-else class="text-gray-500 text-center">No vehicle data available.</p>
              <div v-if="topVehicleTypes.length > 0" class="flex justify-end items-end mt-4">
                <Button
                  label="View Data"
                  size="small"
                  icon="pi pi-arrow-up-right"
                  severity="secondary"
                  @click="$router.push({ path: '/admin/vehicles_&_services' })"
                />
              </div>
            </div>

            <div class="card shadow flex-1">
              <h3 class="text-xl font-semibold mb-4">Top Services</h3>
              <ul v-if="topServices.length > 0">
                <div v-for="(service, index) in topServices" :key="index">
                  <li class="flex justify-between my-4 text-lg">
                    <div class="flex items-center gap-2">
                      <img
                        v-if="service.icon"
                        :src="getImageUrl(service.icon)"
                        alt="Service Icon"
                        class="w-8 h-8 object-cover rounded"
                      />
                      <span>{{ service.name }}</span>
                    </div>
                    <span>{{ service.count }}</span>
                  </li>
                  <Divider />
              </div>
              </ul>
              <p v-else class="text-gray-500 text-center">No service data available.</p>
              <div v-if="topServices.length > 0" class="flex justify-end mt-4">
                <Button
                  label="View Data"
                  size="small"
                  icon="pi pi-arrow-up-right"
                  severity="secondary"
                  @click="$router.push({ path: '/admin/vehicles_&_services' })"
                />
              </div>
            </div>
          </div>
          <div class="card shadow">
            <h1 class="text-base">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam eum sint tenetur enim, aliquam ut adipisci
              quibusdam impedit nesciunt assumenda exercitationem provident, vero ipsum sequi quo. Pariatur commodi,
              tempora cum laudantium voluptate similique labore veniam ducimus id explicabo atque quia tempore, laborum
              laboriosam consequatur quod recusandae, nemo necessitatibus consectetur ab.
            </h1>
          </div>
        </div>

        <div class="card shadow w-full lg:w-1/3">
          <h3 class="text-xl font-semibold mb-4">Ratings Distribution</h3>
          <div class="grid grid-cols-1">
            <Chart type="doughnut" :data="ratingsChartData" class="lg:h-[30rem] md:mx-auto" />
          </div>
        </div>
      </div>

      <div class="card shadow">
        <h3 class="text-xl font-semibold mb-4">Monthly Bookings</h3>
        <div class="grid grid-cols-1 p-4">
          <Chart type="bar" :data="chartData" :options="chartOptions" class="lg:h-[40rem] md:mx-auto" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>

