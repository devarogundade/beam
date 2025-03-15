<script setup lang="ts">
import ChevronRightIcon from '@/components/icons/ChevronRightIcon.vue';
import CompletedIcon from '@/components/icons/CompletedIcon.vue';
import OutIcon from '@/components/icons/OutIcon.vue';
import PendingIcon from '@/components/icons/PendingIcon.vue';
import ProgressBox from '@/components/ProgressBox.vue';
import { Client } from '@/scripts/client';
import Converter from '@/scripts/converter';
import { SaleStatus, type Sale } from '@/scripts/types';
import { useWalletStore } from '@/stores/wallet';
import { onMounted, ref } from 'vue';
import { getToken } from "../../../../beam-sdk/src/utils/constants";

const VITE_EXPLORER_URL = import.meta.env.VITE_EXPLORER_URL;

const walletStore = useWalletStore();
const progress = ref<boolean>(false);
const sales = ref<Sale[]>([]);

const getSales = async (load: boolean = true) => {
    if (!walletStore.address) return;
    progress.value = load;
    sales.value = await Client.getSales(
        walletStore.address
    );
    progress.value = false;
};

onMounted(() => {
    getSales();
});
</script>

<template>
    <ProgressBox v-if="progress" />
    <div class="sales" v-else>
        <table>
            <thead>
                <tr>
                    <td>Info</td>
                    <td>Time</td>
                    <td>Status</td>
                    <td>Buyer</td>
                    <td>Amount</td>
                    <td></td>
                </tr>
            </thead>

            <tbody>
                <tr v-for="sale, index in sales" :key="index">
                    <td>
                        <div class="product">
                            <img :src="sale.product?.images[0]" :alt="sale.product?.name">

                            <div class="product_info">
                                <p>{{ sale.product?.name }}</p>
                                <p><span>Qty:</span> {{ sale.quantity }}</p>
                            </div>
                        </div>
                    </td>

                    <td>
                        <div class="time">
                            <p>
                            {{
                                Intl.DateTimeFormat('en-US', {
                                    day: '2-digit',
                                    month: 'short',
                                }).format(new Date(sale.createdAt))
                            }}
                            </p>
                            <p>
                            {{
                                Intl.DateTimeFormat('en-US', {
                                    second: '2-digit',
                                    minute: '2-digit',
                                    hour: '2-digit'
                                }).format(new Date(sale.createdAt))
                            }}
                            </p>
                        </div>
                    </td>

                    <td>
                        <div class="status" v-if="sale.status == SaleStatus.Pending">
                            <PendingIcon />
                            <p>Pending</p>
                        </div>

                        <div class="status" v-else-if="sale.status == SaleStatus.Completed">
                            <CompletedIcon />
                            <p>Completed</p>
                        </div>
                    </td>

                    <td>
                        <div class="buyer">
                            <img src="/images/colors.png" alt="">

                            <div class="buyer_info">
                                <p>{{ sale.buyer }}</p>

                                <a :href="`${VITE_EXPLORER_URL}/address/${sale.buyer}`">
                                    <div class="buyer_address">
                                        <p>{{ Converter.fineAddress(sale.merchant, 5) }}</p>
                                        <OutIcon />
                                    </div>
                                </a>
                            </div>
                        </div>
                    </td>

                    <td>
                        <div class="amount">
                            <p>{{Converter.toMoney(sale.amount)}} <span>{{getToken(sale.token)?.symbol}}</span></p>
                            <p>≈ ${{Converter.toMoney(sale.amountInUsd)}}</p>
                        </div>
                    </td>

                    <td>
                        <div class="view">
                            <ChevronRightIcon />
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped>
.sales {
    padding: 0 50px;
    padding-bottom: 50px;
}

table {
    width: 100%;
    border-collapse: collapse;
}

thead {
    background: var(--bg-light);
    border-radius: 8px;
}

thead tr {
    height: 38px;
}

thead td {
    color: var(--tx-semi);
    font-size: 14px;
}

td:first-child {
    padding-left: 20px;
}

td:last-child {
    padding-right: 20px;
}

thead td:nth-child(5) {
    text-align: right;
}

tbody tr {
    height: 94px;
    padding: 0 20px;
    border-bottom: 1px solid var(--bg-lighter);
}

tbody tr:last-child {
    border: none;
}

tbody td:last-child {
    display: flex;
    height: 94px;
    align-items: center;
    justify-content: center;
}

.product {
    display: flex;
    align-items: center;
    gap: 16px;
}

.product img {
    width: 42px;
    height: 42px;
    border-radius: 8px;
    background: var(--bg-lighter);
    object-fit: contain;
}

.product_info p:first-child {
    color: var(--tx-normal);
    font-size: 16px;
}

.product_info p:last-child {
    color: var(--tx-normal);
    font-size: 14px;
}

.product_info p:last-child span {
    color: var(--tx-semi);
}

.time p:first-child {
    color: var(--tx-normal);
    font-size: 16px;
}

.time p:last-child {
    color: var(--tx-semi);
    font-size: 14px;
}

.status {
    display: flex;
    align-items: center;
    gap: 6px;
    border: 1px solid var(--bg-lighter);
    padding: 0 12px;
    height: 30px;
    width: fit-content;
    border-radius: 8px;
}

.status p {
    color: var(--tx-normal);
    font-size: 14px;
}

.buyer {
    display: flex;
    align-items: center;
    gap: 12px;
}

.buyer img {
    width: 40px;
    height: 40px;
    border-radius: 8px;
}

.buyer_info>p {
    color: var(--tx-normal);
    font-size: 16px;
}

.buyer_address {
    display: flex;
    align-items: center;
    gap: 6px;
}

.buyer_address p {
    color: var(--tx-dimmed);
    font-size: 14px;
}

.buyer_address svg {
    width: 12px;
    height: 12px;
}

.amount {
    text-align: right;
}

.amount p:first-child {
    color: var(--tx-normal);
    font-size: 16px;
}

.amount p:first-child span {
    color: var(--tx-semi);
}

.amount p:last-child {
    color: var(--tx-semi);
    font-size: 14px;
}

.view {
    width: 32px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    border: 1px solid var(--bg-lighter);
}
</style>