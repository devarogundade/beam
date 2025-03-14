<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue';
import { onMounted } from 'vue';
import { useDataStore } from './stores/data';
import ProgressBox from './components/ProgressBox.vue';
import type { Hex } from 'viem';
import BeamSDK from '../../beam-sdk/src';
import { Network } from '../../beam-sdk/src/enums';

const dataStore = useDataStore();

const getFavicon = (url: string): string => {
  return `https://www.google.com/s2/favicons?sz=64&domain=${new URL(url).hostname.replace("www.", "")}`;
};

const getWebsiteTitle = async (url: string): Promise<string | null> => {
  try {
    const response = await fetch(url);
    const text = await response.text();
    const match = text.match(/<title>(.*?)<\/title>/);
    return match ? match[1] : "Unknown";
  } catch (error) {
    console.error("Failed to fetch website title:", error);
    return null;
  }
};

const getTransaction = async (transactionId: Hex) => {
  const beamSdk = new BeamSDK({
    network: Network.Testnet
  });

  beamSdk.oneTimeTransaction.getTransaction({
    transactionId
  }).then(result => {
    if (!result) return;

    dataStore.setData({
      merchant: result.merchant,
      payers: result.payers,
      amounts: result.amounts,
      type: result.type,
      description: result.description,
      metadata: {
        schemaVersion: result.metadata_schemaVersion,
        value: result.metadata_value
      },
      token: result.token,
      subscriptionId: undefined,
      mintReceipt: false
    });
  });
};

onMounted(async () => {
  const params = new URLSearchParams(window.location.search);
  const session = params.get("session");
  const initiator = params.get("initiator");
  const transactionId = params.get("tx_hash") as Hex | null;

  if (session && initiator) {
    window.addEventListener('message', (event) => {
      if (initiator == event.origin) {
        dataStore.setData(event.data);
      }
    });
  } else if (transactionId) {
    getTransaction(transactionId);
  } else { }

  if (!initiator) return;

  dataStore.setInitiator({
    url: initiator,
    title: await getWebsiteTitle(initiator),
    favicon: getFavicon(initiator)
  });
});
</script>

<template>
  <AppHeader />
  <ProgressBox v-if="!dataStore.data" />
  <RouterView />
</template>
