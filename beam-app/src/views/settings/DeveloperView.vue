<script setup lang="ts">
import ChevronRightIcon from '@/components/icons/ChevronRightIcon.vue';
import { HookManagerContract } from '@/scripts/contract';
import { useWalletStore } from '@/stores/wallet';
import { zeroAddress, type Hex } from 'viem';
import { onMounted, ref, watch } from 'vue';
import BeamSDK from 'beam-ts/src';
import { Connection, Network } from '@/scripts/types';
import { notify } from '@/reactives/notify';
import { Client } from '@/scripts/client';

const webhook = ref<string>('');
const hook = ref<string>('');
const walletStore = useWalletStore();

const beamSdk = new BeamSDK({
    network: Network.Testnet
});

const saveChanges = async () => {
    if (!walletStore.merchant) return;
    if (walletStore.connection != Connection.Wallet) return;
    if (webhook.value.length > 0 && !webhook.value.startsWith('https://')) {
        notify.push({
            title: 'Enter a valid URL!',
            description: 'Try again.',
            category: "error"
        });
        return;
    }

    if (webhook.value.startsWith('https://')) {
        await Client.updateWebhooks({
            merchant: walletStore.merchant.merchant,
            webhooks: [webhook.value]
        });
    } else {
        await Client.updateWebhooks({
            merchant: walletStore.merchant.merchant,
            webhooks: []
        });
    }

    notify.push({
        title: 'Changes saved!',
        description: 'Webhooks has been updated.',
        category: "success"
    });

    if (hook.value.length == 42) {
        const txHash = await HookManagerContract.register(
            { hook: hook.value as Hex }
        );

        if (txHash) {
            walletStore.setMerchant({
                ...walletStore.merchant,
                hook: hook.value as Hex
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
    }

    getMerchant();
};

const getMerchant = async () => {
    if (!walletStore.address) return;
    if (!walletStore.merchant) return;

    const merchant = await beamSdk.merchant.getMerchant({
        merchant: walletStore.merchant.merchant
    });

    const clientMerchant = await Client.getMerchant(walletStore.address);

    walletStore.setClientMerchant(clientMerchant);
    walletStore.setMerchant(merchant);
};

onMounted(() => {
    if (!walletStore.merchant) return;
    getMerchant();

    hook.value = walletStore.merchant.hook;

    if (!walletStore.clientMerchant) return;
    webhook.value = walletStore.clientMerchant.webhooks.length > 0
        ? walletStore.clientMerchant.webhooks[0] : '';
});

watch(walletStore, () => {
    if (!walletStore.merchant) return;

    hook.value = walletStore.merchant.hook;

    if (!walletStore.clientMerchant) return;
    webhook.value = walletStore.clientMerchant.webhooks.length > 0
        ? walletStore.clientMerchant.webhooks[0] : '';
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
                    <button class="title">
                        <p>Payments</p>
                    </button>
                </RouterLink>
                <RouterLink to="/settings/wallet">
                    <button class="title ">
                        <p>MultiSig Wallet</p>
                    </button>
                </RouterLink>
                <RouterLink to="/settings/developer">
                    <button class="title title_active">
                        <p>Dev & Plugins</p>
                    </button>
                </RouterLink>
            </div>

            <button :class="webhook.length >= 0 || hook.length == 42 ? 'next_active next' : 'next'"
                @click="saveChanges">
                <p>Save Changes</p>
                <ChevronRightIcon />
            </button>
        </div>

        <div class="wrapper">
            <div class="form">
                <div class="webhooks">
                    <div class="label">
                        <h3>Webhooks</h3>
                        <p>Listen to beam on-chain events from your server.</p>
                    </div>

                    <input type="text" placeholder="https://" v-model="webhook">
                </div>

                <div class="hooks">
                    <div class="label">
                        <h3>Hook</h3>
                        <p>Assets types to be acceptable as payment from customers.</p>
                    </div>

                    <input type="text" placeholder="0x" v-model="hook">
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

.webhooks {
    border-bottom: 1px solid var(--bg-lightest);
    padding-bottom: 40px;
}

.hooks {
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

input {
    margin-top: 20px;
    height: 44px;
    width: 100%;
    border-radius: 8px;
    background: none;
    border: 1px solid var(--bg-lightest);
    color: var(--tx-normal);
    padding: 0 16px;
    outline: none;
    font-size: 14px;
}
</style>