<script setup lang="ts">
import ArrowDownIcon from '@/components/icons/ArrowDownIcon.vue';
import ChevronDownIcon from '@/components/icons/ChevronDownIcon.vue';
import ChevronLeftIcon from '@/components/icons/ChevronLeftIcon.vue';
import { getToken } from '@/scripts/constants';
import type { Token } from '@/scripts/types';
import { useDataStore } from '@/stores/data';
import { onMounted, ref } from 'vue';

const session = ref<string | null>(null);
const initiator = ref<string | null>(null);

const tokenB = ref<Token | null>(null);
const token = ref<Token | undefined>(undefined);

const dataStore = useDataStore();

const makePayment = async () => { };

onMounted(() => {
    if (!dataStore.data) return;

    const params = new URLSearchParams(window.location.search);
    session.value = params.get("session");
    initiator.value = params.get("initiator");

    token.value = getToken(dataStore.data.token);
});
</script>

<template>
    <section>
        <div class="app_width">
            <div class="container" v-if="dataStore.data">
                <div class="payment">
                    <div class="info">
                        <div class="head">
                            <RouterLink :to="`/?session=${session}&initiator=${initiator}`">
                                <div class="back">
                                    <ChevronLeftIcon />
                                </div>
                            </RouterLink>
                            <p>Swap to Pay</p>
                        </div>

                        <div class="asset">
                            <div class="label">
                                <p>You'll swap</p>
                                <p>Bal: <span>41.24</span></p>
                            </div>

                            <div class="input">
                                <input type="text" value="31.2332">
                                <div class="tokens">
                                    <div class="token">
                                        <img src="/images/btc.png" alt="">
                                        <p>BTC</p>
                                        <ChevronDownIcon />
                                    </div>

                                    <div class="dropdown">
                                        <div class="token">
                                            <img src="/images/btc.png" alt="">
                                            <p>BTC</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="divider">
                            <div class="line"></div>
                            <div class="icon">
                                <ArrowDownIcon />
                            </div>
                        </div>

                        <div class="asset">
                            <div class="label">
                                <p>To Pay</p>
                                <p>Bal: <span>41.24</span></p>
                            </div>

                            <div class="input">
                                <input type="text" value="31.2332">
                                <div class="tokens">
                                    <div class="token" v-if="token">
                                        <img :src="token.image" alt="">
                                        <p>{{ token.symbol }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="action">
                        <button @click="makePayment">Make Payment</button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.container {
    display: flex;
    justify-content: center;
    padding: 60px;
}

.payment {
    width: 460px;
    border-radius: 16px;
    border: 1px solid var(--bg-lightest);
}

.info {
    padding: 30px;
}

.head {
    display: flex;
    align-items: center;
    gap: 16px;
    padding-bottom: 30px;
    border-bottom: 1px solid var(--bg-lightest);
}

.head .back {
    width: 36px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    border: 1px solid var(--bg-lightest);
    cursor: pointer;
}

.head p {
    color: var(--tx-normal);
    font-size: 16px;
}


label {
    color: var(--tx-semi);
    font-size: 16px;
}

.asset {
    margin-top: 30px;
}

.label {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.label p {
    color: var(--tx-semi);
    font-size: 16px;
}

.label span {
    color: var(--tx-normal);
}

.input {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 24px;
    width: 100%;
    height: 44px;
    border-radius: 8px;
    background: var(--bg-light);
    border: 1px solid var(--bg-lightest);
}

.input input {
    padding: 0 16px;
    background: none;
    outline: none;
    border: none;
    font-size: 16px;
    color: var(--tx-normal);
}

.input .dropdown {
    display: none;
}

.tokens {
    border-left: 1px solid var(--bg-lightest);
}

.input .token {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 14px;
    height: 44px;
    cursor: pointer;
    user-select: none;
}

.token img {
    width: 20px;
    height: 20px;
    border-radius: 10px;
}

.token p {
    color: var(--tx-normal);
    font-size: 14px;
}

.divider {
    margin-top: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 44px;
}

.divider .line {
    width: 100%;
    height: 1px;
    background: var(--bg-lighter);
}

.divider .icon {
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    background: var(--bg);
    border-radius: 6px;
    border: 1px solid var(--bg-lightest);
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