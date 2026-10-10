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
  gap: 1rem;
  margin-bottom: .9rem;
}

.landing-section-header__copy {
  min-width: 0;
}

.landing-section-header h2 {
  margin: 0;
  color: var(--color-text-heading);
  font-size: clamp(1.15rem, 1.7vw, 1.45rem);
  font-weight: var(--font-weight-extrabold);
  line-height: var(--line-height-section);
  letter-spacing: var(--letter-spacing-normal);
}

.landing-section-header p {
  max-width: 40rem;
  margin: .35rem 0 0;
  color: var(--color-text-muted);
  font-size: .76rem;
  line-height: 1.7;
}

.landing-section-header__action {
  flex: none;
}

.landing-section-header__action :deep(button),
.landing-section-header__action :deep(a) {
  min-height: 2.15rem;
  padding-inline: .75rem;
  font-size: .68rem;
}

@media (max-width: 639px) {
  .landing-section-header {
    align-items: stretch;
    flex-direction: column;
    gap: .65rem;
    margin-bottom: .8rem;
  }

  .landing-section-header__action {
    align-self: flex-start;
  }
}
</style>
