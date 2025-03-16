<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { onMounted, ref } from 'vue';
import ProductDetails from '@/components/ProductDetails.vue';
import AddProduct from '@/components/AddProduct.vue';
import type { Product } from '@/scripts/types';
import { Client } from '@/scripts/client';
import Converter from '@/scripts/converter';
import { useWalletStore } from '@/stores/wallet';
import ProgressBox from '@/components/ProgressBox.vue';

const modules = [Pagination];
const walletStore = useWalletStore();
const progress = ref<boolean>(false);
const products = ref<Product[]>([]);
const selectedProduct = ref<Product | null>(null);

const emit = defineEmits(['close-adding-product']);

const props = defineProps({
    addingProduct: { type: Boolean }
});

const getProducts = async (load: boolean = true) => {
    if (!walletStore.address) return;
    progress.value = load;
    products.value = await Client.getProducts(
        walletStore.address
    );
    progress.value = false;
};

onMounted(() => {
    getProducts();
});
</script>

<template>
    <ProgressBox v-if="progress" />
    <div class="products" v-else>
        <div class="product" v-for="product, index in products" :key="index" @click="selectedProduct = product">
            <swiper :pagination="{
                clickable: true,
                dynamicBullets: true,
            }" :modules="modules">
                <SwiperSlide v-for="image in product.images" :key="image">
                    <img :src="image" :alt="product.name">
                </SwiperSlide>
            </swiper>

            <div class="product_info">
                <h3 class="name">{{ product.name }}</h3>

                <div class="product_type">
                    <div class="category">
                        <p>{{ product.category }}</p>
                        <p>Qty: {{ product.quantity }}</p>
                    </div>

                    <div class="price">${{ Converter.toMoney(product.amountInUsd) }}</div>
                </div>
            </div>
        </div>
    </div>
    <div class="empty" v-if="!progress && products.length == 0">
        <img src="/images/empty.png" alt="">
        <p>No products.</p>
    </div>

    <AddProduct v-if="props.addingProduct" @refresh="getProducts(false)" @close="emit('close-adding-product')" />

    <ProductDetails v-if="selectedProduct" :product="selectedProduct" @close="selectedProduct = null" />
</template>

<style scoped>
.products {
    padding: 0 50px;
    padding-bottom: 50px;
    gap: 30px;
    display: flex;
    flex-wrap: wrap;
}

.product {
    width: 250px;
    border-radius: 14px;
    background: var(--bg-light);
    cursor: pointer;
}

.product img {
    width: 250px;
    height: 250px;
    object-fit: contain;
}

.product_info {
    padding: 18px;
}

.name {
    color: var(--tx-normal);
    font-size: 16px;
}

.product_type {
    margin-top: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.category p {
    color: var(--tx-dimmed);
    font-size: 14px;
}

.category p span {
    color: var(--tx-normal);
}

.price {
    color: var(--tx-normal);
    font-size: 16px;
}
</style>