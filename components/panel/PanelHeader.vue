<script setup lang="ts">
const props = defineProps<{ title: string; identity: { name: string; subtitle?: string }; collapsed?: boolean }>();
const emit = defineEmits<{ openMenu: []; toggleSidebar: [] }>();
</script>

<template>
  <header class="panel-header" aria-label="سربرگ پنل">
    <div class="panel-header__leading">
      <button class="panel-header__menu" type="button" aria-label="باز کردن منوی پنل" @click="emit('openMenu')">
        <UIcon name="i-lucide-menu" aria-hidden="true" />
      </button>
      <button class="panel-header__collapse" type="button" :aria-label="props.collapsed ? 'باز کردن منوی پنل' : 'جمع کردن منوی پنل'" @click="emit('toggleSidebar')">
        <UIcon :name="props.collapsed ? 'i-lucide-panel-right-open' : 'i-lucide-panel-right-close'" aria-hidden="true" />
      </button>
      <HeaderBrand compact />
      <span class="panel-header__divider" aria-hidden="true" />
      <h1 class="panel-header__title">{{ title }}</h1>
    </div>
    <div class="panel-header__actions">
      <div class="panel-header__identity" aria-label="اطلاعات کاربر">
        <span class="panel-header__name">{{ identity.name }}</span>
        <span class="panel-header__phone">{{ identity.subtitle }}</span>
      </div>
      <UButton to="/" icon="i-lucide-arrow-right" color="neutral" variant="ghost" aria-label="بازگشت به سایت">
        <span class="panel-header__back-label">بازگشت به سایت</span>
      </UButton>
    </div>
  </header>
</template>

<style scoped>
.panel-header { min-height: var(--panel-header-height); padding: .75rem clamp(1rem, 3vw, 2rem); display:flex; align-items:center; justify-content:space-between; gap:1rem; background:var(--color-bg-surface, #fff); border-bottom:1px solid var(--color-border, var(--gray-200)); }
.panel-header__leading, .panel-header__actions { display:flex; align-items:center; gap:.75rem; min-width:0; }
.panel-header__divider { height:1.5rem; width:1px; background:var(--gray-200); }
.panel-header__title { margin:0; color:var(--color-text-heading); font-size:1rem; font-weight:700; white-space:nowrap; }
.panel-header__identity { display:flex; flex-direction:column; align-items:flex-end; line-height:1.35; }
.panel-header__name { color:var(--color-text-heading); font-size:.8rem; font-weight:700; }
.panel-header__phone { color:var(--color-text-muted); font-size:.7rem; direction:ltr; }
.panel-header__menu, .panel-header__collapse { display:none; width:2.5rem; height:2.5rem; border:0; border-radius:var(--radius-card); background:var(--color-bg-light); color:var(--color-text-heading); }
@media (min-width: 1025px) { .panel-header__collapse { display:grid; place-items:center; } }
@media (max-width: 1024px) { .panel-header__menu { display:grid; place-items:center; } .panel-header__identity { display:none; } }
@media (max-width: 560px) { .panel-header { padding-inline:1rem; } .panel-header__divider, .panel-header__back-label { display:none; } .panel-header__title { font-size:.9rem; } }
</style>
