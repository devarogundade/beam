<script setup lang="ts">
import PlanDetails from '@/components/PlanDetails.vue';
import { useWalletStore } from '@/stores/wallet';
import { onMounted, ref } from 'vue';
import BeamSDK from "beam-ts/src/index";
import { Network } from "beam-ts/src/enums";
import type { Subscription } from "beam-ts/src/types";

const beamSdk = new BeamSDK({
    network: Network.Testnet
});

const walletStore = useWalletStore();
const progress = ref<boolean>(false);
const plans = ref<Subscription[]>([]);
const selectedPlan = ref<Subscription | null>(null);

const getSubscriptions = async (page: number, load: boolean = true) => {
    if (!walletStore.address) return;
    progress.value = load;

    plans.value = await beamSdk.recurrentTransaction.getSubscriptions({
        merchant: walletStore.address, page, limit: 20
    });

    progress.value = false;
};

onMounted(() => {
    getSubscriptions(1);
});
</script>

<template>
    <div class="plans">
        <div class="plan" v-for="plan, index in plans" :key="index" @click="selectedPlan = plan">
            <img src="/images/image_1.png" alt="">

            <div class="plan_info">
                <h3 class="name">Rabbit R1 Pro Premium</h3>
                <p class="description">Lorem ipsum dolor sit amet consectetur. Ultrices et semper ant dolor sit amet.
                </p>

                <div class="plan_type">
                    <div class="duration">
                        <p>Duration: <span>{{ plan.interval }}</span></p>
                        <p>Active</p>
                    </div>

                    <div class="amount">$24.99</div>
                </div>
            </div>
        </div>
    </div>

    <PlanDetails v-if="selectedPlan" :plan="selectedPlan" @close="selectedPlan = null" />
</template>

<style scoped>
.plans {
    padding: 0 50px;
    padding-bottom: 50px;
    gap: 30px;
    display: flex;
    flex-wrap: wrap;
}

.plan {
    display: flex;
    align-items: center;
    border-radius: 14px;
    background: var(--bg-light);
    width: 530px;
    cursor: pointer;
}

.plan img {
    width: 200px;
    height: 200px;
    object-fit: contain;
}

.plan_info {
    padding: 0 20px 0 10px;
}

.name {
    color: var(--tx-normal);
    font-size: 16px;
}

.description {
    margin-top: 16px;
    font-size: 14px;
    color: var(--tx-dimmed);
}

.plan_type {
    margin-top: 18px;
    padding-top: 18px;
    border-top: 1px dashed var(--bg-lightest);
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.duration p:first-child {
    font-size: 14px;
    color: var(--tx-semi);
}

.duration p:first-child span {
    color: var(--tx-normal);
}

.duration p:last-child {
    margin-top: 6px;
    font-size: 14px;
    color: var(--accent-green);
}

.amount {
    font-size: 16px;
    color: var(--tx-normal);
}
</style>