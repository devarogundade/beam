<script setup lang="ts">
import ArrowDownIcon from '@/components/icons/ArrowDownIcon.vue';
import ChevronDownIcon from '@/components/icons/ChevronDownIcon.vue';
import ChevronLeftIcon from '@/components/icons/ChevronLeftIcon.vue';
import { useDataStore } from '@/stores/data';
import { onMounted, ref, watch } from 'vue';
import type { TransactionCallback, Token, Transaction } from 'beam-ts/src/types';
import { getToken, getTokens, SCHEMA_JSON, sleep } from 'beam-ts/src/utils/constants';
import { useWalletStore } from '@/stores/wallet';
import { TokenContract } from '@/scripts/erc20';
import { formatEther, formatUnits, parseUnits, zeroAddress, type Hex } from 'viem';
import { AaveV3Contract, BeamContract, DelegationContract } from '@/scripts/contract';
import { Network, TransactionType, TransactionRoute } from '@/scripts/types';
import BeamSDK from 'beam-ts/src';
import { type Signature } from 'beam-ts/src/params';
import Converter from '@/scripts/converter';
import ChooseAsset from '@/components/ChooseAsset.vue';
import Slider from '@vueform/slider';
import { useRouter } from 'vue-router';
import GoodHFIcon from '@/components/icons/GoodHFIcon.vue';
import BadHFIcon from '@/components/icons/BadHFIcon.vue';
import HFIcon from '@/components/icons/HFIcon.vue';
import { notify } from '@/reactives/notify';

const dataStore = useDataStore();
const walletStore = useWalletStore();

const beamSdk = new BeamSDK({
    network: Network.Testnet
});

const router = useRouter();

const session = ref<string | null>(null);
const initiator = ref<string | null>(null);

const chooseToken = ref<boolean>(false);
const approving = ref<boolean>(false);
const signing = ref<boolean>(false);
const paying = ref<boolean>(false);
const hf = ref<number>(0);
const rate = ref<number>(0);
const amount = ref<number>(0);
const amountB = ref<number>(0);
const balance = ref<number>(0);
const balanceB = ref<number>(0);
const allowance = ref<number>(0);
const allowanceB = ref<number>(0);
const borrowAllowance = ref<number>(0);
const signature = ref<Signature | null>(null);
const healthFactorMultiplier = ref<number>(160);
const tokenB = ref<Token | null>(null);
const token = ref<Token | undefined>(getToken(dataStore.data?.token));

const setTokenB = (token: Token) => {
    tokenB.value = token;
    chooseToken.value = false;
};

const getHFRate = async () => {
    if (!walletStore.address) return;
    if (!tokenB.value) return;

    const hfResult = await AaveV3Contract.getHealthFactor(walletStore.address);
    if (hfResult) hf.value = Number(formatEther(hfResult));

    const rateResult = await AaveV3Contract.getCurrentLiquidityRate(tokenB.value.address);
    if (rateResult) rate.value = Number(formatEther(rateResult)) / 10_000_000;
};

const getAmount = () => {
    if (!dataStore.data) return;

    const index = dataStore.data.payers.length <= 1
        ? 0
        : dataStore.data.payers.findIndex(p =>
            p.toLowerCase() == walletStore.address?.toLowerCase()
        );

    if (index < 0) return;

    const amounts = dataStore.data.amounts.map((amount) => {
        return formatEther(amount);
    });

    amount.value = Number(amounts[index]);
};

const getAmountB = async () => {
    if (!dataStore.data) return;
    if (!tokenB.value) return;
    if (!walletStore.address) return;
    if (!token.value) return;

    const decimals = token.value?.decimals || 18;

    const resultB = await AaveV3Contract.requiredSupplyMin({
        payer: walletStore.address,
        supplyAsset: tokenB.value.address,
        borrowAsset: token.value.address,
        borrowAmount: parseUnits(amount.value.toString(), decimals),
        healthFactorMultiplier: BigInt(healthFactorMultiplier.value)
    });

    const decimalsB = tokenB.value?.decimals || 18;

    amountB.value = Number(formatUnits(resultB, decimalsB));
};

