<script setup lang="ts">
const props = defineProps<{ modelValue: boolean; collapsed?: boolean; identity: { name: string; subtitle?: string }; items: import("~/types/sidebar").SidebarNavItem[] }>();
const emit = defineEmits<{ "update:modelValue": [value: boolean] }>();
</script>

<template>
<div class="panel-sidebar" :class="{ 'panel-sidebar--collapsed': props.collapsed }">
  <AppDrawer :model-value="props.modelValue" persistent-on-desktop label="منوی پنل" width="100%" @update:model-value="emit('update:modelValue', $event)">
    <SidebarPanel :items="items" :identity="identity" @navigate="emit('update:modelValue', false)" />
  </AppDrawer>
</div>

<style scoped>
.panel-sidebar { width:100%; height:100%; min-height:0; }
.panel-sidebar--collapsed :deep(.sidebar-nav__label),
.panel-sidebar--collapsed :deep(.sidebar-nav__section),
.panel-sidebar--collapsed :deep(.sidebar-identity__text) { display:none; }
.panel-sidebar--collapsed :deep(.sidebar-nav__item) { justify-content:center; margin-inline:.5rem; width:calc(100% - 1rem); padding-inline:0; }
.panel-sidebar--collapsed :deep(.sidebar-nav__icon) { width:1.5rem; height:1.5rem; }
@media (max-width:1024px) { .panel-sidebar { position:fixed; inset:0; z-index:60; width:0; height:0; pointer-events:none; } }
</style>
</template>
