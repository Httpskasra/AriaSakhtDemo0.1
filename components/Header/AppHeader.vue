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
await load().catch(() => undefined);
const mobileMenuOpen = ref(false);
const isScrolledLocal = ref(false);
const effectiveScrolled = computed(() => props.isScrolled || isScrolledLocal.value);
const topCategories = computed(() => categories.value.filter(category => !getParentCategoryId(category)));
const popularCategories = computed(() => topCategories.value.slice(0, 5));
const categoryPath = (category: Category) => ({ path: "/products", query: { categoryIds: getCategoryFilterIds(category, categories.value) } });
const cartCountLabel = computed(() => cartStore.itemCount > 99 ? "99+" : String(cartStore.itemCount));
const supportPhone = "021-12345678";

function handleCartClick() { return isAuthenticated.value ? navigateTo("/dashboard/account/cart") : setStep("signin"); }
function closeMobileMenu() { mobileMenuOpen.value = false; }
function openAuth() { setStep("signin"); closeMobileMenu(); }
function handleScroll() { isScrolledLocal.value = window.scrollY > 24; }
onMounted(() => { handleScroll(); window.addEventListener("scroll", handleScroll, { passive: true }); });
onBeforeUnmount(() => window.removeEventListener("scroll", handleScroll));
</script>