const getBalance = async () => {
    if (!dataStore.data) return;
    if (!token.value) return;
    if (!walletStore.address) return;

    const result = await TokenContract.getTokenBalance(
        token.value.address,
        walletStore.address
    );

    const decimals = token.value?.decimals || 18;

    balance.value = Number(formatUnits(result, decimals));

    if (amount.value <= balance.value) {
        router.push(`/?session=${session.value}&initiator=${initiator.value}`);
    }
};

const getBalanceB = async () => {
    if (!dataStore.data) return;
    if (!tokenB.value) return;
    if (!walletStore.address) return;

    const resultB = await TokenContract.getTokenBalance(
        tokenB.value.address,
        walletStore.address
    );

    const decimalsB = tokenB.value?.decimals || 18;

    balanceB.value = Number(formatUnits(resultB, decimalsB));
};

const getAllowance = async () => {
    if (!token.value) return;
    if (!dataStore.data) return;

    if (token.value.address == zeroAddress) {
        allowance.value = Number.MAX_VALUE;
        return;
    }

    if (!walletStore.address) return;

    const result = await TokenContract.getAllowance(
        token.value.address,
        walletStore.address,
        BeamContract.address
    );

    const decimals = token.value?.decimals || 18;

    allowance.value = Number(formatUnits(result, decimals));
};

const getAllowanceB = async () => {
    if (!tokenB.value) return;
    if (!dataStore.data) return;

    if (tokenB.value.address == zeroAddress) {
        allowanceB.value = Number.MAX_VALUE;
        return;
    }

    if (!walletStore.address) return;

    const result = await TokenContract.getAllowance(
        tokenB.value.address,
        walletStore.address,
        BeamContract.address
    );

    const decimalsB = tokenB.value?.decimals || 18;

    allowanceB.value = Number(formatUnits(result, decimalsB));
};

const approve = async () => {
    if (approving.value) return;
    if (!token.value) return;
    if (!dataStore.data) return;
    if (!walletStore.address) return;

    if (amount.value == 0) return;

    approving.value = true;

    const decimals = token.value.decimals || 18;

    const txHash = await TokenContract.approve(
        token.value.address,
        BeamContract.address,
        parseUnits(amount.value.toString(), decimals)
    );

    if (txHash) {
        getAllowance();
    } else { }

    approving.value = false;
};


const approveB = async () => {
    if (approving.value) return;
    if (!tokenB.value) return;
    if (!dataStore.data) return;
    if (!walletStore.address) return;

    if (amountB.value == 0) return;

    const decimalsB = tokenB.value?.decimals || 18;

    approving.value = true;

    const txHash = await TokenContract.approve(
        tokenB.value.address,
        BeamContract.address,
        parseUnits(amountB.value.toString(), decimalsB)
    );

    if (txHash) {
        getAllowanceB();
    } else { }

    approving.value = false;
};

const getBorrowAllowance = async () => {
    if (!dataStore.data) return;
    if (!walletStore.address) return;
    if (!token.value) return;

    const debtToken = await AaveV3Contract.getVariableDebtTokenAddresses(token.value.address);
    if (!debtToken) return;

    const result = await DelegationContract.getBorrowAllowance(
        walletStore.address,
        debtToken
    );

    const decimals = token.value?.decimals || 18;

    borrowAllowance.value = Number(formatUnits(result, decimals));
};

const signBorrowAllowance = async () => {
    if (signing.value) return;
    if (!dataStore.data) return;
    if (!walletStore.address) return;
    if (!token.value) return;
    if (!tokenB.value) return;

    const debtToken = await AaveV3Contract.getVariableDebtTokenAddresses(token.value.address);
    if (!debtToken) return;

    const decimals = token.value?.decimals || 18;
    const amountLeft = (amount.value - balance.value);

    signature.value = await DelegationContract.signBorrowAllowance(
        walletStore.address,
        debtToken,
        parseUnits(amountLeft.toString(), decimals)
    );
};

