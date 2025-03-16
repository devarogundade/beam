<script setup lang="ts">
import ChevronDownIcon from '@/components/icons/ChevronDownIcon.vue';
import ChevronRightIcon from '@/components/icons/ChevronRightIcon.vue';
import FilterIcon from '@/components/icons/FilterIcon.vue';
import OutIcon from '@/components/icons/OutIcon.vue';
import PendingIcon from '@/components/icons/PendingIcon.vue';
import ReceiveIcon from '@/components/icons/ReceiveIcon.vue';
import SendIcon from '@/components/icons/SendIcon.vue';
import SwapIcon from '@/components/icons/SwapIcon.vue';
import UsersIcon from '@/components/icons/UsersIcon.vue';
import { useWalletStore } from '@/stores/wallet';
import { onMounted, ref } from 'vue';
import BeamSDK from "beam-ts/src";
import type { Token, Transaction } from "beam-ts/src/types";
import { getToken, getTokens } from "beam-ts/src/utils/constants";
import CompletedIcon from '@/components/icons/CompletedIcon.vue';
import { formatUnits } from 'viem';
import Converter from '@/scripts/converter';
import PaymentsIcon from '@/components/icons/PaymentsIcon.vue';
import ArrowDownIcon from '@/components/icons/ArrowDownIcon.vue';
import ArrowUpIcon from '@/components/icons/ArrowUpIcon.vue';
import { TokenContract } from '@/scripts/erc20';
import AllAssets from '@/components/AllAssets.vue';
import ProgressBox from '@/components/ProgressBox.vue';
import { Network, TransactionType } from '@/scripts/types';
import ReceiveToken from '@/components/ReceiveToken.vue';
import UserIcon from '@/components/icons/UserIcon.vue';

const VITE_EXPLORER_URL = import.meta.env.VITE_EXPLORER_URL;

const beamSdk = new BeamSDK({
  network: Network.Testnet
});
const activeIndex = ref<number>(-1);
const walletStore = useWalletStore();
const progress = ref<boolean>(false);
const balances = ref<{ [key: string]: number; }>({
  '0x0000000000000000000000000000000000000000': 0,
  '0x2c9678042d52b97d27f2bd2947f7111d93f3dd0d': 0,
  '0x5ea79f3190ff37418d42f9b2618688494dbd9693': 0,
  '0x9E8CEC4F2F4596141B62e88966D7167E9db555aD': 0,
  '0x7984e363c38b590bb4ca35aed5133ef2c6619c40': 0,
  '0x279cbf5b7e3651f03cb9b71a9e7a3c924b267801': 0,
});
const tokens = ref<Token[]>([]);
const receiveToken = ref<boolean>(false);
const allAssets = ref<boolean>(false);

const transactions = ref<Transaction[]>([]);

const getTokenBalances = async () => {
  if (!walletStore.merchant) return;

  tokens.value = getTokens.filter(t => walletStore.merchant?.tokens.includes(t.address));

  for (let index = 0; index < tokens.value.length; index++) {
    const balance = await TokenContract.getTokenBalance(
      tokens.value[index].address,
      walletStore.merchant.wallet
    );
    balances.value[tokens.value[index].address] = Number(
      formatUnits(balance, tokens.value[index].decimals)
    );
  }
};

const getTransactions = async (load: boolean = true) => {
  if (!walletStore.address) return;
  progress.value = load;

  transactions.value = await beamSdk.oneTimeTransaction.getTransactions({
    merchant: walletStore.address,
    page: 1,
    limit: 50
  });

  progress.value = false;
};

onMounted(() => {
  getTransactions();
  getTokenBalances();
});
</script>

