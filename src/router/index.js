import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';

const routes = [
  {
    path: '/',
    redirect: 'home',
    component: () => import('../layouts/UserLayout.vue'),
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('../views/user/HomeView.vue'),
        meta: { title: 'Home' }
      },
      {
        path: 'services',
        name: 'Service',
        component: () => import('../views/user/ServiceView.vue'),
        meta: { title: 'Services' }
      },
      {
        path: 'contact',
        name: 'Contact',
        component: () => import('../views/user/ContactView.vue'),
        meta: { title: 'Contact' }
      },
      {
        path: 'about',
        name: 'About',
        component: () => import('../views/user/AboutView.vue'),
        meta: { title: 'About Us' }
      },
      {
        path: 'technicians',
        name: 'Technicians',
        component: () => import('../views/user/TechnicianView.vue'),
        meta: { title: 'Technicians' }
      },
      {
        path: '/technician/details/:id',
        name: 'TechnicianDetails',
        component: () => import('../views/user/TechnicianDetailsView.vue'),
        meta: { title: 'Technician Details' }
      },
      {
        path: '/booking/form/:id',
        name: 'BookingForm',
        component: () => import('../views/user/BookingFormView.vue'),
        meta: { requiresAuth: true, role: 'user', title: 'Fill Booking Details' },
      },  
      {
        path: '/booking/details/:id',
        name: 'BookingDetails',
        component: () => import('../views/user/BookingDetailsView.vue'),
        meta: { requiresAuth: true, role: 'user', title: 'Booking Details' },
      },    
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('../views/user/ProfileView.vue'),
        meta: { requiresAuth: true, role: 'user', title: 'Profile', hideFooter: true }
      },
      {
        path: 'bookings',
        name: 'Bookings',
        component: () => import('../views/user/BookingView.vue'),
        meta: { requiresAuth: true, role: 'user', title: 'Bookings', hideFooter: true }
      },
      {
        path: 'transactions',
        name: 'Transactions',
        component: () => import('../views/user/TransactionView.vue'),
        meta: { requiresAuth: true, role: 'user', title: 'Transactions', hideFooter: true }
      },
      {
        path: 'success/:bookingId',
        name: 'BookingSuccess',
        component: () => import('../views/user/BookingSuccess.vue'),
        meta: { requiresAuth: true, role: 'user', title: 'Success!', hideFooter: true }
      },
      {
        path: 'messages', 
        name: 'Messages',
        component: () => import('../views/user/MessagesView.vue'),
        meta: { requiresAuth: true, role: 'user', title: 'Messages', hideFooter: true }
      },
      {
        path: 'payment',
        name: 'Payment',
        component: () => import('../views/user/PaymentView.vue'),
        meta: { role: 'user', title: 'Payment' }
      },
      {
        path: 'payment-status',
        name: 'PaymentStatus',
        component: () => import('../views/PaymentStatus.vue'),
        meta: { hideFooter: true }
      },
      // {
      //   path: 'personal-info',
      //   name: 'PersonalInfoForm',
      //   component: () => import('../views/user/PersonalInfoForm.vue'),
      //   meta: { title: 'Fill in Your Information' }
      // },
    ]
  },
  {
    path: '/login',
    name: 'UserLogin',
    component: () => import('../views/user/LoginView.vue'),
    meta: { title: 'Login' }
  },
  {
    path: '/verify-account',
    name: 'VerifyAccount',
    component: () => import('../views/user/VerifyAccountView.vue'),
    meta: { title: 'Verify Account' }
  },
  {
    path: '/register',
    name: 'UserRegister',
    component: () => import('../views/user/RegisterView.vue'),
    meta: { title: 'Register' }
  },
  {
    path: '/admin',
    component: () => import('../layouts/AdminLayout.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/admin/DashboardView.vue'),
        meta: { requiresAuth: true, role: 'admin', title: 'Dashboard' }
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('../views/admin/SettingsView.vue'),
        meta: { requiresAuth: true, role: 'admin', title: 'Settings' }
      },
      {
        path: 'carousel',
        name: 'Carousel',
        component: () => import('../views/admin/CarouselView.vue'),
        meta: { requiresAuth: true, role: 'admin', title: 'Carousel' }
      },
      {
        path: 'vehicles_&_services',
        name: 'VehiclesServices',
        component: () => import('../views/admin/Vehicles&ServicesView.vue'),
        meta: { requiresAuth: true, role: 'admin', title: 'Vehicles and Services' }
      },
      {
        path: 'technician',
        name: 'TechnicianAdmin',
        component: () => import('../views/admin/TechnicianView.vue'),
        meta: { requiresAuth: true, role: 'admin', title: 'Manage Technicians' }
      },
      {
        path: 'users',
        name: 'ManageUser',
        component: () => import('../views/admin/ManageUserView.vue'),
        meta: { requiresAuth: true, role: 'admin', title: 'Manage Users' }
      },
      {
        path: 'bookings',
        name: 'ManageBookings',
        component: () => import('../views/admin/BookingsView.vue'),
        meta: { requiresAuth: true, role: 'admin', title: 'Manage Bookings' }
      },
      {
        path: 'active_bookings',
        name: 'ManageActiveBookings',
        component: () => import('../views/admin/ActiveBookingsView.vue'),
        meta: { requiresAuth: true, role: 'admin', title: 'Manage Bookings' }
      },
      {
        path: 'testimonials',
        name: 'ManageTestimonials',
        component: () => import('../views/admin/TestimonialsView.vue'),
        meta: { requiresAuth: true, role: 'admin', title: 'Manage Testimonials' }
      },
      {
        path: 'user_queries',
        name: 'ManageUserQueries',
        component: () => import('../views/admin/UserQueriesView.vue'),
        meta: { requiresAuth: true, role: 'admin', title: 'Manage User Queries' }
      },
      {
        path: 'technician/:id',
        name: 'TechnicianAdminDetails',
        component: () => import('../components/admin/technician/TechnicianDetails.vue'),
        meta: { requiresAuth: true, role: 'admin', title: 'Technician Details' }
      },
      // {
      //   path: 'guest-bookings',
      //   name: 'GuestBookings',
      //   component: () => import('../views/admin/GuestBookingView.vue'),
      //   meta: { requiresAuth: true, role: 'admin', title: 'Manage Guest Bookings' }
      // }
    ]
  },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: () => import('../views/admin/LoginView.vue'),
    meta: { title: 'Login as Admin' }
  },
  {
    path: '/technician/login',
    name: 'TechnicianLogin',
    component: () => import('../views/technician/LoginView.vue'),
    meta: { title: 'Login as Technician' }
  },
  {
    path: '/technician/change-password',
    name: 'TechnicianChangePassword',
    component: () => import('../views/technician/TechnicianChangePasswordView.vue'),
    meta: { requiresAuth: true, role: 'technician', title: 'Change Password' }
  },
  
  {
    path: '/technician',
    component: () => import('../layouts/TechnicianLayout.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'TechnicianDashboard',
        component: () => import('../views/technician/TechnicianDashboardView.vue'),
        meta: { requiresAuth: true, role: 'technician', title: 'Dashboard' }
      },
      {
        path: 'schedules',
        name: 'Schedules',
        component: () => import('../views/technician/SchedulesView.vue'),
        meta: { requiresAuth: true, role: 'technician', title: 'Schedules' }
      },
      {
        path: 'confirmations',
        name: 'Confirmations',
        component: () => import('../views/technician/ConfirmationsView.vue'),
        meta: { requiresAuth: true, role: 'technician', title: 'Confirmations' }
      },
      {
        path: 'profile',
        name: 'TechnicianProfile',
        component: () => import('../views/technician/TechnicianProfileView.vue'),
        meta: { requiresAuth: true, role: 'technician', title: 'Confirmations' }
      },
      {
        path: 'messages', 
        name: 'TechnicianMessages',
        component: () => import('../views/technician/MessagesView.vue'),
        meta: { requiresAuth: true, role: 'technician', title: 'Messages' }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFoundView.vue'),
    meta: { title: '404 - Page Not Found' }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.title) {
    document.title = `JHPaints | ${to.meta.title}`;
  } else {
    document.title = 'JHPaints';
  }

  const userRole = authStore.role;
  const isAuthenticated = !!authStore.token;

  if ((to.name === 'AdminLogin' || to.name === 'TechnicianLogin' || to.name === 'UserLogin' || to.name === 'UserRegister' || to.name === 'VerifyAccount' ) && isAuthenticated) {
    if (userRole === 'admin') {
      return next({ name: 'Dashboard' });
    } else if (userRole === 'technician') {
      return next({ name: 'TechnicianDashboard' });
    } else {
      return next({ name: 'Home' });
    }
  }

  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      if (to.meta.role === 'admin') {
        return next({ name: 'AdminLogin' });
      } else if (to.meta.role === 'technician') {
        return next({ name: 'TechnicianLogin' });
      } else {
        return next({ name: 'UserLogin' });
      }
    } else if (to.meta.role && to.meta.role !== userRole) {
      if (userRole === 'admin') {
        return next({ name: 'Dashboard' });
      } else if (userRole === 'technician') {
        return next({ name: 'TechnicianDashboard' });
      } else {
        return next({ name: 'Home' });
      }
    }
  }

  if (to.path === '/' || to.path === '/technician' || to.path === '/admin') {
    if (isAuthenticated) {
      if (userRole === 'admin') {
        return next({ name: 'Dashboard' });
      } else if (userRole === 'technician') {
        return next({ name: 'TechnicianDashboard' });
      } else {
        return next({ name: 'Home' });
      }
    }
  }

  next();
});

export default router;
