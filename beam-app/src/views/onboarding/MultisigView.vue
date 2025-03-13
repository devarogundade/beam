<script setup lang="ts">
import ChevronLeftIcon from '@/components/icons/ChevronLeftIcon.vue';
import ChevronRightIcon from '@/components/icons/ChevronRightIcon.vue';
import PlusIcon from '@/components/icons/PlusIcon.vue';
import TrashIcon from '@/components/icons/TrashIcon.vue';
import { useWalletStore } from '@/stores/wallet';
import type { Hex } from 'viem';
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isValid = ref<boolean>(false);
const walletStore = useWalletStore();
const threshold = ref<number>(1);

const next = () => {
    if (!walletStore.merchant) return;
    if (!isValid.value) {
        return;
    }

    let metadata_value = JSON.parse(walletStore.merchant.metadata_value);
    metadata_value = {
        ...metadata_value,
        signers: signers.value.filter(s => s.address != null).map(signer => signer.name),
    };


    walletStore.merchant = {
        ...walletStore.merchant,
        metadata_value: JSON.stringify(metadata_value),
        signers: signers.value.filter(s => s.address != null).map(signer => signer.address!),
        minSigners: threshold.value
    };

    router.push('/onboarding/review');
};

interface Signer {
    name: string;
    address: Hex | null;
    disabled: boolean;
}

const signers = ref<Signer[]>([
    { name: 'My Main Wallet', address: walletStore.address, disabled: true }
]);

const addSigner = () => {
    signers.value.push({ name: '', address: null, disabled: false });
};

const removeSigner = (index: number) => {
    signers.value.splice(index, 1);
    if (threshold.value > signers.value.length) {
        threshold.value = signers.value.length;
    }
};

onMounted(() => {
    if (!walletStore.address || !walletStore.merchant) router.push('/onboarding');
    isValid.value = signers.value.every(signer => signer.name.length >= 1 && signer.address?.length === 42);
});

watch(signers, () => {
    isValid.value = signers.value.every(signer => signer.name.length >= 1 && signer.address?.length === 42);
}, { deep: true });
</script>

<template>
    <section>
        <div class="app_width">
            <div class="container">
                <div class="toolbar">
                    <RouterLink to="/onboarding/profile">
                        <button class="back">
                            <ChevronLeftIcon />
                            <p>Back</p>
                        </button>
                    </RouterLink>

                    <div class="titles">
                        <button class="title">
                            <p>Merchant Profile</p>
                        </button>
                        <button class="title title_active">
                            <p>MultiSig Wallet</p>
                        </button>
                        <button class="title">
                            <p>Review</p>
                        </button>
                    </div>

                    <button :class="isValid ? 'next_active next' : 'next'" @click="next">
                        <p>Next</p>
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
        </div>
    </section>
</template>

<style scoped>
.toolbar {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 78px;
    border-bottom: 1px solid var(--bg-lightest);
}

.back,
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

.back p,
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