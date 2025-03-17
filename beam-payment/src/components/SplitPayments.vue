<script setup lang="ts">
import PlusIcon from '@/components/icons/PlusIcon.vue';
import TrashIcon from '@/components/icons/TrashIcon.vue';
import { useDataStore } from '@/stores/data';
import { useWalletStore } from '@/stores/wallet';
import { formatEther, parseEther, type Hex } from 'viem';
import { onMounted, ref, watch } from 'vue';
import CloseIcon from './icons/CloseIcon.vue';
import CheckIcon from './icons/CheckIcon.vue';
import EraserIcon from './icons/EraserIcon.vue';
import { Token } from 'beam-ts/src/types';
import { getToken } from 'beam-ts/src/utils/constants';
import Converter from '@/scripts/converter';
import { notify } from '@/reactives/notify';

const emit = defineEmits(['close']);

interface Payer {
    name: string;
    address: Hex | null;
    amount: number;
    disabled: boolean;
}

const isValid = ref<boolean>(false);
const dataStore = useDataStore();
const walletStore = useWalletStore();
const unsavedPayers = ref<Payer[]>([]);
const totalAmount = ref<number>(0);
const token = ref<Token | undefined>(undefined);

const confirm = () => {
    if (!walletStore.address) return;
    if (!dataStore.data) return;
    if (!isValid.value) return;

    const amounts = unsavedPayers.value.map(payer => parseEther(payer.amount.toString()));
    const payers = unsavedPayers.value.filter(payer => payer.address != null).map(payer => payer.address!);

    dataStore.setData({ ...dataStore.data, amounts: amounts, payers: payers });

    notify.push({
        title: "Changes saved!",
        description: "Payment splited into " + payers.length + " payers.",
        category: "success"
    });

    emit('close');
};

const addPayer = () => {
    unsavedPayers.value.push({
        name: 'Payer ' + unsavedPayers.value.length,
        address: null,
        amount: 0,
        disabled: false
    });
};

const removePayer = (index: number) => {
    unsavedPayers.value.splice(index, 1);
};

watch(unsavedPayers, () => {
    isValid.value =
        unsavedPayers.value.every(signer => signer.name.length >= 1 && signer.address?.length === 42 && signer.amount > 0)
        && unsavedPayers.value.reduce((a, b) => a + b.amount, 0) == totalAmount.value;
}, { deep: true });

onMounted(() => {
    if (!dataStore.data) return;
    if (!walletStore.address) return;
    if (!dataStore.data.amounts) return;

    token.value = getToken(dataStore.data.token);
    const amounts: bigint[] = dataStore.data.amounts;
    const payers: Hex[] = (dataStore.data.payers && dataStore.data.payers.length > 0) ? dataStore.data.payers : [walletStore.address];

    if (amounts.length != payers.length) {
        notify.push({
            title: "Unable to split payment",
            description: "Try again.",
            category: "error"
        });
        return;
    }

    totalAmount.value = Number(
        formatEther(amounts.reduce((a, b) => a + b, BigInt(0)))
    );

    unsavedPayers.value = amounts.map((amount, index) => {
        return {
            address: payers[index],
            amount: Number(formatEther(amount)),
            disabled: payers[index] == walletStore.address,
            name: payers[index] == walletStore.address ? 'You' : `Payer ${index + 1}`
        };
    });

    isValid.value =
        unsavedPayers.value.every(signer => signer.name.length >= 1 && signer.address?.length === 42 && signer.amount > 0)
        && unsavedPayers.value.reduce((a, b) => a + b.amount, 0) == totalAmount.value;
});
</script>

<template>
    <div class="overlay">
        <div class="form">
            <div class="title">
                <p>Split Payment <span>{{ Converter.toMoney(totalAmount) }} {{ token?.symbol }}</span></p>

                <div class="close" @click="emit('close')">
                    <CloseIcon />
                </div>
            </div>

            <div class="scroll">
                <div v-for="(signer, index) in unsavedPayers" :key="index" class="signer_card">
                    <div class="input">
                        <div class="name">
                            <p>{{ signer.name }}</p>

                            <button v-if="index == 0 && unsavedPayers.length <= 3" @click="addPayer"
                                class="add_signer_btn">
                                <PlusIcon />
                                <p>Add Payer</p>
                            </button>

                            <button v-if="index > 0" @click="removePayer(index)" class="remove_btn">
                                <TrashIcon />
                            </button>
                        </div>
                        <div class="input_field">
                            <p>Amount</p>
                            <input v-model="signer.amount" type="number" placeholder="0.00" />
                        </div>
                    </div>

                    <div class="address">
                        <p>Address</p>
                        <input v-model="signer.address" type="text" :disabled="signer.disabled"
                            placeholder="Wallet Address" />
                    </div>
                </div>
            </div>

            <div class="actions">
                <div class="buttons">
                    <button @click="emit('close')">
                        <EraserIcon />
                        <p>Cancel</p>
                    </button>

                    <button @click="confirm" :disabled="!isValid">
                        <CheckIcon />
                        <p>Confirm</p>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.overlay {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    position: fixed;
    background: rgba(51, 51, 51, 0.35);
    backdrop-filter: blur(5px);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
}

.form {
    width: 450px;
    border-radius: 16px;
    background: var(--bg);
    overflow: hidden;
}

.title {
    padding: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.title p {
    font-size: 16px;
    color: var(--tx-normal);
}

.title p span {
    margin-left: 16px;
    color: var(--tx-semi);
}

.close {
    width: 36px;
    height: 30px;
    border-radius: 6px;
    cursor: pointer;
    border: 1px solid var(--bg-lightest);
    display: flex;
    align-items: center;
    justify-content: center;
}

.scroll {
    overflow-y: auto;
    max-height: calc(100vh - 280px);
    padding: 30px;
    border-top: 1px solid var(--bg-lightest);
}

.signer_card {
    border-bottom: 1px solid var(--bg-lightest);
    margin-bottom: 30px;
    padding-bottom: 30px;
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

.signer_card:last-child {
    border: none;
    margin-bottom: 0;
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

.actions {
    padding: 24px;
    background: var(--bg-light);
    border-top: 1px solid var(--bg-lightest);
}

.actions button {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background: none;
    gap: 10px;
    width: 100%;
    border: 1px solid var(--bg-lightest);
    height: 40px;
    cursor: pointer;
}

.actions button p {
    font-size: 14px;
    color: var(--tx-semi);
}

.actions button:last-child {
    background: var(--primary);
}

.actions button:last-child p {
    color: var(--tx-normal);
}

.actions button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.actions .buttons {
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(2, 1fr);
}
</style>