<template>
  <div class="treasury">
    <div class="assets_grid">
      <div class="assets">
        <div class="assets_head">
          <p>Total Value Locked</p>

          <div class="dropdown">
            <div class="dropdown_item">
              <p>1 Week</p>
              <ChevronDownIcon />
            </div>
          </div>
        </div>

        <div class="assets_value">
          <div class="value_amount">
            <p>$
              {{
                Converter.toMoney(
                  tokens.reduce((a, b) => a + b.price * balances[b.address], 0) || 0
                )
              }}
              <span>+0.00%</span>
            </p>

            <div class="stats">
              <div class="stat">
                <SendIcon />
                <p>$0.00 <span>Outs</span></p>
              </div>

              <div class="stat">
                <ReceiveIcon />
                <p>$0.00 <span>Ins</span></p>
              </div>
            </div>
          </div>

          <div class="value_tokens">
            <div class="images">
              <img v-for="token in tokens.slice(0, 3)" :src="token.image" alt="">
              <img src="/images/token.png" alt="">
            </div>

            <p>{{ tokens.length }} <span>Assets</span></p>
          </div>
        </div>

        <div class="assets_actions">
          <button>
            <SendIcon />
            <p>Send</p>
          </button>

          <button @click="receiveToken = true">
            <ReceiveIcon />
            <p>Receive</p>
          </button>

          <button>
            <SwapIcon />
            <p>Swap</p>
          </button>
        </div>
      </div>

      <div class="top_assets">
        <div class="assets_head">
          <p>Top Assets</p>

          <div class="dropdown" @click="allAssets = true">
            <div class="dropdown_item">
              <p>All</p>
              <ChevronRightIcon />
            </div>
          </div>
        </div>

        <div class="top_asset" v-for="token, index in tokens.slice(0, 3)" :key="index">
          <div class="info">
            <img :src="token.image" alt="">
            <p>{{ token.name }}</p>
          </div>

          <div class="balance">
            <p>{{ Converter.toMoney(balances[token.address]) }} <span>{{ token.symbol }}</span></p>
          </div>

          <div class="price">
            <p>${{ Converter.toMoney(token.price * balances[token.address]) }}</p>
            <div v-if="index % 2 == 0">
              <ArrowDownIcon />
              <span>-0.0%</span>
            </div>
            <div v-else>
              <ArrowUpIcon />
              <span>+0.0%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ProgressBox v-if="progress" />

    <div class="transactions" v-else>
      <div class="title">
        <div class="name">
          <p>Transactions</p>
          <p>{{ transactions.length }} <span>Txns</span></p>
        </div>

        <button class="filter">
          <FilterIcon />
          <p>Filter</p>
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <td>Type</td>
            <td>Time</td>
            <td>Status</td>
            <td>Signers</td>
            <td>Amount</td>
            <td></td>
          </tr>
        </thead>

        <tbody>
          <tr v-for="transaction, index in transactions" :key="index"
            @click="index == activeIndex ? activeIndex = - 1 : activeIndex = index"
            :class="index == activeIndex ? 'active_transaction' : ''">
            <td>
              <div class="product">
                <PaymentsIcon v-if="transaction.type == TransactionType.OneTime" />
                <PaymentsIcon v-if="transaction.type == TransactionType.Recurrent" />
                <ReceiveIcon v-if="transaction.type == TransactionType.Send" />

                <div class="product_info">
                  <p v-if="transaction.type == TransactionType.OneTime">{{
                    transaction.description?.length > 0 ? transaction.description : 'One Time'
                  }}</p>
                  <p v-if="transaction.type == TransactionType.Recurrent">{{
                    transaction.description?.length > 0 ?
                      transaction.description : 'Recurrent'
                  }}</p>
                  <p v-if="transaction.type == TransactionType.Send">{{
                    transaction.description?.length > 0 ?
                      transaction.description : 'Send'
                  }}</p>

                  <div v-if="transaction.type == TransactionType.OneTime">
                    <p>{{ transaction.payers.length }} {{ transaction.payers.length < 2 ? 'Signer' : 'Signers' }}</p>
                  </div>
                </div>
              </div>
            </td>

            <td>
              <div class="time">
                <p>
                  {{
                    Intl.DateTimeFormat('en-US', {
                      day: '2-digit',
                      month: 'short',
                    }).format(transaction.blockTimestamp * 1000)
                  }}
                </p>
                <p>
                  {{
                    Intl.DateTimeFormat('en-US', {
                      second: '2-digit',
                      minute: '2-digit',
                      hour: '2-digit'
                    }).format(transaction.blockTimestamp * 1000)
                  }}
                </p>
              </div>
            </td>

            <td>
              <div class="status"
                v-if="transaction.type == TransactionType.OneTime && transaction.payers.length < transaction.fulfilleds.length">
                <PendingIcon />
                <p>Pending</p>
              </div>

              <div class="status"
                v-if="transaction.type == TransactionType.OneTime && transaction.payers.length == transaction.fulfilleds.length">
                <CompletedIcon />
                <p>Completed</p>
              </div>

              <div class="status" v-if="transaction.type == TransactionType.Recurrent">
                <CompletedIcon />
                <p>Completed</p>
              </div>
            </td>

            <td>
              <div class="signers">
                <div class="users">
                  <UsersIcon />
                  <p v-if="transaction.type == TransactionType.OneTime">
                    {{ transaction.fulfilleds.length }} <span>of {{ transaction.payers.length }}</span>
                  </p>

                  <p v-if="transaction.type == TransactionType.Recurrent">1 <span>of 1</span> </p>
                </div>

                <div class=" progress">
                  <div v-if="transaction.type == TransactionType.OneTime" class="bar"
                    :style="`width: ${(transaction.fulfilleds.length / transaction.payers.length) * 100}%`"></div>

                  <div v-if="transaction.type == TransactionType.Recurrent" class="bar" :style="`width: ${100}%`"></div>
                </div>
              </div>
            </td>

            <td>
              <div class="amount">
                <p v-if="transaction.type == TransactionType.OneTime">
                  {{
                    Converter.toMoney(
                      Number(formatUnits(transaction.amounts.reduce((a, b) => a + b, BigInt(0)),
                        getToken(transaction.token)?.decimals || 18))
                    )
                  }}
                  <span>{{ getToken(transaction.token)?.symbol }}</span>
                </p>
                <p v-if="transaction.type == TransactionType.OneTime">≈ ${{Converter.toMoney(
                  (getToken(transaction.token)?.price || 0) * Number(formatUnits(transaction.amounts.reduce((a, b) => a
                    + b, BigInt(0)),
                    getToken(transaction.token)?.decimals || 18))

                )}}
                </p>

                <p v-if="transaction.type == TransactionType.Recurrent">
                  {{
                    Converter.toMoney(
                      Number(formatUnits(transaction.amount,
                        getToken(transaction.token)?.decimals || 18))
                    )
                  }}
                  <span>{{ getToken(transaction.token)?.symbol }}</span>
                </p>
                <p v-if="transaction.type == TransactionType.Recurrent">≈ ${{ Converter.toMoney(
                  (getToken(transaction.token)?.price || 0) * Number(formatUnits(transaction.amount,
                    getToken(transaction.token)?.decimals || 18)))
                }}
                </p>
              </div>
            </td>

            <td>
              <div class="view_dropdown">
                <div class="view">
                  <ChevronDownIcon />
                </div>
              </div>
            </td>

            <div class="confirmation">
              <div class="confirmation_title">
                <p>Confrimations</p>
                <div class="icon">

                </div>
              </div>

              <div class="confirmation_signers"
                :style="`grid-template-columns: repeat(${transaction.confirmations.length}, 1fr);`">
                <div class="confirmation_signer" v-for="confirmation, index in transaction.confirmations">
                  <div class="signer_wrapper">
                    <div class="signer_info">
                      <UserIcon />
                      <p>Signer {{ index + 1 }}</p>
                    </div>
                    <p>{{ Converter.fineAddress(confirmation.from, 6) }}</p>
                  </div>
                  <a target="_blank" :href="`${VITE_EXPLORER_URL}/tx/${confirmation.transactionHash}`">
                    <OutIcon />
                  </a>
                </div>
              </div>
            </div>
          </tr>
        </tbody>
      </table>

      <div class="empty" v-if="!progress && transactions.length == 0">
        <img src="/images/empty.png" alt="">
        <p>No transactions.</p>
      </div>
    </div>

    <ReceiveToken v-if="walletStore.merchant && receiveToken" :address="walletStore.merchant.wallet"
      @close="receiveToken = false" />
    <AllAssets v-if="allAssets" :balances="balances" :tokens="tokens" @close="allAssets = false" />
  </div>
