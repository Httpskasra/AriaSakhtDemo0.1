<script setup lang="ts">
defineProps<{
  label: string;
  value: string;
  icon: string;
  to: string;
  loading?: boolean;
}>();
</script>

<template>
  <NuxtLink :to="to" class="panel-stat-card">
    <span class="panel-stat-card__icon" aria-hidden="true"><UIcon :name="icon" /></span>
    <span class="panel-stat-card__label">{{ label }}</span>
    <strong>{{ loading ? "…" : value }}</strong>
    <span class="panel-stat-card__link">مشاهده جزئیات <UIcon name="i-lucide-arrow-left" aria-hidden="true" /></span>
  </NuxtLink>
</template>

<style scoped>
.panel-stat-card { display:grid; gap:.45rem; min-width:0; padding:1.25rem; color:inherit; text-decoration:none; background:var(--color-bg-surface); border:1px solid var(--color-border); border-radius:var(--radius-card); transition:transform .16s ease, border-color .16s ease, box-shadow .16s ease; }
.panel-stat-card:hover { transform:translateY(-2px); border-color:var(--color-brand-blue); box-shadow:var(--shadow-raised); }
.panel-stat-card__icon { display:grid; place-items:center; width:2.5rem; height:2.5rem; margin-bottom:.25rem; border-radius:.75rem; background:var(--color-info-bg); color:var(--color-brand-blue); font-size:1.25rem; }
.panel-stat-card__label { color:var(--color-text-muted); font-size:.88rem; }
.panel-stat-card strong { color:var(--color-text-heading); font-size:1.35rem; font-weight:800; }
.panel-stat-card__link { display:flex; align-items:center; gap:.25rem; color:var(--color-brand-blue); font-size:.78rem; }
</style>
