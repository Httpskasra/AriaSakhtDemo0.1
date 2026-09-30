<script setup lang="ts">
import { navigateTo } from "#app";
import { useAuthStep } from "~/composables/useAuthStep";
import { useCategories } from "~/composables/useCategories";
import { useUser } from "~/composables/useUser";
import { getCategoryFilterIds, getCategoryId, getParentCategoryId, type Category } from "~/services/categories";
import { useCartStore } from "~/stores/cart";

const props = withDefaults(defineProps<{ variant?: "desktop" | "mobile" | "auto"; isScrolled?: boolean; menuType?: string }>(), { variant: "auto", isScrolled: false });
const route = useRoute();
const { isAuthenticated, user } = useUser();
const { setStep } = useAuthStep();
const cartStore = useCartStore();
const { categories, loading: categoriesLoading, load } = useCategories();
// Category data is shared by the header, drawer and catalog filters. Start the
// request without blocking the first render of the public page or the catalog
// request itself. The drawer still renders a loading state until it is ready.
void load().catch(() => undefined);
const mobileMenuOpen = ref(false);
const effectiveScrolled = computed(() => props.isScrolled);
const topCategories = computed(() => categories.value.filter(category => !getParentCategoryId(category)));
const categoryPath = (category: Category) => ({ path: "/products", query: { categoryIds: getCategoryFilterIds(category, categories.value) } });
const cartCountLabel = computed(() => cartStore.itemCount > 99 ? "99+" : String(cartStore.itemCount));
const supportPhone = "021-12345678";

function handleCartClick() { return isAuthenticated.value ? navigateTo("/dashboard/account/cart") : setStep("signin"); }
function closeMobileMenu() { mobileMenuOpen.value = false; }
function openAuth() { setStep("signin"); closeMobileMenu(); }
</script>

