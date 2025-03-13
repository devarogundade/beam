<script setup lang="ts">
import CheckIcon from '@/components/icons/CheckIcon.vue';
import ChevronLeftIcon from '@/components/icons/ChevronLeftIcon.vue';
import OutIcon from '@/components/icons/OutIcon.vue';
import UsersIcon from '@/components/icons/UsersIcon.vue';
import { getTokens } from '@/scripts/constants';
import { MerchantContract } from '@/scripts/contract';
import Converter from '@/scripts/converter';
import Storage from '@/scripts/storage';
import { useWalletStore } from '@/stores/wallet';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const walletStore = useWalletStore();

const creating = ref<boolean>(false);
const imageURL = ref<string | null>(null);

const create = async () => {
    if (!walletStore.merchant) return;

    creating.value = true;

    if (walletStore.image) {
        imageURL.value = await Storage.awaitUpload(
            walletStore.image,
            `merchant_image_${walletStore.address}`
        );
    }

    let metadata_value = JSON.parse(walletStore.merchant.metadata_value);
    metadata_value = {
        ...metadata_value,
        imageURL: imageURL.value
    };

    walletStore.merchant = {
        ...walletStore.merchant,
        metadata_value: JSON.stringify(metadata_value)
    };

    const txHash = await MerchantContract.create({
        metadata: {
            schemaVersion: walletStore.merchant.metadata_schemaVersion,
            value: walletStore.merchant.metadata_value
        },
        tokens: getTokens.map(token => token.address),
        signers: walletStore.merchant.signers,
        minSigners: walletStore.merchant.minSigners
    });

    if (txHash) {

        router.push('/');
    } else {

    }

    creating.value = false;
};

onMounted(() => {
    if (!walletStore.address) router.push('/onboarding');

    if (walletStore.image) {
        imageURL.value = URL.createObjectURL(walletStore.image);
    }
});
</script>

<template>
    <section v-if="walletStore.address && walletStore.merchant">
        <div class="app_width">
            <div class="container">
                <div class="toolbar">
                    <RouterLink to="/onboarding/multisig">
                        <button class="back">
                            <ChevronLeftIcon />
                            <p>Back</p>
                        </button>
                    </RouterLink>

                    <div class="titles">
                        <button class="title ">
                            <p>Merchant Profile</p>
                        </button>
                        <button class="title">
                            <p>MultiSig Wallet</p>
                        </button>
                        <button class="title title_active">
                            <p>Review</p>
                        </button>
                    </div>

                    <button class="next_active next" @click="create">
                        <CheckIcon />
                        <p>{{ creating ? 'Creating' : 'Create' }}</p>
                    </button>
                </div>

                <div class="wrapper">
                    <div class="form">
                        <div class="item">
                            <p>Merchant Name</p>
                            <div>
                                <img :src="imageURL || '/images/placeholder.png'" alt="">
                                <p>{{ JSON.parse(walletStore.merchant.metadata_value)?.name }}</p>
                            </div>
                        </div>

                        <div class="item" v-for="signer, index in walletStore.merchant.signers">
                            <p>Signer {{ index + 1 }}</p>
                            <a :href="`/address/${signer}`" target="_blank">
                                <div>
                                    <img src="/images/colors.png" alt="">
                                    <p>{{ Converter.fineAddress(signer, 10) }}</p>
                                    <OutIcon />
                                </div>
                            </a>
                        </div>

                        <div class="item">
                            <p>Threshold</p>
                            <div>
                                <UsersIcon />
                                <p>{{ walletStore.merchant.minSigners }} <span>of {{ walletStore.merchant.signers.length
                                        }}</span></p>
                            </div>
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

.item {
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--bg-lightest);
}

.item>p {
    font-size: 16px;
    color: var(--tx-semi);
}

.item div {
    display: flex;
    align-items: center;
    gap: 10px;
}

.item div img {
    width: 20px;
    height: 20px;
    border-radius: 6px;
    object-fit: cover;
}

.item div p {
    font-size: 14px;
    color: var(--tx-normal);
}

.item div span {
    color: var(--tx-semi);

}
</style>