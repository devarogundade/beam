<script setup lang="ts">
import { onMounted, ref } from "vue";
import BeamSDK from "beam-sdk";
import { Network } from "beam-sdk/enums";
import type { Merchant } from "beam-sdk/types";
import type { Product } from "./scripts/types";
import { OracleContract } from "./scripts/contract";
import { parseEther, type Hex } from "viem";
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import ProgressBox from "./components/ProgressBox.vue";
import { Client } from "./scripts/client";

type Form = {
    description: string,
    token: Hex | null,
    quantity: number,
    metadata: { [key: string]: string; };
    mintReceipt: boolean;
};

const beamSdk = new BeamSDK({
    network: Network.Testnet
});

const modules = [Pagination];
const product = ref<Product | null>(null);
const merchant = ref<Merchant | null>(null);

const form = ref<Form>({
    token: null,
    quantity: 1,
    metadata: {},
    description: '',
    mintReceipt: false
});

const getProduct = async (id: string) => {
    product.value = await Client.getProduct(id);
    if (!product.value?.merchant) return;

    merchant.value = await beamSdk.merchant.getMerchant({
        merchant: product.value.merchant
    });
};

const makePayment = async () => {
    if (!product.value) return;
    if (!merchant.value) return;
    if (!form.value.token) return;

    try {
        const amountInUsd = product.value.amountInUsd * form.value.quantity;
        const amount = await OracleContract.getAmountFromUsd(
            "0x",
            form.value.token,
            parseEther(amountInUsd.toString())
        );

        const result = await beamSdk.oneTimeTransaction.create({
            payers: [],
            merchant: product.value.merchant,
            amounts: [amount],
            token: form.value.token,
            description: form.value.description,
            metadata: {
                schemaVersion: 1,
                value: JSON.stringify(form.value.metadata)
            },
            mintReceipt: form.value.mintReceipt
        });
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
    <section>
        <main>
            <header></header>

            <ProgressBox v-if="!product || !merchant" />
            <div v-else class="product">

            </div>
        </main>
    </section>
</template>

<style scoped></style>
