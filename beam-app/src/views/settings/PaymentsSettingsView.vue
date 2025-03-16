<script setup lang="ts">
import ChevronRightIcon from '@/components/icons/ChevronRightIcon.vue';
import PlusIcon from '@/components/icons/PlusIcon.vue';
import TrashIcon from '@/components/icons/TrashIcon.vue';
import { MultiSigContract } from '@/scripts/contract';
import { useWalletStore } from '@/stores/wallet';
import type { Hex } from 'viem';
import { onMounted, ref, watch } from 'vue';
import BeamSDK from 'beam-ts/src';
import { Connection, Network } from '@/scripts/types';

const isValid = ref<boolean>(false);
const walletStore = useWalletStore();
const threshold = ref<number>(1);

const beamSdk = new BeamSDK({
    network: Network.Testnet
});

const saveChanges = async () => {
    if (!walletStore.merchant) return;
    if (walletStore.connection != Connection.Wallet) return;
    if (!isValid.value) {
        return;
    }


};


const getSigners = async () => {
    if (!walletStore.merchant) return;

    const merchant = await beamSdk.merchant.getMerchant({
        merchant: walletStore.merchant.merchant
    });

    walletStore.setMerchant(merchant);
};

onMounted(() => {
    if (!walletStore.merchant) return;


    getSigners();
});

watch(walletStore, () => {
    if (!walletStore.merchant) return;

});

</script>

<template>
    <div class="container">
        <div class="toolbar">
            <div class="titles">
                <RouterLink to="/settings">
                    <button class="title">
                        <p>General</p>
                    </button>
                </RouterLink>
                <RouterLink to="/settings/payments">
                    <button class="title title_active">
                        <p>Payments</p>
                    </button>
                </RouterLink>
                <RouterLink to="/settings/wallet">
                    <button class="title ">
                        <p>MultiSig Wallet</p>
                    </button>
                </RouterLink>
            </div>

            <button :class="isValid ? 'next_active next' : 'next'" @click="saveChanges">
                <p>Save Changes</p>
                <ChevronRightIcon />
            </button>
        </div>

        <div class="wrapper">
            <div class="form">

            </div>
        </div>
    </div>
</template>

<style scoped>
.container {
    padding: 0 50px;
    padding-bottom: 40px;
}

.toolbar {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 78px;
    border-bottom: 1px solid var(--bg-lightest);
}

.next {
    border-radius: 6px;
    border: 1px solid var(--bg-lightest);
    display: flex;
    align-items: center;
    padding: 0 12px;
    gap: 10px;
    justify-content: center;
    height: 32px;
    background: none;
    cursor: pointer;
}

.next p {
    font-size: 14px;
    color: var(--tx-normal);
}

.next_active {
    background: var(--primary);
}

.titles {
    height: 100%;
}

.title {
    padding: 0 24px;
    height: 100%;
    text-align: center;
    border: none;
    background: none;
    cursor: pointer;
}

.title_active {
    border-bottom: 1px solid var(--primary);
}

.title p {
    font-size: 16px;
    color: var(--tx-dimmed);
}


.title_active p {
    color: var(--tx-normal);
}

.wrapper {
    padding: 20px 0;
    display: flex;
    justify-content: center;
    width: 100%;
}

.form {
    width: 550px;
}
</style>