<script setup lang="ts">
import SideBar from '@/components/SideBar.vue';
import AppHeader from './components/AppHeader.vue';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useWalletStore } from './stores/wallet';

const router = useRouter();
const walletStore = useWalletStore();

onMounted(() => {
  if (!walletStore.address) router.push('/onboarding');
});
</script>

<template>
  <section>
    <main>
      <SideBar />
      <div></div>
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