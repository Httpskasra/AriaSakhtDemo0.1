<template>
  <section aria-labelledby="marketplace-categories-heading" class="py-10 sm:py-12">
    <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 id="marketplace-categories-heading" class="mb-2 text-2xl font-black text-slate-800 md:text-3xl">دسته‌بندی‌های صنعتی</h2>
        <p class="text-sm text-slate-600 md:text-base">دسترسی سریع به کالاهای ساختمانی و تجهیزات فنی</p>
      </div>
      <UButton to="/products" variant="outline" color="primary" trailing-icon="i-lucide-arrow-left" label="مشاهده همه دسته‌ها" />
    </div>

    <div v-if="loading" class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
      <div v-for="index in 6" :key="index" class="category-skeleton premium-card p-5">
        <USkeleton class="mx-auto mb-4 size-16 rounded-card" />
        <USkeleton class="mx-auto h-4 w-3/4" />
      </div>
    </div>
    <div v-else-if="error" class="category-feedback panel-surface">
      <UIcon name="i-lucide-circle-alert" class="size-icon-inline text-red-600" aria-hidden="true" />
      <p>دریافت دسته‌بندی‌ها ناموفق بود.</p>
      <UButton type="button" size="sm" variant="outline" color="neutral" @click="retryCategories">تلاش مجدد</UButton>
    </div>
    <div v-else-if="!categories.length" class="category-feedback panel-surface">
      <UIcon name="i-lucide-folders" class="size-icon-inline text-slate-500" aria-hidden="true" />
      <p>هنوز دسته‌بندی‌ای تعریف نشده است.</p>
    </div>
    <div v-else class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
      <NuxtLink 
        v-for="cat in categories" 
        :key="categoryId(cat)"
        :to="categoryPath(cat)"
        class="premium-card p-6 flex flex-col items-center text-center group cursor-pointer"
      >
        <div class="size-16 bg-slate-50 rounded-card flex items-center justify-center mb-5 group-hover:bg-primary-50 transition-colors">
          <UIcon :name="icons[categories.indexOf(cat) % icons.length]" class="size-icon-empty-state text-slate-600 group-hover:text-primary-600 transition-colors" />
        </div>
        <h3 class="text-sm font-bold text-slate-800 mb-1.5">{{ cat.name }}</h3>
        <span v-if="categoryCount(cat)" class="text-[10px] text-slate-400 font-num uppercase tracking-wider">{{ categoryCount(cat) }} کالا</span>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useCategories } from "~/composables/useCategories";
import { getCategoryFilterIds, getCategoryId, getParentCategoryId, type Category } from "~/services/categories";

const icons = ["i-lucide-building-2", "i-lucide-plug", "i-lucide-droplets", "i-lucide-layers", "i-lucide-wrench", "i-lucide-fan"];
const { categories: loadedCategories, loading, error, load } = useCategories();
const retryCategories = () => load().catch(() => undefined);
await retryCategories();

const categories = computed(() => loadedCategories.value.filter((category) => !getParentCategoryId(category)).slice(0, 6));
const categoryId = (category: Category) => getCategoryId(category);
const categoryPath = (category: Category) => ({
  path: "/products",
  query: { categoryIds: getCategoryFilterIds(category, loadedCategories.value) },
});
const categoryCount = (category: Category) => {
  const count = (category as Category & { productCount?: number; productsCount?: number }).productCount
    ?? (category as Category & { productCount?: number; productsCount?: number }).productsCount;
  return typeof count === "number" ? String(count) : "";
};
</script>

<style scoped>
.category-feedback {
  display: flex;
  min-height: 9rem;
  align-items: center;
  justify-content: center;
  gap: .75rem;
  padding: 1.5rem;
  color: #475569;
  font-size: .875rem;
}

.category-skeleton {
  min-height: 9rem;
}
</style>
