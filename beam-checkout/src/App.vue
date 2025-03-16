<script setup lang="ts">
import NotifyPop from '@/components/NotifyPop.vue';
import { onMounted, ref, watch } from "vue";
import BeamSDK from "beam-ts/src";
import { Network } from "@/scripts/types";
import type { Merchant, Subscription, Token, TransactionCallback } from "beam-ts/src/types";
import { getTokens } from "beam-ts/src/utils/constants";
import type { Plan, Product } from "./scripts/types";
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
import { notify } from './reactives/notify';

type PayData = {
    quantity: number,
    metadata: { [key: string]: any; };
};

const beamSdk = new BeamSDK({
    network: Network.Testnet
});

const modules = [Pagination];
const amount = ref<number>(0);
const token = ref<Token | null>(null);
const tokens = ref<Token[]>([]);
const product = ref<Product | null>(null);
const plan = ref<Plan | null>(null);
const merchant = ref<Merchant | null>(null);
const subscription = ref<Subscription | null>(null);

const result = ref<TransactionCallback | null>(null);

const routes = ref<{ [key: number]: string; }>({
    0: 'Default',
    1: 'Swap to Pay',
    2: 'Borrow to Pay',
});

const form = ref<PayData>({
    quantity: 1,
    metadata: {
        buyer: '',
        amountInUsd: true
    },
});

