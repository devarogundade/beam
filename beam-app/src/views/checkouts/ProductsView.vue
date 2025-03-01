<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { ref } from 'vue';
import ProductDetails from '@/components/ProductDetails.vue';

const modules = [Pagination];

const selectedProduct = ref<number | null>(null);

</script>

<template>
    <div class="products">
        <div class="product" v-for="product in 24" :key="product" @click="selectedProduct = product">
            <swiper :pagination="{
                clickable: true,
                dynamicBullets: true,
            }" :modules="modules">
                <SwiperSlide v-for="image in 2" :key="image">
                    <img :src="`/images/image_${image}.png`" alt="">
                </SwiperSlide>
            </swiper>

            <div class="product_info">
                <h3 class="name">Rabbit R1 Device</h3>

                <div class="product_type">
                    <div class="category">
                        <p>Technology</p>
                        <p>Qty: 25</p>
                    </div>

                    <div class="price">$199.99</div>
                </div>
            </div>
        </div>
    </div>

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