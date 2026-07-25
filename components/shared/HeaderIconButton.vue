<script setup lang="ts">
withDefaults(defineProps<{
  icon: string;
  label: string;
  to?: string;
}>(), { to: undefined });
</script>

<template>
  <UButton
    :to="to"
    :icon="icon"
    :aria-label="label"
    variant="ghost"
    color="neutral"
    square
    class="header-icon-button" />
</template>

<style scoped>
.header-icon-button {
  min-width: 2.5rem;
  min-height: 2.5rem;
}
</style>
