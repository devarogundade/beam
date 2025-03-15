<script setup lang="ts">
import AIIcon from '@/components/icons/AIIcon.vue';
import BulbIcon from '@/components/icons/BulbIcon.vue';
import CloseIcon from '@/components/icons/CloseIcon.vue';
import SendIcon from '@/components/icons/SendIcon.vue';
import ProgressBox from '@/components/ProgressBox.vue';
import { Client } from '@/scripts/client';
import type { Chat } from '@/scripts/types';
import { useWalletStore } from '@/stores/wallet';
import { onMounted, onUnmounted, ref } from 'vue';

const faqs = [
    "How much have I earned in sales from the last 7 days until now?",
    "Which of my listed products do I need to restock?",
    "Which of my listed Subscription Plan has the highest recurring customers?"
];

const walletStore = useWalletStore();

const text = ref<string>('');
const chats = ref<Chat[]>([]);
const showing = ref<boolean>(true);
const sending = ref<boolean>(false);
const progress = ref<boolean>(false);
const scrollContainer = ref<HTMLElement | null>(null);

const getChats = async (load: boolean = true) => {
    if (!walletStore.address) return;
    progress.value = load;
    chats.value = await Client.getChats(walletStore.address);
    progress.value = false;

    setTimeout(() => {
        if (scrollContainer.value) {
            scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
        }
    }, 400);
};

const sendText = async () => {
    if (sending.value) return;
    if (!walletStore.address) return;
    if (text.value == '') return;

    sending.value = true;

    showing.value = false;
    const message = text.value;

    chats.value.push({
        _id: 'text',
        from: walletStore.address,
        text: message,
        to: '0x',
        createdAt: new Date()
    });

    chats.value.push({
        _id: 'reply',
        from: '0x',
        text: 'Thinking...',
        to: walletStore.address,
        createdAt: new Date()
    });

    setTimeout(() => {
        if (scrollContainer.value) {
            scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
        }
    }, 400);

    text.value = '';
    await Client.sendChat(walletStore.address, message);

    sending.value = false;
    getChats(false);
};

onMounted(() => {
    getChats();
    document.body.style.overflowY = 'hidden';

});

onUnmounted(() => {
    document.body.style.overflowY = 'auto';
});
</script>

<template>
    <ProgressBox v-if="progress" />

    <div class="container" v-else>
        <div class="messages" ref="scrollContainer">
            <div class="no_message" v-if="chats.length == 0">
                <div class="icon">
                    <AIIcon />
                </div>

                <h3>What can I help you with?</h3>
                <p>Your payments and sales AI Assistant.</p>
            </div>

            <div v-for="chat in chats" :class="chat.from == walletStore.address ? 'message message_user' : 'message'">
                <img v-if="chat.from == walletStore.address" src="/images/colors.png" alt="">
                <img v-else src="/images/ai.png" alt="">
                <div class="text" v-html="chat.text?.replace('```html', '').replace('```', '')"></div>
            </div>
        </div>
        <div class="form">
            <div class="faq" v-if="showing">
                <div class="title">
                    <BulbIcon />
                    <p>FAQs</p>
                </div>
                <div class="close" @click="showing = false">
                    <CloseIcon />
                </div>
                <div class="items">
                    <div class="item" v-for="faq in faqs" @click="text = faq">{{ faq }}</div>
                </div>
            </div>

            <div class="input">
                <input type="text" v-model="text" placeholder="Ask a question">
                <button @click="sendText">
                    <SendIcon />
                    <p>Send</p>
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container {
    height: calc(100vh - 90px);
    position: relative;
}

.messages {
    padding: 0 50px;
    max-height: calc(100vh - 180px);
    overflow: auto;
}

.messages::-webkit-scrollbar {
    display: none;
}

.message {
    padding: 30px 40px;
    display: grid;
    grid-template-columns: 40px 1fr;
    gap: 30px;
    font-size: 14px;
    color: var(--tx-normal);
    align-items: flex-end;
}

.message div {
    margin-bottom: 10px;
}

.message_user,
.message_user * {
    background: var(--bg-light) !important;
}

.message img {
    height: 40px;
    width: 40px;
    border-radius: 8px;
}

.text * {
    margin-bottom: 4px;
    font-weight: 400;
    color: var(--tx-normal);
    background: var(--bg);
    border-color: var(--bg-lightest);
}


.no_message {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 80px 0;
    text-align: center;
}

.no_message .icon {
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    background: var(--bg-light);
    border: 1px solid var(--bg-lightest);
}

.no_message h3 {
    margin-top: 40px;
    font-size: 24px;
    color: var(--tx-normal);
}

.no_message p {
    margin-top: 12px;
    font-size: 16px;
    color: var(--tx-dimmed);
}

.form {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 30px 40px;
    z-index: 10;
    background: rgba(23, 23, 23, 0.8);
}

.faq .title {
    display: flex;
    align-items: center;
    gap: 12px;
    position: relative;
}

.close {
    position: absolute;
    right: 40px;
    top: 40px;
    width: 36px;
    height: 30px;
    border-radius: 6px;
    cursor: pointer;
    border: 1px solid var(--bg-lightest);
    display: flex;
    align-items: center;
    justify-content: center;
}

.faq .title p {
    font-size: 16px;
    color: var(--tx-normal);
}

.faq .items {
    padding: 30px 0;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 40px;
}

.faq .item {
    padding: 25px 22px;
    text-align: center;
    border-radius: 8px;
    border: 1px solid var(--bg-lighter);
    color: var(--tx-normal);
    background: var(--bg);
    font-size: 14px;
    line-height: 26px;
    cursor: pointer;
    user-select: none;
}

.input {
    width: 100%;
    height: 44px;
    border-radius: 8px;
    background: var(--bg-light);
    border: 1px solid var(--bg-lightest);
    overflow: hidden;
    display: grid;
    grid-template-columns: 1fr 100px;
}

.input input {
    height: 100%;
    background: none;
    padding: 0 20px;
    border: none;
    outline: none;
    color: var(--tx-normal);
    font-size: 16px;
}

.input button {
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-lightest);
    gap: 8px;
    border: none;
    cursor: pointer;
}

.input button p {
    font-size: 14px;
    color: var(--tx-normal);
}
</style>