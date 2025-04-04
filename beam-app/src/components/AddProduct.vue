<script setup lang="ts">
import { useWalletStore } from '@/stores/wallet';
import CheckIcon from './icons/CheckIcon.vue';
import CloseIcon from './icons/CloseIcon.vue';
import EraserIcon from './icons/EraserIcon.vue';
import UploadIcon from './icons/UploadIcon.vue';
import { onMounted, onUnmounted, ref } from 'vue';
import { Client } from '@/scripts/client';
import Storage from '@/scripts/storage';
import { notify } from '@/reactives/notify';

const emit = defineEmits(['close', 'refresh']);
const walletStore = useWalletStore();

const creating = ref<boolean>(false);
const selectedImage = ref<number>(0);

const images = ref<(File | null)[]>([null, null, null]);
const selectedImageURLs = ref<(string | undefined)[]>([undefined, undefined, undefined]);

const form = ref({
    name: '',
    description: '',
    images: [] as string[],
    category: '',
    quantity: 0,
    amountInUsd: 0
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

    if (form.value.quantity == 0) {
        notify.push({
            title: 'Quantity cannot be zero!',
            description: 'Try again',
            category: "error"
        });
        return;
    }

    if (form.value.amountInUsd == 0) {
        notify.push({
            title: 'Price cannot be zero!',
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

    const created = await Client.createProduct({
        merchant: walletStore.address,
        name: form.value.name,
        description: form.value.description,
        images: form.value.images,
        category: form.value.category,
        quantity: form.value.quantity,
        amountInUsd: form.value.amountInUsd
    });

    if (created) {
        notify.push({
            title: 'Product added!',
            description: 'Share product link to your customers.',
            category: "success"
        });

        emit('refresh');
        emit('close');
    } else {
        notify.push({
            title: 'Failed to create product!',
            description: 'Try again',
            category: "error"
        });
    }

    creating.value = false;
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
        <div class="form">
            <div class="title">
                <p>New Product</p>

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
                    <p class="head">Product Details</p>

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
                            placeholder="Shortly describe the product"></textarea>
                    </div>

                    <div class="inputs_grid">
                        <div class="inputs">
                            <div class="label">
                                <p>Price</p>
                            </div>

                            <div class="input_grid">
                                <p>$</p>
                                <input type="number" v-model="form.amountInUsd" placeholder="0.00">
                            </div>
                        </div>

                        <div class="inputs">
                            <div class="label">
                                <p>Quantity</p>
                            </div>

                            <input type="number" v-model="form.quantity" placeholder="0">
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

.inputs_grid {
    gap: 10px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
}

.input_grid {
    overflow: hidden;
    display: grid;
    grid-template-columns: 40px 1fr;
    border: 1px solid var(--bg-lightest);
    border-radius: 8px;
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