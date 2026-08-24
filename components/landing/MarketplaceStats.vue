<script setup lang="ts">
/**
 * Marketplace Statistics Section
 * Rebuilt for stability and industrial trust.
 */
const stats = [
  { label: 'تامین‌کننده فعال', value: '۲,۴۵۰+', icon: 'i-lucide-users', color: 'blue' },
  { label: 'محصولات صنعتی', value: '۱۸,۰۰۰+', icon: 'i-lucide-package', color: 'blue' },
  { label: 'معاملات موفق', value: '۵۰,۰۰۰+', icon: 'i-lucide-activity', color: 'blue' },
  { label: 'پروژه فعال', value: '۱۲۰+', icon: 'i-lucide-trending-up', color: 'blue' },
];
</script>

<template>
  <section class="marketplace-stats">
    <div class="section-container">
      <div class="marketplace-stats__grid">
        <div 
          v-for="stat in stats" 
          :key="stat.label"
          class="marketplace-stat"
        >
          <div class="marketplace-stat__icon">
            <UIcon :name="stat.icon" />
          </div>
          <div class="marketplace-stat__copy">
            <div class="marketplace-stat__value font-num">{{ stat.value }}</div>
            <div class="marketplace-stat__label">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.marketplace-stats { padding-block: 3rem; background: var(--color-bg-surface); }
.marketplace-stats__grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
.marketplace-stat { display: flex; align-items: center; gap: 1rem; padding: 1.5rem; border: 1px solid var(--color-border); border-radius: var(--radius-card); background: var(--color-bg-light); transition: background-color .2s ease, box-shadow .2s ease, transform .2s ease; }
.marketplace-stat:hover { background: var(--color-bg-surface); box-shadow: var(--shadow-raised); transform: translateY(-2px); }
.marketplace-stat__icon { display: grid; width: 3rem; height: 3rem; flex: none; place-items: center; border-radius: var(--radius-card); background: var(--color-info-bg); color: var(--color-brand-blue); font-size: var(--spacing-icon-action); transition: transform .2s ease; }
.marketplace-stat:hover .marketplace-stat__icon { transform: scale(1.08); }
.marketplace-stat__copy { min-width: 0; }
.marketplace-stat__value { color: var(--color-text-heading); font-size: 1.5rem; font-weight: 900; }
.marketplace-stat__label { color: var(--color-text-muted); font-size: .875rem; font-weight: 600; }
@media (min-width: 1024px) { .marketplace-stats__grid { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 2rem; } }
</style>
