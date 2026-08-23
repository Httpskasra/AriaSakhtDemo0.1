<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useCategories } from "~/composables/useCategories";
import { getCategoryFilterIds, getCategoryId, getParentCategoryId, type Category } from "~/services/categories";

const isOpen = ref(false);
const button = ref<HTMLButtonElement | null>(null);
const menu = ref<HTMLElement | null>(null);
const { categories, loading, error, load } = useCategories();
const route = useRoute();
await load().catch(() => undefined);

const topLevelCategories = computed(() => categories.value.filter(category => !getParentCategoryId(category)));
const childrenOf = (category: Category) => categories.value.filter(child => getParentCategoryId(child) === getCategoryId(category));
const categoryPath = (category: Category) => ({ path: "/products", query: { categoryIds: getCategoryFilterIds(category, categories.value) } });
const isCategoryActive = (category: Category) => {
  const selected = route.query.categoryIds;
  const values = Array.isArray(selected) ? selected : selected ? [selected] : [];
  return route.path.startsWith("/products") && values.includes(getCategoryId(category));
};

function closeMenu(restoreFocus = true) {
  isOpen.value = false;
  if (restoreFocus) nextTick(() => button.value?.focus());
}
function handleOutsidePointer(event: PointerEvent) {
  if (isOpen.value && !menu.value?.contains(event.target as Node) && !button.value?.contains(event.target as Node)) closeMenu(false);
}
watch(isOpen, async open => {
  if (open) { await nextTick(); menu.value?.querySelector<HTMLElement>("a[href], button:not([disabled])")?.focus(); }
});
onMounted(() => document.addEventListener("pointerdown", handleOutsidePointer));
onBeforeUnmount(() => document.removeEventListener("pointerdown", handleOutsidePointer));
</script>

<template>
  <div class="category-menu" @keydown.escape.prevent="closeMenu()">
    <button ref="button" type="button" class="category-menu__trigger" aria-haspopup="true" aria-controls="desktop-category-menu" :aria-expanded="isOpen" @click="isOpen = !isOpen" @keydown.enter.prevent="isOpen = true" @keydown.space.prevent="isOpen = true">
      <UIcon name="i-lucide-grid-3x3" class="size-icon-action" aria-hidden="true" /> دسته‌بندی‌ها
      <UIcon name="i-lucide-chevron-down" class="size-icon-inline" :class="{ 'category-menu__chevron--open': isOpen }" aria-hidden="true" />
    </button>
    <nav v-if="isOpen" id="desktop-category-menu" ref="menu" class="category-mega-menu" aria-label="دسته‌بندی‌های فروشگاه">
      <div class="category-mega-menu__header"><div><span class="category-mega-menu__eyebrow">خرید سریع</span><h2>دسته‌بندی‌های صنعتی</h2></div><NuxtLink to="/products" class="category-mega-menu__all" @click="closeMenu(false)">مشاهده همه دسته‌بندی‌ها <UIcon name="i-lucide-arrow-left" aria-hidden="true" /></NuxtLink></div>
      <div v-if="loading" class="category-mega-menu__state" aria-live="polite">در حال بارگذاری دسته‌بندی‌ها…</div>
      <div v-else-if="error" class="category-mega-menu__state" role="status">دسته‌بندی‌ها موقتاً در دسترس نیستند. <NuxtLink to="/products" @click="closeMenu(false)">مشاهده فروشگاه</NuxtLink></div>
      <div v-else class="category-mega-menu__grid">
        <div v-for="category in topLevelCategories" :key="getCategoryId(category)" class="category-mega-card">
          <NuxtLink :to="categoryPath(category)" class="category-mega-card__title" :class="{ 'category-mega-card__title--active': isCategoryActive(category) }" :aria-current="isCategoryActive(category) ? 'page' : undefined" @click="closeMenu(false)"><span>{{ category.name }}</span><UIcon name="i-lucide-arrow-left" aria-hidden="true" /></NuxtLink>
          <ul v-if="childrenOf(category).length" class="category-mega-card__children"><li v-for="child in childrenOf(category)" :key="getCategoryId(child)"><NuxtLink :to="categoryPath(child)" @click="closeMenu(false)">{{ child.name }}</NuxtLink></li></ul>
          <span v-else class="category-mega-card__hint">مشاهده محصولات این دسته</span>
        </div>
      </div>
    </nav>
  </div>
</template>

<style scoped>
.category-menu { position:relative; height:100%; padding-block:.25rem; }
.category-menu__trigger { display:inline-flex; min-height:2.75rem; align-items:center; gap:.5rem; padding-inline:.25rem; color:#334155; font-size:.875rem; font-weight:800; outline:none; white-space:nowrap; }
.category-menu__trigger:hover,.category-menu__trigger:focus-visible { color:#2563eb; }
.category-menu__trigger:focus-visible,.category-mega-menu a:focus-visible { border-radius:.45rem; outline:3px solid rgb(37 99 235 / 25%); outline-offset:2px; }
.category-menu__chevron--open { transform:rotate(180deg); }
.category-mega-menu { position:absolute; top:calc(100% + .25rem); inset-inline-start:0; z-index:60; width:min(72rem,calc(100vw - 2rem)); max-height:min(34rem,calc(100vh - 7rem)); overflow-y:auto; padding:1.1rem; border:1px solid #e2e8f0; border-radius:0 0 1rem 1rem; background:rgb(255 255 255 / 98%); box-shadow:0 1.5rem 3rem rgb(15 23 42 / 14%); direction:rtl; }
.category-mega-menu__header { display:flex; align-items:center; justify-content:space-between; gap:1rem; padding:.25rem .35rem .9rem; border-bottom:1px solid #f1f5f9; }
.category-mega-menu__eyebrow { color:#2563eb; font-size:.68rem; font-weight:800; }
.category-mega-menu__header h2 { margin-top:.2rem; color:#0f172a; font-size:1rem; font-weight:900; }
.category-mega-menu__all { display:inline-flex; min-height:2.5rem; align-items:center; gap:.35rem; color:#2563eb; font-size:.75rem; font-weight:800; white-space:nowrap; }
.category-mega-menu__grid { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:.75rem; padding-top:1rem; }
.category-mega-card { min-width:0; padding:.8rem; border:1px solid #f1f5f9; border-radius:.85rem; background:linear-gradient(145deg,#fff,#f8fbff); }
.category-mega-card:hover { border-color:#bfdbfe; box-shadow:0 .5rem 1rem rgb(37 99 235 / 8%); }
.category-mega-card__title { display:flex; min-height:2.5rem; align-items:center; justify-content:space-between; gap:.5rem; color:#1e3a8a; font-size:.82rem; font-weight:900; }
.category-mega-card__title :deep(svg) { width:1rem; color:#60a5fa; }
.category-mega-card__title--active { color:#2563eb; }
.category-mega-card__children { display:grid; gap:.15rem; margin-top:.5rem; color:#64748b; font-size:.72rem; }
.category-mega-card__children a { display:block; min-height:2rem; padding-block:.35rem; }
.category-mega-card__children a:hover { color:#2563eb; }
.category-mega-card__hint,.category-mega-menu__state { display:block; margin-top:.65rem; color:#64748b; font-size:.72rem; line-height:1.8; }
.category-mega-menu__state a { color:#2563eb; font-weight:800; }
@media (max-width:1199px) { .category-mega-menu__grid { grid-template-columns:repeat(3,minmax(0,1fr)); } }
@media (max-width:1099px) { .category-mega-menu { inset-inline-start:auto; inset-inline-end:0; } }
</style>
