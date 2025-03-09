<script setup lang="ts">
import AIIcon from '@/components/icons/AIIcon.vue';
import BulbIcon from '@/components/icons/BulbIcon.vue';
import SendIcon from '@/components/icons/SendIcon.vue';

const faqs = [
    "How much have I earned in sales from the last 7 days until now?",
    "Which of my listed products do I need to restock?",
    "Which of my listed Subscription Plan has the highest recurring customers?"
];
</script>

<template>
    <div class="container">
        <div class="messages">
            <div class="no_message">
                <div class="icon">
                    <AIIcon />
                </div>

                <h3>What can I help you with?</h3>
                <p>Your payments and sales AI Assistant.</p>
            </div>
        </div>
        <div class="form">
            <div class="faq">
                <div class="title">
                    <BulbIcon />
                    <p>FAQs</p>
                </div>

                <div class="items">
                    <div class="item" v-for="text in faqs">{{ text }}</div>
                </div>
            </div>

            <div class="input">
                <input type="text" placeholder="Ask a question">
                <button>
                    <SendIcon />
                    <p>Send</p>
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container {
    min-height: calc(100vh - 90px);
    position: relative;
}

.messages {
    padding: 40px;
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
    width: 100%;
    padding: 30px 40px;
    z-index: 10;
}

.faq .title {
    display: flex;
    align-items: center;
    gap: 12px;
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