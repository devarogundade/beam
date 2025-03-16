<script setup lang="ts">
import CheckIcon from '@/components/icons/CheckIcon.vue';
import CloseIcon from '@/components/icons/CloseIcon.vue';
import CompletedIcon from '@/components/icons/CompletedIcon.vue';
import EraserIcon from '@/components/icons/EraserIcon.vue';
import PendingIcon from '@/components/icons/PendingIcon.vue';
import ProgressBox from '@/components/ProgressBox.vue';
import { notify } from '@/reactives/notify';
import { BeamContract } from '@/scripts/contract';
import Converter from '@/scripts/converter';
import Storage from '@/scripts/storage';
import { Network, TransactionType } from '@/scripts/types';
import { useWalletStore } from '@/stores/wallet';
import BeamSDK from 'beam-ts';
import { Transaction } from 'beam-ts/src/types';
import { getToken } from 'beam-ts/src/utils/constants';
import html2canvas from "html2canvas";
import { formatUnits, Hex } from 'viem';
import { onMounted, ref } from 'vue';

const progress = ref<boolean>(true);
const walletStore = useWalletStore();
const treansactionId = ref<Hex | null>(null);
const transaction = ref<Transaction | null>(null);
const minting = ref<boolean>(false);
const captureDiv = ref<HTMLDivElement | null>(null);

const beamSdk = new BeamSDK({
    network: Network.Testnet
});

const mint = async () => {
    if (minting.value) return;
    if (!walletStore.address) return;
    if (!captureDiv.value) return;
    if (!transaction.value) return;

    const canvas = await html2canvas(captureDiv.value);

    canvas.toBlob(async (blob) => {
        if (!walletStore.address) return;
        if (!transaction.value) return;

        minting.value = true;

        if (!blob) {
            minting.value = false;
            notify.push({
                title: 'Failed to mint NFT!',
                description: 'Try again',
                category: "error"
            });
            return;
        }

        const imageURL = await Storage.awaitUpload(blob, `${treansactionId.value}-${Date.now()}`);

        const metadata = {
            title: 'Payment receipt.',
            description: transaction.value.description ? transaction.value.description : 'No description.',
            image: imageURL
        };

        let transactionHash: Hex | null = null;
        if (transaction.value.type == TransactionType.OneTime) {
            transactionHash = await BeamContract.mintOneTimeTransactionReceipt({
                to: walletStore.address,
                transactionId: transaction.value.transactionId,
                URI: JSON.stringify(metadata)
            });
        } else if (transaction.value.type == TransactionType.Recurrent) {
            transactionHash = await BeamContract.mintRecurrentTransactionReceipt({
                to: walletStore.address,
                transactionId: transaction.value.transactionId,
                URI: JSON.stringify(metadata)
            });
        } else {
            notify.push({
                title: 'Transaction does mot has a receipt!',
                description: 'Try again',
                category: "error"
            });
            return;
        }

        if (transactionHash) {
            notify.push({
                title: 'Transaction was sent!',
                description: 'NFT was minted',
                category: "success",
                linkTitle: 'View Trx',
                linkUrl: `${import.meta.env.VITE_EXPLORER_URL}/tx/${transactionHash}`
            });
        } else {
            notify.push({
                title: 'Failed to mint receipt!',
                description: 'Try again',
                category: "error"
            });
        }

        minting.value = false;
    }, "image/png");
};
const getTransaction = async (transactionId: Hex) => {
    transaction.value = await beamSdk.oneTimeTransaction.getTransaction({
        transactionId
    });

    if (!transaction.value) {
        notify.push({
            title: 'Transaction not found!',
            description: 'Try again',
            category: "error"
        });
        return;
    }

    progress.value = false;
};
onMounted(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        notify.push({
            title: 'Invalid receipt link!',
            description: 'Try again',
            category: "error"
        });
        return;
    }

    getTransaction(id as Hex);
});
</script>

