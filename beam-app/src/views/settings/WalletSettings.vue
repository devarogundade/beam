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

    const txHash = await MultiSigContract.updateSigners(
        walletStore.merchant.wallet,
        signers.value.filter(s => s.address != null).map((s) => s.address!),
        threshold.value
    );

    if (txHash) {
        walletStore.setMerchant({
            ...walletStore.merchant,
            signers: signers.value.filter(s => s.address != null).map((s) => s.address!),
            minSigners: threshold.value
        });
    } else {

    }
};

interface Signer {
    name: string;
    address: Hex | null;
    disabled: boolean;
}

const signers = ref<Signer[]>([]);

const addSigner = () => {
    signers.value.push({ name: 'My Wallet ' + signers.value.length, address: null, disabled: false });
};

const removeSigner = (index: number) => {
    signers.value.splice(index, 1);
    if (threshold.value > signers.value.length) {
        threshold.value = signers.value.length;
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
    signers.value = walletStore.merchant.signers.map((s, index) => {
        return {
            address: s,
            name: index == 0 ? 'My Main Wallet' : `Signer ${index}`,
            disabled: index == 0
        };
    });
    threshold.value = walletStore.merchant.minSigners;

    getSigners();
});

watch(walletStore, () => {
    if (!walletStore.merchant) return;
    signers.value = walletStore.merchant.signers.map((s, index) => {
        return {
            address: s,
            name: index == 0 ? 'My Main Wallet' : `Signer ${index}`,
            disabled: index == 0
        };
    });
    threshold.value = walletStore.merchant.minSigners;
});

watch(signers, () => {
    isValid.value = signers.value.every(signer => signer.name.length >= 1 && signer.address?.length === 42) && walletStore.connection == Connection.Wallet;
}, { deep: true });
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
                    <button class="title title_active">
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
                <div v-for="(signer, index) in signers" :key="index" class="signer_card">
                    <div class="input">
                        <div class="name">
                            <p>Signer {{ index + 1 }}</p>

                            <button v-if="index == 0" @click="addSigner" class="add_signer_btn">
                                <PlusIcon />
                                <p>Add Signer</p>
                            </button>

                            <button v-if="index > 0" @click="removeSigner(index)" class="remove_btn">
                                <TrashIcon />
                            </button>
                        </div>
                        <div class="input_field">
                            <p>Name</p>
                            <input v-model="signer.name" type="text" placeholder="Signer Name" />
                        </div>
                    </div>

                    <div class="address">
                        <p>Address</p>
                        <input v-model="signer.address" type="text" :disabled="signer.disabled"
                            placeholder="Wallet Address" />
                    </div>
                </div>

                <div class="threshold">
                    <div class="text">
                        <p>Threshold</p>
                        <p>Set Number of Confirmations required for each transaction.</p>
                    </div>

                    <select v-model="threshold">
                        <option v-for="n in signers.length" :key="n" :value="n">{{ n }}</option>
                    </select>
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
    padding: 20px 0;
    display: flex;
    justify-content: center;
    width: 100%;
}

.form {
    width: 550px;
}

.signer_card {
    padding: 40px 0;
    border-bottom: 1px solid var(--bg-lightest);
}

.signer_card .name {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 30px;
    margin-bottom: 24px;
}

.signer_card .name>p {
    font-size: 14px;
    color: var(--tx-semi);
}

.input_field {
    display: grid;
    grid-template-columns: 72px 1fr;
    height: 44px;
    border: 1px solid var(--bg-lightest);
    border-radius: 8px;
    overflow: hidden;
}

.input_field p {
    font-size: 14px;
    color: var(--tx-semi);
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-light);
    border-right: 1px solid var(--bg-lightest);
}

.input_field input {
    padding: 10px;
    background: none;
    color: var(--tx-normal);
    border-radius: 5px;
    height: 100%;
    border: none;
    outline: none;
}

.address {
    margin-top: 24px;
}

.address p {
    font-size: 14px;
    color: var(--tx-semi);
}

.address input {
    padding: 0 10px;
    background: var(--bg-light);
    color: var(--tx-normal);
    height: 44px;
    border: 1px solid var(--bg-lightest);
    border-radius: 5px;
    width: 100%;
    outline: none;
    margin-top: 24px;
}

.add_signer_btn {
    color: var(--tx-normal);
    background: none;
    display: flex;
    align-items: center;
    gap: 8px;
}

.add_signer_btn p {
    font-size: 14px;
    color: var(--tx-normal);
}

.remove_btn {
    background: none;
    border: 1px solid var(--bg-lightest);
    border-radius: 6px;
    width: 36px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.signer_card button {
    padding: 10px;
    margin-top: 10px;
    border: none;
    cursor: pointer;
    font-size: 16px;
}

.threshold {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 40px 0;
}

.threshold .text p:first-child {
    font-size: 14px;
    color: var(--tx-normal);
}

.threshold .text p:last-child {
    margin-top: 8px;
    font-size: 14px;
    color: var(--tx-dimmed);
}

.threshold select {
    padding: 10px;
    background: var(--bg-light);
    color: var(--tx-normal);
    border: 1px solid var(--bg-lightest);
    border-radius: 8px;
    width: 68px;
    height: 44px;
    outline: none;
}
</style>