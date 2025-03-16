<script setup lang="ts">
import { BeamContract } from '@/scripts/contract';
import { useDataStore } from '@/stores/data';
import { useWalletStore } from '@/stores/wallet';
import { formatEther, formatUnits, parseUnits, zeroAddress, type Hex } from 'viem';
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import BeamSDK from "beam-ts/src/index";
import { Network, TransactionType, TransactionRoute } from '@/scripts/types';
import type { Token, Transaction, TransactionCallback } from 'beam-ts/src/types';
import { getToken, SCHEMA_JSON, sleep } from 'beam-ts/src/utils/constants';
import { TokenContract } from '@/scripts/erc20';
import Converter from '@/scripts/converter';
import { emptySignature } from 'beam-ts/src/utils/helpers';
import { notify } from '@/reactives/notify';

const router = useRouter();

const dataStore = useDataStore();
const walletStore = useWalletStore();

const beamSdk = new BeamSDK({
    network: Network.Testnet
});

const type = ref('default');

const approving = ref<boolean>(false);
const paying = ref<boolean>(false);
const amount = ref<number>(0);
const balance = ref<number>(0);
const allowance = ref<number>(0);
const token = ref<Token | undefined>(getToken(dataStore.data?.token));

const onTypeChanged = (e: any) => {
    type.value = e.target.value;
};

const getAmount = () => {
    if (!dataStore.data) return;

    const index = dataStore.data.payers.length <= 1 ? 0 : dataStore.data.payers.findIndex(p =>
        p.toLowerCase() == walletStore.address?.toLowerCase()
    );

    if (index < 0) return;

    const amounts = dataStore.data.amounts.map((amount) => {
        return formatEther(amount);
    });

    amount.value = Number(amounts[index]);
};

const getBalance = async () => {
    if (!dataStore.data) return;
    if (!dataStore.data.token) return;
    if (!walletStore.address) return;

    balance.value = 0;

    const result = await TokenContract.getTokenBalance(
        dataStore.data.token,
        walletStore.address
    );

    const decimals = token.value?.decimals || 18;

    balance.value = Number(formatUnits(result, decimals));
};

const getAllowance = async () => {
    if (!dataStore.data) return;
    if (!dataStore.data.token) return;

    if (dataStore.data.token == zeroAddress) {
        allowance.value = Number.MAX_VALUE;
        return;
    }

    if (!walletStore.address) return;
    if (type.value != 'default') return;

    const result = await TokenContract.getAllowance(
        dataStore.data.token,
        walletStore.address,
        BeamContract.address
    );

    const decimals = token.value?.decimals || 18;

    allowance.value = Number(formatUnits(result, decimals));
};

const approve = async () => {
    if (approving.value) return;
    if (!dataStore.data) return;
    if (!dataStore.data.token) return;
    if (!walletStore.address) return;

    if (amount.value == 0) return;

    const index = dataStore.data.payers.length <= 1 ? 0 : dataStore.data.payers.findIndex(p =>
        p.toLowerCase() == walletStore.address?.toLowerCase()
    );

    if (index < 0) return;

    const decimals = token.value?.decimals || 18;

    approving.value = true;

    const txHash = await TokenContract.approve(
        dataStore.data.token,
        BeamContract.address,
        parseUnits(amount.value.toString(), decimals)
    );

    if (txHash) {
        getAllowance();
    } else {
        notify.push({
            title: 'Transaction failed!',
            description: 'Try again.',
            category: 'error'
        });
    }

    approving.value = false;
};

const proceed = async () => {
    const params = new URLSearchParams(window.location.search);
    const session = params.get("session");
    const initiator = params.get("initiator");

    if (type.value == 'swap') {
        return router.push(`/swap?session=${session}&initiator=${initiator}`);
    }
    else if (type.value == 'borrow') {
        return router.push(`/borrow?session=${session}&initiator=${initiator}`);
    } else {
        type.value = 'default';
    }
};

const makePayment = async () => {
    if (paying.value) return;
    if (!dataStore.initiator) return;
    if (!dataStore.data) return;
    if (!walletStore.address) return;
    if (!token.value) return;

    const params = new URLSearchParams(window.location.search);
    const session = params.get("session");

    if (!session) return;

    paying.value = true;

    let transactionHash: Hex | null = null;

    if (dataStore.data.type == TransactionType.OneTime) {

        const amounts = dataStore.data.amounts.map((amount) => {
            const value = formatEther(amount);
            const decimals = token.value?.decimals || 18;
            return parseUnits(value, decimals);
        });

        const index = dataStore.data.payers.length <= 1 ? 0 : dataStore.data.payers.findIndex(p =>
            p.toLowerCase() == walletStore.address?.toLowerCase()
        );

        transactionHash = await BeamContract.oneTimeTransaction(
            {
                payers: [walletStore.address],
                merchant: dataStore.data.merchant,
                amounts: amounts,
                token: token.value.address,
                tokenB: zeroAddress,
                description: dataStore.data.description ? dataStore.data.description : '',
                metadata: dataStore.data.metadata || {
                    schemaVersion: SCHEMA_JSON,
                    value: "{}"
                },
                slippage: BigInt(0),
                healthFactorMultiplier: BigInt(0),
                route: TransactionRoute.None,
                signature: emptySignature
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
                tokenB: zeroAddress,
                subscriptionId: dataStore.data.subscriptionId,
                description: dataStore.data.description ? dataStore.data.description : '',
                metadata: dataStore.data.metadata || {
                    schemaVersion: SCHEMA_JSON,
                    value: "{}"
                },
                slippage: BigInt(0),
                healthFactorMultiplier: BigInt(0),
                route: TransactionRoute.None,
                signature: emptySignature
            },
            token.value.address == zeroAddress ? subscription.amount : BigInt(0)
        );
    } else {
        notify.push({
            title: 'Invalid transaction type!',
            description: 'Try again.',
            category: 'error'
        });
    }

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
            route: TransactionRoute.None,
            ...trxs[0]
        };

        dataStore.setResult(result);
    } else {
        notify.push({
            title: 'Transaction failed!',
            description: 'Try again.',
            category: 'error'
        });
    };

    paying.value = false;
};

