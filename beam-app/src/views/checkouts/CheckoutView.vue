<script lang="ts" setup>
import FilterIcon from '@/components/icons/FilterIcon.vue';
import PlusIcon from '@/components/icons/PlusIcon.vue';
import Converter from '@/scripts/converter';
import { useWalletStore } from '@/stores/wallet';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const walletStore = useWalletStore();
const addingProduct = ref<boolean>(false);
</script>

<template>
    <div>
        <div class="stats_wrapper">
            <div class="stats">
                <div class="stat">
                    <p class="stat_title">
                        Total Revenue
                    </p>

                    <div class="stat_info">
                        <h3>${{ Converter.toMoney(walletStore.clientMerchant?.productSalesInUsd || 0) }}</h3>
                        <p><span>+0.00%</span> than last 7d</p>
                    </div>
                </div>

                <div class="stat">
                    <p class="stat_title">
                        Total Orders
                    </p>

                    <div class="stat_info">
                        <h3>{{ Converter.toMoney(walletStore.clientMerchant?.productSalesCount || 0) }}</h3>
                        <p>items sold</p>
                    </div>
                </div>

                <div class="stat">
                    <p class="stat_title">
                        Added Products
                    </p>

                    <div class="stat_info">
                        <h3>{{ Converter.toMoney(walletStore.clientMerchant?.productsCount || 0) }}</h3>
                        <p>items on sale</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="toolbar">
            <div class="tabs">
                <RouterLink to="/payments">
                    <button
                        :class="route.name == 'payments-checkouts-products' ? 'tab tab_active' : 'tab'">Products</button>
                </RouterLink>

                <RouterLink to="/payments/checkouts/sales">
                    <button :class="route.name == 'payments-checkouts-sales' ? 'tab tab_active' : 'tab'">Sale</button>
                </RouterLink>
            </div>

            <div class="actions">
                <button class="filter">
                    <FilterIcon />
                    <p>Filter</p>
                </button>

                <button class="new_product" @click="addingProduct = true">
                    <PlusIcon />
                    <p>New Product</p>
                </button>
            </div>
        </div>

        <RouterView :adding-product="addingProduct" @close-adding-product="addingProduct = false" />
    </div>
</template>

<style scoped>
.stats_wrapper {
    padding: 0 50px;
}

.stats {
    display: grid;
    padding: 30px 0;
    grid-template-columns: repeat(3, 1fr);
    border-bottom: 1px solid var(--bg-lightest);
    width: 100%;
}

.stat {
    border-right: 1px solid var(--bg-lightest);
    padding: 0 30px;
}

.stat:first-child {
    padding-left: 0;
}

.stat:last-child {
    padding-right: 0;
    border-right: none;
}

.stat_title {
    font-size: 16px;
    line-height: 20px;
    letter-spacing: 2%;
    color: var(--tx-semi);
}

.stat_info {
    gap: 12px;
    display: flex;
    margin-top: 18px;
    align-items: flex-end;
}

.stat_info h3 {
    font-weight: 400;
    font-size: 26px;
    color: var(--tx-normal);
}

.stat_info p {
    font-weight: 400;
    font-size: 14px;
    color: var(--tx-semi);
    margin-bottom: 4px;
}

.stat_info span {
    color: var(--accent-green);
}


.toolbar {
    top: 90px;
    position: sticky;
    margin: 20px 0;
    padding: 10px 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 99;
    backdrop-filter: blur(10px);
}

.tabs {
    display: flex;
    align-items: center;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid var(--bg-lightest);
}

.tab {
    padding: 0 26px;
    color: var(--tx-dimmed);
    background: none;
    border: none;
    font-size: 16px;
    height: 40px;
    cursor: pointer;
}

.a:first-child .tab {
    border-right: 1px solid var(--bg-lightest);
}

.tab_active {
    color: var(--tx-normal);
    background: var(--bg-lighter);
}

.actions {
    display: flex;
    align-items: center;
    gap: 20px;
}

.filter {
    height: 40px;
    padding: 0 26px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    border: 1px solid var(--bg-lightest);
    background: none;
}

.filter svg {
    width: 20;
    height: 20;
}

.filter p {
    font-size: 16px;
    color: var(--tx-normal);
}

.new_product {
    height: 40px;
    padding: 0 26px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    border: 1px solid var(--bg-lightest);
    background: var(--primary);
}

.new_product svg {
    width: 20;
    height: 20;
}

.new_product p {
    font-size: 16px;
    color: var(--tx-normal);
}
</style>