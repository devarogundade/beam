<script setup lang="ts">
import CloseIcon from './icons/CloseIcon.vue';
import SuccessIcon from './icons/SuccessIcon.vue';
import FailedIcon from './icons/FailedIcon.vue';
import OutIcon from './icons/OutIcon.vue';

import { notify } from '../reactives/notify';

const removeIndex = (index: number) => {
    notify.remove(index);
};
</script>

<template>
    <main>
        <div class="snackbars">
            <div v-for="(notification, index) in notify.notifications" :key="index"
                :class="`snackbar ${notification.category}`">
                <div class="indicator"></div>
                <SuccessIcon v-if="notification.category == 'success'" class="icon" />
                <FailedIcon v-if="notification.category == 'error'" class="icon" />
                <div class="texts">
                    <h3>{{ notification.title }}</h3>
                    <p>{{ notification.description }}</p>
                </div>
                <CloseIcon class="close" v-on:click="removeIndex(index)" />

                <a target="_blank"
                    v-if="notification.linkUrl && notification.linkUrl != '' && notification.linkUrl.startsWith('http')"
                    v-on:click="removeIndex(index)" :href="notification.linkUrl">
                    <div class="link">
                        <p>{{ notification.linkTitle }}</p>
                        <OutIcon />
                    </div>
                </a>

                <RouterLink v-else-if="notification.linkUrl && notification.linkUrl != ''" :to="notification.linkUrl"
                    v-on:click="removeIndex(index)">
                    <div class="link">
                        <p>{{ notification.linkTitle }}</p>
                        <OutIcon />
                    </div>
                </RouterLink>
            </div>
        </div>
    </main>
</template>

<style scoped>
.snackbars {
    position: fixed;
    left: 50%;
    bottom: 0;
    transform: translate(-50%, 0);
    z-index: 1000;
}

.snackbar {
    width: 580px;
    background: var(--bg-darkest);
    box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.8);
    border-radius: 4px;
    margin-bottom: 25px;
    padding: 20px 16px;
    display: flex;
    align-items: center;
    gap: 20px;
    position: relative;
    animation: slide_in_up .2s ease-in-out;
}

.indicator {
    width: 6px;
    height: 56px;
    border-radius: 1px;
}

.success .indicator {
    background: #b5ebaf;
}

.error .indicator {
    background: #e698a6;
}

.icon {
    width: 30px;
    height: 30px;
    border-radius: 4px;
    padding: 4px;
}

.success .icon {
    background: #78ff69;
}

.error .icon {
    background: var(--sm-red);
}

.close {
    position: absolute;
    top: 12px;
    right: 18px;
    width: 22px;
    height: 22px;
    border-radius: 4px;
    background: #9a9d9f;
    cursor: pointer;
}

.texts h3 {
    font-size: 16px;
    color: var(--tx-normal);
}

.texts p {
    font-size: 14px;
    margin-top: 14px;
    color: var(--tx-dimmed);
}

.link {
    position: absolute;
    display: flex;
    align-items: center;
    gap: 6px;
    background: #fff;
    border-radius: 4px;
    padding: 0 12px;
    height: 30px;
    bottom: 16px;
    right: 18px;
}

.link p {
    font-size: 12px;
    color: #181A1C;
}

.link svg {
    width: 14px;
    height: 14px;
}
</style>