<script setup lang="ts">
import ArrowDownIcon from '@/components/icons/ArrowDownIcon.vue';
import ChevronDownIcon from '@/components/icons/ChevronDownIcon.vue';
import ChevronLeftIcon from '@/components/icons/ChevronLeftIcon.vue';
import { useDataStore } from '@/stores/data';
import { onMounted, ref, watch } from 'vue';
import type { TransactionCallback, Token, Transaction } from '../../../beam-sdk/src/types';
import { getToken, getTokens, sleep } from '../../../beam-sdk/src/utils/constants';
import { useWalletStore } from '@/stores/wallet';
import { TokenContract } from '@/scripts/erc20';
import { formatEther, formatUnits, parseUnits, zeroAddress, zeroHash, type Hex } from 'viem';
import { AaveV3Contract, BeamContract, UniswapContract } from '@/scripts/contract';
import { Network, TransactionType } from '../../../beam-sdk/src/enums';
import BeamSDK from '../../../beam-sdk/src';
import { TransactionRoute, type Signature } from '../../../beam-sdk/src/params';
import Converter from '@/scripts/converter';
import ChooseAsset from '@/components/ChooseAsset.vue';
import Slider from '@vueform/slider/src/Slider.js';
import { useRouter } from 'vue-router';

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
const paying = ref<boolean>(false);
const amount = ref<number>(0);
const amountB = ref<number>(0);
const balance = ref<number>(0);
const balanceB = ref<number>(0);
const allowance = ref<number>(0);
const allowanceB = ref<number>(0);
const signature = ref<Signature | null>(null);
const healthFactorMultiplier = ref<number>(1.2);
const tokenB = ref<Token | null>(null);
const token = ref<Token | undefined>(getToken(dataStore.data?.token));

const setTokenB = (token: Token) => {
    tokenB.value = token;
};

const getAmount = () => {
    if (!dataStore.data) return;
    if (!walletStore.address) return;

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

    amountB.value = 0;

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

    balance.value = 0;

    const result = await TokenContract.getTokenBalance(
        token.value.address,
        walletStore.address
    );

    const decimals = token.value?.decimals || 18;

    balance.value = Number(formatUnits(result, decimals));
};

const getBalanceB = async () => {
    if (!dataStore.data) return;
    if (!tokenB.value) return;
    if (!walletStore.address) return;

    balanceB.value = 0;

    const resultB = await TokenContract.getTokenBalance(
        tokenB.value.address,
        walletStore.address
    );

    const decimalsB = token.value?.decimals || 18;

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
        allowance.value = Number.MAX_VALUE;
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

    let txHash: Hex | null = null;

    if (dataStore.data.type == TransactionType.OneTime) {
        txHash = await BeamContract.oneTimeTransaction(
            {
                payers: [walletStore.address],
                merchant: dataStore.data.merchant,
                amounts: dataStore.data.amounts.map((amount) => {
                    const value = formatEther(amount);
                    const decimals = token.value?.decimals || 18;
                    return parseUnits(value, decimals);
                }),
                token: token.value.address,
                tokenB: tokenB.value.address,
                description: dataStore.data.description ? dataStore.data.description : '',
                metadata: {
                    schemaVersion: 1,
                    value: JSON.stringify(dataStore.data.metadata)
                },
                mintReceipt: false,
                healthFactorMultiplier: BigInt(healthFactorMultiplier.value * 100),
                route: TransactionRoute.Aave,
                signature: signature.value
            }
        );
    } else if (dataStore.data.subscriptionId) {
        txHash = await BeamContract.recurrentTransaction(
            {
                merchant: dataStore.data.merchant,
                tokenB: tokenB.value.address,
                subscriptionId: dataStore.data.subscriptionId,
                description: dataStore.data.description ? dataStore.data.description : '',
                metadata: {
                    schemaVersion: 1,
                    value: JSON.stringify(dataStore.data.metadata)
                },
                mintReceipt: false,
                healthFactorMultiplier: BigInt(healthFactorMultiplier.value * 100),
                route: TransactionRoute.Aave,
                signature: signature.value
            }
        );
    } else { }

    if (txHash) {
        let tries: number = 0;
        let trxs: Transaction[] = [];

        do {
            trxs = await beamSdk.oneTimeTransaction.getTransactionsFromHash({
                transactionId: txHash
            });

            tries += 1;

            await sleep(1_000);
        } while (trxs.length == 0 && tries < 5);

        const result: TransactionCallback = {
            session, ...trxs[0]
        };

        window.opener.postMessage(result);
    } else { }

    paying.value = false;
};

watch(dataStore, () => {
    getAmount();
    getAmountB();
    getBalance();
    getBalanceB();
    getAllowance();
    getAllowanceB();
    token.value = getToken(dataStore.data?.token);

    const otherTokens = getTokens.filter(t => t.address != dataStore.data?.token);
    tokenB.value = otherTokens.length > 0 ? otherTokens[0] : null;

    if (amount <= balance) {
        router.push(`/?session=${session}&initiator=${initiator}`);
    }
}, { deep: true });

watch(walletStore, () => {
    getAmount();
    getAmountB();
    getBalance();
    getBalanceB();
    getAllowance();
    getAllowanceB();

    if (amount <= balance) {
        router.push(`/?session=${session}&initiator=${initiator}`);
    }
}, { deep: true });

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
                                <p>Bal:
                                    <span>
                                        {{ Converter.toMoney(balanceB) }}
                                        {{ token?.symbol }}
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

                        <div class="ltv">
                            <div class="label">
                                <p>Loan-to-Value Ratio</p>
                            </div>

                            <div class="hf">
                                <Slider v-model="healthFactorMultiplier" :step="0.2" :min="1.2" :max="2" />
                                <div class="hf_value">
                                    {{ healthFactorMultiplier * 100 }}
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
                                        {{ Converter.toMoney(amountB) }}
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
                        <button v-if="allowanceB < amountB" @click="approveB">
                            {{ approving ? 'Approving' : 'Approve ' +
                                tokenB?.symbol
                            }}
                        </button>
                        <button v-else @click="makePayment">
                            {{ paying ? 'Paying' : 'Make Payment' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <ChooseAsset v-if="chooseToken" @close="chooseToken = false" @changed="setTokenB" />
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

.ltv {
    margin-top: 30px;
    padding: 30px 0;
}

.hf {
    display: grid;
    grid-template-columns: 1fr 60px;
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