<script setup lang="ts">
import type { SidebarNavItem } from "~/types/sidebar";

defineProps<{
  items: SidebarNavItem[];
  identity?: { name: string; subtitle?: string };
}>();

const emit = defineEmits<{ navigate: [] }>();
</script>

<template>
  <div class="sidebar-panel">
    <SharedSidebarIdentity v-if="identity" v-bind="identity" />
    <SharedSidebarNav :items="items" @navigate="emit('navigate')" />
  </div>
</template>

<style scoped>
.sidebar-panel {
  width: 100%;
  height: 100%;
  border: 1px solid var(--color-border);
  background: var(--color-bg-surface);
  display: flex;
  flex-direction: column;
}
</style>
