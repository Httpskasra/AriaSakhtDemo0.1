
<template>
  <div class="w-full">
    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <SkeletonLoaderProduct v-for="i in 8" :key="i" />
    </div>

    <!-- Empty State -->
    <AsyncState v-else-if="error" state="error" message="دریافت فهرست محصولات با مشکل مواجه شد." @retry="emit('retry')" />

    <div v-else-if="!products.length" class="empty-results surface-card border border-gray-100">
      <div class="empty-results__icon" aria-hidden="true">
        <UIcon :name="emptyState.icon" />
      </div>
      <h3 class="text-lg font-bold text-slate-800">{{ emptyState.title }}</h3>
      <p class="mt-2 text-center text-sm text-slate-600">{{ emptyState.message }}</p>
      <ul class="empty-results__suggestions" aria-label="پیشنهادهای جستجو">
        <li v-for="suggestion in emptyState.suggestions" :key="suggestion">
          <UIcon name="i-lucide-check" aria-hidden="true" /> {{ suggestion }}
        </li>
      </ul>
      <UButton
        v-if="emptyState.action"
        type="button"
        color="primary"
        variant="solid"
        size="md"
        class="mt-5"
        @click="emptyState.action === 'clear-search' ? emit('clear-search') : emit('clear-filters')"
      >
        {{ emptyState.actionLabel }}
      </UButton>
    </div>

    <!-- Results Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <CatalogProductCard
        v-for="product in products"
        :key="product._id || product.id"
        :product="product"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types/product';

const props = defineProps<{
  products: Product[];
  loading: boolean;
  error?: boolean;
  hasActiveFilters?: boolean;
  hasSearchQuery?: boolean;
}>();

const emit = defineEmits<{
  (e: 'clear-filters'): void;
  (e: 'clear-search'): void;
  (e: 'retry'): void;
}>();

const emptyState = computed(() => {
  if (props.hasActiveFilters) {
    return {
      icon: 'i-lucide-sliders-horizontal',
      title: 'محصولی با این فیلترها پیدا نشد',
      message: 'فیلترها را کمی بازتر کنید تا گزینه‌های بیشتری نمایش داده شود.',
      suggestions: ['محدوده قیمت را افزایش دهید', 'دسته‌بندی یا تأمین‌کننده را تغییر دهید'],
      action: 'clear-filters' as const,
      actionLabel: 'بازنشانی فیلترها',
    };
  }

  if (props.hasSearchQuery) {
    return {
      icon: 'i-lucide-search-x',
      title: 'برای جستجوی شما نتیجه‌ای یافت نشد',
      message: 'عبارت جستجو را کوتاه‌تر یا عمومی‌تر کنید.',
      suggestions: ['املای عبارت را بررسی کنید', 'از واژه‌های ساده‌تر استفاده کنید'],
      action: 'clear-search' as const,
      actionLabel: 'حذف عبارت جستجو',
    };
  }

  return {
    icon: 'i-lucide-package-search',
    title: 'هنوز محصولی برای نمایش وجود ندارد',
    message: 'برای شروع، نام یا کد محصول موردنظر خود را جستجو کنید.',
    suggestions: [],
    action: null,
    actionLabel: '',
  };
});
</script>

<style scoped>
.empty-results {
  display: flex;
  min-height: 18rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  box-shadow: var(--shadow-none);
}

.empty-results__icon {
  display: grid;
  width: 4.5rem;
  height: 4.5rem;
  place-items: center;
  margin-bottom: 1rem;
  border: 1px solid var(--color-info-border);
  border-radius: var(--radius-dialog);
  background: var(--color-info-bg);
  color: var(--color-brand-blue);
  font-size: 2.25rem;
}

.empty-results__suggestions {
  display: grid;
  gap: 0.375rem;
  margin-top: 1rem;
  color: var(--color-text-body);
  font-size: 0.75rem;
  line-height: 1.75;
}

.empty-results__suggestions li {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.empty-results__suggestions :deep(svg) {
  flex: 0 0 auto;
  color: var(--color-success-fg);
  font-size: 0.875rem;
}

.empty-results :deep(button) {
  min-width: 11rem;
  min-height: 2.75rem;
}

@media (max-width: 639px) {
  .empty-results {
    min-height: 16rem;
    padding: 1.25rem;
  }
}
</style>
