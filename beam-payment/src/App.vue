<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue';
import { onMounted } from 'vue';
import { useDataStore } from './stores/data';
import ProgressBox from './components/ProgressBox.vue';

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

onMounted(async () => {
  const params = new URLSearchParams(window.location.search);
  const session = params.get("session");
  const initiator = params.get("initiator");

  if (!initiator) return;

  window.addEventListener('message', (event) => {
    if (initiator == event.origin) {
      dataStore.setData(event.data);
    }
  });

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

<style scoped></style>
