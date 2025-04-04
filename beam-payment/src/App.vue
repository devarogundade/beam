<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useDataStore } from './stores/data';
import ProgressBox from './components/ProgressBox.vue';
import { formatUnits, parseEther, parseUnits, type Hex } from 'viem';
import BeamSDK from 'beam-ts/src';
import { Network, TransactionType } from '@/scripts/types';
import { notify } from './reactives/notify';
import { getToken } from 'beam-ts/src/utils/constants';

const beamSdk = new BeamSDK({
  network: Network.Testnet,
});

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

const getSubscription = async () => {
  if (dataStore.data?.type == TransactionType.Recurrent && dataStore.data.subscriptionId) {
    beamSdk.recurrentTransaction.getSubscription({
      subscriptionId: dataStore.data.subscriptionId
    }).then(result => {
      if (!result) {
        notify.push({
          title: "Subscription not found!",
          description: "Try again",
          category: "error"
        });
        return;
      }

      dataStore.setData({
        merchant: result.merchant,
        payers: [],
        amounts: [parseEther(formatUnits(result.amount, getToken(result.token)?.decimals || 18))],
        type: TransactionType.Recurrent,
        description: dataStore.data?.description || result.description,
        metadata: dataStore.data?.metadata,
        subscriptionId: result.subsciptionId,
        token: result.token,
        splitPayment: false
      });
    });
  }
};

const getTransaction = async (transactionId: Hex) => {
  beamSdk.oneTimeTransaction.getTransaction({
    transactionId
  }).then(result => {
    if (!result) {
      notify.push({
        title: "Transaction not found!",
        description: "Try again",
        category: "error"
      });
      return;
    }

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
      splitPayment: false,
    });

    getSubscription();
  });
};

onMounted(async () => {
  const params = new URLSearchParams(window.location.search);
  const session = params.get("session");
  const initiator = params.get("initiator");
  const transactionId = params.get("tx") as Hex | null;

  if (!initiator) {
    notify.push({
      title: 'Invalid payment link!',
      description: 'Try again.',
      category: 'error'
    });
    return;
  }

  if (session && initiator) {
    window.addEventListener('message', (event) => {
      if (initiator == event.origin && !dataStore.data) {
        dataStore.setData(JSON.parse(event.data));
        getSubscription();
      }
    });
  } else if (transactionId) {
    getTransaction(transactionId);
  } else {
    notify.push({
      title: 'Invalid payment link!',
      description: 'Try again.',
      category: 'error'
    });
  }

  dataStore.setInitiator({
    url: initiator,
    title: await getWebsiteTitle(initiator),
    favicon: getFavicon(initiator)
  });
});
</script>

<template>
  <RouterView />
</template>
