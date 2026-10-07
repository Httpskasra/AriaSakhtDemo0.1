<script setup lang="ts">
withDefaults(defineProps<{
  id: string;
  title: string;
  subtitle?: string;
}>(), {
  subtitle: "",
});
</script>

<template>
  <header class="landing-section-header">
    <div class="landing-section-header__copy">
      <h2 :id="id">{{ title }}</h2>
      <p v-if="subtitle">{{ subtitle }}</p>
    </div>
    <div v-if="$slots.action" class="landing-section-header__action">
      <slot name="action" />
    </div>
  </header>
</template>

<style scoped>
.landing-section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.5rem;
  margin-bottom: 1.4rem;
}

.landing-section-header__copy {
  min-width: 0;
}

.landing-section-header h2 {
  margin: 0;
  color: var(--color-text-heading);
  font-size: clamp(1.35rem, 2.2vw, 1.8rem);
  font-weight: 900;
  line-height: 1.45;
}

.landing-section-header p {
  max-width: 40rem;
  margin: .5rem 0 0;
  color: var(--color-text-muted);
  font-size: .85rem;
  line-height: 1.8;
}

.landing-section-header__action {
  flex: none;
}

@media (max-width: 639px) {
  .landing-section-header {
    align-items: stretch;
    flex-direction: column;
    gap: .85rem;
    margin-bottom: 1.1rem;
  }

  .landing-section-header__action {
    align-self: flex-start;
  }
}
</style>
