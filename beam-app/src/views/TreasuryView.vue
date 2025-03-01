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
            <p>$248,569 <span>+14%</span></p>

            <div class="stats">
              <div class="stat">
                <SendIcon />
                <p>$69,145 <span>Outs</span></p>
              </div>

              <div class="stat">
                <ReceiveIcon />
                <p>$48,145 <span>Ins</span></p>
              </div>
            </div>
          </div>

          <div class="value_tokens">
            <div class="images">
              <img src="/images/btc.png" alt="">
              <img src="/images/eth.png" alt="">
              <img src="/images/usdt.png" alt="">
              <img src="/images/token.png" alt="">
            </div>

            <p>7 <span>Assets</span></p>
          </div>
        </div>

        <div class="assets_actions">
          <button>
            <SendIcon />
            <p>Send</p>
          </button>

          <button>
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

          <div class="dropdown">
            <div class="dropdown_item">
              <p>All</p>
              <ChevronRightIcon />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="transactions">
      <div class="title">
        <div class="name">
          <p>Transactions</p>
          <p>21 <span>Txns</span></p>
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
          <tr v-for="sale in 20" :key="sale">
            <td>
              <div class="product">
                <ReceiveIcon />

                <div class="product_info">
                  <p>Receive</p>
                  <div>
                    <p>Txn ID</p>
                    <OutIcon />
                  </div>
                </div>
              </div>
            </td>

            <td>
              <div class="time">
                <p>14 Feb</p>
                <p>03:10:12 PM</p>
              </div>
            </td>

            <td>
              <div class="status">
                <PendingIcon />
                <p>Pending</p>
              </div>
            </td>

            <td>
              <div class="signers">
                <div class="users">
                  <UsersIcon />
                  <p>1 <span>of 2</span></p>
                </div>

                <div class="progress">
                  <div class="bar"></div>
                </div>
              </div>
            </td>

            <td>
              <div class="amount">
                <p>0.384 <span>BTC</span></p>
                <p>≈ $39,680</p>
              </div>
            </td>

            <td>
              <div class="view">
                <ChevronRightIcon />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.treasury {
  padding: 30px 50px;
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

}

.assets_head p {
  color: var(--tx-semi);
  font-size: 14px;
}

.assets_value {
  padding: 20px 0 30px 0;
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
  border: 1px dashed var(--bg-lightest);
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
  width: 50%;
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

.view {
  width: 32px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid var(--bg-lighter);
}
</style>
