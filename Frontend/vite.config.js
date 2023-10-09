// vite.config.js
// import { fileURLToPath, URL } from 'node:url'

// import { defineConfig, loadEnv } from 'vite'
// import vue from '@vitejs/plugin-vue'


// export default defineConfig({
//   plugins: [vue()],
  
//   // Imposta il percorso relativo alla root del tuo progetto
//   base: '/',

//   // Definisci le risorse pubbliche (ad esempio, immagini) nella cartella "public"
//   //publicDir: 'public',

//   // Configura le opzioni per il server di sviluppo
//   server: {
//     // Imposta la porta del server di sviluppo
//     port: 808,
//   },
// });

import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue'

// Se si desidera passare variabili d'ambiente (ENV) da Docker al contesto di ViteJS, è necessario definirle nel Dockerfile,
//    e successivamente utilizzare la parte commentata interna al export default .... e sostituire la riga successiva alla precedente.
// import { defineConfig, loadEnv } from 'vite';

// server: {
//   proxy: {
//     "/api": {
//       target: "https://your-remote-domain.com",
//       changeOrigin: true,
//       secure: false,
//     },
//   },
// },

export default defineConfig(/*({ command, mode }) => */
  {
    // const env = loadEnv(mode, process.cwd(), '');
    //return {
      // define: {
      //   'process.env.BE_IP': JSON.stringify(env.BE_IP)
      // },
      plugins: [vue()],

      // Imposta il percorso relativo alla root del tuo progetto
      base: '/',

      // Definisci le risorse pubbliche (ad esempio, immagini) nella cartella "public"
      //publicDir: 'public',

      // Configura le opzioni per il server di sviluppo
      server: {
        // Imposta la porta del server di sviluppo
        port: 808,

        // # Il proxy è stato impostato per funzionare direttamente da Apache (però se in sviluppo si vuole abilitare l'hot reloading si deve decommentare il seguente perché sarà il server vite a rispondere)
        // proxy: {
        //   "/backend/ping": {
        //     target: "http://miobe:5000/ping",
        //     changeOrigin: true,
        //     secure: false,
        //     rewrite: (path) => path.replace(/^\/backend\/ping/, ''),
        //   },
        //   "/backend/get_utenti": {
        //     target: "http://miobe:5000/get_utenti",
        //     changeOrigin: true,
        //     secure: false,
        //     rewrite: (path) => path.replace(/^\/backend\/get_utenti/, ''),
        //   },
        //   "/backend/esegui_operazione": {
        //     target: "http://miobe:5000/esegui_operazione",
        //     changeOrigin: true,
        //     secure: false,
        //     rewrite: (path) => path.replace(/^\/backend\/esegui_operazione/, ''),
        //   },
        //   "/backend/crash": {
        //     target: "http://miobe:5000/crash",
        //     changeOrigin: true,
        //     secure: false,
        //     rewrite: (path) => path.replace(/^\/backend\/esegui_operazione/, ''),
        //   }
        // },
      },
    // };
  }
);