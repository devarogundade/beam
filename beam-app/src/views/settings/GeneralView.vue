<script setup lang="ts">
import ChevronRightIcon from '@/components/icons/ChevronRightIcon.vue';
import UploadIcon from '@/components/icons/UploadIcon.vue';
import { useWalletStore } from '@/stores/wallet';
import { onMounted, ref, watch } from 'vue';
import BeamSDK from 'beam-ts/src';
import { Connection, Network } from '@/scripts/types';
import Storage from '@/scripts/storage';
import { MerchantContract } from '@/scripts/contract';
import { SCHEMA_JSON } from 'beam-ts/src/utils/constants';
import { notify } from '@/reactives/notify';

const beamSdk = new BeamSDK({
    network: Network.Testnet
});

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

const saveChanges = async () => {
    if (!walletStore.address) return;
    if (walletStore.connection != Connection.Wallet) return;
    if (!walletStore.merchant) return;

    if (!name.value) {
        notify.push({
            title: 'Enter a valid name!',
            description: 'Try again',
            category: "error"
        });
        return;
    }

    if ((name.value?.length || 0) < 3) {
        notify.push({
            title: 'Name is too short!',
            description: 'Try again',
            category: "error"
        });
        return;
    }

    if (walletStore.image) {
        imageURL.value = await Storage.awaitUpload(
            walletStore.image,
            `merchant_image_${walletStore.address}`
        );
    }

    let metadata_value = JSON.parse(walletStore.merchant.metadata_value);
    metadata_value = {
        ...metadata_value,
        name: name.value,
        imageURL: imageURL.value
    };

    const txHash = await MerchantContract.update({
        metadata: {
            schemaVersion: SCHEMA_JSON,
            value: JSON.stringify(metadata_value)
        }
    });

    if (txHash) {
        walletStore.setMerchant({
            ...walletStore.merchant,
            metadata_value: JSON.stringify(metadata_value)
        });

        notify.push({
            title: 'Changes saved!',
            description: 'Transaction was sent.',
            category: "success",
            linkTitle: 'View Trx',
            linkUrl: `${import.meta.env.VITE_EXPLORER_URL}/tx/${txHash}`
        });
    } else {
        notify.push({
            title: 'Failed to save changes!',
            description: 'Try again',
            category: "error"
        });
    }
};

const getMerchant = async () => {
    if (!walletStore.merchant) return;

    const merchant = await beamSdk.merchant.getMerchant({
        merchant: walletStore.merchant.merchant
    });

    walletStore.setMerchant(merchant);
};

watch(walletStore, () => {
    if (walletStore.merchant) {
        name.value = JSON.parse(walletStore.merchant.metadata_value)?.name;
        imageURL.value = JSON.parse(walletStore.merchant.metadata_value)?.imageURL;
    }
});

onMounted(() => {
    if (walletStore.merchant) {
        name.value = JSON.parse(walletStore.merchant.metadata_value)?.name;
        imageURL.value = JSON.parse(walletStore.merchant.metadata_value)?.imageURL;
    }

    getMerchant();
});
</script>

<template>
    <div class="container">
        <div class="toolbar">
            <div class="titles">
                <RouterLink to="/settings">
                    <button class="title title_active">
                        <p>General</p>
                    </button>
                </RouterLink>
                <RouterLink to="/settings/payments">
                    <button class="title">
                        <p>Payments</p>
                    </button>
                </RouterLink>
                <RouterLink to="/settings/wallet">
                    <button class="title">
                        <p>MultiSig Wallet</p>
                    </button>
                </RouterLink>
                <RouterLink to="/settings/developer">
                    <button class="title">
                        <p>Dev & Plugins</p>
                    </button>
                </RouterLink>
            </div>

            <button
                :class="(name?.length || 0) >= 3 && walletStore.connection == Connection.Wallet ? 'next_active next' : 'next'"
                @click="saveChanges">
                <p>Save Changes</p>
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
</template>

<style scoped>
.container {
    padding: 0 50px;
    padding-bottom: 40px;
}

.toolbar {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 78px;
    border-bottom: 1px solid var(--bg-lightest);
}

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
    padding: 20px 0;
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