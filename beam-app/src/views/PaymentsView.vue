<script setup lang="ts">
import CheckoutPrompt from '@/components/CheckoutPrompt.vue';
import { ref } from 'vue';

const hasCheckout = ref<boolean>(false);
</script>

<template>
    <CheckoutPrompt v-if="!hasCheckout" />
    <RouterView v-else />
</template>