<template>
  <header :class="['site-header', { 'site-header--scrolled': effectiveScrolled }]">
    <div v-if="variant !== 'mobile'" class="desktop-header hidden lg:block">
      <div class="desktop-header__trust">
        <div class="section-container desktop-header__trust-inner">
          <div class="desktop-header__trust-links">
            <a :href="`tel:${supportPhone.replace(/-/g, '')}`"><UIcon name="i-lucide-phone" aria-hidden="true" /> {{ supportPhone }}</a>
            <NuxtLink to="/about"><UIcon name="i-lucide-verified" aria-hidden="true" /> تأمین‌کنندگان تأییدشده</NuxtLink>
          </div>
        </div>
      </div>
      <div class="desktop-header__main">
        <div class="section-container desktop-header__main-inner">
          <HeaderBrand class="shrink-0" />
          <div class="desktop-header__search"><GlobalProductSearch variant="header" /></div>
          <div class="desktop-header__actions" aria-label="عملیات حساب و خرید">
            <HeaderIconButton v-if="isAuthenticated" to="/dashboard/account/favorites" icon="i-lucide-heart" label="علاقه‌مندی‌ها" />
            <HeaderIconButton v-else icon="i-lucide-heart" label="ورود برای مشاهده علاقه‌مندی‌ها" @click="setStep('signin')" />
            <div class="cart-action"><HeaderIconButton icon="i-lucide-shopping-cart" label="سبد خرید" @click="handleCartClick" /><span v-if="cartStore.itemCount" class="cart-action__badge" aria-hidden="true">{{ cartCountLabel }}</span></div>
            <div class="desktop-header__divider" aria-hidden="true"></div><AuthLoginButton />
          </div>
        </div>
      </div>
      <div class="desktop-header__nav"><div class="section-container desktop-header__nav-inner"><CategoryMenu /><nav aria-label="ناوبری اصلی" class="desktop-nav-links"><NuxtLink to="/products" class="header-nav-link" :aria-current="route.path.startsWith('/products') ? 'page' : undefined">فروشگاه</NuxtLink><NuxtLink to="/dashboard/company/register" class="header-nav-link">تأمین‌کننده شوید</NuxtLink><NuxtLink to="/about" class="header-nav-link">درباره تجاریس</NuxtLink><NuxtLink to="/contact" class="header-nav-link">پشتیبانی</NuxtLink></nav></div></div>
    </div>

    <div v-if="variant !== 'desktop'" class="mobile-header lg:hidden">
      <div class="mobile-header__row">
        <HeaderBrand compact />
        <div class="mobile-header__actions"><div class="cart-action"><HeaderIconButton icon="i-lucide-shopping-cart" label="سبد خرید" @click="handleCartClick" /><span v-if="cartStore.itemCount" class="cart-action__badge" aria-hidden="true">{{ cartCountLabel }}</span></div><AuthLoginButton compact /></div>
        <UButton id="mobile-site-menu-trigger" icon="i-lucide-menu" variant="soft" color="primary" square class="mobile-header__menu-button" aria-label="باز کردن منوی سایت" aria-controls="mobile-site-drawer" :aria-expanded="mobileMenuOpen" @click="mobileMenuOpen = true" />
      </div>
      <div class="mobile-header__search"><GlobalProductSearch variant="header" class="w-full" /></div>
      <nav v-if="popularCategories.length && !effectiveScrolled" class="mobile-header__categories" aria-label="دسته‌بندی‌های محبوب فروشگاه">
        <NuxtLink to="/products" class="mobile-header__category-link mobile-header__category-link--all" :aria-current="route.path === '/products' ? 'page' : undefined">همه دسته‌بندی‌ها</NuxtLink>
        <NuxtLink v-for="category in popularCategories" :key="getCategoryId(category)" :to="categoryPath(category)" class="mobile-header__category-link">{{ category.name }}</NuxtLink>
      </nav>
      <ClientOnly><AppDrawer v-model="mobileMenuOpen" panel-id="mobile-site-drawer" label="منوی سایت" width="min(22rem, 88vw)"><nav class="mobile-menu" aria-label="ناوبری موبایل">
        <div class="mobile-menu__account">
          <NuxtLink v-if="isAuthenticated" to="/dashboard" class="mobile-menu__link mobile-menu__link--primary" @click="closeMobileMenu"><UIcon name="i-lucide-user" aria-hidden="true" /><span>حساب کاربری</span><small>{{ user?.userId || "پنل کاربری" }}</small></NuxtLink>
          <div v-else class="mobile-menu__guest-status" role="status"><UIcon name="i-lucide-log-in" aria-hidden="true" /><span>ورود به حساب</span><small>برای خرید وارد شوید</small></div>
        </div>
      <div class="mobile-menu__links"><NuxtLink to="/products" class="mobile-menu__link" @click="closeMobileMenu"><UIcon name="i-lucide-store" aria-hidden="true" />فروشگاه</NuxtLink><button type="button" class="mobile-menu__link" @click="handleCartClick"><UIcon name="i-lucide-shopping-cart" aria-hidden="true" />سبد خرید<span v-if="cartStore.itemCount" class="mobile-menu__count">{{ cartCountLabel }}</span></button><NuxtLink v-if="isAuthenticated" to="/dashboard/account/orders" class="mobile-menu__link" @click="closeMobileMenu"><UIcon name="i-lucide-receipt" aria-hidden="true" />سفارش‌های من</NuxtLink><button v-else type="button" class="mobile-menu__link" @click="openAuth"><UIcon name="i-lucide-receipt" aria-hidden="true" />سفارش‌های من</button><NuxtLink v-if="isAuthenticated" to="/dashboard/account/favorites" class="mobile-menu__link" @click="closeMobileMenu"><UIcon name="i-lucide-heart" aria-hidden="true" />علاقه‌مندی‌ها</NuxtLink><button v-else type="button" class="mobile-menu__link" @click="openAuth"><UIcon name="i-lucide-heart" aria-hidden="true" />علاقه‌مندی‌ها</button></div>
        <div class="mobile-menu__section"><div class="mobile-menu__section-heading"><h2>دسته‌بندی‌ها</h2><span v-if="categoriesLoading">در حال بارگذاری</span><span v-else>{{ topCategories.length }} دسته اصلی</span></div><NuxtLink to="/products" class="mobile-menu__all-categories" @click="closeMobileMenu">مشاهده همه دسته‌بندی‌ها <UIcon name="i-lucide-arrow-left" aria-hidden="true" /></NuxtLink><div v-if="categoriesLoading" class="mobile-menu__state">در حال آماده‌سازی دسته‌بندی‌ها…</div><div v-else class="mobile-menu__categories-list"><details v-for="category in topCategories" :key="`drawer-${getCategoryId(category)}`" class="mobile-menu__category-group"><summary><span>{{ category.name }}</span><UIcon name="i-lucide-chevron-down" aria-hidden="true" /></summary><div class="mobile-menu__subcategory-list"><NuxtLink :to="categoryPath(category)" @click="closeMobileMenu">همه محصولات این دسته</NuxtLink><NuxtLink v-for="child in categories.filter(item => getParentCategoryId(item) === getCategoryId(category))" :key="getCategoryId(child)" :to="categoryPath(child)" @click="closeMobileMenu">{{ child.name }}</NuxtLink></div></details></div></div>
        <div class="mobile-menu__links mobile-menu__links--secondary"><NuxtLink to="/dashboard/company/register" class="mobile-menu__link" @click="closeMobileMenu"><UIcon name="i-lucide-handshake" aria-hidden="true" />تأمین‌کننده شوید</NuxtLink><NuxtLink to="/about" class="mobile-menu__link" @click="closeMobileMenu"><UIcon name="i-lucide-building-2" aria-hidden="true" />درباره تجاریس</NuxtLink><NuxtLink to="/contact" class="mobile-menu__link" @click="closeMobileMenu"><UIcon name="i-lucide-life-buoy" aria-hidden="true" />پشتیبانی</NuxtLink><a class="mobile-menu__link" :href="`tel:${supportPhone.replace(/-/g, '')}`"><UIcon name="i-lucide-phone" aria-hidden="true" />تماس با ما</a></div>
      </nav></AppDrawer></ClientOnly>
    </div>
  </header>
