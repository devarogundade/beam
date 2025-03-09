<script setup lang="ts">
import { useRoute } from 'vue-router';
import BellIcon from './icons/BellIcon.vue';
import MetamaskIcon from './icons/MetamaskIcon.vue';
import { ref, watch, type Component } from 'vue';

import TreasuryIcon from './icons/TreasuryIcon.vue';
import PaymentsIcon from './icons/PaymentsIcon.vue';
import { useWalletStore } from '@/stores/wallet';
import { Connection } from '@/scripts/types';
import Converter from '@/scripts/converter';
import EyeIcon from './icons/EyeIcon.vue';

interface Props {
    parent?: string;
    title: string;
    icon: Component;
}

const route = useRoute();
const walletStore = useWalletStore();

const props = ref<Props>({
    title: 'Treasury',
    icon: TreasuryIcon
});

watch(route, (newValue) => {
    if (newValue.name?.toString() === 'treasury') {
        props.value = {
            title: 'Treasury',
            icon: TreasuryIcon
        };
    } else if (newValue.name?.toString().startsWith('payments-checkouts')) {
        props.value = {
            parent: 'Payments',
            title: 'Checkouts',
            icon: PaymentsIcon
        };
    } else if (newValue.name?.toString().startsWith('payments-subscriptions')) {
        props.value = {
            parent: 'Payments',
            title: 'Subscriptions',
            icon: PaymentsIcon
        };
    }
});
</script>

<template>
    <header>
        <div class="header_info">
            <div class="icon_wrapper">
                <component :is="props.icon" />
            </div>

            <p>
                <span v-if="props.parent">{{ props.parent }} /</span>
                {{ props.title }}
            </p>
        </div>

        <div class="actions">
            <div class="bell_wrapper">
                <BellIcon />
            </div>

            <button>
                <WalletIcon v-if="!walletStore.address" />
                <MetamaskIcon v-else-if="walletStore.connection == Connection.Wallet" />
                <EyeIcon v-else="walletStore.connection == Connection.Guest" />
                <p>{{ walletStore.address ? Converter.fineAddress(walletStore.address, 5) : 'Connect Wallet' }}</p>
            </button>
        </div>
    </header>
</template>

<style scoped>
header {
    top: 0;
    position: sticky;
    z-index: 99;
    background: var(--bg);
    height: 90px;
    display: flex;
    align-items: center;
    margin: 0 50px;
    justify-content: space-between;
    border-bottom: 1px solid var(--bg-lightest);
}

.header_info {
    display: flex;
    align-items: center;
    gap: 20px;
}

.header_info p {
    font-size: 20px;
    line-height: 25px;
    letter-spacing: 2%;
    color: var(--tx-normal);
}

.header_info p span {
    color: var(--tx-dimmed);
}

.icon_wrapper {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    border: 1px solid var(--bg-lightest);
    display: flex;
    align-items: center;
    justify-content: center;
}

.bell_wrapper {
    width: 40px;
    height: 40px;
    border-radius: 6px;
    background: var(--bg);
    border: 1px solid var(--bg-lightest);
    display: flex;
    align-items: center;
    justify-content: center;
}

.actions {
    display: flex;
    align-items: center;
    gap: 16px;
}

.actions button {
    gap: 12px;
    height: 40px;
    display: flex;
    align-items: center;
    padding: 0 20px;
    border-radius: 6px;
    background: var(--bg);
    border: 1px solid var(--bg-lightest);
    cursor: pointer;
}

.actions button p {
    font-size: 14px;
    line-height: 16.8px;
    letter-spacing: 2%;
    color: var(--tx-normal);
}
</style>