const makePayment = async () => {
    if (paying.value) return;
    if (!dataStore.data) return;
    if (!walletStore.address) return;
    if (!token.value) return;
    if (!tokenB.value) return;
    if (!signature.value) return;

    const params = new URLSearchParams(window.location.search);
    const session = params.get("session");

    if (!session) return;

    paying.value = true;

    let transactionHash: Hex | null = null;

    const amounts = dataStore.data.amounts.map((amount) => {
        const value = formatEther(amount);
        const decimals = token.value?.decimals || 18;
        return parseUnits(value, decimals);
    });

    const index = dataStore.data.payers.length <= 1 ? 0 : dataStore.data.payers.findIndex(p =>
        p.toLowerCase() == walletStore.address?.toLowerCase()
    );

    if (dataStore.data.type == TransactionType.OneTime) {
        transactionHash = await BeamContract.oneTimeTransaction(
            {
                payers: [walletStore.address],
                merchant: dataStore.data.merchant,
                amounts: amounts,
                token: token.value.address,
                tokenB: tokenB.value.address,
                description: dataStore.data.description ? dataStore.data.description : '',
                metadata: dataStore.data.metadata || {
                    schemaVersion: SCHEMA_JSON,
                    value: "{}"
                },
                slippage: BigInt(0),
                healthFactorMultiplier: BigInt(healthFactorMultiplier.value),
                route: TransactionRoute.Aave,
                signature: signature.value
            },
            token.value.address == zeroAddress ? amounts[index] : BigInt(0)
        );
    } else if (dataStore.data.subscriptionId) {
        const subscription = await beamSdk.recurrentTransaction.getSubscription({
            subscriptionId: dataStore.data.subscriptionId
        });

        if (!subscription || subscription.trashed) return;

        transactionHash = await BeamContract.recurrentTransaction(
            {
                merchant: dataStore.data.merchant,
                tokenB: tokenB.value.address,
                subscriptionId: dataStore.data.subscriptionId,
                description: dataStore.data.description ? dataStore.data.description : '',
                metadata: dataStore.data.metadata || {
                    schemaVersion: SCHEMA_JSON,
                    value: "{}"
                },
                slippage: BigInt(0),
                healthFactorMultiplier: BigInt(healthFactorMultiplier.value),
                route: TransactionRoute.Aave,
                signature: signature.value
            },
            token.value.address == zeroAddress ? subscription.amount : BigInt(0)
        );
    } else { }

    if (transactionHash) {
        notify.push({
            title: 'Transaction sent!',
            description: 'Payment successful.',
            category: 'error',
            linkTitle: 'View Trx',
            linkUrl: `${import.meta.env.VITE_EXPLORER_URL}/tx/${transactionHash}`
        });

        let tries: number = 0;
        let trxs: Transaction[] = [];

        while (trxs.length == 0 && tries < 5) {
            trxs = await beamSdk.oneTimeTransaction.getTransactionsFromHash({
                transactionHash
            });

            tries += 1;

            await sleep(2_000);
        }

        const result: TransactionCallback = {
            session,
            route: TransactionRoute.Aave,
            ...trxs[0]
        };

        dataStore.setResult(result);
    } else {
        notify.push({
            title: 'Transaction failed!',
            description: 'Try again.',
            category: 'error'
        });
    }

    paying.value = false;
};

watch(dataStore, () => {
    getAmount();
    getAmountB();
    getBalance();
    getBalanceB();
    getAllowance();
    getAllowanceB();
    getBorrowAllowance();

    token.value = getToken(dataStore.data?.token);

    const otherTokens = getTokens.filter(t => t.address != dataStore.data?.token);
    tokenB.value = otherTokens.length > 0 ? otherTokens[0] : null;
}, { deep: true });

watch(walletStore, () => {
    getHFRate();
    getAmount();
    getAmountB();
    getBalance();
    getBalanceB();
    getAllowance();
    getAllowanceB();
    getBorrowAllowance();
}, { deep: true });

watch(tokenB, () => {
    getHFRate();
    getAmountB();
    getBalanceB();
    getAllowanceB();
    getBorrowAllowance();
}, { deep: true });

watch(healthFactorMultiplier, () => {
    getAmountB();
}, { deep: true });

