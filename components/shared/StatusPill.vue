<script setup lang="ts">
import type { StatusSemantic } from "~/composables/useStatusStyle";

const props = withDefaults(defineProps<{
  label: string;
  semantic?: StatusSemantic;
  icon?: string;
  size?: "compact" | "default";
}>(), {
  semantic: "neutral",
  size: "default",
});

const style = computed(() => useStatusStyle(props.semantic));
</script>

<template>
  <span class="status-pill" :class="`status-pill--${size}`" :style="style">
    <UIcon v-if="icon" :name="icon" class="status-pill__icon" />
    <span>{{ label }}</span>
  </span>
</template>

<style scoped>
.status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  width: fit-content;
  white-space: nowrap;
  border-radius: var(--radius-pill);
  font-family: var(--font-num);
  font-weight: 600;
  line-height: var(--line-height-metadata);
}

.status-pill--compact {
  min-height: 1.375rem;
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
}

.status-pill--default {
  min-height: 1.75rem;
  padding: 0.25rem 0.625rem;
  font-size: 0.8125rem;
}

.status-pill__icon {
  width: var(--spacing-icon-compact);
  height: var(--spacing-icon-compact);
  flex: none;
}
</style>
