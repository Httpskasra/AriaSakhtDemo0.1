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
    <SidebarIdentity v-if="identity" v-bind="identity" />
    <SidebarNav :items="items" @navigate="emit('navigate')" />
  </div>
</template>

<style scoped>
.sidebar-panel {
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  border: 1px solid var(--color-border);
  background: var(--color-bg-surface);
  display: flex;
  flex-direction: column;
}
</style>
