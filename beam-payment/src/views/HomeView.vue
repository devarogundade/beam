<script setup lang="ts">
import { getTokens, getToken, sleep } from '@/scripts/constants';
import { BeamContract, BeamOracleContract } from '@/scripts/contract';
import { TransactionRoute } from '@/scripts/params';
import type { Token } from '@/scripts/types';
import { useDataStore } from '@/stores/data';
import { useWalletStore } from '@/stores/wallet';
import { formatEther, formatUnits, parseUnits, zeroAddress, zeroHash } from 'viem';
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import BeamSDK from "../../../beam-sdk/src/index";
import { Network } from '../../../beam-sdk/src/enums';
import type { Transaction } from '../../../beam-sdk/src/types';
import { TokenContract } from '@/scripts/erc20';
import Converter from '@/scripts/converter';

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

const getAmount = async () => {
    if (!dataStore.data) return;
    if (!dataStore.data.token) return;

    const index = dataStore.data.payers.length <= 1 ? 0 : dataStore.data.payers.findIndex(p =>
        p.toLowerCase() == walletStore.address?.toLowerCase()
    );

    amount.value = 0;

    if (index < 0) return;

    const value = formatEther(dataStore.data.amounts[index]);

    const decimals = token.value?.decimals || 18;

    const result = await BeamOracleContract.getAmountFromUsd(
        dataStore.data.token,
        parseUnits(value, decimals)
    );

    amount.value = Number(formatUnits(result, decimals));
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
    if (!dataStore.data) return;
    if (!dataStore.data.token) return;
    if (!walletStore.address) return;

    const params = new URLSearchParams(window.location.search);
    const session = params.get("session");

    if (!session) return;

    paying.value = true;

    const txHash = await BeamContract.oneTimeTransaction(
        {
            payers: [walletStore.address],
            merchant: dataStore.data.merchant,
            amounts: dataStore.data.amounts.map((amount) => {
                const value = formatEther(amount);
                const decimals = token.value?.decimals || 18;
                return parseUnits(value, decimals);
            }),
            token: dataStore.data.token,
            tokenB: zeroAddress,
            description: dataStore.data.description ? dataStore.data.description : '',
            metadata: {
                schemaVersion: 1,
                value: JSON.stringify(dataStore.data.metadata)
            },
            mintReceipt: false,
            healthFactorMultiplier: BigInt(0),
            route: TransactionRoute.None,
            signature: {
                deadline: 0,
                v: 0,
                r: zeroHash,
                s: zeroHash
            }
        }
    );

    if (txHash) {
        let tries: number = 0;
        let trx: Transaction[] = [];

        do {
            trx = await beamSdk.oneTimeTransaction.getTransactionsFromHash({
                transactionId: txHash
            });

            tries += 1;

            await sleep(1_000);
        } while (trx.length == 0 && tries < 5);

        window.opener.postMessage({ ...trx, session });
    } else {

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
                            <h3>
                                {{ Intl.NumberFormat('en-US', {
                                    currency: 'USD'
                                }).format(Number(formatEther(dataStore.data.amounts[0])))
                                }}
                            </h3>
                            <span v-if="dataStore.data?.token">
                                ⁓ {{ Converter.toMoney(amount) }}
                                {{ token?.symbol }}
                            </span>
                        </div>

                        <div class="asset">
                            <div class="label">
                                <p>Pay With</p>
                                <p v-if="dataStore.data?.token">Bal:
                                    <span>
                                        {{ Converter.toMoney(balance) }}
                                        {{
                                            token?.symbol
                                        }}
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
                        <button v-else-if="allowance < amount" @click="approve">
                            {{ approving ? 'Approving' : 'Approve ' +
                                token?.symbol
                            }}
                        </button>
                        <button disabled v-else-if="balance < amount">
                            Insufficient Bal
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