<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ categoryIds: string[]; currentProductId: string }>();
const { $axios } = useNuxtApp();

const { data: related, pending, error, refresh } = await useAsyncData(
  `related-${props.currentProductId}`,
  async () => {
    if (!props.categoryIds?.length) return [];
    const response = await $axios.get('/products/advanced-search', { params: { categoryIds: props.categoryIds, limit: 5 } });
    const payload = response.data as any[] | { items?: any[]; products?: any[]; data?: any[] } | undefined;
    const products = Array.isArray(payload) ? payload : payload?.items || payload?.products || payload?.data || [];
    return products.filter((item: any) => String(item.id || item._id) !== props.currentProductId);
  },
  { default: () => [], lazy: true, server: false },
);

const relatedItems = computed(() => related.value || []);
const relatedError = computed(() => error.value?.statusMessage || error.value?.message || 'محصولات مشابه فعلاً قابل دریافت نیستند.');
</script>

<template>
  <section v-if="pending || relatedItems.length || error" class="related-products" aria-labelledby="related-products-title">
    <div class="related-products__heading">
      <div>
        <span class="related-products__eyebrow">پیشنهاد برای شما</span>
        <h2 id="related-products-title">محصولات مشابه</h2>
      </div>
      <span class="related-products__accent" aria-hidden="true"></span>
    </div>
    <div v-if="pending" class="related-products__loading" role="status" aria-live="polite">
      <UIcon name="i-lucide-loader-circle" class="animate-spin" aria-hidden="true" />
      <span>در حال بارگذاری محصولات مشابه…</span>
    </div>
    <div v-else-if="error" class="related-products__error" role="status">
      <span>{{ relatedError }}</span>
      <UButton type="button" color="neutral" variant="soft" size="sm" @click="() => { void refresh(); }">تلاش دوباره</UButton>
    </div>
    <div v-else class="related-products__grid">
      <CatalogProductCard v-for="item in relatedItems" :key="item.id || item._id" :product="item" />
    </div>
  </section>
</template>

<style scoped>
.related-products { display: grid; gap: 1rem; margin-top: .5rem; padding-top: 1.5rem; border-top: 1px solid var(--color-border); }
.related-products__heading { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
.related-products__heading h2 { margin: .2rem 0 0; color: var(--color-text-heading); font-size: clamp(1.05rem, 2vw, 1.25rem); font-weight: 800; }
.related-products__eyebrow { display: block; color: var(--color-text-muted); font-size: .72rem; font-weight: 700; }
.related-products__accent { width: 2.25rem; height: .25rem; border-radius: var(--radius-pill); background: var(--color-brand-blue); }
.related-products__grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1rem; }
.related-products__loading, .related-products__error { display: flex; align-items: center; justify-content: center; gap: .75rem; padding: 1.25rem; border: 1px solid var(--color-border); border-radius: var(--radius-field); color: var(--color-text-muted); background: var(--color-bg-light); }
.related-products__error { justify-content: space-between; color: var(--color-danger-fg); }
@media (max-width: 1024px) { .related-products__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 640px) { .related-products__grid { grid-template-columns: 1fr; } .related-products__error { align-items: stretch; flex-direction: column; } }
</style>