onMounted(() => {
    if (!dataStore.data) return;

    const params = new URLSearchParams(window.location.search);
    session.value = params.get("session");
    initiator.value = params.get("initiator");

    token.value = getToken(dataStore.data.token);

    getHFRate();
    getAmount();
    getAmountB();
    getBalance();
    getBalanceB();
    getAllowance();
    getAllowanceB();
    getBorrowAllowance();

    const otherTokens = getTokens.filter(t => t.address != dataStore.data?.token);
    tokenB.value = otherTokens.length > 0 ? otherTokens[0] : null;
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
                            <p>Borrow to Pay</p>
                        </div>

                        <div class="asset">
                            <div class="label">
                                <p>You'll supply</p>
                                <p>Bal:
                                    <span>
                                        {{ Converter.toMoney(balanceB) }}
                                        {{ tokenB?.symbol }}
                                    </span>
                                </p>
                            </div>

                            <div class="input">
                                <input type="text" :value="amountB">
                                <div class="tokens" @click="chooseToken = true">
                                    <div class="token" v-if="tokenB">
                                        <img :src="tokenB.image" alt="">
                                        <p>{{ tokenB.symbol }}</p>
                                        <ChevronDownIcon />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="rates">
                            <div class="rate">
                                <p>Supply APY</p>

                                <p>{{ Converter.toMoney(rate, 2) }}<span>%</span></p>
                            </div>

                            <div class="rate">
                                <p>Health Factor</p>

                                <div>
                                    <BadHFIcon v-if="hf <= 1.2" />
                                    <HFIcon v-else-if="hf <= 1.6" />
                                    <GoodHFIcon v-else />
                                    <p>{{ hf > 1000 ? '1k+' : Converter.toMoney(hf) }}</p>
                                </div>
                            </div>
                        </div>

                        <div class="ltv">
                            <div class="label">
                                <p>Loan-to-Value Ratio</p>
                            </div>

                            <div class="hf">
                                <Slider v-model="healthFactorMultiplier" :step="10" :min="120" :max="160"
                                    :tooltips="false" />
                                <div class="hf_value">
                                    {{ healthFactorMultiplier }}
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
                                <p>To Borrow</p>
                                <p>Bal:
                                    <span>
                                        {{ Converter.toMoney(balance) }}
                                        {{ token?.symbol }}
                                    </span>
                                </p>
                            </div>

                            <div class="input">
                                <input type="text" :value="amount - balance">
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
                        <button disabled v-if="balanceB < amountB">
                            Insufficient Bal
                        </button>
                        <button v-else-if="allowance < balance" @click="approve">
                            {{ approving ? 'Approving' : 'Approve ' +
                                token?.symbol
                            }}
                        </button>
                        <button v-else-if="allowanceB < amountB" @click="approveB">
                            {{ approving ? 'Approving' : 'Approve ' +
                                tokenB?.symbol
                            }}
                        </button>
                        <button v-else-if="!signature" @click="signBorrowAllowance">
                            {{ signing ? 'Signing' : 'Sign Borrow Allowance' }}
                        </button>
                        <button v-else @click="makePayment">
                            {{ paying ? 'Paying' : 'Make Payment' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <ChooseAsset v-if="chooseToken" @close="chooseToken = false" @change="setTokenB" />
    </section>
</template>

<style src="@vueform/slider/themes/default.css"></style>
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

.ltv {
    margin-top: 30px;
    padding: 30px 0;
}

.hf {
    margin-top: 30px;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 60px;
    align-items: center;
    gap: 16px;
}

.hf_value {
    height: 44px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--tx-normal);
    font-size: 16px;
    border: 1px solid var(--bg-lightest);
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

.rates {
    margin-top: 30px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    background: var(--bg-light);
    border-radius: 30px;
    overflow: hidden;
}

.rate {
    height: 40px;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.rate p:first-child {
    color: var(--tx-dimmed);
    font-size: 14px;
}

.rate div {
    display: flex;
    align-items: center;
    gap: 8px;
}

.rate p:last-child {
    color: var(--tx-normal);
    font-size: 14px;
}

.rate:first-child {
    border-right: 1px solid var(--bg-lightest);
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