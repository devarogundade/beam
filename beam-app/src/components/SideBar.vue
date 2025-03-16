<script setup lang="ts">
import BeamLogo from '@/components/icons/BeamLogo.vue';
import CopyIcon from '@/components/icons/CopyIcon.vue';
import OverviewIcon from '@/components/icons/OverviewIcon.vue';
import PaymentsIcon from '@/components/icons/PaymentsIcon.vue';
import SettingsIcon from '@/components/icons/SettingsIcon.vue';
import TreasuryIcon from '@/components/icons/TreasuryIcon.vue';

import { useRoute } from 'vue-router';
import ChevronRightIcon from './icons/ChevronRightIcon.vue';
import { useWalletStore } from '@/stores/wallet';
import { Connection } from '@/scripts/types';
import Converter from '@/scripts/converter';
import AIIcon from './icons/AIIcon.vue';

const route = useRoute();
const walletStore = useWalletStore();
</script>

<template>
    <div class="sidebar" v-if="walletStore.address && walletStore.merchant">
        <RouterLink to="/">
            <header>
                <BeamLogo />
            </header>
        </RouterLink>

        <main>
            <p class="main_title">MAIN</p>

            <div class="options">
                <RouterLink to="/">
                    <div :class="route.name?.toString().startsWith('treasury') ? 'option option_selected' : 'option'">
                        <div class="selector"></div>

                        <button>
                            <TreasuryIcon />
                            <p>Treasury</p>
                        </button>
                    </div>
                </RouterLink>

                <div :class="route.name?.toString().startsWith('overview') ? 'option option_selected' : 'option'">
                    <div class="selector"></div>

                    <button>
                        <OverviewIcon />
                        <p>Overview</p>
                    </button>
                </div>

                <RouterLink to="/payments" v-if="walletStore.connection == Connection.Wallet">
                    <div :class="route.name?.toString().startsWith('payments') ? 'option option_selected' : 'option'">
                        <div class="selector"></div>

                        <button>
                            <PaymentsIcon />
                            <p>Payments</p>
                        </button>
                    </div>
                </RouterLink>

                <div class="option_children" v-if="walletStore.connection == Connection.Wallet">
                    <RouterLink to="/payments">
                        <button
                            :class="route.name?.toString().startsWith('payments-checkouts') ? 'option_child option_child_selected' : 'option_child'">
                            Checkouts
                        </button>
                    </RouterLink>

                    <RouterLink to="/payments/subscriptions">
                        <button
                            :class="route.name?.toString().startsWith('payments-subscriptions') ? 'option_child option_child_selected' : 'option_child'">
                            Subscriptions
                        </button>
                    </RouterLink>
                </div>

                <RouterLink to="/chat" v-if="walletStore.connection == Connection.Wallet">
                    <div :class="route.name?.toString().startsWith('chat') ? 'option option_selected' : 'option'">
                        <div class="selector"></div>

                        <button>
                            <AIIcon />
                            <p>BeamAI</p>
                        </button>
                    </div>
                </RouterLink>
            </div>
        </main>

        <footer>
            <RouterLink to="/settings" v-if="walletStore.connection == Connection.Wallet">
                <div :class="route.name?.toString().startsWith('settings') ? 'option option_selected' : 'option'">
                    <div class="selector"></div>

                    <button>
                        <SettingsIcon />
                        <p>Settings</p>
                    </button>
                </div>
            </RouterLink>

            <div class="account">
                <div class="account_info">
                    <img :src="JSON.parse(walletStore.merchant.metadata_value)?.imageURL ? JSON.parse(walletStore.merchant.metadata_value)?.imageURL : '/images/user.png'"
                        alt="account">
                    <div class="account_name">
                        <p>{{ JSON.parse(walletStore.merchant.metadata_value)?.name }}</p>
                        <div>
                            <p>{{ Converter.fineAddress(walletStore.address, 5) }}</p>
                            <CopyIcon />
                        </div>
                    </div>
                </div>

                <div class="account_arrow">
                    <ChevronRightIcon />
                </div>
            </div>
        </footer>
    </div>
</template>

<style scoped>
.sidebar {
    top: 0;
    position: sticky;
    height: 100vh;
    width: 250px;
    z-index: 20;
    position: fixed;
    border-right: 1px solid var(--bg-lightest);
}

header {
    height: 90px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--bg-lightest);
    margin: 0 24px;
}

main {
    padding-top: 24px;
    height: calc(100vh - 250px);
    overflow: auto;
}

.main_title {
    font-size: 14px;
    letter-spacing: 1%;
    line-height: 17.5px;
    margin: 0 24px;
    color: var(--tx-dimmed);
}

.options {
    margin-top: 22px;
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.option {
    display: flex;
    align-items: center;
    gap: 15px;
}

.option_selected .selector {
    background: var(--primary-light);
}

.selector {
    width: 5px;
    height: 32px;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
}

.option_selected button {
    background: var(--bg-lighter) !important;
}

.option button {
    width: 210px;
    height: 44px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    gap: 12px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0 12px;
}

.option_selected .option button p {
    color: var(--tx-normal);
}

.option button p {
    font-size: 16px;
    line-height: 20px;
    letter-spacing: 2%;
    color: var(--tx-dimmed);
}

.option_children {
    display: flex;
    flex-direction: column;
    border-left: 1px solid var(--bg-lightest);
    margin-left: 44px;
}

.option_child {
    width: 186px;
    height: 44px;
    padding: 0 30px;
    background: none;
    border: none;
    font-size: 16px;
    line-height: 20px;
    letter-spacing: 2%;
    color: var(--tx-dimmed);
    text-align: left;
    cursor: pointer;
}

.option_child_selected {
    color: var(--tx-normal);
}

footer {
    width: 100%;
    height: 200px;
    display: sticky;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

footer a {
    display: block;
    width: 100%;
}

.settings {
    width: 100%;
    height: 44px;
    display: flex;
    align-items: center;
    padding: 0 40px;
    gap: 12px;
    background: none;
    border: none;
    cursor: pointer;
}

.settings p {
    font-size: 16px;
    line-height: 20px;
    letter-spacing: 2%;
    color: var(--tx-dimmed);
}

.account {
    width: calc(100% - 40px);
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 90px;
    margin: 0 20px;
    margin-top: 20px;
    cursor: pointer;
    border-top: 1px solid var(--bg-lightest);
}

.account_info {
    display: flex;
    align-items: center;
    gap: 10px;
}

.account_info img {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    object-fit: cover;
}

.account_name>p {
    font-size: 14px;
    line-height: 17.5px;
    letter-spacing: 2%;
    color: var(--tx-normal);
}

.account_name>div {
    margin-top: 4px;
    display: flex;
    align-items: center;
    gap: 6px;
}

.account_name>div p {
    font-size: 12px;
    line-height: 15px;
    letter-spacing: 2%;
    color: var(--tx-dimmed);
}

.account_arrow {
    width: 24px;
    height: 24px;
    border-radius: 6px;
    border: 1px solid var(--bg-lightest);
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>