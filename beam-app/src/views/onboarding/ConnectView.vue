<script setup lang="ts">
import EyeIcon from '@/components/icons/EyeIcon.vue';
import WalletIcon from '@/components/icons/WalletIcon.vue';
import { config, chains } from '@/scripts/config';
import { useWalletStore } from '@/stores/wallet';
import { createWeb3Modal } from '@web3modal/wagmi/vue';
import { useWeb3Modal } from '@web3modal/wagmi/vue';
import { watchAccount } from '@wagmi/core';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Connection } from '@/scripts/types';

createWeb3Modal({
    wagmiConfig: config,
    projectId: import.meta.env.VITE_PROJECT_ID,
    // @ts-ignore
    chains: chains,
    enableAnalytics: true,
    themeMode: 'dark'
});

const router = useRouter();
const modal = useWeb3Modal();
const walletStore = useWalletStore();

onMounted(() => {
    watchAccount(config, {
        onChange(account) {
            if (account.address) {
                walletStore.setAddress(account.address);
                walletStore.setConnection(Connection.Wallet);
                router.push('/onboarding/profile');
            }
        },
    });
});
</script>

<template>
    <section>
        <div class="app_width">
            <div class="signin">
                <div class="signin_title">
                    <h3>Get Started with Beam</h3>
                    <p>Connect a wallet to be Signed in into an existing merchant account or create a new one. </p>
                </div>

                <div class="signin_wallets">
                    <div class="signin_wallet signin_wallet_connect" @click="modal.open()">
                        <div class="signin_wallet_name">
                            <WalletIcon />
                            <p>Connect Wallet</p>
                        </div>
                    </div>

                    <div class="or">
                        <div></div> <span>Or</span>
                    </div>

                    <RouterLink to="/onboarding/watch">
                        <div class="signin_wallet signin_wallet_watch">
                            <div class="signin_wallet_name">
                                <EyeIcon />
                                <p>Watch an Account</p>
                            </div>
                        </div>
                    </RouterLink>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
section {
    padding-top: 120px;
    padding-bottom: 60px;
}

.signin {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 50px;
}

.signin_title {
    width: 395px;
    text-align: center;
}

.signin_title h3 {
    font-size: 30px;
    font-weight: 500;
    color: var(--tx-normal);
}

.signin_title p {
    margin-top: 16px;
    font-size: 16px;
    font-weight: 500;
    line-height: 21px;
    color: var(--tx-dimmed);
}

.signin_wallets {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    width: 360px;
    max-width: 100%;
}

.signin_wallets a {
    width: 100%;
}

.signin_wallet {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 20px;
    border: 1px solid var(--bg-lightest);
    border-radius: 6px;
    user-select: none;
    cursor: pointer;
}

.signin_wallet_connect {
    background: var(--primary);
}


.signin_wallet_watch {
    background: var(--bg-light);
}


.signin_wallet_name {
    display: flex;
    align-items: center;
    gap: 16px;
}

.signin_wallet_name img {
    width: 22px;
    height: 22px;
}

.signin_wallet_name p {
    font-size: 14px;
    font-weight: 500;
    color: var(--tx-normal);
}

.or {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    margin: 20px 0;
}

.or div {
    width: 100%;
    height: 1px;
    background: rgba(32, 34, 39, 1);
}

.or span {
    position: absolute;
    background: var(--bg);
    padding: 0 10px;
    font-size: 14px;
    color: var(--tx-semi);
}
</style>