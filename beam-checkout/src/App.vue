<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import BeamSDK from "beam-ts/src";
import { Network, TransactionRoute, TransactionType } from "beam-ts/src/enums";
import type { Merchant, Token, TransactionCallback } from "beam-ts/src/types";
import { getTokens } from "beam-ts/src/utils/constants";
import type { Product } from "./scripts/types";
import { parseUnits, formatUnits, parseEther } from "viem";
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import MinusIcon from "@/components/icons/MinusIcon.vue";
import PlusIcon from "@/components/icons/PlusIcon.vue";
import ProgressBox from "@/components/ProgressBox.vue";
import { Client } from "@/scripts/client";
import AppHeader from "@/components/AppHeader.vue";
import { BeamOracleContract } from "./scripts/contract";
import Converter from "./scripts/converter";
import TicketIcon from "./components/icons/TicketIcon.vue";

type PayData = {
    quantity: number,
    description: string,
    metadata: { [key: string]: any; };
};

const beamSdk = new BeamSDK({
    network: Network.Testnet
});

const modules = [Pagination];
const amount = ref<number>(0);
const token = ref<Token | null>(getTokens[0]);
const product = ref<Product | null>(null);
const merchant = ref<Merchant | null>(null);

const result = ref<TransactionCallback | null>(null);

const routes = ref<{ [key: number]: string; }>({
    0: 'Default',
    1: 'Swap to Pay',
    2: 'Borrow to Pay',
});

const form = ref<PayData>({
    quantity: 1,
    description: '',
    metadata: {
        buyer: '',
        amountInUsd: true
    },
});

const getAmount = async () => {
    if (!token.value) return;
    if (!product.value) return;

    const amountInUsd = product.value.amountInUsd * form.value.quantity;
    const decimals = token.value?.decimals || 18;

    const result = await BeamOracleContract.getAmountFromUsd(
        token.value.address,
        parseUnits(amountInUsd.toString(), decimals),
        10 ** 8
    );

    amount.value = Number(formatUnits(result, decimals));
};

const getProduct = async (id: string) => {
    product.value = await Client.getProduct(id);

    if (!product.value?.merchant) return;

    merchant.value = await beamSdk.merchant.getMerchant({
        merchant: product.value.merchant
    });

    getAmount();
};

const proceed = async () => {
    if (!token.value) return;
    if (!product.value) return;
    if (!merchant.value) return;

    if (form.value.metadata.buyer.length < 3) {
        // 
        return;
    }

    try {
        const amountInUsd = product.value.amountInUsd * form.value.quantity;

        result.value = await beamSdk.oneTimeTransaction.create({
            merchant: product.value.merchant,
            payers: [],
            amounts: [parseEther(amount.value.toString()).toString()] as any,
            token: token.value.address,
            description: form.value.description,
            metadata: {
                schemaVersion: 1,
                value: JSON.stringify(form.value.metadata)
            }
        });

        await Client.createSale({
            transactionId: result.value.transactionId,
            merchant: product.value.merchant,
            buyer: form.value.metadata.buyer,
            product: product.value._id,
            type: result.value.type,
            status: result.value.status,
            amount: amount.value,
            token: result.value.token,
            amountInUsd: amountInUsd,
            quantity: form.value.quantity
        });
    } catch (error) {
        //
    }
};

watch(form, () => {
    getAmount();
}, { deep: true });

watch(token, () => {
    getAmount();
}, { deep: true });

onMounted(() => {
    const productId = new URL(window.location.href)
        .searchParams
        .get('id');

    if (!productId) return;

    getProduct(productId);
});
</script>

<template>
    <AppHeader />

    <section>
        <div class="app_width">

            <ProgressBox v-if="!product || !merchant" />

            <div v-else class="container">
                <div class="product">
                    <div class="images">
                        <swiper class="swiper" :pagination="{
                            clickable: true,
                            dynamicBullets: true,
                        }" :modules="modules">
                            <SwiperSlide v-for="image in product.images" :key="image">
                                <img :src="image" :alt="product.name">
                            </SwiperSlide>
                        </swiper>
                    </div>


                    <div class="info">
                        <p class="name">{{ product.name }}</p>
                    </div>

                    <div class="description">
                        <p class="head">Description</p>
                        <p class="body">
                            {{ product.description }}
                        </p>
                    </div>
                </div>

                <div class="detail" v-if="!result">
                    <div class="props">
                        <div class="item">
                            <div class="category">
                                <p>{{ product.category }}</p>
                                <label>Items left: <span>{{ product.quantity }}</span></label>
                            </div>

                            <h3 class="price">
                                ${{ Converter.toMoney(product.amountInUsd * form.quantity) }}
                                <span>{{ Converter.toMoney(amount) }} {{ token?.symbol }}</span>
                            </h3>
                        </div>

                        <div class="quantity">
                            <label>Quantity</label>
                            <div class="amount">
                                <button @click="form.quantity > 0 ? form.quantity -= 1 : null">
                                    <MinusIcon />
                                </button>
                                <input type="number" v-model="form.quantity" placeholder="0">
                                <button @click="form.quantity += 1">
                                    <PlusIcon />
                                </button>
                            </div>
                        </div>

                        <div class="type">
                            <label>Choose pay type</label>
                            <select>
                                <option value="one-time">One Time Payment</option>
                                <option value="one-time">Split Payment</option>
                            </select>
                        </div>

                        <div class="asset">
                            <label>Pay With</label>

                            <div class="tokens">
                                <div v-for="t in getTokens"
                                    :class="t.address == token?.address ? 'token token_selected' : 'token'"
                                    @click="token = t">
                                    <div class="token_info">
                                        <img :src="t.image" alt="">
                                        <p>{{ t.symbol }}</p>
                                    </div>
                                    <div class="radio">
                                        <div>
                                            <span></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="buyer">
                            <label>Buyer's Name</label>
                            <input type="text" placeholder="Vitalik.eth" v-model="form.metadata.buyer">
                        </div>
                    </div>

                    <div class="action">
                        <button disabled v-if="product.quantity == 0 || product.quantity < form.quantity">Not
                            available</button>
                        <button disabled v-else-if="form.quantity == 0">Cart is empty</button>
                        <button v-else @click="proceed">Proceed</button>
                    </div>
                </div>

                <div class="receipt" v-if="result">
                    <div class="ticket">
                        <img src="/images/ticket.png" alt="">
                        <h3>Payment Successful</h3>
                        <p>You’ve successfully paid for {{ product.name }}
                            using {{ routes[result.route] }} payment method.</p>
                    </div>

                    <div class="mint">
                        <button>
                            <TicketIcon />
                            <p>Get Receipt</p>
                        </button>

                        <button @click="result = null; form.quantity = 1">
                            <PlusIcon />
                            <p>Buy Again</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 40px;
    padding: 60px;
}

