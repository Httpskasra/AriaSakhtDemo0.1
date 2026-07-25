<script setup lang="ts">
withDefaults(defineProps<{ compact?: boolean }>(), { compact: false });
</script>

<template>
  <NuxtLink to="/" class="header-brand" :class="{ 'header-brand--compact': compact }" aria-label="تجاریس">
    <span class="header-brand__mark">
      <img src="/logo/logo.png" alt="Logo" class="logo-img" />
    </span>
    <span class="header-brand__name">تجاریس</span>
  </NuxtLink>
</template>

<style scoped>
.header-brand {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.header-brand__mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--radius-field);
  /* background: var(--color-primary); */
  /* box-shadow: var(--shadow-raised); */
}

.header-brand__name {
  color: var(--color-text-heading);
  font-size: 1.5rem;
  font-weight: 900;
}

.header-brand--compact .header-brand__mark {
  width: 2.25rem;
  height: 2.25rem;
  box-shadow: none;
}

.header-brand--compact .header-brand__name {
  font-size: 1.25rem;
}
</style>
