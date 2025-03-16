<script setup lang="ts">
import CloseIcon from './icons/CloseIcon.vue';
import QrcodeVue from 'qrcode.vue';
import { onMounted, onUnmounted } from 'vue';
import CopyIcon from './icons/CopyIcon.vue';
import { notify } from '@/reactives/notify';

const emit = defineEmits(['close']);

const props = defineProps({
    address: { type: String, required: true }
});

const copyLink = async () => {
    try {
        await navigator.clipboard.writeText(props.address);
        notify.push({
            title: 'Address copied!',
            description: props.address,
            category: 'success'
        });
    } catch (error) {
        notify.push({
            title: 'Failed to copy address!',
            description: props.address,
            category: 'error'
        });
    }
};

onMounted(() => {
    document.body.style.overflowY = 'hidden';
});

onUnmounted(() => {
    document.body.style.overflowY = 'auto';
});
</script>

<template>
    <div class="overlay">
        <div class="box">
            <div class="title">
                <p>Receive Asset</p>

                <div class="close" @click="emit('close')">
                    <CloseIcon />
                </div>
            </div>

            <div class="subtitle">
                <p>This is the address of your Beam Account. Deposit funds by scanning the QR Code or copying the
                    address below. <span>Only send Scroll (ETH) and Scroll ERC20 to this address.</span></p>
            </div>

            <div class="qr">
                <div class="code_wrapper">
                    <div class="code">
                        <qrcode-vue :value="props.address" :size="250" level="H" render-as="svg" />
                    </div>
                </div>
            </div>

            <div class="address">
                <img src="/images/colors.png" alt="">
                <div class="input">
                    <p>{{ props.address }}</p>
                    <div class="icon" @click="copyLink">
                        <CopyIcon />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.overlay {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    position: fixed;
    background: rgba(51, 51, 51, 0.35);
    backdrop-filter: blur(5px);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
}

.box {
    height: fit-content;
    width: 550px;
    border-radius: 16px;
    background: var(--bg);
    overflow: hidden;
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

.title {
    padding: 30px 30px 14px 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.title p {
    font-size: 16px;
    color: var(--tx-normal);
}

.subtitle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--bg-light);
    padding: 14px 24px;
}

.subtitle p {
    font-size: 14px;
    color: var(--tx-semi);
}

.subtitle p span {
    color: var(--tx-normal);
}

.qr {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 30px;
}

.code_wrapper {
    padding: 24px;
    border-radius: 28px;
    border: 1px dashed var(--bg-lightest);
    width: fit-content;
    height: fit-content;
}

.code {
    padding: 14px;
    border-radius: 16px;
    background: white;
    width: fit-content;
    height: fit-content;
}

.address {
    border-top: 1px solid var(--bg-lightest);
    background: var(--bg-light);
    display: flex;
    align-items: center;
    padding: 30px;
    gap: 14px;
}

.address img {
    width: 40px;
    height: 40px;
    border-radius: 8px;
}

.input {
    width: 100%;
    border: 1px dashed var(--bg-lightest);
    border-radius: 10px;
    display: grid;
    grid-template-columns: 1fr 40px;
    align-items: center;
}

.input p {
    padding: 0 10px;
    font-size: 14px;
    color: var(--tx-semi);
}

.input .icon {
    border-radius: 10px;
    border-left: 1px solid var(--bg-lightest);
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}
</style>