.product {
    width: 460px;
    border-radius: 16px;
    background: var(--bg-light);
    height: fit-content;
}

.images {
    padding: 20px;
}

.product img {
    width: 420px;
    height: 420px;
    object-fit: contain;
}

.info {
    padding: 0 24px;
}

.name {
    color: var(--tx-normal);
    font-size: 16px;
}

.description .head {
    margin-top: 24px;
    padding: 0 24px;
    width: 100%;
    height: 34px;
    background: var(--bg-lighter);
    color: var(--tx-semi);
    font-size: 14px;
    display: flex;
    align-items: center;
}

.description .body {
    padding: 24px;
    color: var(--tx-dimmed);
    font-size: 14px;
    line-height: 21px;
}

.detail {
    width: 400px;
    border-radius: 16px;
    border: 1px solid var(--bg-lightest);
    height: fit-content;
}

.props {
    padding: 30px;
}

.item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--bg-lightest);
    padding-bottom: 30px;
}

.category p {
    color: var(--tx-dimmed);
    font-size: 14px;
    margin-bottom: 4px;
}

label {
    color: var(--tx-semi);
    font-size: 16px;
}

.price {
    color: var(--tx-normal);
    font-size: 20px;
    font-weight: 500;
    display: flex;
    flex-direction: column;
    text-align: right;
}

.price span {
    color: var(--tx-semi);
    font-size: 14px;
}

.quantity {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30px 0;
    border-bottom: 1px solid var(--bg-lightest);
}

.amount {
    display: grid;
    gap: 16px;
    grid-template-columns: 44px 64px 44px;
}

.amount>button {
    height: 44px;
    border-radius: 8px;
    border: 1px solid var(--bg-lightest);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background: none;
}

input {
    width: 100%;
    height: 44px;
    border-radius: 8px;
    padding: 0 16px;
    outline: none;
    color: var(--tx-normal);
    font-size: 16px;
    background: none;
    border: 1px solid var(--bg-lightest);
}

.quantity input {
    padding: 4px;
    text-align: center;
}

.type {
    padding: 30px 0;
    display: flex;
    flex-direction: column;
}

.type select {
    margin-top: 24px;
    width: 100%;
    height: 44px;
    border-radius: 8px;
    padding: 0 16px;
    outline: none;
    color: var(--tx-normal);
    font-size: 16px;
    background: none;
    background: var(--bg-light);
    border: 1px solid var(--bg-lightest);
}

.asset {
    padding: 30px 0;
    border-top: 1px solid var(--bg-lightest);
    border-bottom: 1px solid var(--bg-lightest);
}

.tokens {
    margin-top: 24px;
    display: grid;
    align-items: center;
    grid-template-columns: repeat(2, 1fr);
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
    border-radius: 10px;
    border: 1px solid var(--bg-lightest);
    background: var(--bg);
    display: flex;
    align-items: center;
    justify-content: center;
}

.token .radio div span {
    width: 10px;
    height: 10px;
    border-radius: 10px;
}

.token_selected .radio div {
    border: 1px solid var(--primary-light);
}

.token_selected .radio div span {
    background: var(--primary);
}

.buyer {
    margin-top: 30px;
}

.buyer input {
    margin-top: 24px;
}

.action {
    background: var(--bg-light);
    border-top: 1px solid var(--bg-lightest);
    padding: 30px;
}

.action button {
    height: 40px;
    width: 100%;
    background: var(--primary);
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    color: var(--tx-normal);
    font-weight: 500;
    border: none;
}

.action button:disabled {
    cursor: not-allowed;
    opacity: 0.4;
}

.receipt {
    width: 400px;
    border-radius: 16px;
    border: 1px solid var(--bg-lightest);
    height: fit-content;
    overflow: hidden;
}

.ticket {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 30px;
}

.ticket img {
    width: 100%;
    height: 220px;
    object-fit: contain;
}

.ticket h3 {
    color: var(--tx-normal);
    font-size: 16px;
    font-weight: 500;
}

.ticket p {
    margin-top: 20px;
    color: var(--tx-semi);
    font-size: 14px;
}

.mint {
    padding: 30px;
    background: var(--bg-light);
    border-top: 1px solid var(--bg-lightest);
    display: flex;
    align-items: center;
    gap: 20px;
}

.mint button {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    cursor: pointer;
    background: none;
    border: 1px solid var(--bg-lightest);
    border-radius: 8px;
    height: 40px;
}

.mint button p {
    color: var(--tx-normal);
    font-size: 14px;
}
</style>
