<script setup lang="ts">
import ChevronDownIcon from '@/components/icons/ChevronDownIcon.vue';
</script>

<template>
  <main>
    <div class="assets">
      <div class="assets_head">
        <p>Total Value Locked</p>

        <div class="dropdown">
          <div class="dropdown_item">
            <p>1 Week</p>
            <ChevronDownIcon />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  padding: 30px 50px;
}
</style>
