import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

// if(window.location.href.includes("localhost")){ // Sviluppo
// } else { // Produzione
//     app.config.globalProperties.backendHostname = 'http://89.116.52.193';
// }
app.config.globalProperties.backendHostname = 'http://localhost';
app.config.globalProperties.backendPort = '5000';

app.use(router)

app.mount('#app')