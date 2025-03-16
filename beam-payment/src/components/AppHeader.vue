<script setup lang="ts">
import WalletIcon from './icons/WalletIcon.vue';
import MetamaskIcon from './icons/MetamaskIcon.vue';
import { useDataStore } from '@/stores/data';
import { config, chains } from '@/scripts/config';
import { useWalletStore } from '@/stores/wallet';
import { createWeb3Modal } from '@web3modal/wagmi/vue';
import { useWeb3Modal } from '@web3modal/wagmi/vue';
import { watchAccount } from '@wagmi/core';
import { onMounted } from 'vue';
import BeamLogo from './icons/BeamLogo.vue';
import Converter from '@/scripts/converter';

const dataStore = useDataStore();
const walletStore = useWalletStore();

createWeb3Modal({
    wagmiConfig: config,
    projectId: import.meta.env.VITE_PROJECT_ID,
    // @ts-ignore
    chains: chains,
    enableAnalytics: true,
    themeMode: 'dark'
});

const modal = useWeb3Modal();

onMounted(() => {
    watchAccount(config, {
        onChange(account) {
            if (account.address) {
                walletStore.setAddress(account.address);
            }
        },
    });
});
</script>

<template>
    <section>
        <div class="app_width">
            <header>
                <BeamLogo />

                <div class="actions">

                    <a v-if="dataStore.initiator" :href="dataStore.initiator.url" target="_blank">
                        <div class="from">
                            <p>From</p>

                            <div class="app">
                                <img
                                    :src="dataStore.initiator.favicon ? dataStore.initiator.favicon : '/images/placeholder.png'" />
                                <p>{{ dataStore.initiator.title }}</p>
                            </div>
                        </div>
                    </a>
                    <div class="connect">
                        <button @click="modal.open()">
                            <WalletIcon v-if="!walletStore.address" />
                            <MetamaskIcon v-else />
                            <p>{{ walletStore.address ? Converter.fineAddress(walletStore.address, 5) : 'Connect Wallet'
                                }}</p>
                        </button>
                    </div>
                </div>
            </header>
        </div>
    </section>
</template>

<style scoped>
section {
    top: 0;
    position: sticky;
    z-index: 99;
    background: var(--bg);
}

header {
    height: 90px;
    display: flex;
    align-items: center;
    margin: 0 50px;
    justify-content: space-between;
    border-bottom: 1px solid var(--bg-lightest);
}

.from {
    display: flex;
    align-items: center;
    gap: 20px;
}

.from>p {
    font-size: 16px;
    color: var(--tx-normal);
}

.app {
    display: flex;
    align-items: center;
    gap: 14px;
}

.app img {
    width: 30px;
    height: 30px;
}

.app p {
    font-size: 14px;
    color: var(--tx-dimmed);
}

.actions {
    display: flex;
    align-items: center;
    gap: 20px;
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