watch(dataStore, () => {
    getAmount();
    getBalance();
    getAllowance();
    token.value = getToken(dataStore.data?.token);
}, { deep: true });

watch(walletStore, () => {
    getAmount();
    getBalance();
    getAllowance();
}, { deep: true });

onMounted(() => {
    getAmount();
    getBalance();
    getAllowance();
    token.value = getToken(dataStore.data?.token);
});
</script>

<template>
    <section>
        <div class="app_width">
            <div class="container" v-if="dataStore.data">
                <div class="payment">
                    <div class="info">
                        <p class="head">Payment</p>

                        <div class="amount">
                            <p>You'll Pay</p>
                            <h3>{{ amount }}</h3>
                            <span>{{ token?.symbol }}</span>
                        </div>

                        <div class="asset">
                            <div class="label">
                                <p>Pay With</p>
                                <p v-if="dataStore.data?.token">Bal:
                                    <span>
                                        {{ Converter.toMoney(balance) }}
                                        {{ token?.symbol }}
                                    </span>
                                </p>
                            </div>

                            <div class="tokens">
                                <div class="token token_selected">
                                    <div class="token_info" v-if="token">
                                        <img :src="token.image" alt="">
                                        <p>{{ token.symbol }}</p>
                                    </div>
                                    <div class="radio">
                                        <div>
                                            <span></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="mode">
                            <label>Mode of Payment</label>
                            <select @change="onTypeChanged">
                                <option value="default">With selected asset</option>
                                <option value="swap">Swap to Pay</option>
                                <option value="borrow">Borrow to Pay</option>
                            </select>
                        </div>
                    </div>

                    <div class="action">
                        <button v-if="type != 'default'" @click="proceed">Proceed</button>
                        <button disabled v-else-if="balance < amount">
                            Insufficient Bal
                        </button>
                        <button v-else-if="allowance < amount" @click="approve">
                            {{ approving ? 'Approving' : 'Approve ' +
                                token?.symbol
                            }}
                        </button>
                        <button v-else @click="makePayment">
                            {{ paying ? 'Paying' : 'Make Payment' }}
                        </button>
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
    color: var(--tx-normal);
    font-size: 16px;
    padding-bottom: 30px;
    border-bottom: 1px solid var(--bg-lightest);
}

.amount {
    text-align: center;
    padding: 30px 0;
    border-bottom: 1px solid var(--bg-lightest);
}

.amount p {
    color: var(--tx-semi);
    font-size: 14px;
}


.amount h3 {
    margin-top: 8px;
    color: var(--tx-normal);
    font-size: 26px;
}

.amount span {
    color: var(--tx-dimmed);
    font-size: 14px;
}

.asset {
    padding: 30px 0;
    border-bottom: 1px solid var(--bg-lightest);
}

.tokens {
    margin-top: 24px;
    display: grid;
    align-items: center;
    grid-template-columns: repeat(1, 1fr);
    gap: 24px;
}

.token {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 44px;
    border-radius: 8px 10px 10px 8px;
    border: 1px solid var(--bg-lighter);
    cursor: pointer;
    user-select: none;
}

.token_info {
    padding: 0 14px;
    display: flex;
    align-items: center;
    gap: 12px;
}

.token_info img {
    width: 20px;
    height: 20px;
    border-radius: 10px;
}

.token_info p {
    color: var(--tx-normal);
    font-size: 14px;
}

.token .radio {
    width: 44px;
    height: 100%;
    border: 1px solid var(--bg-lightest);
    border-radius: 0 8px 8px 0;
    background: var(--bg-light);
    display: flex;
    align-items: center;
    justify-content: center;
}

.token .radio div {
    width: 20px;
    height: 20px;
    border-radius: 10px;
    border: 1px solid var(--bg-lightest);
    background: var(--bg);
    display: flex;
    align-items: center;
    justify-content: center;
}

.token .radio div span {
    width: 10px;
    height: 10px;
    border-radius: 10px;
}

.token_selected .radio div {
    border: 1px solid var(--primary-light);
}

.token_selected .radio div span {
    background: var(--primary);
}

label {
    color: var(--tx-semi);
    font-size: 16px;
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

.mode {
    padding-top: 30px;
    display: flex;
    flex-direction: column;
}

.mode select {
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

.action button:disabled {
    cursor: not-allowed;
    opacity: 0.4;
}
</style>