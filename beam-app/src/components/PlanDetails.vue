<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import CloseIcon from './icons/CloseIcon.vue';
import CopyIcon from './icons/CopyIcon.vue';
import ForwardIcon from './icons/ForwardIcon.vue';
import EditIcon from './icons/EditIcon.vue';
import EraserIcon from './icons/EraserIcon.vue';
import TrashIcon from './icons/TrashIcon.vue';
import { onMounted, onUnmounted, ref } from 'vue';
import Converter from '@/scripts/converter';
import { getToken } from 'beam-ts/src/utils/constants';
import { notify } from '@/reactives/notify';

const modules = [Pagination];
const planLink = ref<string>('');

const props = defineProps({
    plan: { type: Object, required: true }
});

const emit = defineEmits(['close']);

const copyLink = async () => {
    try {
        await navigator.clipboard.writeText(planLink.value);
        notify.push({
            title: 'Link copied!',
            description: planLink.value,
            category: 'success'
        });
    } catch (error) {
        notify.push({
            title: 'Failed to copy link!',
            description: planLink.value,
            category: 'error'
        });
    }
};

const shareLink = () => {
    if (!navigator.canShare()) {
        notify.push({
            title: 'Cannot share!',
            description: 'Copy instead.',
            category: 'error'
        });
        return;
    }

    navigator.share({
        title: props.plan.names,
        text: props.plan.description,
        url: planLink.value
    });
};

onMounted(() => {
    document.body.style.overflowY = 'hidden';
    planLink.value = `https://beam-checkout.netlify.app?id=${props.plan._id}&type=plan`;
});

onUnmounted(() => {
    document.body.style.overflowY = 'auto';
});
</script>

<template>
    <div class="overlay">
        <div class="plan">
            <div class="title">
                <p>Plan Details</p>

                <div class="close" @click="emit('close')">
                    <CloseIcon />
                </div>
            </div>

            <div class="scroll">
                <div class="images">
                    <swiper class="swiper" :pagination="{
                        clickable: true,
                        dynamicBullets: true,
                    }" :modules="modules">
                        <SwiperSlide v-for="image in props.plan.images" :key="image">
                            <img :src="image" :alt="props.plan.name">
                        </SwiperSlide>
                    </swiper>
                </div>

                <div class="info">
                    <p class="name">{{ props.plan.name }}</p>

                    <div class="type">
                        <div class="category">
                            <p>{{ props.plan.category }}</p>
                            <p>Status: {{ props.plan.available ? 'Active' : 'Not active' }}</p>
                        </div>

                        <div class="price">{{ Converter.toMoney(props.plan.amount) }}
                            {{ getToken(props.plan.token)?.symbol }}
                        </div>
                    </div>
                </div>

                <div class="description">
                    <p class="head">Description</p>
                    <p class="body">
                        {{ props.plan.description }}
                    </p>
                </div>

                <div class="link">
                    <p class="head">Payment Link</p>
                    <div class="body">
                        <div class="field">
                            <p>{{ planLink }}</p>
                            <div class="icon" @click="copyLink">
                                <CopyIcon />
                            </div>
                        </div>

                        <div class="forward" @click="shareLink">
                            <ForwardIcon />
                        </div>
                    </div>
                </div>

            </div>

            <div class="actions">
                <button>
                    <EditIcon />
                    <p>Edit</p>
                </button>

                <div class="buttons">
                    <button>
                        <TrashIcon />
                        <p>Delete</p>
                    </button>

                    <button>
                        <EraserIcon />
                        <p>Delist</p>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.overlay {
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    position: fixed;
    background: rgba(51, 51, 51, 0.35);
    backdrop-filter: blur(5px);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 20px;
}


.plan {
    width: 400px;
    height: fit-content;
    border-radius: 16px;
    background: var(--bg);
    overflow: hidden;
}

.title {
    padding: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.title p {
    font-size: 16px;
    color: var(--tx-normal);
}

.swiper {
    width: 100%;
}

.scroll {
    overflow-y: scroll;
    height: calc(100vh - 260px);
}

.images {
    padding: 20px;
}

.plan img {
    width: 352px;
    height: 352px;
    object-fit: contain;
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

.info {
    padding: 0 24px;
}

.name {
    color: var(--tx-normal);
    font-size: 16px;
}

.type {
    margin-top: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.category p {
    color: var(--tx-dimmed);
    font-size: 14px;
}

.category p span {
    color: var(--tx-normal);
}

.price {
    color: var(--tx-normal);
    font-size: 16px;
}

.description .head {
    margin-top: 24px;
    padding: 0 24px;
    width: 100%;
    height: 34px;
    background: var(--bg-light);
    color: var(--tx-semi);
    font-size: 14px;
    display: flex;
    align-items: center;
}

.description .body {
    padding: 24px;
    color: var(--tx-dimmed);
    font-size: 14px;
    line-height: 21px;
}

.link .head {
    padding: 0 24px;
    width: 100%;
    height: 34px;
    background: var(--bg-light);
    color: var(--tx-semi);
    font-size: 14px;
    display: flex;
    align-items: center;
}

.link .body {
    padding: 24px;
    display: grid;
    grid-template-columns: 1fr 40px;
    align-items: center;
    gap: 10px;
}

.link .field {
    display: grid;
    grid-template-columns: 1fr 40px;
    border: 1px dashed var(--bg-lightest);
    border-radius: 8px;
    overflow: hidden;
}

.link .field p {
    height: 40px;
    display: flex;
    align-items: center;
    padding: 0 10px;
    font-size: 14px;
    color: var(--tx-semi);
    text-overflow: ellipsis;
    overflow: hidden;
    text-wrap: nowrap;
}

.link .field .icon {
    height: 40px;
    gap: 10px;
    background: var(--bg-lighter);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.link .field .icon svg {
    width: 18px;
    height: 18px;
}

.forward {
    width: 40px;
    height: 40px;
    gap: 10px;
    border: 1px dashed var(--bg-lightest);
    display: flex;
    align-items: center;
    border-radius: 8px;
    justify-content: center;
    cursor: pointer;
}

.actions {
    padding: 24px;
    background: var(--bg-light);
    border-top: 1px solid var(--bg-lightest);
}

.actions button {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background: none;
    gap: 10px;
    width: 100%;
    border: 1px dashed var(--bg-lightest);
    height: 40px;
    cursor: pointer;
}

.actions button p {
    font-size: 14px;
    color: var(--tx-semi);
}

.actions .buttons {
    margin-top: 10px;
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(2, 1fr);
}
</style>