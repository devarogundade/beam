<script setup lang="ts">
import { useWalletStore } from '@/stores/wallet';
import CheckIcon from './icons/CheckIcon.vue';
import CloseIcon from './icons/CloseIcon.vue';
import EraserIcon from './icons/EraserIcon.vue';
import UploadIcon from './icons/UploadIcon.vue';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { Client } from '@/scripts/client';
import Storage from '@/scripts/storage';
import { MerchantContract } from '@/scripts/contract';
import { getTokens } from 'beam-ts/src/utils/constants';
import { parseUnits } from 'viem';
import { notify } from '@/reactives/notify';
import { Token } from '@/scripts/types';

const emit = defineEmits(['close', 'refresh']);
const walletStore = useWalletStore();

const creating = ref<boolean>(false);
const selectedImage = ref<number>(0);
const token = ref<Token | null>(null);
const tokens = ref<Token[]>([]);
const images = ref<(File | null)[]>([null, null, null]);
const selectedImageURLs = ref<(string | undefined)[]>([undefined, undefined, undefined]);

const form = ref({
    name: '',
    description: '',
    images: [] as string[],
    category: '',
    interval: 0,
    gracePeriod: 0,
    amount: 0
});

const onImageSelected = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files) {
        images.value[selectedImage.value] = target.files[0];
        selectedImageURLs.value[selectedImage.value] = URL.createObjectURL(target.files[0]);
    }
};

const create = async () => {
    if (creating.value) return;
    if (!token.value) return;
    if (!walletStore.address) return;

    if (form.value.name.length < 3) {
        notify.push({
            title: 'Name is too short!',
            description: 'Try again',
            category: "error"
        });
        return;
    }

    if (form.value.description.length < 3) {
        notify.push({
            title: 'Description is too short!',
            description: 'Try again',
            category: "error"
        });
        return;
    }

    if (form.value.category.length < 3) {
        notify.push({
            title: 'Category is too short!',
            description: 'Try again',
            category: "error"
        });
        return;
    }

    if (form.value.interval == 0) {
        notify.push({
            title: 'Duration cannot be zero!',
            description: 'Try again',
            category: "error"
        });
        return;
    }

    if (form.value.amount == 0) {
        notify.push({
            title: 'Amount cannot be zero!',
            description: 'Try again',
            category: "error"
        });
        return;
    }

    creating.value = true;

    for (const image of images.value) {
        if (image) {
            const imageURL = await Storage.awaitUpload(image, image.name);
            form.value.images.push(imageURL);
        }
    }

    const interval = (form.value.interval * 24 * 60 * 60 * 1000);

    const transactionHash = await MerchantContract.createSubscription({
        token: token.value.address,
        interval: interval,
        amount: parseUnits(form.value.amount.toString(), token.value.decimals),
        gracePeriod: form.value.gracePeriod,
        description: form.value.description
    });

    if (!transactionHash) {
        notify.push({
            title: 'Failed to create subscription on-chain!',
            description: 'Try again',
            category: "error"
        });
        return;
    }

    const created = await Client.createPlan({
        transactionHash: transactionHash,
        merchant: walletStore.address,
        name: form.value.name,
        description: form.value.description,
        images: form.value.images,
        category: form.value.category,
        interval: interval,
        gracePeriod: form.value.gracePeriod,
        amount: form.value.amount,
        token: token.value.address
    });

    if (created) {
        notify.push({
            title: 'Plan created!',
            description: 'Share plan link to your customers.',
            category: "success"
        });

        emit('refresh');
        emit('close');
    } else {
        notify.push({
            title: 'Failed to create plan!',
            description: 'Try again',
            category: "error"
        });
    }

    creating.value = false;
};

watch(walletStore, () => {
    tokens.value = getTokens.filter(t => walletStore.merchant?.tokens.includes(t.address));
    if (tokens.value.length > 0) token.value = tokens.value[0];
}, { deep: true });

onMounted(() => {
    document.body.style.overflowY = 'hidden';
    tokens.value = getTokens.filter(t => walletStore.merchant?.tokens.includes(t.address));
    if (tokens.value.length > 0) token.value = tokens.value[0];
});