</template>

<style scoped>
.site-header { position:sticky; top:0; z-index:1000; width:100%; max-width:100%; overflow-x:clip; border-bottom:1px solid #e2e8f0; background:rgb(255 255 255 / 94%); backdrop-filter:blur(14px); }
.site-header--scrolled .desktop-header__trust { display:none; }
.site-header--scrolled .desktop-header__main-inner { min-height:4.25rem; }
.desktop-header__trust { background:#0f172a; color:#fff; }
.desktop-header__trust-inner,.desktop-header__trust-links { display:flex; min-height:2rem; align-items:center; justify-content:space-between; }
.desktop-header__trust-links { gap:1.5rem; font-size:.7rem; font-weight:700; }
.desktop-header__trust-links a { display:inline-flex; min-height:2rem; align-items:center; gap:.35rem; opacity:.9; }
.desktop-header__trust-links a:hover { opacity:1; color:#bfdbfe; }
.desktop-header__trust-links :deep(svg) { width:1rem; }
.desktop-header__main { background:#fff; }
.desktop-header__main-inner { display:flex; min-height:5.25rem; align-items:center; gap:clamp(1rem,3vw,2.5rem); }
.desktop-header__search { min-width:0; flex:1; }
.desktop-header__actions { display:flex; flex-shrink:0; align-items:center; gap:.35rem; }
.desktop-header__divider { width:1px; height:1.75rem; margin-inline:.25rem; background:#e2e8f0; }
.desktop-header__nav { border-top:1px solid #f1f5f9; background:#fff; }
.desktop-header__nav-inner { display:flex; min-height:3.25rem; align-items:center; gap:2rem; }
.desktop-nav-links { display:flex; min-width:0; align-items:center; gap:clamp(1rem,2.2vw,2rem); color:#475569; font-size:.8rem; font-weight:700; }
.header-nav-link { display:inline-flex; min-height:2.75rem; align-items:center; border-bottom:2px solid transparent; white-space:nowrap; }
.header-nav-link:hover,.header-nav-link.router-link-active { color:#2563eb; border-bottom-color:#2563eb; }
.cart-action { position:relative; display:inline-flex; }
.cart-action__badge { position:absolute; inset-block-start:-.2rem; inset-inline-start:-.25rem; display:flex; min-width:1.05rem; height:1.05rem; align-items:center; justify-content:center; padding-inline:.18rem; border:2px solid #fff; border-radius:999px; background:#facc15; color:#0f172a; font-size:.58rem; font-weight:900; line-height:1; }
.mobile-header { max-width:100%; overflow-x:clip; background:rgb(255 255 255 / 97%); }
.mobile-header__row { position:relative; display:flex; min-height:3.5rem; align-items:center; justify-content:center; padding:.45rem 3.2rem; }
.mobile-header__actions { position:absolute; inset-inline-start:.55rem; display:flex; align-items:center; gap:.1rem; }
.mobile-header__actions :deep(button) { min-width:2.5rem; min-height:2.5rem; }
.mobile-header__menu-button { position:absolute; inset-inline-end:.55rem; width:2.5rem; height:2.5rem; border-radius:.75rem; }
.mobile-header__search { padding:.4rem .7rem .55rem; border-top:1px solid #f1f5f9; }
.mobile-header__categories { display:flex; gap:.4rem; padding:0 .7rem .5rem; overflow-x:auto; scrollbar-width:none; }
.mobile-header__categories::-webkit-scrollbar { display:none; }
.mobile-header__category-link { display:inline-flex; min-height:2.25rem; flex:0 0 auto; align-items:center; padding-inline:.7rem; border:1px solid #e2e8f0; border-radius:999px; background:#f8fafc; color:#475569; font-size:.7rem; font-weight:700; white-space:nowrap; }
.mobile-header__category-link:hover,.mobile-header__category-link:focus-visible,.mobile-header__category-link--all { border-color:#bfdbfe; background:#eff6ff; color:#1d4ed8; }
.mobile-menu { display:flex; flex-direction:column; gap:.75rem; padding:.15rem 0 1rem; direction:rtl; }
.mobile-menu__account { border-bottom:1px solid #e2e8f0; padding-bottom:.7rem; }
.mobile-menu__links { display:grid; gap:.15rem; }
.mobile-menu__links--secondary { border-top:1px solid #e2e8f0; padding-top:.65rem; }
.mobile-menu__link { display:flex; min-height:2.75rem; align-items:center; gap:.65rem; padding:.5rem .65rem; border-radius:.65rem; color:#334155; font-size:.8rem; font-weight:700; text-align:right; }
.mobile-menu__link:hover,.mobile-menu__link:focus-visible,.mobile-menu__link--primary { background:#eff6ff; color:#1d4ed8; }
.mobile-menu__link :deep(svg) { width:1.1rem; color:#2563eb; }
.mobile-menu__guest-status { display:flex; min-height:2.75rem; align-items:center; gap:.65rem; padding:.5rem .65rem; color:#64748b; font-size:.8rem; font-weight:700; }
.mobile-menu__guest-status :deep(svg) { width:1.1rem; color:#94a3b8; }
.mobile-menu__guest-status small { margin-inline-start:auto; color:#94a3b8; font-size:.65rem; }
.mobile-menu__link small { margin-inline-start:auto; max-width:9rem; overflow:hidden; color:#64748b; font-size:.63rem; text-overflow:ellipsis; white-space:nowrap; }
.mobile-menu__count { margin-inline-start:auto; color:#2563eb; }
.mobile-menu__section { border-top:1px solid #e2e8f0; padding-top:.7rem; }
.mobile-menu__section-heading { display:flex; align-items:center; justify-content:space-between; padding:0 .35rem .45rem; }
.mobile-menu__section-heading h2 { color:#0f172a; font-size:.85rem; font-weight:900; }
.mobile-menu__section-heading span { color:#94a3b8; font-size:.65rem; }
.mobile-menu__all-categories { display:flex; min-height:2.5rem; align-items:center; justify-content:space-between; padding:.45rem .65rem; border-radius:.65rem; background:#f8fafc; color:#2563eb; font-size:.75rem; font-weight:800; }
.mobile-menu__category-group { border-bottom:1px solid #f1f5f9; }
.mobile-menu__category-group summary { display:flex; min-height:2.75rem; align-items:center; justify-content:space-between; gap:.5rem; padding:.45rem .65rem; color:#334155; cursor:pointer; font-size:.78rem; font-weight:800; list-style:none; }
.mobile-menu__category-group summary::-webkit-details-marker { display:none; }
.mobile-menu__category-group[open] summary { color:#2563eb; }
.mobile-menu__subcategory-list { display:grid; gap:.1rem; padding:0 .65rem .5rem 1.75rem; }
.mobile-menu__subcategory-list a { min-height:2.35rem; padding:.45rem; color:#64748b; font-size:.73rem; }
.mobile-menu__subcategory-list a:hover,.mobile-menu__subcategory-list a:focus-visible { color:#2563eb; }
.mobile-menu__state { padding:.65rem; color:#64748b; font-size:.72rem; }
@media (min-width:1024px) and (max-width:1199px) { .desktop-header__main-inner { gap:1rem; } .desktop-nav-links { gap:1rem; } .desktop-header__trust-links { gap:.75rem; } }
@media (max-width:359px) { .mobile-header__row { padding-inline:2.85rem; } .mobile-header__actions { inset-inline-start:.35rem; } .mobile-header__menu-button { inset-inline-end:.35rem; } .mobile-header__search { padding-inline:.5rem; } .header-brand--compact :deep(.header-brand__name) { display:none; } }
@media (prefers-reduced-motion:reduce) { .site-header *,.site-header *::before,.site-header *::after { transition:none !important; animation:none !important; } }
</style>
