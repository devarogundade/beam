<script setup lang="ts">
import { onMounted } from 'vue';

onMounted(() => {
  window.addEventListener('message', (event) => {
    console.log('Message event:', event);
    console.log('Message event data:', event.data);
  });
});
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
