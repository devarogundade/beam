<script setup lang="ts">
import PaymentsIcon from './icons/PaymentsIcon.vue';

</script>

<template>
    <div class="container">
        <div class="prompt">
            <div class="icon">
                <PaymentsIcon />
            </div>

            <h3>Want to Sell Online?</h3>
            <p>Start selling and accept crypto payments online by easily
                creating wide range of products for your customers
                powered by BeamPay.</p>

            <button>Continue</button>
        </div>
    </div>
</template>

<style scoped>
.container {
    padding: 40px 50px;
    display: flex;
    justify-content: center;
}

.prompt {
    width: 468px;
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 80px 0;
    text-align: center;
}

.icon {
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    background: var(--bg-light);
    border: 1px solid var(--bg-lightest);
}

h3 {
    margin-top: 40px;
    font-size: 24px;
    color: var(--tx-normal);
}

p {
    margin-top: 12px;
    font-size: 16px;
    color: var(--tx-dimmed);
}

button {
    margin-top: 60px;
    width: 350px;
    height: 50px;
    border-radius: 8px;
    border: 1px solid var(--bg-lightest);
    background: var(--primary);
    color: var(--tx-normal);
    font-size: 14px;
    cursor: pointer;
}
</style>