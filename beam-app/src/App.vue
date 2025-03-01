<script setup lang="ts">
// import NotifyPop from '@/components/NotifyPop.vue';

import SideBar from '@/components/SideBar.vue';

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import AppHeader from './components/AppHeader.vue';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FS_API_KEY,
  authDomain: import.meta.env.VITE_FS_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FS_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FS_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FS_MSG_SENDER_ID,
  appId: import.meta.env.VITE_FS_APP_ID,
  measurementId: import.meta.env.VITE_FS_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

getAnalytics(app);
</script>

<template>
  <section>
    <main>
      <SideBar />
      <div>
        <AppHeader />
        <RouterView />
      </div>
    </main>
  </section>
</template>

<style scoped>
section {
  display: flex;
  justify-content: center;
}

main {
  display: grid;
  grid-template-columns: 250px 1fr;
  width: 100%;
  max-width: 1440px;
  height: 100vh;
}
</style>