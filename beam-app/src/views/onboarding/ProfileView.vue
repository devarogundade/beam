<script setup lang="ts">
import ChevronLeftIcon from '@/components/icons/ChevronLeftIcon.vue';
import ChevronRightIcon from '@/components/icons/ChevronRightIcon.vue';
import UploadIcon from '@/components/icons/UploadIcon.vue';
import { useWalletStore } from '@/stores/wallet';
import { zeroAddress } from 'viem';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const walletStore = useWalletStore();
const name = ref<string | null>(null);
const image = ref<File | null>(null);

const imageURL = ref<string | null>(null);

const onImageSelected = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (!target.files || !target.files[0]) {
        return;
    }

    image.value = target.files[0];
    imageURL.value = URL.createObjectURL(target.files[0]);
};

const next = () => {
    if (!walletStore.address) return;

    if (!name.value) {
        return;
    }

    if ((name.value?.length || 0) < 3) {
        return;
    }

    walletStore.setImage(image.value);

    walletStore.setMerchant({
        id: zeroAddress,
        merchant: walletStore.address,
        metadata_schemaVersion: 1,
        metadata_value: JSON.stringify({
            name: name.value
        }),
        wallet: zeroAddress,
        tokens: [],
        hook: zeroAddress,
        signers: [],
        minSigners: 0,
        blockNumber: 0,
        blockTimestamp: 0,
        transactionHash: zeroAddress
    });

    router.push('/onboarding/multisig');
};

onMounted(() => {
    if (!walletStore.address) router.push('/onboarding');

    if (walletStore.merchant) {
        name.value = JSON.parse(walletStore.merchant.metadata_value)?.name;
    }

    if (walletStore.image) {
        image.value = walletStore.image;
        imageURL.value = URL.createObjectURL(walletStore.image);
    }
});
</script>

<template>
    <section>
        <div class="app_width">
            <div class="container">
                <div class="toolbar">
                    <RouterLink to="/onboarding">
                        <button class="back">
                            <ChevronLeftIcon />
                            <p>Back</p>
                        </button>
                    </RouterLink>

                    <div class="titles">
                        <button class="title title_active">
                            <p>Merchant Profile</p>
                        </button>
                        <button class="title">
                            <p>MultiSig Wallet</p>
                        </button>
                        <button class="title">
                            <p>Review</p>
                        </button>
                    </div>

                    <button :class="(name?.length || 0) >= 3 ? 'next_active next' : 'next'" @click="next">
                        <p>Next</p>
                        <ChevronRightIcon />
                    </button>
                </div>

                <div class="wrapper">
                    <div class="form">
                        <div class="info">
                            <label>Merchant Image</label>
                            <div class="file">
                                <div class="upload">
                                    <img :src="imageURL ? imageURL : '/images/placeholder.png'" alt="">
                                </div>

                                <div class="upload_text">
                                    <input type="file" @change="onImageSelected">

                                    <p>
                                        Click below to upload a JPG or PNG file type, <span>100 x 100px
                                            recommended.</span>
                                    </p>

                                    <button>
                                        <UploadIcon />
                                        <p>Upload</p>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="input">
                            <label>Merchant Name</label>
                            <input type="text" v-model="name" placeholder="Scroll.eth" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.toolbar {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 78px;
    border-bottom: 1px solid var(--bg-lightest);
}

.back,
.next {
    border-radius: 6px;
    border: 1px solid var(--bg-lightest);
    display: flex;
    align-items: center;
    padding: 0 12px;
    gap: 10px;
    justify-content: center;
    height: 32px;
    background: none;
    cursor: pointer;
}

.back p,
.next p {
    font-size: 14px;
    color: var(--tx-normal);
}

.next_active {
    background: var(--primary);
}

.titles {
    height: 100%;
}

.title {
    padding: 0 24px;
    height: 100%;
    text-align: center;
    border: none;
    background: none;
    cursor: pointer;
}

.title_active {
    border-bottom: 1px solid var(--primary);
}

.title p {
    font-size: 16px;
    color: var(--tx-dimmed);
}


.title_active p {
    color: var(--tx-normal);
}

.wrapper {
    padding: 60px 0;
    display: flex;
    justify-content: center;
}

.form {
    width: 550px;
}

.info label {
    font-size: 16px;
    color: var(--tx-semi);
}

.file {
    padding: 24px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
}

.upload {
    width: 214px;
    height: 214px;
    border-radius: 8px;
    overflow: hidden;
}

.upload_text {
    position: relative;
}

.upload_text input {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    cursor: pointer;
    z-index: 1;
}

.upload img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.upload_text {
    padding: 0 24px;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    border-left: 1px solid var(--bg-lightest);
    gap: 40px;
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
    border: 1px solid var(--bg-lightest);
    height: 40px;
    cursor: pointer;
}

.upload_text button p {
    font-size: 14px;
    color: var(--tx-normal);
}

.input {
    border-top: 1px solid var(--bg-lighter);
    padding-top: 40px;
}

.input label {
    font-size: 16px;
    color: var(--tx-semi);
}

input {
    margin-top: 24px;
    width: 100%;
    height: 44px;
    border: none;
    border: 1px solid var(--bg-lightest);
    background: none;
    color: var(--tx-normal);
    font-size: 16px;
    padding: 0 16px;
    outline: none;
    border-radius: 8px;
}
</style>