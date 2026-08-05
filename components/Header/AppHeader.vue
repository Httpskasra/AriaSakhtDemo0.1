<script setup lang="ts">
import { navigateTo } from '#app';
import { useUser } from '~/composables/useUser';
import { useAuthStep } from '~/composables/useAuthStep';
import { fetchCategories, getCategoryFilterIds, getCategoryId, type Category } from '~/services/categories';
import { useCartStore } from '~/stores/cart';

withDefaults(
  defineProps<{
    variant?: "desktop" | "mobile" | "auto";
    isScrolled?: boolean;
    menuType?: string;
  }>(),
  { variant: "auto" }
);

const { isAuthenticated } = useUser();
const cartStore = useCartStore();
const { setStep } = useAuthStep();
const { data: categories } = await useAsyncData('header-mobile-categories', () => fetchCategories(), { default: () => [] as Array<{ _id?: string; id?: string; name: string }> });

const mobileCategories = computed(() => (Array.isArray(categories.value) ? categories.value.slice(0, 6) : []));
const mobileMenuOpen = ref(false);
const categoryPath = (category: Category) => ({
  path: '/products',
  query: { categoryIds: getCategoryFilterIds(category, categories.value) },
});

const handleCartClick = () => {
  if (isAuthenticated.value) {
    return navigateTo('/dashboard/carts');
  }
  setStep('signin');
};
</script>

<template>
  <header class="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
    <div v-if="variant !== 'mobile'" class="hidden lg:block">
      <div class="hidden overflow-hidden bg-slate-900 py-2 text-[11px] font-medium text-white md:block">
        <div class="section-container flex items-center justify-between">
          <div class="flex items-center gap-6">
            <span class="flex items-center gap-1.5 opacity-90">
              <UIcon name="i-lucide-phone" class="size-icon-compact" />
              ۰۲۱-۱۲۳۴۵۶۷۸
            </span>
            <span class="flex items-center gap-1.5 opacity-90">
              <UIcon name="i-lucide-verified" class="size-icon-compact" />
              تأمین‌کنندگان تأییدشده
            </span>
          </div>
        </div>
      </div>

      <div class="bg-white py-3 md:py-4">
        <div class="section-container flex items-center gap-6 lg:gap-8">
          <HeaderBrand class="shrink-0" />

          <div class="header-search-slot min-w-0 flex-1 max-w-3xl">
            <GlobalProductSearch variant="header" />
          </div>

          <div class="flex shrink-0 items-center gap-3">
            <HeaderIconButton to="/dashboard/fav" icon="i-lucide-heart" label="علاقه‌مندی‌ها" class="hidden md:flex" />
            <div class="relative">
              <HeaderIconButton icon="i-lucide-shopping-cart" label="سبد خرید" @click="handleCartClick" />
              <span v-if="cartStore.itemCount" class="size-4.5 absolute -right-1 -top-1 flex items-center justify-center rounded-full border-2 border-white bg-brand-yellow font-num text-[10px] font-bold text-slate-900 ring-1 ring-slate-100">{{ cartStore.itemCount }}</span>
            </div>
            <div class="mx-1 hidden h-6 w-px bg-slate-200 md:block"></div>
            <AuthLoginButton />
          </div>
        </div>
      </div>

      <div class="hidden border-t border-slate-50 bg-white lg:block">
        <div class="section-container flex items-center gap-8">
          <CategoryMenu />
          <nav aria-label="ناوبری اصلی" class="flex items-center gap-6 text-sm font-semibold text-slate-600">
            <NuxtLink to="/products" class="header-nav-link">فروشگاه</NuxtLink>
            <NuxtLink to="/dashboard/company/register" class="header-nav-link">تأمین‌کننده شوید</NuxtLink>
            <NuxtLink to="/about" class="header-nav-link">درباره تجاریس</NuxtLink>
            <NuxtLink to="/contact" class="header-nav-link">پشتیبانی</NuxtLink>
          </nav>
        </div>
      </div>
    </div>

    <div v-if="variant !== 'desktop'" class="mobile-header lg:hidden">
      <div class="mobile-header__row">
        <HeaderBrand compact />
        <div class="mobile-header__actions">
          <UButton icon="i-lucide-menu" variant="ghost" color="neutral" square aria-label="باز کردن منوی سایت" @click="mobileMenuOpen = true" />
          <HeaderIconButton icon="i-lucide-shopping-cart" label="سبد خرید" @click="handleCartClick" />
          <AuthLoginButton compact />
        </div>
      </div>

      <div class="mobile-header__search">
        <GlobalProductSearch variant="header" class="w-full" />
      </div>

      <ClientOnly>
        <USlideover v-model:open="mobileMenuOpen" side="right" title="منوی سایت">
          <template #default>
            <span class="hidden" aria-hidden="true" />
          </template>
          <template #body>
            <nav class="mobile-menu" aria-label="ناوبری موبایل">
              <NuxtLink to="/products" class="mobile-menu__link" @click="mobileMenuOpen = false">
                <UIcon name="i-lucide-store" aria-hidden="true" />
                <span>فروشگاه</span>
              </NuxtLink>
              <NuxtLink to="/dashboard/company/register" class="mobile-menu__link" @click="mobileMenuOpen = false">
                <UIcon name="i-lucide-handshake" aria-hidden="true" />
                <span>تأمین‌کننده شوید</span>
              </NuxtLink>
              <NuxtLink to="/about" class="mobile-menu__link" @click="mobileMenuOpen = false">
                <UIcon name="i-lucide-building-2" aria-hidden="true" />
                <span>درباره تجاریس</span>
              </NuxtLink>
              <NuxtLink to="/contact" class="mobile-menu__link" @click="mobileMenuOpen = false">
                <UIcon name="i-lucide-life-buoy" aria-hidden="true" />
                <span>پشتیبانی</span>
              </NuxtLink>

              <div v-if="mobileCategories.length" class="mobile-menu__categories">
                <h2>دسته‌بندی‌ها</h2>
                <NuxtLink
                  v-for="category in mobileCategories"
              :key="getCategoryId(category)"
                  :to="categoryPath(category)"
                  class="mobile-menu__category"
                  @click="mobileMenuOpen = false"
                >
                  <span>{{ category.name }}</span>
                  <UIcon name="i-lucide-chevron-left" aria-hidden="true" />
                </NuxtLink>
              </div>
            </nav>
          </template>
        </USlideover>
      </ClientOnly>
    </div>
  </header>
