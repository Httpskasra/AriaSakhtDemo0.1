<template>
  <section class="py-4">
    <div class="flex items-end justify-between mb-10">
      <div>
        <h2 class="text-2xl md:text-3xl font-black text-slate-800 mb-3">دسته‌بندی‌های صنعتی</h2>
        <p class="text-slate-500 text-sm md:text-base">دسترسی سریع به طیف گسترده کالاهای ساختمانی و تجهیزات فنی</p>
      </div>
      <UButton to="/products" variant="link" color="primary" trailing-icon="i-lucide-arrow-left" label="مشاهده همه" />
    </div>

    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
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
import type { Category } from "~/services/categories";

const icons = ["i-lucide-building-2", "i-lucide-plug", "i-lucide-droplets", "i-lucide-layers", "i-lucide-wrench", "i-lucide-fan"];
const { categories: loadedCategories, load } = useCategories();
await load().catch(() => undefined);

const categories = computed(() => loadedCategories.value.filter((category) => !category.parentId).slice(0, 6));
const categoryId = (category: Category) => category._id || category.id || category.slug || category.name;
const categoryPath = (category: Category) => `/products?categoryIds=${encodeURIComponent(categoryId(category))}`;
const categoryCount = (category: Category) => {
  const count = (category as Category & { productCount?: number; productsCount?: number }).productCount
    ?? (category as Category & { productCount?: number; productsCount?: number }).productsCount;
  return typeof count === "number" ? String(count) : "";
};
</script>
