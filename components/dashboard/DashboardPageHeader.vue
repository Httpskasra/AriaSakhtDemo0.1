<template>
  <div class="dashboard-page-header">
    <div class="dashboard-page-header__text">
      <h1>{{ title }}</h1>
      <p v-if="subtitle">{{ subtitle }}</p>
    </div>
    <img v-if="icon" :src="icon" :alt="alt || title" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  subtitle?: string;
  icon?: string;
  alt?: string;
}>();
</script>

<style scoped>
.dashboard-page-header {
  min-height: 4.25rem;
  color: var(--color-text-heading);
  font-family: var(--font-yekan);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: .85rem;
  margin: 0 0 1.5rem;
  padding: 1rem 1.25rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: var(--color-bg-surface);
  box-shadow: var(--shadow-card);
}

.dashboard-page-header h1 {
  margin: 0;
  font-size: clamp(1.15rem, 2vw, 1.5rem);
  font-weight: 700;
}
.dashboard-page-header__text { min-width: 0; }
.dashboard-page-header__text p { margin: .25rem 0 0; color: var(--color-text-muted); font-size: .8rem; }

.dashboard-page-header img {
  width: 2.75rem;
  height: 2.75rem;
  object-fit: contain;
  padding: .45rem;
  border-radius: var(--radius-compact-list-item);
  background: var(--color-bg-light);
}

@media (max-width: 767px) {
  .dashboard-page-header {
    min-height: 3.75rem;
    margin-bottom: 1rem;
    padding: .75rem;
  }
}
</style>
