<script setup lang="ts">
import CloseIcon from './icons/CloseIcon.vue';
import CopyIcon from './icons/CopyIcon.vue';
import ForwardIcon from './icons/ForwardIcon.vue';
import EditIcon from './icons/EditIcon.vue';
import EraserIcon from './icons/EraserIcon.vue';
import TrashIcon from './icons/TrashIcon.vue';
import { onMounted, onUnmounted } from 'vue';

const props = defineProps({
    plan: { type: Object, required: true }
});

const emit = defineEmits(['close']);

onMounted(() => {
    document.body.style.overflowY = 'hidden';
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
                    <img :src="`/images/image_${1}.png`" alt="">
                </div>

                <div class="info">
                    <p class="name">Rabbit R1 Device</p>

                    <div class="type">
                        <div class="duration">
                            <p>Duration: <span>30d</span></p>
                            <p>Active</p>
                        </div>

                        <div class="amount">$24.99</div>
                    </div>
                </div>

                <div class="description">
                    <p class="head">Description</p>
                    <p class="body">Lorem ipsum dolor sit amet consectetur. Scelerisque eu augue sed sagittis enim
                        dignissim. Lorem non nisl nulla tristique ornare est. Congue mi dictum faucibus pulvinar
                        volutpat
                        nisl sapien. </p>
                </div>

                <div class="link">
                    <p class="head">Payment Link</p>
                    <div class="body">
                        <div class="field">
                            <p>beampay.com/reflex...</p>
                            <div class="icon">
                                <CopyIcon />
                            </div>
                        </div>

                        <div class="forward">
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
    border-radius: 16px;
    height: fit-content;
    width: 400px;
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