<template>
    <section>
        <div class="app_width">
            <ProgressBox v-if="progress" />
            <div class="container" v-else-if="transaction">
                <div class="receipt">
                    <div class="title">
                        <p>Your Receipt</p>

                        <div class="close">
                            <CloseIcon />
                        </div>
                    </div>

                    <div class="nft" ref="captureDiv">
                        <div class="amount">
                            <p>Amount</p>
                            <h3 v-if="transaction.type == TransactionType.OneTime">
                                {{
                                    Converter.toMoney(Number(formatUnits(
                                        transaction.amounts.reduce((a, b) => a + b, BigInt(0)),
                                        getToken(transaction.token)?.decimals || 18
                                    )))
                                }}
                                <span>{{ getToken(transaction.token)?.symbol }}</span>
                            </h3>
                            <h3 v-if="transaction.type == TransactionType.Recurrent">
                                {{
                                    Converter.toMoney(Number(formatUnits(
                                        transaction.amount, getToken(transaction.token)?.decimals || 18
                                    )))
                                }}
                                <span>{{ getToken(transaction.token)?.symbol }}</span>
                            </h3>
                        </div>

                        <div class="name">
                            <p>{{ transaction.description ? transaction.description : 'No description' }}</p>
                            <p><span>Signers:</span> {{ transaction.confirmations.length }}</p>
                        </div>

                        <div class="info">
                            <p class="head">Info</p>

                            <div class="label">
                                <p>Payment</p>
                                <div>
                                    <img :src="getToken(transaction.token)?.image" alt="">
                                    <p v-if="transaction.type == TransactionType.OneTime">
                                        {{
                                            Converter.toMoney(Number(formatUnits(
                                                transaction.amounts.reduce((a, b) => a + b, BigInt(0)),
                                                getToken(transaction.token)?.decimals || 18
                                            )))
                                        }} <span>{{ getToken(transaction.token)?.symbol }}</span>
                                    </p>
                                    <p v-if="transaction.type == TransactionType.Recurrent">
                                        {{
                                            Converter.toMoney(Number(
                                                formatUnits(
                                                    transaction.amount, getToken(transaction.token)?.decimals || 18
                                                )
                                            ))
                                        }} <span>{{ getToken(transaction.token)?.symbol }}</span>
                                    </p>
                                </div>
                            </div>

                            <div class="label">
                                <p>Status</p>
                                <div
                                    v-if="transaction.type == TransactionType.OneTime && transaction.fulfilleds.length == transaction.payers.length">
                                    <CompletedIcon />
                                    <p>Completed</p>
                                </div>

                                <div v-else-if="transaction.type == TransactionType.Recurrent">
                                    <CompletedIcon />
                                    <p>Completed</p>
                                </div>

                                <div v-else>
                                    <PendingIcon />
                                    <p>Pending</p>
                                </div>
                            </div>

                            <div class="label">
                                <p>Timestamp</p>
                                <div>
                                    <p>
                                        {{
                                            Intl.DateTimeFormat('en-US', {
                                                day: '2-digit',
                                                month: 'short',
                                            }).format(transaction.blockTimestamp * 1000)
                                        }}
                                        <span>
                                            {{
                                                Intl.DateTimeFormat('en-US', {
                                                    minute: '2-digit',
                                                    hour: '2-digit'
                                                }).format(transaction.blockTimestamp * 1000)
                                            }}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div class="actions">
                        <button>
                            <EraserIcon />
                            <p>Cancel</p>
                        </button>

                        <button @click="mint">
                            <CheckIcon />
                            <p>{{ minting ? 'Minting' : 'Mint NFT' }}</p>
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
    padding: 40px 0;
}

.receipt {
    width: 420px;
    background: var(--bg);
    border: 1px solid var(--bg-lightest);
    border-radius: 16px;
    overflow: hidden;
}

.title {
    padding: 24px 24px 16px 24px;
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

.nft {
    border-radius: 16px;
    border: 1px solid var(--bg-lightest);
    overflow: hidden;
    margin: 24px;
    background: var(--bg);
}

.amount {
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    background: var(--bg-light);
    flex-direction: column;
}

.amount p {
    font-size: 14px;
    color: var(--tx-semi);
}

.amount h3 {
    font-weight: 400;
    margin-top: 8px;
    font-size: 20px;
    color: var(--tx-normal);
}

.amount h3 span {
    color: var(--tx-dimmed);
}

.name {
    display: flex;
    align-items: center;
    padding: 0 24px;
    justify-content: space-between;
    height: 68px;
}

.name p:first-child {
    font-size: 14px;
    color: var(--tx-normal);
}

.name p:last-child {
    font-size: 14px;
    color: var(--tx-normal);
}

.name p span {
    color: var(--tx-dimmed);
}

.info .head {
    height: 30px;
    padding: 0 24px;
    background: var(--bg-light);
    font-size: 14px;
    color: var(--tx-semi);
    display: flex;
    align-items: center;
}

.label {
    display: flex;
    align-items: center;
    padding: 0 24px;
    justify-content: space-between;
    height: 68px;
    border-bottom: 1px solid var(--bg-lightest);
}

.label>p {
    font-size: 14px;
    color: var(--tx-semi);
}

.label>div {
    display: flex;
    align-items: center;
    gap: 8px;
}

.label img {
    width: 20px;
    height: 20px;
}

.label>div p {
    font-size: 14px;
    color: var(--tx-normal);
}

.label>div span {
    color: var(--tx-dimmed);
}

.label:last-child {
    border-bottom: none;
}

.actions {
    padding: 24px;
    background: var(--bg-light);
    border-top: 1px solid var(--bg-lightest);
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
}

.actions button {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background: none;
    gap: 10px;
    width: 100%;
    border: 1px solid var(--bg-lightest);
    height: 40px;
    cursor: pointer;
}

.actions button:last-child {
    background: var(--primary);
}

.actions button p {
    font-size: 14px;
    color: var(--tx-semi);
}

.actions button:last-child p {
    color: var(--tx-normal);
}

.actions .buttons {
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(2, 1fr);
}
</style>