<template>
  <header :class="['site-header', { 'site-header--scrolled': effectiveScrolled }]">
    <div v-if="variant !== 'mobile'" class="desktop-header">
      <div class="desktop-header__main">
        <div class="section-container desktop-header__main-inner">
          <HeaderBrand class="shrink-0" />
          <div class="desktop-header__search"><GlobalProductSearch variant="header" /></div>
          <div class="desktop-header__actions" aria-label="عملیات حساب و خرید">
            <UButton to="/dashboard/company/register" variant="outline" color="neutral" size="sm" icon="i-lucide-handshake" class="desktop-header__supplier-cta">تأمین‌کننده شوید</UButton>
            <div class="cart-action"><HeaderIconButton icon="i-lucide-shopping-cart" label="سبد خرید" @click="handleCartClick" /><span v-if="cartStore.itemCount" class="cart-action__badge" aria-hidden="true">{{ cartCountLabel }}</span></div>
            <AuthLoginButton />
          </div>
        </div>
      </div>
      <div class="desktop-header__nav"><div class="section-container desktop-header__nav-inner"><CategoryMenu /><nav aria-label="ناوبری اصلی" class="desktop-nav-links"><NuxtLink to="/products" class="header-nav-link" :aria-current="route.path.startsWith('/products') ? 'page' : undefined">فروشگاه</NuxtLink><NuxtLink to="/wholesale" class="header-nav-link" :aria-current="route.path === '/wholesale' ? 'page' : undefined">خرید عمده</NuxtLink><NuxtLink to="/price-quote" class="header-nav-link" :aria-current="route.path === '/price-quote' ? 'page' : undefined">استعلام قیمت</NuxtLink><NuxtLink to="/about" class="header-nav-link" :aria-current="route.path === '/about' ? 'page' : undefined">درباره تجاریس</NuxtLink><NuxtLink to="/support" class="header-nav-link" :aria-current="route.path === '/support' ? 'page' : undefined">پشتیبانی</NuxtLink></nav></div></div>
    </div>

    <div v-if="variant !== 'desktop'" class="mobile-header">
      <div class="mobile-header__row">
        <HeaderBrand compact />
        <div class="mobile-header__actions"><div class="cart-action"><HeaderIconButton icon="i-lucide-shopping-cart" label="سبد خرید" @click="handleCartClick" /><span v-if="cartStore.itemCount" class="cart-action__badge" aria-hidden="true">{{ cartCountLabel }}</span></div><AuthLoginButton compact /></div>
        <UButton id="mobile-site-menu-trigger" icon="i-lucide-menu" variant="soft" color="primary" square class="mobile-header__menu-button" aria-label="باز کردن منوی سایت و دسته‌بندی‌ها" aria-controls="mobile-site-drawer" :aria-expanded="mobileMenuOpen" @click="mobileMenuOpen = true" />
      </div>
      <div class="mobile-header__search"><GlobalProductSearch variant="header" class="w-full" /></div>
      <ClientOnly><AppDrawer v-model="mobileMenuOpen" panel-id="mobile-site-drawer" label="منوی سایت" teleport-on-mobile width="min(22rem, 88vw)"><nav class="mobile-menu" aria-label="ناوبری موبایل">
        <div class="mobile-menu__account">
          <NuxtLink v-if="isAuthenticated" to="/dashboard" class="mobile-menu__link mobile-menu__link--primary" @click="closeMobileMenu"><UIcon name="i-lucide-user" aria-hidden="true" /><span>حساب کاربری</span><small>{{ user?.userId || "پنل کاربری" }}</small></NuxtLink>
          <button v-else type="button" class="mobile-menu__link mobile-menu__guest-status" aria-label="ورود به حساب" @click="openAuth"><UIcon name="i-lucide-log-in" aria-hidden="true" /><span>ورود به حساب</span><small>برای خرید وارد شوید</small></button>
        </div>
      <div class="mobile-menu__links"><NuxtLink to="/products" class="mobile-menu__link" @click="closeMobileMenu"><UIcon name="i-lucide-store" aria-hidden="true" />فروشگاه</NuxtLink><button type="button" class="mobile-menu__link" @click="handleCartClick"><UIcon name="i-lucide-shopping-cart" aria-hidden="true" />سبد خرید<span v-if="cartStore.itemCount" class="mobile-menu__count">{{ cartCountLabel }}</span></button><NuxtLink v-if="isAuthenticated" to="/dashboard/account/orders" class="mobile-menu__link" @click="closeMobileMenu"><UIcon name="i-lucide-receipt" aria-hidden="true" />سفارش‌های من</NuxtLink><button v-else type="button" class="mobile-menu__link" @click="openAuth"><UIcon name="i-lucide-receipt" aria-hidden="true" />سفارش‌های من</button><NuxtLink v-if="isAuthenticated" to="/dashboard/account/favorites" class="mobile-menu__link" @click="closeMobileMenu"><UIcon name="i-lucide-heart" aria-hidden="true" />علاقه‌مندی‌ها</NuxtLink><button v-else type="button" class="mobile-menu__link" @click="openAuth"><UIcon name="i-lucide-heart" aria-hidden="true" />علاقه‌مندی‌ها</button></div>
        <div class="mobile-menu__section"><div class="mobile-menu__section-heading"><h2>دسته‌بندی‌ها</h2><span v-if="categoriesLoading">در حال بارگذاری</span><span v-else>{{ topCategories.length }} دسته اصلی</span></div><NuxtLink to="/products" class="mobile-menu__all-categories" @click="closeMobileMenu">مشاهده همه دسته‌بندی‌ها <UIcon name="i-lucide-arrow-left" aria-hidden="true" /></NuxtLink><div v-if="categoriesLoading" class="mobile-menu__state">در حال آماده‌سازی دسته‌بندی‌ها…</div><div v-else class="mobile-menu__categories-list"><details v-for="category in topCategories" :key="`drawer-${getCategoryId(category)}`" class="mobile-menu__category-group"><summary><span>{{ category.name }}</span><UIcon name="i-lucide-chevron-down" aria-hidden="true" /></summary><div class="mobile-menu__subcategory-list"><NuxtLink :to="categoryPath(category)" @click="closeMobileMenu">همه محصولات این دسته</NuxtLink><NuxtLink v-for="child in categories.filter(item => getParentCategoryId(item) === getCategoryId(category))" :key="getCategoryId(child)" :to="categoryPath(child)" @click="closeMobileMenu">{{ child.name }}</NuxtLink></div></details></div></div>
        <div class="mobile-menu__links mobile-menu__links--secondary"><NuxtLink to="/wholesale" class="mobile-menu__link" @click="closeMobileMenu"><UIcon name="i-lucide-truck" aria-hidden="true" />خرید عمده</NuxtLink><NuxtLink to="/price-quote" class="mobile-menu__link" @click="closeMobileMenu"><UIcon name="i-lucide-badge-dollar-sign" aria-hidden="true" />استعلام قیمت</NuxtLink><NuxtLink to="/dashboard/company/register" class="mobile-menu__link" @click="closeMobileMenu"><UIcon name="i-lucide-handshake" aria-hidden="true" />تأمین‌کننده شوید</NuxtLink><NuxtLink to="/about" class="mobile-menu__link" @click="closeMobileMenu"><UIcon name="i-lucide-building-2" aria-hidden="true" />درباره تجاریس</NuxtLink><NuxtLink to="/support" class="mobile-menu__link" @click="closeMobileMenu"><UIcon name="i-lucide-life-buoy" aria-hidden="true" />پشتیبانی</NuxtLink><a class="mobile-menu__link" :href="`tel:${supportPhone.replace(/-/g, '')}`"><UIcon name="i-lucide-phone" aria-hidden="true" />تماس با ما</a></div>
      </nav></AppDrawer></ClientOnly>
    </div>
  </header>