onUnmounted(() => {
    document.body.style.overflowY = 'auto';
});
</script>

<template>
    <div class="overlay">
        <div class="form">
            <div class="title">
                <p>Create Plan</p>

                <div class="close" @click="emit('close')">
                    <CloseIcon />
                </div>
            </div>

            <div class="scroll">
                <div class="image">
                    <div class="label">
                        <p>Product Image</p>
                    </div>

                    <div class="file">
                        <div class="upload">
                            <img :src="selectedImageURLs[selectedImage] ? selectedImageURLs[selectedImage] : `/images/placeholder.png`"
                                alt="">

                            <div class="tabs">
                                <div v-for="imageURL, index in selectedImageURLs" @click="selectedImage = index"
                                    :class="selectedImage == index ? 'tab tab_active' : 'tab'" :key="index">
                                    <img :src="imageURL ? imageURL : `/images/placeholder.png`" alt="">
                                </div>
                            </div>
                        </div>

                        <div class="upload_text">
                            <input type="file" accept="image/*" @change="onImageSelected">
                            <p>
                                Click below to upload a JPG or PNG file type, <span>100 x 100px recommended.</span>
                            </p>

                            <button>
                                <UploadIcon />
                                <p>Upload</p>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="details">
                    <p class="head">Plan Details</p>

                    <div class="inputs">
                        <div class="label">
                            <p>Name</p>
                            <p>{{ form.name.length }}<span>/24</span></p>
                        </div>

                        <input type="text" v-model="form.name">
                    </div>

                    <div class="inputs">
                        <div class="label">
                            <p>Description</p>
                            <p>{{ form.description.length }}<span>/400</span></p>
                        </div>

                        <textarea rows="3" v-model="form.description"
                            placeholder="Shortly describe the plan"></textarea>
                    </div>

                    <div class="asset">
                        <div class="label">
                            <p>Token</p>
                        </div>

                        <div class="tokens">
                            <div v-for="t in tokens"
                                :class="t.address == token?.address ? 'token token_selected' : 'token'"
                                @click="token = t">
                                <div class="token_info">
                                    <img :src="t.image" alt="">
                                    <p>{{ t.symbol }}</p>
                                </div>
                                <div class="radio">
                                    <div>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="inputs_grid">
                        <div class="inputs">
                            <div class="label">
                                <p>Amount</p>
                            </div>
                            <div class="input_grid">
                                <p>{{ token?.symbol }}</p>
                                <input type="number" v-model="form.amount" placeholder="0">
                            </div>
                        </div>

                        <div class="inputs">
                            <div class="label">
                                <p>Duration</p>
                            </div>
                            <div class="input_grid input_grid_2">
                                <input type="number" v-model="form.interval" placeholder="0">
                                <p>Days</p>
                            </div>
                        </div>
                    </div>

                    <div class="inputs">
                        <div class="label">
                            <p>Category</p>
                            <p>{{ form.category.length }}<span>/18</span></p>
                        </div>

                        <input type="text" v-model="form.category">
                    </div>
                </div>
            </div>

            <div class="actions">
                <div class="buttons">
                    <button @click="emit('close')">
                        <EraserIcon />
                        <p>Cancel</p>
                    </button>

                    <button @click="create">
                        <CheckIcon />
                        <p>{{ creating ? 'Saving' : 'Save' }}</p>
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

