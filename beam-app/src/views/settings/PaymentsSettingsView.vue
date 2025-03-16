<script setup lang="ts">
import ChevronRightIcon from '@/components/icons/ChevronRightIcon.vue';
import { MultiSigContract } from '@/scripts/contract';
import { useWalletStore } from '@/stores/wallet';
import type { Hex } from 'viem';
import { onMounted, ref, watch } from 'vue';
import BeamSDK from 'beam-ts/src';
import { Connection, Network } from '@/scripts/types';
import { getTokens } from 'beam-ts/src/utils/constants';
import { notify } from '@/reactives/notify';

const walletStore = useWalletStore();
const tokens = ref<Hex[]>();

const beamSdk = new BeamSDK({
    network: Network.Testnet
});

const addOrRemoveToken = (token: Hex) => {
    if (!tokens.value) return;

    const index = tokens.value.findIndex(t => t == token);

    if (index >= 0) {
        tokens.value.splice(index, 1);
    } else {
        tokens.value.push(token);
    }
};

const saveChanges = async () => {
    if (!walletStore.merchant) return;
    if (!tokens.value) return;
    if (walletStore.connection != Connection.Wallet) return;
    if (tokens.value.length == 0) return;

    const txHash = await MultiSigContract.updateTokens(
        walletStore.merchant.wallet,
        tokens.value
    );

    if (txHash) {
        walletStore.setMerchant({
            ...walletStore.merchant,
            tokens: tokens.value
        });

        notify.push({
            title: 'Changes saved!',
            description: 'Transaction was sent.',
            category: "success",
            linkTitle: 'View Trx',
            linkUrl: `${import.meta.env.VITE_EXPLORER_URL}/tx/${txHash}`
        });
    } else {
        notify.push({
            title: 'Failed to save changes!',
            description: 'Try again',
            category: "error"
        });
    }
};


const getMerchant = async () => {
    if (!walletStore.merchant) return;

    const merchant = await beamSdk.merchant.getMerchant({
        merchant: walletStore.merchant.merchant
    });

    walletStore.setMerchant(merchant);
};

onMounted(() => {
    if (!walletStore.merchant) return;
    tokens.value = walletStore.merchant.tokens;
    getMerchant();
});

watch(walletStore, () => {
    if (!walletStore.merchant) return;
    tokens.value = walletStore.merchant.tokens;
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

            <button :class="tokens && tokens.length > 0 ? 'next_active next' : 'next'" @click="saveChanges">
                <p>Save Changes</p>
                <ChevronRightIcon />
            </button>
        </div>

        <div class="wrapper">
            <div class="form">
                <div class="grace_period">
                    <div class="label">
                        <h3>Grace Period</h3>
                        <p>Set grace period durations for subscription plans.</p>
                    </div>

                    <div class="grace_period_input">
                        <input type="number" placeholder="0">
                        <p>Days</p>
                    </div>
                </div>

                <div class="assets">
                    <div class="label">
                        <h3>Payment Assets</h3>
                        <p>Assets types to be acceptable as payment from customers.</p>
                    </div>

                    <div class="tokens">
                        <div v-for="token in getTokens"
                            :class="tokens?.includes(token.address) ? 'token token_selected' : 'token'"
                            @click="addOrRemoveToken(token.address)">
                            <div class="token_info">
                                <img :src="token.image" alt="">
                                <p>{{ token.symbol }}</p>
                            </div>
                            <div class="radio">
                                <div>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
    padding: 60px 0;
    display: flex;
    justify-content: center;
    width: 100%;
}

.form {
    width: 550px;
}

.grace_period {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--bg-lightest);
    padding-bottom: 40px;
}

.grace_period_input {
    display: grid;
    grid-template-columns: 70px 65px;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid var(--bg-lightest);
}

.grace_period_input input {
    height: 44px;
    background: none;
    outline: none;
    border: none;
    padding: 0 14px;
    font-size: 14px;
    color: var(--tx-normal);
}

.grace_period_input p {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 44px;
    font-size: 14px;
    color: var(--tx-normal);
    background: var(--bg-light);
    border: 1px solid var(--bg-lightest);
    border-radius: 0 8px 8px 0;
}

.assets {
    margin-top: 40px;
}

.label h3 {
    font-weight: 400;
    font-size: 16px;
    color: var(--tx-normal);
}

.label p {
    margin-top: 10px;
    font-size: 14px;
    color: var(--tx-dimmed);
}

.tokens {
    margin-top: 24px;
    display: grid;
    align-items: center;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
}

.token {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 44px;
    border-radius: 8px 10px 10px 8px;
    border: 1px solid var(--bg-lighter);
    cursor: pointer;
    user-select: none;
}

.token_info {
    padding: 0 14px;
    display: flex;
    align-items: center;
    gap: 12px;
}

.token_info img {
    width: 20px;
    height: 20px;
    border-radius: 10px;
}

.token_info p {
    color: var(--tx-normal);
    font-size: 14px;
}

.token .radio {
    width: 44px;
    height: 100%;
    border: 1px solid var(--bg-lightest);
    border-radius: 0 8px 8px 0;
    background: var(--bg-light);
    display: flex;
    align-items: center;
    justify-content: center;
}

.token .radio div {
    width: 20px;
    height: 20px;
    border-radius: 4px;
    border: 1px solid var(--bg-lightest);
    background: var(--bg);
    display: flex;
    align-items: center;
    justify-content: center;
}

.token .radio div span {
    width: 14px;
    height: 14px;
    border-radius: 2px;
}

.token_selected .radio div {
    border: 1px solid var(--primary-light);
}

.token_selected .radio div span {
    background: var(--primary);
}
</style>