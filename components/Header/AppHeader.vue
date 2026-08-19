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
const { data: categories } = await useAsyncData<Category[]>('header-mobile-categories', () => fetchCategories(), { default: () => [] });

const mobileCategories = computed(() => (Array.isArray(categories.value)
  ? categories.value.filter(category => !category.parentId).slice(0, 8)
  : []));
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
            <HeaderIconButton
              v-if="isAuthenticated"
              to="/dashboard/fav"
              icon="i-lucide-heart"
              label="علاقه‌مندی‌ها"
              class="hidden md:flex" />
            <HeaderIconButton
              v-else
              icon="i-lucide-heart"
              label="ورود برای مشاهده علاقه‌مندی‌ها"
              class="hidden md:flex"
              @click="setStep('signin')" />
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
              <div class="mobile-menu__intro">
                <span class="mobile-menu__eyebrow">تجاریس</span>
                <h2>چه چیزی نیاز دارید؟</h2>
                <p>دسته‌بندی موردنظر را انتخاب کنید یا وارد فروشگاه شوید.</p>
              </div>

              <div class="mobile-menu__quick-links">
                <NuxtLink to="/products" class="mobile-menu__quick-card mobile-menu__quick-card--primary" @click="mobileMenuOpen = false">
                  <span class="mobile-menu__icon"><UIcon name="i-lucide-store" aria-hidden="true" /></span>
                  <span><strong>فروشگاه</strong><small>مشاهده همه کالاها</small></span>
                  <UIcon name="i-lucide-arrow-left" aria-hidden="true" />
                </NuxtLink>
                <NuxtLink to="/dashboard/company/register" class="mobile-menu__quick-card" @click="mobileMenuOpen = false">
                  <span class="mobile-menu__icon"><UIcon name="i-lucide-handshake" aria-hidden="true" /></span>
                  <span><strong>تأمین‌کننده شوید</strong><small>ثبت درخواست همکاری</small></span>
                  <UIcon name="i-lucide-arrow-left" aria-hidden="true" />
                </NuxtLink>
              </div>

              <div v-if="mobileCategories.length" class="mobile-menu__categories">
                <div class="mobile-menu__section-heading"><h2>دسته‌بندی‌ها</h2><span>{{ mobileCategories.length }} دسته</span></div>
                <div class="mobile-menu__category-grid">
                  <NuxtLink
                    v-for="category in mobileCategories"
                    :key="getCategoryId(category)"
                    :to="categoryPath(category)"
                    class="mobile-menu__category"
                    @click="mobileMenuOpen = false"
                  >
                    <span class="mobile-menu__category-icon"><UIcon name="i-lucide-layers-3" aria-hidden="true" /></span>
                    <span class="mobile-menu__category-name">{{ category.name }}</span>
                    <UIcon name="i-lucide-chevron-left" aria-hidden="true" />
                  </NuxtLink>
                </div>
              </div>

              <div class="mobile-menu__footer-links">
                <NuxtLink to="/about" @click="mobileMenuOpen = false"><UIcon name="i-lucide-building-2" /> درباره تجاریس</NuxtLink>
                <NuxtLink to="/contact" @click="mobileMenuOpen = false"><UIcon name="i-lucide-life-buoy" /> پشتیبانی</NuxtLink>
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
  gap: 1rem;
  padding: .25rem 0 1rem;
}
.mobile-menu__intro { padding:.25rem .25rem .5rem; }
.mobile-menu__eyebrow { color:#2563eb; font-size:.7rem; font-weight:900; }
.mobile-menu__intro h2 { margin-top:.25rem; color:#0f172a; font-size:1.15rem; font-weight:900; }
.mobile-menu__intro p { margin-top:.35rem; color:#64748b; font-size:.75rem; line-height:1.7; }
.mobile-menu__quick-links { display:grid; gap:.6rem; }
.mobile-menu__quick-card { display:flex; align-items:center; gap:.65rem; min-height:4rem; padding:.7rem; border:1px solid #e2e8f0; border-radius:1rem; background:#fff; color:#334155; box-shadow:0 .25rem .8rem rgba(15,23,42,.04); }
.mobile-menu__quick-card--primary { border-color:#bfdbfe; background:linear-gradient(135deg,#eff6ff,#fff); }
.mobile-menu__quick-card > span:nth-child(2) { display:flex; flex:1; flex-direction:column; gap:.15rem; }
.mobile-menu__quick-card strong { font-size:.8rem; }
.mobile-menu__quick-card small { color:#94a3b8; font-size:.65rem; }
.mobile-menu__quick-card > svg { color:#60a5fa; }
.mobile-menu__icon,.mobile-menu__category-icon { display:grid; flex:0 0 auto; place-items:center; width:2.25rem; height:2.25rem; border-radius:.75rem; background:#eff6ff; color:#2563eb; }

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
  border-top: 1px solid #e2e8f0;
  padding-top: 1rem;
}
.mobile-menu__section-heading { display:flex; align-items:center; justify-content:space-between; margin-bottom:.65rem; }
.mobile-menu__section-heading h2 { color:#0f172a; font-size:.85rem; font-weight:900; }
.mobile-menu__section-heading span { color:#94a3b8; font-size:.65rem; }
.mobile-menu__category-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:.5rem; }

.mobile-menu__category {
  display:flex; align-items:center; gap:.4rem; min-height:4.25rem; padding:.55rem; border:1px solid #f1f5f9; background:#f8fafc; font-size:.7rem;
}
.mobile-menu__category-icon { width:1.8rem; height:1.8rem; border-radius:.6rem; }
.mobile-menu__category-icon :deep(svg) { width:1rem; }
.mobile-menu__category-name { flex:1; line-height:1.5; }
.mobile-menu__category > svg { width:.9rem; color:#94a3b8; }
.mobile-menu__footer-links { display:flex; gap:1rem; padding-top:.75rem; border-top:1px solid #f1f5f9; }
.mobile-menu__footer-links a { display:inline-flex; align-items:center; gap:.35rem; color:#64748b; font-size:.72rem; font-weight:700; }
.mobile-menu__footer-links :deep(svg) { width:1rem; color:#2563eb; }
@media (max-width: 360px) { .mobile-menu__category-grid { grid-template-columns:1fr; } }

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