</template>

<style scoped>
.treasury {
  padding: 30px 50px;
  padding-bottom: 100px;
}

.assets_grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}


.assets {
  padding-right: 20px;
  border-right: 1px solid var(--bg-lightest);
}

.top_assets {
  padding-left: 20px;
}

.top_asset {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 65px;
  border-bottom: 1px solid var(--bg-lightest);
}

.top_asset .info {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 150px;
}

.top_asset .info img {
  width: 30px;
  height: 30px;
  border-radius: 10px;
}

.top_asset .info p {
  color: var(--tx-normal);
  font-size: 16px;
}

.top_asset .balance {
  width: 150px;
}

.top_asset .balance p {
  color: var(--tx-normal);
  font-size: 14px;
}

.top_asset .balance p span {
  color: var(--tx-semi);
  font-size: 14px;
}

.top_asset .price {
  width: 150px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}

.top_asset .price p {
  color: var(--tx-normal);
  font-size: 16px;
}

.top_asset .price span {
  color: var(--tx-semi);
  font-size: 16px;
}

.top_asset .price div {
  display: flex;
  align-items: center;
  gap: 10px;
}

.assets_head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--bg-lightest);
  padding-bottom: 20px;
}

.assets_head>p {
  color: var(--tx-semi);
  font-size: 16px;
}

.assets_head .dropdown {
  border-radius: 6px;
  border: 1px solid var(--bg-lightest);
}

.dropdown_item {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 32px;
  padding: 0 12px;
  cursor: pointer;
}

.assets_head p {
  color: var(--tx-semi);
  font-size: 14px;
}

.assets_value {
  padding: 30px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--bg-lightest);
}

.value_amount>p {
  color: var(--tx-normal);
  font-size: 26px;
}

.value_amount>p span {
  color: var(--accent-green);
  font-size: 14px;
}

.stats {
  gap: 12px;
  margin-top: 10px;
  display: flex;
  align-items: center;
}

.stat {
  display: flex;
  gap: 4px;
}

