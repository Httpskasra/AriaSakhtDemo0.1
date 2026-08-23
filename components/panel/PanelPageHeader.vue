<script setup lang="ts">
withDefaults(defineProps<{
  title: string;
  subtitle?: string;
  icon?: string;
}>(), { icon: "i-lucide-layout-dashboard" });
</script>

<template>
  <header class="panel-page-header">
    <div class="panel-page-header__icon" aria-hidden="true"><UIcon :name="icon" /></div>
    <div class="panel-page-header__copy">
      <h1>{{ title }}</h1>
      <p v-if="subtitle">{{ subtitle }}</p>
    </div>
    <div v-if="$slots.actions" class="panel-page-header__actions"><slot name="actions" /></div>
  </header>
</template>

<style scoped>
.panel-page-header { display:flex; align-items:center; gap:.875rem; min-width:0; margin-bottom:1.25rem; padding:1rem 1.25rem; background:var(--color-bg-surface); border:1px solid var(--color-border); border-radius:var(--radius-card); box-shadow:var(--shadow-raised); }
.panel-page-header__icon { display:grid; place-items:center; flex:none; width:2.75rem; height:2.75rem; border-radius:var(--radius-compact-list-item); background:var(--color-info-bg); color:var(--color-brand-blue); font-size:1.35rem; }
.panel-page-header__copy { min-width:0; flex:1; }
.panel-page-header h1 { margin:0; color:var(--color-text-heading); font-size:clamp(1.1rem, 2vw, 1.45rem); font-weight:800; }
.panel-page-header p { margin:.25rem 0 0; color:var(--color-text-muted); font-size:.85rem; }
.panel-page-header__actions { display:flex; align-items:center; gap:.5rem; flex:none; }
@media (max-width:640px) { .panel-page-header { align-items:flex-start; padding:.85rem; } .panel-page-header__actions { margin-inline-start:auto; } }
</style>
