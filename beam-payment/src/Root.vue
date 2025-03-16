<script setup lang="ts">
import NotifyPop from '@/components/NotifyPop.vue';
import AppHeader from '@/components/AppHeader.vue';
</script>

<template>
    <AppHeader />
    <RouterView />
    <NotifyPop />
</template>