.form {
    height: fit-content;
    width: 500px;
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

.scroll {
    overflow-y: scroll;
    max-height: calc(100vh - 240px);
}


.upload>img {
    width: 190px;
    height: 190px;
    border-radius: 12px;
    object-fit: contain;
    border: 1px dashed var(--bg-lightest);
}

.tabs {
    margin-top: 20px;
    width: 190px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    cursor: pointer;
}

.tab img {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    object-fit: contain;
    border: 1px solid var(--bg-lightest);
}

.tab_active img {
    border: 1px solid var(--tx-semi);
}

.image {
    margin-top: 24px;
}

.image .label {
    padding: 0 24px;
}

.image .label p {
    font-size: 16px;
    color: var(--tx-semi);
}

.file {
    padding: 24px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
}

.upload_text {
    padding: 0 24px;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: flex-end;
    border-left: 1px solid var(--bg-lightest);
    gap: 70px;
    position: relative;
}

.upload_text input {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    z-index: 1;
    opacity: 0;
    cursor: pointer;
}

.upload_text>p {
    text-align: center;
    font-size: 14px;
    line-height: 21px;
    color: var(--tx-dimmed);
}

.upload_text>p span {
    color: var(--tx-semi);
}

.upload_text button {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background: none;
    padding: 0 28px;
    gap: 10px;
    border: 1px dashed var(--bg-lightest);
    height: 40px;
    cursor: pointer;
}

.upload_text button p {
    font-size: 14px;
    color: var(--tx-normal);
}

.details {
    padding-bottom: 24px;
}

.details .head {
    padding: 0 24px;
    width: 100%;
    height: 34px;
    background: var(--bg-light);
    color: var(--tx-semi);
    font-size: 14px;
    display: flex;
    align-items: center;
}

.details .inputs {
    margin-top: 24px;
    padding: 0 24px;
}

.details .label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
}

.details .label p:first-child {
    font-size: 14px;
    color: var(--tx-dimmed);
}

.details .label p:last-child {
    font-size: 14px;
    color: var(--tx-normal);
}

.details .label p:last-child span {
    color: var(--tx-dimmed);
}

.details .inputs input {
    height: 44px;
    width: 100%;
    border-radius: 8px;
    background: none;
    border: 1px solid var(--bg-lightest);
    color: var(--tx-normal);
    padding: 0 16px;
    outline: none;
    font-size: 14px;
}

.details .inputs input::placeholder {
    color: var(--tx-dimmed);
}

.details .inputs textarea {
    width: 100%;
    border-radius: 8px;
    background: none;
    border: 1px solid var(--bg-lightest);
    color: var(--tx-normal);
    padding: 12px 16px;
    resize: none;
    outline: none;
    font-size: 14px;
}

.details .inputs textarea::placeholder {
    color: var(--tx-dimmed);
}

.asset {
    margin-top: 24px;
    padding: 0 30px;
}

.tokens {
    margin-top: 14px;
    display: grid;
    align-items: center;
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
}

.token {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 44px;
    border-radius: 8px 10px 10px 8px;
    border: 1px solid var(--bg-lighter);
    cursor: pointer;
    user-select: none;
}

.token_info {
    padding: 0 14px;
    display: flex;
    align-items: center;
    gap: 12px;
}

.token_info img {
    width: 20px;
    height: 20px;
    border-radius: 10px;
}

.token_info p {
    color: var(--tx-normal);
    font-size: 14px;
}

.token .radio {
    width: 44px;
    height: 100%;
    border: 1px solid var(--bg-lightest);
    border-radius: 0 8px 8px 0;
    background: var(--bg-light);
    display: flex;
    align-items: center;
    justify-content: center;
}

.token .radio div {
    width: 20px;
    height: 20px;
    border-radius: 10px;
    border: 1px solid var(--bg-lightest);
    background: var(--bg);
    display: flex;
    align-items: center;
    justify-content: center;
}

.token .radio div span {
    width: 10px;
    height: 10px;
    border-radius: 10px;
}

.token_selected .radio div {
    border: 1px solid var(--primary-light);
}

.token_selected .radio div span {
    background: var(--primary);
}

.inputs_grid {
    gap: 10px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
}

.input_grid {
    overflow: hidden;
    display: grid;
    grid-template-columns: 60px 1fr;
    border: 1px solid var(--bg-lightest);
    border-radius: 8px;
}

.input_grid_2 {
    grid-template-columns: 1fr 60px;
}

.input_grid input {
    border: none !important;
}

.input_grid>p {
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: 1px solid var(--bg-lightest);
    background: var(--bg-light);
    color: var(--tx-normal);
    font-size: 14px;
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
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(2, 1fr);
}
</style>