<script setup lang="ts">
import { onMounted, ref } from 'vue';
import SearchIcon from './icons/SearchIcon.vue';
import { getTokens } from 'beam-ts/src/utils/constants';
import Converter from '@/scripts/converter';
import { useWalletStore } from '@/stores/wallet';
import { formatUnits, parseUnits } from 'viem';
import { TokenContract } from '@/scripts/erc20';
import CloseIcon from './icons/CloseIcon.vue';

const walletStore = useWalletStore();

const emit = defineEmits(['close', 'change']);

const search = ref<string>('');

const balances = ref<{ [key: string]: number; }>({
    '0x2c9678042d52b97d27f2bd2947f7111d93f3dd0d': 0,
    '0x5ea79f3190ff37418d42f9b2618688494dbd9693': 0,
    '0x9E8CEC4F2F4596141B62e88966D7167E9db555aD': 0,
    '0x7984e363c38b590bb4ca35aed5133ef2c6619c40': 0,
    '0x279cbf5b7e3651f03cb9b71a9e7a3c924b267801': 0,
});

const getTokenBalances = async () => {
    if (!walletStore.address) return;

    for (let index = 0; index < getTokens.length; index++) {
        const token = getTokens[index];
        const balance = await TokenContract.getTokenBalance(
            token.address,
            walletStore.address
        );
        balances.value[token.address] = Number(
            formatUnits(balance, token.decimals)
        );
    }
};

onMounted(() => {
    getTokenBalances();
});
</script>

<template>
    <div class="overlay">
        <div class="form">
            <div class="title">
                <p>Choose Asset</p>

                <div class="close" @click="emit('close')">
                    <CloseIcon />
                </div>
            </div>

            <div class="search">
                <div class="input">
                    <div class="icon">
                        <SearchIcon />
                    </div>
                    <input type="text" placeholder="Search asset by name" v-model="search">
                </div>
            </div>

            <div class="scroll">
                <div class="assets">
                    <div class="asset" v-for="token in getTokens.filter(t =>
                        search == '' ? true : t.name.toLowerCase().includes(search.toLowerCase())
                    )" @click="emit('change', token)">
                        <div class=" info">
                            <img :src="token.image" alt="">
                            <div class="name">
                                <p>{{ token.name }}</p>
                                <p>{{ token.symbol }}</p>
                            </div>
                        </div>

                        <div class="amount">
                            <p>{{ Converter.toMoney(balances[token.address]) }}</p>
                            <p>≈ ${{ Converter.toMoney(token.price * balances[token.address]) }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.overlay {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    position: fixed;
    background: rgba(51, 51, 51, 0.35);
    backdrop-filter: blur(5px);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
}

.form {
    height: fit-content;
    width: 500px;
    border-radius: 16px;
    background: var(--bg);
    overflow: hidden;
}

.title {
    padding: 30px 30px 14px 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--bg-lightest);
}

.title p {
    font-size: 16px;
    color: var(--tx-normal);
}

.close {
    width: 36px;
    height: 30px;
    border-radius: 6px;
    cursor: pointer;
    border: 1px solid var(--bg-lightest);
    display: flex;
    align-items: center;
    justify-content: center;
}

.scroll {
    overflow-y: auto;
    height: calc(100vh - 480px);
}

.search {
    height: 100px;
    padding: 0 30px;
    display: flex;
    align-items: center;
}

.search .input {
    display: grid;
    height: 44px;
    grid-template-columns: 44px 1fr;
    width: 100%;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid var(--bg-lightest);
}

.search .icon {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-light);
    border-right: 1px solid var(--bg-lightest);
}

.search input {
    height: 100%;
    color: var(--tx-normal);
    font-size: 14px;
    padding: 0 14px;
    background: none;
    border: none;
    outline: none;
    color: var(--tx-normal);
    font-size: 14px;
}

.assets {}

.asset {
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 30px;
    border-top: 1px solid var(--bg-lightest);
    cursor: pointer;
}


.asset:hover {
    background: var(--bg-light);
}

.info {
    display: flex;
    align-items: center;
    gap: 14px;
}

.asset img {
    width: 40px;
    width: 40px;
    border-radius: 8px;
}

.name p:first-child {
    color: var(--tx-normal);
    font-size: 14px;
}

.name p:last-child {
    margin-top: 4px;
    color: var(--tx-semi);
    font-size: 14px;
}

.amount {
    text-align: right;
}

.amount p:first-child {
    color: var(--tx-normal);
    font-size: 14px;
}

.amount p:last-child {
    margin-top: 4px;
    color: var(--tx-semi);
    font-size: 14px;
}
</style>