const getProductAmount = async () => {
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

const getPlanAmount = async () => {
    if (!plan.value) return;
    if (!subscription.value) return;

    const amountInUsd = plan.value.amountInUsd * form.value.quantity;
    const decimals = token.value?.decimals || 18;

    const result = await BeamOracleContract.getAmountFromUsd(
        subscription.value.token,
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

    getProductAmount();
};

const getPlan = async (id: string) => {
    plan.value = await Client.getPlan(id);

    if (!plan.value?.merchant) return;

    merchant.value = await beamSdk.merchant.getMerchant({
        merchant: plan.value.merchant
    });

    const subscriptions = await beamSdk.recurrentTransaction.getSubscriptionFromHash({
        transactionHash: plan.value.transactionHash
    });

    if (subscriptions.length == 0) {
        notify.push({
            title: 'Subscription not found on-chain!',
            description: 'Try again',
            category: "error"
        });
    }

    subscription.value = subscriptions[0];

    getPlanAmount();
};

const proceed = async () => {
    if (!token.value) return;
    if (!product.value) return;
    if (!merchant.value) return;

    if (form.value.metadata.buyer.length < 3) {
        notify.push({
            title: 'Buyer\'s name is too short!',
            description: 'Try again',
            category: "error"
        });
        return;
    }

    try {
        const amountInUsd = product.value.amountInUsd * form.value.quantity;

        if (product.value) {
            result.value = await beamSdk.oneTimeTransaction.create({
                merchant: product.value.merchant,
                payers: [],
                amounts: [parseEther(amount.value.toString()).toString()] as any,
                token: token.value.address,
                description: 'Product sale',
                metadata: {
                    schemaVersion: 1,
                    value: JSON.stringify(form.value.metadata)
                }
            });
        } else if (plan.value && subscription.value) {
            result.value = await beamSdk.recurrentTransaction.create({
                merchant: subscription.value.merchant,
                subscriptionId: subscription.value.subsciptionId,
                description: 'Subscription',
                metadata: {
                    schemaVersion: 1,
                    value: JSON.stringify(form.value.metadata)
                }
            });
        }

        if (!result.value) {
            notify.push({
                title: 'Invalid data!',
                description: 'Try again',
                category: "error"
            });
            return;
        }

        const created = await Client.createSale({
            transactionId: result.value.transactionId,
            merchant: product.value.merchant,
            buyer: form.value.metadata.buyer,
            product: product.value ? product.value._id : undefined,
            plan: plan.value ? plan.value._id : undefined,
            type: result.value.type,
            status: result.value.status,
            amount: amount.value,
            token: result.value.token,
            amountInUsd: amountInUsd,
            quantity: product.value ? form.value.quantity : 0,
            dueDate: plan.value ? new Date(Number(result.value.dueDate) * 1000) : null,
        });

        if (created) {
            notify.push({
                title: 'Purchase successful!',
                description: 'Transaction was sent',
                category: "success",
                linkTitle: 'View Trx',
                linkUrl: `${import.meta.env.VITE_EXPLORER_URL}/tx/${result.value.transactionId}`
            });
        } else {
            notify.push({
                title: 'Failed to record product sale!',
                description: 'Try again',
                category: "error"
            });
        }
    } catch (error) {
        result.value = null;
        notify.push({
            title: 'Tranaction failed!',
            description: 'Try again',
            category: "error"
        });
    }
};

watch(merchant, () => {
    tokens.value = getTokens.filter(t => merchant.value?.tokens.includes(t.address));
    if (tokens.value.length > 0) token.value = tokens.value[0];
}, { deep: true });

watch(form, () => {
    getPlanAmount();
    getProductAmount();
}, { deep: true });

watch(token, () => {
    getPlanAmount();
    getProductAmount();
}, { deep: true });

onMounted(() => {
    const id = new URL(window.location.href)
        .searchParams
        .get('id');

    const type = new URL(window.location.href)
        .searchParams
        .get('type') || 'product';

    if (id && type == 'product') {
        getProduct(id);
    } else if (id && type == 'plan') {
        getPlan(id);
    } else {
        notify.push({
            title: 'Invalid product link id!',
            description: 'Try again',
            category: "error"
        });
    }
});
</script>

<template>
    <AppHeader />

    <section>
        <div class="app_width">
            <ProgressBox v-if="!merchant" />

            <div v-else class="container">
                <div class="product">
                    <div class="images">
                        <swiper class="swiper" v-if="product" :pagination="{
                            clickable: true,
                            dynamicBullets: true,
                        }" :modules="modules">
                            <SwiperSlide v-for="image in product.images" :key="image">
                                <img :src="image" :alt="product.name">
                            </SwiperSlide>
                        </swiper>

                        <swiper class="swiper" :pagination="{
                            clickable: true,
                            dynamicBullets: true,
                        }" :modules="modules" v-else-if="plan">
                            <SwiperSlide v-for="image in plan.images" :key="image">
                                <img :src="image" :alt="plan.name">
                            </SwiperSlide>
                        </swiper>
                    </div>


                    <div class="info">
                        <p class="name" v-if="product">{{ product.name }}</p>
                        <p class="name" v-else-if="plan">{{ plan.name }}</p>
                    </div>

                    <div class="description">
                        <p class="head">Description</p>
                        <p class="body" v-if="product"> {{ product.description }} </p>
                        <p class="body" v-else-if="plan"> {{ plan.description }} </p>
                    </div>
                </div>

                <div class="detail" v-if="!result">
                    <div class="props">
                        <div class="item">
                            <div class="category" v-if="product">
                                <p>{{ product.category }}</p>
                                <label>Items left: <span>{{ product.quantity }}</span></label>
                            </div>

                            <div class="category" v-else-if="plan">
                                <p>{{ plan.category }}</p>
                                <label>Status: <span>{{ plan.available ? 'Active' : 'Not active' }}</span></label>
                            </div>

                            <h3 class="price" v-if="product">
                                ${{ Converter.toMoney(product.amountInUsd * form.quantity) }}
                                <span>{{ Converter.toMoney(amount) }} {{ token?.symbol }}</span>
                            </h3>

                            <h3 class="price" v-else-if="plan && subscription">
                                {{
                                    Converter.toMoney(
                                        Number(formatUnits(subscription.amount, token?.decimals || 18))
                                    )
                                }}{{ token?.symbol }}
                                <span>${{ Converter.toMoney(plan.amountInUsd) }}</span>
                            </h3>
                        </div>

                        <div class="quantity" v-if="product">
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

                        <div class="type" v-if="product">
                            <label>Choose pay type</label>
                            <select>
                                <option value="one-time">One Time Payment</option>
                                <option value="one-time">Split Payment</option>
                            </select>
                        </div>

                        <div class="asset">
                            <label>Pay With</label>

                            <div class="tokens" v-if="product">
                                <div v-for="t in tokens"
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

                            <div class="tokens tokens_1" v-else-if="subscription">
                                <div class="token token_selected">
                                    <div class="token_info">
                                        <img :src="token?.image" alt="">
                                        <p>{{ token?.symbol }}</p>
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

                    <div class="action" v-if="product">
                        <button disabled v-if="product.quantity == 0 || product.quantity < form.quantity">Not
                            available</button>
                        <button disabled v-else-if="form.quantity == 0">Cart is empty</button>
                        <button v-else @click="proceed">Proceed</button>
                    </div>

                    <div class="action" v-else-if="plan">
                        <button disabled v-if="!plan.available">Not available</button>
                        <button v-else @click="proceed">Proceed</button>
                    </div>
                </div>

                <div class="receipt" v-if="result">
                    <div class="ticket">
                        <img src="/images/ticket.png" alt="">
                        <h3>Payment Successful</h3>
                        <p v-if="product">You’ve successfully paid for {{ product.name }}
                            using {{ routes[result.route] }} payment method.</p>

                        <p v-else-if="plan">You’ve successfully subscribed to {{ plan.name }}
                            using {{ routes[result.route] }} payment method.</p>
                    </div>

                    <div class="mint">
                        <button>
                            <TicketIcon />
                            <p>Get Receipt</p>
                        </button>

                        <button v-if="product" @click="result = null; form.quantity = 1">
                            <PlusIcon />
                            <p>Buy Again</p>
                        </button>

                        <button v-else-if="plan" @click="result = null;">
                            <PlusIcon />
                            <p>Subscribe Again</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <NotifyPop />
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

.tokens_1 {
    grid-template-columns: repeat(1, 1fr);
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
