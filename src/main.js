import './assets/main.scss'

import {createApp} from 'vue'
import ToastService from 'primevue/toastservice';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';

import App from './App.vue'

const app = createApp(App);

app.use(ToastService);

app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            prefix: 'p',
            darkModeSelector: '',
            cssLayer: false,
        }
    }
});

app.mount('#app');

