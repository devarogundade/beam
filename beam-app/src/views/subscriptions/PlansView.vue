<script setup lang="ts">
import PlanDetails from '@/components/PlanDetails.vue';
import { useWalletStore } from '@/stores/wallet';
import { onMounted, ref } from 'vue';
import ProgressBox from '@/components/ProgressBox.vue';
import { Client } from '@/scripts/client';
import { Plan } from '@/scripts/types';
import Converter from '@/scripts/converter';
import CreatePlan from '@/components/CreatePlan.vue';
import { getToken } from 'beam-ts/src/utils/constants';

const walletStore = useWalletStore();
const progress = ref<boolean>(false);
const plans = ref<Plan[]>([]);
const selectedPlan = ref<Plan | null>(null);

const emit = defineEmits(['close-creating-plan']);

const props = defineProps({
    creatingPlan: { type: Boolean }
});

const getPlans = async (load: boolean = true) => {
    if (!walletStore.address) return;
    progress.value = load;

    plans.value = await Client.getPlans(walletStore.address);

    progress.value = false;

    const clientMerchant = await Client.getMerchant(walletStore.address);
    walletStore.setClientMerchant(clientMerchant);
};

onMounted(() => {
    getPlans();
});
</script>

<template>
    <ProgressBox v-if="progress" />
    <div class="plans">
        <div class="plan" v-for="plan, index in plans" :key="index" @click="selectedPlan = plan">
            <img :src="plan.images[0]" alt="">

            <div class="plan_info">
                <h3 class="name">{{ plan.name }}</h3>
                <p class="description">{{ plan.description }}</p>

                <div class="plan_type">
                    <div class="duration">
                        <p>Duration: <span>{{ plan.interval / (24 * 60 * 60 * 1000) }} days</span></p>
                        <p>{{ plan.available ? 'Active' : 'Not active' }}</p>
                    </div>

                    <div class="amount">{{ Converter.toMoney(plan.amount) }} {{ getToken(plan.token)?.symbol }}</div>
                </div>
            </div>
        </div>
    </div>
    <div class="empty" v-if="!progress && plans.length == 0">
        <img src="/images/empty.png" alt="">
        <p>No plans.</p>
    </div>

    <CreatePlan v-if="props.creatingPlan" @refresh="getPlans(false)" @close="emit('close-creating-plan')" />

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
    width: 100%;
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
    width: 100%;
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