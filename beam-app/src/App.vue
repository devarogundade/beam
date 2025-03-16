<script setup lang="ts">
import SideBar from '@/components/SideBar.vue';
import AppHeader from './components/AppHeader.vue';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useWalletStore } from './stores/wallet';
import BeamSDK from 'beam-ts/src';
import { Network } from '@/scripts/types';
import type { Merchant } from 'beam-ts/src/types';
import ProgressBox from './components/ProgressBox.vue';
import { Client } from './scripts/client';

const router = useRouter();
const walletStore = useWalletStore();
const loading = ref<boolean>(true);
const merchant = ref<Merchant | null>(null);

const beamSdk = new BeamSDK({
  network: Network.Testnet
});

const getMerchant = async () => {
  if (!walletStore.address) return;

  merchant.value = await beamSdk.merchant.getMerchant({
    merchant: walletStore.address
  });

  if (!merchant.value) {
    // notify user that merchant account is not found
    return router.push('/onboarding');
  }

  walletStore.setMerchant(merchant.value);

  loading.value = false;

  const clientMerchant = await Client.getMerchant(walletStore.address);

  walletStore.setClientMerchant(clientMerchant);
};

onMounted(() => {
  loading.value = true;

  if (!walletStore.address) {
    return router.push('/onboarding');
  }

  getMerchant();
});
</script>

<template>
  <section>
    <ProgressBox v-if="loading" />
    <main v-else-if="merchant">
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