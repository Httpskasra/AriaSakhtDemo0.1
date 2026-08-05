<script setup lang="ts">
import { useCategories } from "~/composables/useCategories";
import { getCategoryFilterIds, getCategoryId, getParentCategoryId, type Category } from "~/services/categories";

const isOpen = ref(false);
const { categories, load } = useCategories();
await load().catch(() => undefined);

const topLevelCategories = computed(() => categories.value.filter((category) => !getParentCategoryId(category)));
const childrenOf = (category: Category) => {
  const id = getCategoryId(category);
  return categories.value.filter((child) => getParentCategoryId(child) === id);
};
const categoryId = (category: Category) => getCategoryId(category);
const categoryPath = (category: Category) => ({
  path: "/products",
  query: { categoryIds: getCategoryFilterIds(category, categories.value) },
});
</script>

<template>
  <div class="relative group h-full py-3" @keydown.escape="isOpen = false">
    <button
      type="button"
      :aria-expanded="isOpen"
      aria-haspopup="true"
      class="flex items-center gap-2 text-slate-700 font-bold text-sm hover:text-primary-600 transition-colors outline-none"
      @click="isOpen = !isOpen"
      @keydown.enter.prevent="isOpen = true"
      @keydown.space.prevent="isOpen = true">
      <UIcon name="i-lucide-grid-3x3" class="size-icon-action" />
      دسته‌بندی‌ها
      <UIcon name="i-lucide-chevron-down" class="size-icon-inline group-hover:rotate-180 transition-transform" />
    </button>

    <div
      v-if="isOpen"
      class="category-mega-menu">
      <div class="category-mega-menu__header">
        <div>
          <span class="category-mega-menu__eyebrow">خرید سریع</span>
          <h2>دسته‌بندی‌های صنعتی</h2>
        </div>
        <NuxtLink to="/products" class="category-mega-menu__all" @click="isOpen = false">
          مشاهده همه <UIcon name="i-lucide-arrow-left" aria-hidden="true" />
        </NuxtLink>
      </div>

      <div class="category-mega-menu__grid">
        <div v-for="category in topLevelCategories" :key="`children-${categoryId(category)}`" class="category-mega-card">
          <NuxtLink :to="categoryPath(category)" class="category-mega-card__title" @click="isOpen = false">
            <span>{{ category.name }}</span>
            <UIcon name="i-lucide-arrow-left" aria-hidden="true" />
          </NuxtLink>
          <ul v-if="childrenOf(category).length" class="category-mega-card__children">
            <li v-for="child in childrenOf(category).slice(0, 5)" :key="categoryId(child)">
              <NuxtLink :to="categoryPath(child)" @click="isOpen = false">{{ child.name }}</NuxtLink>
            </li>
          </ul>
          <span v-else class="category-mega-card__hint">مشاهده محصولات این دسته</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.category-mega-menu {
  position: absolute;
  top: 100%;
  inset-inline-start: 0;
  z-index: 60;
  width: min(78vw, 72rem);
  max-width: 72rem;
  padding: 1.25rem;
  border: 1px solid #e2e8f0;
  border-top: 0;
  border-radius: 0 0 1.25rem 1.25rem;
  background: rgba(255, 255, 255, .98);
  box-shadow: 0 1.5rem 3rem rgba(15, 23, 42, .14);
  direction: rtl;
}
.category-mega-menu__header { display:flex; align-items:center; justify-content:space-between; gap:1rem; padding: .25rem .35rem 1rem; border-bottom:1px solid #f1f5f9; }
.category-mega-menu__eyebrow { color:#2563eb; font-size:.68rem; font-weight:800; }
.category-mega-menu__header h2 { margin-top:.2rem; color:#0f172a; font-size:1.05rem; font-weight:900; }
.category-mega-menu__all { display:inline-flex; align-items:center; gap:.35rem; color:#2563eb; font-size:.75rem; font-weight:800; }
.category-mega-menu__grid { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:.75rem; padding-top:1rem; max-height:24rem; overflow-y:auto; }
.category-mega-card { min-height:7rem; padding:.8rem; border:1px solid #f1f5f9; border-radius:1rem; background:linear-gradient(145deg,#fff,#f8fbff); }
.category-mega-card:hover { border-color:#bfdbfe; box-shadow:0 .5rem 1rem rgba(37,99,235,.08); }
.category-mega-card__title { display:flex; align-items:center; justify-content:space-between; gap:.5rem; color:#1e3a8a; font-size:.82rem; font-weight:900; }
.category-mega-card__title :deep(svg) { width:1rem; color:#60a5fa; }
.category-mega-card__children { display:grid; gap:.35rem; margin-top:.65rem; color:#64748b; font-size:.72rem; }
.category-mega-card__children a:hover { color:#2563eb; }
.category-mega-card__hint { display:block; margin-top:.7rem; color:#94a3b8; font-size:.68rem; }
@media (max-width: 1100px) { .category-mega-menu__grid { grid-template-columns:repeat(3,minmax(0,1fr)); } }
</style>