</template>

<style scoped>
.mobile-header {
  border-bottom: 1px solid #e2e8f0;
  background: rgb(255 255 255 / 96%);
}

.mobile-header__row {
  display: flex;
  min-height: 3.75rem;
  align-items: center;
  justify-content: space-between;
  gap: .75rem;
  padding: .625rem 1rem;
}

.mobile-header__actions {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: .125rem;
}

.mobile-header__actions :deep(button) {
  min-width: 2.5rem;
  min-height: 2.5rem;
}

.mobile-header__search {
  border-top: 1px solid #f1f5f9;
  padding: .5rem 1rem .625rem;
}

.mobile-menu {
  display: flex;
  flex-direction: column;
  gap: .375rem;
  padding: .25rem 0;
}

.mobile-menu__link,
.mobile-menu__category {
  display: flex;
  align-items: center;
  gap: .75rem;
  min-height: 2.875rem;
  border-radius: var(--radius-field);
  padding: .625rem .75rem;
  color: #334155;
  font-size: .875rem;
  font-weight: 600;
  transition: background-color 150ms ease, color 150ms ease;
}

.mobile-menu__link:hover,
.mobile-menu__link:focus-visible,
.mobile-menu__category:hover,
.mobile-menu__category:focus-visible {
  background: #eff6ff;
  color: var(--color-brand-blue);
}

.mobile-menu__link :deep(svg) {
  width: 1.125rem;
  height: 1.125rem;
  color: var(--color-brand-blue);
}

.mobile-menu__categories {
  margin-top: .75rem;
  border-top: 1px solid #e2e8f0;
  padding-top: 1rem;
}

.mobile-menu__categories h2 {
  margin-bottom: .5rem;
  color: #64748b;
  font-size: .75rem;
  font-weight: 700;
}

.mobile-menu__category {
  justify-content: space-between;
  min-height: 2.5rem;
  border: 1px solid #e2e8f0;
  margin-top: .375rem;
  background: #fff;
  font-size: .8125rem;
}

.header-nav-link {
  min-height: 2.75rem;
  display: inline-flex;
  align-items: center;
  border-bottom: 2px solid transparent;
  transition: color 150ms ease, border-color 150ms ease;
}

.header-nav-link:hover,
.header-nav-link.router-link-active {
  color: var(--color-brand-blue);
  border-bottom-color: var(--color-brand-blue);
}

@media (max-width: 359px) {
  .mobile-header__row { padding-inline: .625rem; }
  .mobile-header__search { padding-inline: .625rem; }
  .header-brand--compact :deep(.header-brand__name) { display: none; }
}
</style>