.stat p {
  color: var(--tx-semi);
  font-size: 14px;
}

.stat p span {
  color: var(--tx-dimmed);
}

.value_tokens {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.images img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-left: -10px;
}

.value_tokens p {
  margin-top: 10px;
  color: var(--tx-semi);
  font-size: 14px;
}

.value_tokens p span {
  color: var(--tx-dimmed);
}

.assets_actions {
  margin-top: 30px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.assets_actions button {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  border-radius: 8px;
  background: none;
  gap: 10px;
  width: 100%;
  border: 1px solid var(--bg-lightest);
  height: 40px;
  cursor: pointer;
}

.assets_actions button p {
  font-size: 14px;
  color: var(--tx-normal);
}

.transactions {
  margin-top: 30px;
}

.transactions .title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.transactions .title p:first-child {
  color: var(--tx-normal);
  font-size: 16px;
}

.transactions .title p:last-child {
  margin-top: 2px;
  color: var(--tx-semi);
  font-size: 14px;
}

.transactions .title p:last-child span {
  color: var(--tx-dimmed);
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

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: var(--bg-light);
  border-radius: 8px;
}

thead tr {
  height: 38px;
}

thead td {
  color: var(--tx-semi);
  font-size: 14px;
}

td:first-child {
  padding-left: 20px;
}

td:last-child {
  padding-right: 20px;
}

thead td:nth-child(5) {
  text-align: right;
}

tbody tr {
  height: 94px;
  padding: 0 20px;
  border-bottom: 1px solid var(--bg-lighter);
}

tbody td {
  cursor: pointer;
}

tbody tr:last-child {
  border: none;
}

tbody td:last-child {
  display: flex;
  height: 94px;
  align-items: center;
  justify-content: center;
}


.product {
  display: flex;
  align-items: center;
  gap: 16px;
}

.product>svg {
  width: 42px;
  height: 42px;
  border-radius: 8px;
  padding: 10px;
  border: 1px solid var(--bg-lightest);
  object-fit: contain;
}

.product_info>p {
  color: var(--tx-normal);
  font-size: 16px;
}

.product_info div {
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.product_info div p {
  color: var(--tx-semi);
  font-size: 14px;
}

.product_info div svg {
  width: 12px;
  height: 12px;
}

.time p:first-child {
  color: var(--tx-normal);
  font-size: 16px;
}

.time p:last-child {
  color: var(--tx-semi);
  font-size: 14px;
}

.status {
  display: flex;
  align-items: center;
  gap: 6px;
  border: 1px solid var(--bg-lighter);
  padding: 0 12px;
  height: 30px;
  width: fit-content;
  border-radius: 8px;
}

.status p {
  color: var(--tx-normal);
  font-size: 14px;
}


.signers .users {
  display: flex;
  align-items: center;
  gap: 8px;
}

.signers .users p {
  font-size: 16px;
  color: var(--tx-normal);
}

.signers .users p span {
  color: var(--tx-semi);
}

.signers .progress {
  margin-top: 10px;
  width: 70px;
  height: 5px;
  border-radius: 10px;
  background: var(--bg-lighter);
}

.signers .bar {
  height: 100%;
  background: var(--primary-light);
  border-radius: 10px;
}

.amount {
  text-align: right;
}

.amount p:first-child {
  color: var(--tx-normal);
  font-size: 16px;
}

.amount p:first-child span {
  color: var(--tx-semi);
}

.amount p:last-child {
  color: var(--tx-semi);
  font-size: 14px;
}

.view_dropdown {
  padding: 0 10px;
  display: flex;
  justify-content: flex-end;
}

.view {
  width: 32px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid var(--bg-lighter);
}

tr {
  position: relative;
  overflow: hidden;
}

.active_transaction {
  background: var(--bg-lighter);
  margin-bottom: 132px;
}

.confirmation {
  width: 100%;
  position: absolute;
  left: 0;
  bottom: -132px;
  height: 132px;
  display: none;
  padding: 20px;
  z-index: 1;
  background: var(--bg-light);
}

.active_transaction .confirmation {
  display: block;
}

.confirmation_title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 30px;
}

.confirmation_title p {
  color: var(--tx-semi);
  font-size: 14px;
}

.confirmation_signers {
  margin-top: 20px;
  width: 100%;
  display: grid;
  justify-content: space-between;
  border-left: 1px solid var(--bg-lightest);
  border-right: 1px solid var(--bg-lightest);
}

.confirmation_signer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px;
  border-right: 1px solid var(--bg-lightest);
}

.confirmation_signer:last-child {
  border-right: none;
}

.signer_wrapper p {
  margin-top: 6px;
  color: var(--tx-normal);
  font-size: 14px;
}

.signer_info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.signer_info p {
  color: var(--tx-semi);
  font-size: 14px;
}
</style>
