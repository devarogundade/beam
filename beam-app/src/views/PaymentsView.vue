<script setup lang="ts">
import CheckoutPrompt from '@/components/CheckoutPrompt.vue';
import { useWalletStore } from '@/stores/wallet';

const walletStore = useWalletStore();
</script>

<template>
    <CheckoutPrompt v-if="!walletStore.clientMerchant" />
    <RouterView v-else />
</template>