<script setup lang="ts">
import BeamLogo from './icons/BeamLogo.vue';
import SettingsIcon from './icons/SettingsIcon.vue';
</script>

<template>
    <section>
        <div class="app_width">
            <header>
                <BeamLogo />

                <div class="actions">
                    <div class="icon_wrapper">
                        <ClockIcon />
                    </div>

                    <div class="icon_wrapper">
                        <SettingsIcon />
                    </div>
                </div>
            </header>
        </div>
    </section>
</template>

<style scoped>
header {
    top: 0;
    position: sticky;
    z-index: 99;
    background: var(--bg);
    height: 90px;
    display: flex;
    align-items: center;
    margin: 0 50px;
    justify-content: space-between;
    border-bottom: 1px solid var(--bg-lightest);
}

.actions {
    display: flex;
    align-items: center;
    gap: 16px;
}

.icon_wrapper {
    width: 40px;
    height: 40px;
    border-radius: 6px;
    background: var(--bg);
    border: 1px solid var(--bg-lightest);
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>