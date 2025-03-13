<script setup lang="ts">
import { onMounted, ref } from "vue";
import BeamSDK from "../../beam-sdk/src";
import { Network } from "../../beam-sdk/src/enums";
import type { Merchant } from "../../beam-sdk/src/types";
import type { Product } from "./scripts/types";
import { zeroAddress, parseEther } from "viem";
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import MinusIcon from "@/components/icons/MinusIcon.vue";
import PlusIcon from "@/components/icons/PlusIcon.vue";
import ProgressBox from "@/components/ProgressBox.vue";
import { Client } from "@/scripts/client";
import AppHeader from "@/components/AppHeader.vue";

type PayData = {
    quantity: number,
    description: string,
    metadata: { [key: string]: any; };
};

const beamSdk = new BeamSDK({
    network: Network.Testnet
});

const modules = [Pagination];
const product = ref<Product | null>(null);
const merchant = ref<Merchant | null>(null);

const USDC = "0x2c9678042d52b97d27f2bd2947f7111d93f3dd0d";

const form = ref<PayData>({
    quantity: 1,
    description: '',
    metadata: {
        buyer: '',
        amountInUsd: true
    },
});

const getProduct = async (id: string) => {
    product.value = await Client.getProduct(id);

    if (!product.value?.merchant) return;

    merchant.value = await beamSdk.merchant.getMerchant({
        merchant: product.value.merchant
    });
};

const proceed = async () => {
    if (!product.value) return;
    if (!merchant.value) return;


    if (form.value.metadata.buyer.length < 3) {
        return;
    }

    try {
        const amountInUsd = product.value.amountInUsd * form.value.quantity;

        const result = await beamSdk.oneTimeTransaction.create({
            merchant: product.value.merchant,
            payers: [],
            amounts: [parseEther(amountInUsd.toString())],
            token: USDC,
            description: form.value.description,
            metadata: {
                schemaVersion: 1,
                value: JSON.stringify(form.value.metadata)
            },
            mintReceipt: false
        });

        console.log(result);
    } catch (error) {

    }
};

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

                <div class="detail">
                    <div class="props">
                        <div class="item">
                            <div class="category">
                                <p>{{ product.category }}</p>
                                <label>Items left: <span>{{ product.quantity }}</span></label>
                            </div>

                            <h3 class="price">{{
                                Intl.NumberFormat('en-US', {
                                    currency: 'USD'
                                }).format(product.amountInUsd * form.quantity) }}
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

                        <div class="buyer">
                            <label>Buyer's Name</label>
                            <input type="text" v-model="form.metadata.buyer">
                        </div>
                    </div>

                    <div class="action">
                        <button @click="proceed">Proceed</button>
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
</style>
