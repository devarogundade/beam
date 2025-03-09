<script setup lang="ts">
import { useWalletStore } from '@/stores/wallet';
import BeamLogo from './icons/BeamLogo.vue';
import BellIcon from './icons/BellIcon.vue';
import MetamaskIcon from './icons/MetamaskIcon.vue';
import WalletIcon from './icons/WalletIcon.vue';
import Converter from '@/scripts/converter';
import { Connection } from '@/scripts/types';
import EyeIcon from './icons/EyeIcon.vue';


const walletStore = useWalletStore();
</script>

<template>
    <header>
        <BeamLogo />

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
    justify-content: center;
    padding: 0 20px;
    border-radius: 6px;
    background: var(--bg-light);
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