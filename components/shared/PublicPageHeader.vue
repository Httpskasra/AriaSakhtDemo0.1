<script setup lang="ts">
withDefaults(defineProps<{
  icon: string;
  title: string;
  description: string;
}>(), {
  icon: 'i-lucide-info',
});
</script>

<template>
  <header class="public-page-header">
    <div class="section-container public-page-header__inner">
      <div class="public-page-header__icon" aria-hidden="true">
        <UIcon :name="icon" class="size-icon-action" />
      </div>
      <div>
        <p class="public-page-header__eyebrow">تجاریس؛ بازار تخصصی صنعت و ساختمان</p>
        <h1 class="public-page-header__title">{{ title }}</h1>
        <p class="public-page-header__description">{{ description }}</p>
      </div>
    </div>
  </header>
</template>

<style scoped>
.public-page-header {
  border-bottom: 1px solid var(--color-border);
  background: linear-gradient(135deg, var(--ui-color-primary-50) 0%, var(--color-bg-light) 58%, var(--color-bg-surface) 100%);
}

.public-page-header__inner {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-block: 2.5rem;
}

.public-page-header__icon {
  display: flex;
  flex: 0 0 3.5rem;
  align-items: center;
  justify-content: center;
  width: 3.5rem;
  height: 3.5rem;
  border: 1px solid var(--color-info-border);
  border-radius: var(--radius-card);
  background: var(--color-info-bg);
  color: var(--color-brand-blue);
}

.public-page-header__eyebrow {
  margin-bottom: .375rem;
  color: var(--color-text-muted);
  font-size: .75rem;
  font-weight: 600;
}

.public-page-header__title {
  color: var(--color-text-heading);
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 800;
  line-height: 1.35;
}

.public-page-header__description {
  margin-top: .375rem;
  max-width: 42rem;
  color: var(--color-text-body);
  font-size: .9375rem;
  line-height: 1.8;
}

@media (max-width: 639px) {
  .public-page-header__inner {
    align-items: flex-start;
    padding-block: 1.75rem;
  }
}
</style>
