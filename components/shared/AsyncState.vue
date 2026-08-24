<script setup lang="ts">
type AsyncState = "loading" | "empty" | "error";

const props = withDefaults(defineProps<{
  state: AsyncState;
  title?: string;
  message?: string;
  retryLabel?: string;
  skeletonRows?: number;
}>(), {
  title: undefined,
  message: undefined,
  retryLabel: "تلاش مجدد",
  skeletonRows: 4,
});

const emit = defineEmits<{ retry: [] }>();

const defaults = {
  loading: { title: "در حال بارگذاری...", message: "لطفاً کمی صبر کنید." },
  empty: { title: "موردی پیدا نشد", message: "در حال حاضر داده‌ای برای نمایش وجود ندارد." },
  error: { title: "بارگذاری انجام نشد", message: "دریافت اطلاعات با مشکل مواجه شد." },
} as const;
</script>

<template>
  <section class="async-state" :class="`async-state--${props.state}`" :role="props.state === 'error' ? 'alert' : 'status'" :aria-busy="props.state === 'loading'" :aria-live="props.state === 'error' ? 'assertive' : 'polite'">
    <template v-if="props.state === 'loading'">
      <div v-for="row in props.skeletonRows" :key="row" class="async-state__skeleton" aria-hidden="true">
        <span class="async-state__skeleton-line async-state__skeleton-line--long" />
        <span class="async-state__skeleton-line" />
      </div>
      <p class="sr-only">{{ props.title || defaults.loading.title }}</p>
    </template>
    <template v-else>
      <div class="async-state__icon" aria-hidden="true">
        <UIcon :name="props.state === 'error' ? 'i-lucide-circle-alert' : 'i-lucide-inbox'" />
      </div>
      <h3>{{ props.title || defaults[props.state].title }}</h3>
      <p>{{ props.message || defaults[props.state].message }}</p>
      <UButton v-if="props.state === 'error'" type="button" @click="emit('retry')">
        {{ props.retryLabel }}
      </UButton>
      <slot />
    </template>
  </section>
</template>

<style scoped>
.async-state { display: grid; gap: .75rem; justify-items: center; min-height: 13rem; padding: 3rem 1.25rem; text-align: center; color: var(--color-text-body); }
.async-state h3 { margin: 0; color: var(--color-text-heading); font-size: 1.08rem; font-weight: 800; }
.async-state p { max-width: 34rem; margin: 0; font-size: .9rem; line-height: 1.9; }
.async-state__icon { display: grid; place-items: center; width: 3.25rem; height: 3.25rem; border: 1px solid var(--color-border); border-radius: var(--radius-card); background: var(--color-neutral-bg); color: var(--color-neutral-fg); font-size: 1.35rem; font-weight: 800; }
.async-state--error .async-state__icon { background: var(--color-danger-bg); color: var(--color-danger-fg); }
.async-state__skeleton { display: grid; gap: .6rem; width: min(100%, 32rem); padding: .85rem; border-radius: var(--radius-compact-list-item); background: var(--color-bg-light); }
.async-state__skeleton-line { display: block; width: 45%; height: .75rem; border-radius: var(--radius-compact-list-item); background: var(--gray-200); animation: async-state-pulse 1.4s ease-in-out infinite; }
.async-state__skeleton-line--long { width: 78%; }
@keyframes async-state-pulse { 50% { opacity: .45; } }
</style>
