<template>
  <section aria-labelledby="marketplace-categories-heading" class="marketplace-categories">
    <LandingSectionHeader
      id="marketplace-categories-heading"
      title="دسته‌بندی‌های صنعتی"
      subtitle="دسترسی سریع به کالاهای ساختمانی و تجهیزات فنی"
    >
      <template #action>
        <UButton to="/products" variant="outline" color="primary" trailing-icon="i-lucide-arrow-left" label="مشاهده همه دسته‌ها" />
      </template>
    </LandingSectionHeader>

    <div v-if="loading" class="marketplace-categories__grid">
      <div v-for="index in 6" :key="index" class="category-skeleton">
        <USkeleton class="mx-auto mb-3 size-14 rounded-card" />
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
    <div v-else class="marketplace-categories__grid">
      <NuxtLink 
        v-for="(cat, index) in categories"
        :key="categoryId(cat)"
        :to="categoryPath(cat)"
        class="category-card group"
      >
        <div class="category-card__icon">
          <UIcon :name="icons[index % icons.length]" aria-hidden="true" />
        </div>
        <h3>{{ cat.name }}</h3>
        <span v-if="categoryCount(cat)" class="font-num">{{ categoryCount(cat) }} کالا</span>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useCategories } from "~/composables/useCategories";
import { getCategoryFilterIds, getCategoryId, getParentCategoryId, type Category } from "~/services/categories";

const icons = ["i-lucide-building-2", "i-lucide-plug", "i-lucide-droplets", "i-lucide-layers", "i-lucide-wrench", "i-lucide-fan"];
const { categories: loadedCategories, loading, error, load } = useCategories();
const retryCategories = () => { void load().catch(() => undefined); };
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
.marketplace-categories__grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:var(--landing-grid-gap); }
.category-card { display:flex; min-height:7.5rem; align-items:center; justify-content:center; gap:.65rem; padding:1rem .75rem; border:1px solid var(--color-border); border-radius:var(--radius-card); background:var(--color-bg-surface); box-shadow:var(--shadow-raised); color:var(--color-text-heading); text-align:center; transition:border-color .16s ease, box-shadow .16s ease, transform .16s ease; }
.category-card:hover { border-color:var(--color-info-border); box-shadow:var(--shadow-raised); transform:translateY(-2px); }
.category-card:focus-visible { outline:3px solid color-mix(in srgb, var(--color-brand-blue) 25%, transparent); outline-offset:2px; }
.category-card__icon { display:grid; width:3rem; height:3rem; place-items:center; flex:none; border-radius:var(--radius-card); background:var(--color-info-bg); color:var(--color-brand-blue); font-size:1.5rem; }
.category-card h3 { margin:0; color:var(--color-text-heading); font-size:.82rem; font-weight:800; line-height:1.7; }
.category-card span { color:var(--color-text-muted); font-size:.67rem; }
.category-skeleton { min-height:8.75rem; padding:1rem; border:1px solid var(--color-border); border-radius:var(--radius-card); background:var(--color-bg-surface); box-shadow:var(--shadow-raised); }
.category-feedback {
  display: flex;
  min-height: 9rem;
  align-items: center;
  justify-content: center;
  gap: .75rem;
  padding: 1.5rem;
  color: var(--color-text-body);
  font-size: .875rem;
}

@media (min-width: 768px) {
  .marketplace-categories__grid { grid-template-columns:repeat(3,minmax(0,1fr)); }
}

@media (min-width: 1024px) and (max-width: 1199px) {
  .marketplace-categories__grid { grid-template-columns:repeat(4,minmax(0,1fr)); }
}

@media (min-width: 1200px) {
  .marketplace-categories__grid { grid-template-columns:repeat(6,minmax(0,1fr)); }
}

@media (max-width: 639px) {
  .marketplace-categories__grid { gap:1rem; }
}
</style>