</template>

<style scoped>
.site-header { position:sticky; top:0; z-index:1000; width:100%; max-width:100%; overflow-x:clip; isolation:isolate; border-bottom:1px solid var(--color-border); background:var(--color-bg-surface-translucent); -webkit-backdrop-filter:blur(14px); backdrop-filter:blur(14px); }
.site-header--scrolled .desktop-header__main-inner { min-height:4.25rem; }
.desktop-header__main { background:var(--color-bg-surface); }
.desktop-header__main-inner { display:flex; min-height:4.5rem; align-items:center; gap:clamp(1rem,2.5vw,2rem); }
.desktop-header__search { min-width:0; flex:1; }
.desktop-header__actions { display:flex; flex-shrink:0; align-items:center; gap:.45rem; }
.desktop-header__supplier-cta { min-height:2.5rem; white-space:nowrap; }
.desktop-header__nav { border-top:1px solid var(--color-bg-light); background:var(--color-bg-surface); }
.desktop-header__nav-inner { display:flex; min-height:2.9rem; align-items:center; gap:2rem; }
.desktop-nav-links { display:flex; min-width:0; align-items:center; gap:clamp(1rem,2.2vw,2rem); color:var(--color-text-body); font-size:.8rem; font-weight:700; }
.header-nav-link { display:inline-flex; min-height:2.75rem; align-items:center; border-bottom:2px solid transparent; white-space:nowrap; }
.header-nav-link:hover,.header-nav-link.router-link-active { color:var(--color-brand-blue); border-bottom-color:var(--color-brand-blue); }
.cart-action { position:relative; display:inline-flex; }
.cart-action__badge { position:absolute; inset-block-start:-.2rem; inset-inline-start:-.25rem; display:flex; min-width:1.05rem; height:1.05rem; align-items:center; justify-content:center; padding-inline:.18rem; border:2px solid var(--color-bg-surface); border-radius:var(--radius-pill); background:var(--color-brand-yellow); color:var(--color-text-heading); font-size:.58rem; font-weight:900; line-height:1; }
.mobile-header { max-width:100%; overflow-x:clip; background:var(--color-bg-surface-mobile); direction:rtl; }
.mobile-header__row { position:relative; display:flex; min-height:3.75rem; align-items:center; justify-content:center; padding:.45rem 3.2rem; }
.mobile-header__actions { position:absolute; left:.55rem; right:auto; display:flex; align-items:center; gap:.1rem; }
.mobile-header__actions :deep(button) { min-width:2.5rem; min-height:2.5rem; }
.mobile-header__menu-button { position:absolute; right:.55rem; left:auto; width:2.5rem; height:2.5rem; border-radius:var(--radius-compact-list-item); }
.mobile-header__search { padding:.5rem .7rem .65rem; border-top:1px solid var(--color-bg-light); }
.mobile-menu { display:flex; flex-direction:column; gap:.75rem; padding:.15rem 0 1rem; direction:rtl; }
.mobile-menu__account { border-bottom:1px solid var(--color-border); padding-bottom:.7rem; }
.mobile-menu__links { display:grid; gap:.15rem; }
.mobile-menu__links--secondary { border-top:1px solid var(--color-border); padding-top:.65rem; }
.mobile-menu__link { display:flex; min-height:2.75rem; align-items:center; gap:.65rem; padding:.5rem .65rem; border-radius:var(--radius-compact-list-item); color:var(--color-text-body); font-size:.8rem; font-weight:700; text-align:right; }
.mobile-menu__link:hover,.mobile-menu__link:focus-visible,.mobile-menu__link--primary { background:var(--color-info-bg); color:var(--color-info-fg); }
.mobile-menu__link :deep(svg) { width:1.1rem; color:var(--color-brand-blue); }
.mobile-menu__guest-status { width:100%; border:0; cursor:pointer; display:flex; min-height:2.75rem; align-items:center; gap:.65rem; padding:.5rem .65rem; color:var(--color-text-muted); font:inherit; font-size:.8rem; font-weight:700; text-align:right; }
.mobile-menu__guest-status :deep(svg) { width:1.1rem; color:var(--color-text-disabled); }
.mobile-menu__guest-status small { margin-inline-start:auto; color:var(--color-text-disabled); font-size:.65rem; }
.mobile-menu__link small { margin-inline-start:auto; max-width:9rem; overflow:hidden; color:var(--color-text-muted); font-size:.63rem; text-overflow:ellipsis; white-space:nowrap; }
.mobile-menu__count { margin-inline-start:auto; color:var(--color-brand-blue); }
.mobile-menu__section { border-top:1px solid var(--color-border); padding-top:.7rem; }
.mobile-menu__section-heading { display:flex; align-items:center; justify-content:space-between; padding:0 .35rem .45rem; }
.mobile-menu__section-heading h2 { color:var(--color-text-heading); font-size:.85rem; font-weight:900; }
.mobile-menu__section-heading span { color:var(--color-text-disabled); font-size:.65rem; }
.mobile-menu__all-categories { display:flex; min-height:2.5rem; align-items:center; justify-content:space-between; padding:.45rem .65rem; border-radius:var(--radius-compact-list-item); background:var(--color-bg-light); color:var(--color-brand-blue); font-size:.75rem; font-weight:800; }
.mobile-menu__category-group { border-bottom:1px solid var(--color-bg-light); }
.mobile-menu__category-group summary { display:flex; min-height:2.75rem; align-items:center; justify-content:space-between; gap:.5rem; padding:.45rem .65rem; color:var(--color-text-body); cursor:pointer; font-size:.78rem; font-weight:800; list-style:none; }
.mobile-menu__category-group summary::-webkit-details-marker { display:none; }
.mobile-menu__category-group[open] summary { color:var(--color-brand-blue); }
.mobile-menu__subcategory-list { display:grid; gap:.1rem; padding:0 .65rem .5rem 1.75rem; }
.mobile-menu__subcategory-list a { min-height:2.35rem; padding:.45rem; color:var(--color-text-muted); font-size:.73rem; }
.mobile-menu__subcategory-list a:hover,.mobile-menu__subcategory-list a:focus-visible { color:var(--color-brand-blue); }
.mobile-menu__state { padding:.65rem; color:var(--color-text-muted); font-size:.72rem; }
@media (min-width:1024px) and (max-width:1199px) { .desktop-header__main-inner { gap:1rem; } .desktop-nav-links { gap:1rem; } .desktop-header__supplier-cta { padding-inline:.65rem; } }
@media (max-width:359px) { .mobile-header__row { padding-inline:2.85rem; } .mobile-header__actions { left:.35rem; right:auto; } .mobile-header__menu-button { right:.35rem; left:auto; } .mobile-header__search { padding-inline:.5rem; } .header-brand--compact :deep(.header-brand__name) { display:none; } }
@media (prefers-reduced-motion:reduce) { .site-header *,.site-header *::before,.site-header *::after { transition:none; animation:none; } }

/* The public header switches as one unit at the same boundary used by the
   mobile drawer. This prevents a desktop and mobile header from competing at
   the exact 1024px boundary. */
.desktop-header { display:none; }

@media (min-width:1025px) {
  .desktop-header { display:block; }
  .mobile-header { display:none; }
  .desktop-header__search { max-width:46rem; }
}

@media (max-width:1024px) {
  .site-header { background:var(--color-bg-surface-mobile); }
  .mobile-header__actions { gap:.25rem; }
  .mobile-header__actions :deep(button) { min-width:2.5rem; min-height:2.5rem; }
}
</style>
