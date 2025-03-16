<script setup lang="ts">
import CheckIcon from '@/components/icons/CheckIcon.vue';
import ChevronLeftIcon from '@/components/icons/ChevronLeftIcon.vue';
import { ref } from 'vue';
import type { Hex } from 'viem';
import { useWalletStore } from '@/stores/wallet';
import { Connection } from '@/scripts/types';
import { useRouter } from 'vue-router';

const router = useRouter();
const walletStore = useWalletStore();
const address = ref<Hex | null>(null);

const watch = () => {
    if (!address.value) return;

    walletStore.setAddress(address.value);
    walletStore.setConnection(Connection.Guest);

    router.push('/');
};
</script>

<template>
    <section>
        <div class="app_width">
            <div class="container">
                <div class="toolbar">
                    <RouterLink to="/onboarding">
                        <button class="back">
                            <ChevronLeftIcon />
                            <p>Back</p>
                        </button>
                    </RouterLink>

                    <button class="title">
                        <p>Watch Account</p>
                    </button>

                    <button class="watch" @click="watch">
                        <CheckIcon />
                        <p>Watch</p>
                    </button>
                </div>

                <div class="wrapper">
                    <div class="form">
                        <div class="info">
                            <h3>Wallet Address</h3>
                            <p>Input the address of the wallet you’ll like to watch below.</p>
                        </div>

                        <div class="input">
                            <img src="/images/colors.png" alt="colors">
                            <input type="text" v-model="address"
                                placeholder="0xd2dABBDbD69cE434Ce2b152fddad81C6a88ahsu4" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>


<style scoped>
.toolbar {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 78px;
    border-bottom: 1px solid var(--bg-lightest);
}

.back {
    border-radius: 6px;
    border: 1px solid var(--bg-lightest);
    display: flex;
    align-items: center;
    padding: 0 12px;
    gap: 10px;
    justify-content: center;
    height: 32px;
    background: none;
    cursor: pointer;
}

.back p {
    font-size: 14px;
    color: var(--tx-normal);
}

.title {
    padding: 0 24px;
    height: 100%;
    text-align: center;
    border: none;
    border-bottom: 1px solid var(--primary);
    background: none;
    cursor: pointer;
}

.title p {
    font-size: 16px;
    color: var(--tx-normal);
}

.watch {
    border-radius: 6px;
    border: 1px solid var(--bg-lightest);
    display: flex;
    align-items: center;
    padding: 0 12px;
    gap: 10px;
    justify-content: center;
    height: 32px;
    background: var(--primary);
    cursor: pointer;
}

.watch p {
    font-size: 14px;
    color: var(--tx-normal);
}

.wrapper {
    padding: 80px 0;
    display: flex;
    justify-content: center;
}

.form {
    width: 550px;
}

.info h3 {
    font-size: 16px;
    color: var(--tx-normal);
}

.info p {
    font-size: 14px;
    color: var(--tx-dimmed);
    margin-top: 8px;
}

.input {
    margin-top: 40px;
    border-top: 1px solid var(--bg-lighter);
    border-bottom: 1px solid var(--bg-lighter);
    padding: 40px 0;
    display: flex;
    align-items: center;
    gap: 20px;
}

.input img {
    width: 44px;
    height: 44px;
    border-radius: 6px;
}

input {
    width: 100%;
    height: 44px;
    border: none;
    border: 1px solid var(--bg-lightest);
    background: none;
    color: var(--tx-normal);
    font-size: 16px;
    padding: 0 16px;
    outline: none;
    border-radius: 8px;
}
</style>