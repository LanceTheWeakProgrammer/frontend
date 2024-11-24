import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import PrimeVue from 'primevue/config';
import Ripple from 'primevue/ripple';
import Aura from '@primevue/themes/aura';
import { definePreset } from '@primevue/themes';
import AnimateOnScroll from 'primevue/animateonscroll';
import ToastService from 'primevue/toastservice';

import Tooltip from 'primevue/tooltip';
import StyleClass from 'primevue/styleclass';

import 'swiper/swiper-bundle.css';
import './index.css';
import './assets/styles.css';
import 'primeicons/primeicons.css';

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate)

const MyPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '{rose.50}',
            100: '{rose.100}',
            200: '{rose.200}',
            300: '{rose.300}',
            400: '{rose.400}',
            500: '{rose.500}',
            600: '{rose.600}',
            700: '{rose.700}',
            800: '{rose.800}',
            900: '{rose.900}',
            950: '{rose.950}'
        }
    },
    components: {
        divider: {
            content: {
                background: '#f4f4f4',        
            },
        },
        menubar: {
            colorScheme: {
                light: {
                    item: {
                        focus: {
                            color: '{neutral.50}',
                            background: '{rose.500}'  
                        },
                        background: '{neutral.50}',
                    },
                    submenu: {
                        background: '{neutral.50}',
                    },
                },
            }
        },
        panelmenu: {
            gap: '0',
            panel: {
                border: {
                    width: '0px',
                    radius: '0rem',
                },
                padding: '0rem',
                first: {
                    border: {
                        width: '0px',
                    },
                    top: {
                        border: {
                            radius: '0rem',
                        },
                    },
                },
                last: {
                    border: {
                        width: '0px',
                    },
                    bottom: {
                        border: {
                            radius: '0rem',
                        },
                    },
                },
            },
            item: {
                gap: '0rem',
                padding: '0.75rem 1rem',
                border: {
                    radius: '0rem',
                },
            },
            submenu: {
                indent: '1rem',
                icon: {
                    color: '{neutral.500}',
                    focus: {
                        color: '{rose.500}',
                    },
                },
            },
        },
    }
});


app.use(router);
app.use(pinia);
app.use(PrimeVue, {
    theme: {
        preset: MyPreset,
        options: {
            prefix: 'p',
            darkModeSelector: '.p-dark',
        },
    },
});

app.directive('ripple', Ripple);
app.directive('animateonscroll', AnimateOnScroll);
app.directive('tooltip', Tooltip);
app.directive('styleclass', StyleClass);
app.use(ToastService);

app.mount('#app');
