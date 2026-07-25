<script setup lang="ts">
import { navigateTo } from '#app';
import { useUser } from '~/composables/useUser';
import { useAuthStep } from '~/composables/useAuthStep';
import { fetchCategories } from '~/services/categories';

withDefaults(
  defineProps<{
    variant?: "desktop" | "mobile" | "auto";
    isScrolled?: boolean;
    menuType?: string;
  }>(),
  { variant: "auto" }
);

const { isAuthenticated } = useUser();
const { setStep } = useAuthStep();
const { data: categories } = await useAsyncData('header-mobile-categories', () => fetchCategories(), { default: () => [] as Array<{ _id?: string; id?: string; name: string }> });

const mobileCategories = computed(() => (Array.isArray(categories.value) ? categories.value.slice(0, 6) : []));
const categoryPath = (category: { _id?: string; id?: string; name: string }) => {
  const categoryId = category._id ?? category.id ?? category.name;
  return `/products?categoryIds=${encodeURIComponent(categoryId)}`;
};

const handleCartClick = () => {
  if (isAuthenticated.value) {
    return navigateTo('/dashboard/carts');
  }
  setStep('signin');
};
</script>

<template>
  <header class="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
    <div v-if="variant !== 'mobile'" class="hidden md:block">
      <div class="hidden overflow-hidden bg-slate-900 py-2 text-[11px] font-medium text-white md:block">
        <div class="section-container flex items-center justify-between">
          <div class="flex items-center gap-6">
            <span class="flex items-center gap-1.5 opacity-90">
              <UIcon name="i-lucide-phone" class="size-icon-compact" />
              ۰۲۱-۱۲۳۴۵۶۷۸
            </span>
            <span class="flex items-center gap-1.5 opacity-90">
              <UIcon name="i-lucide-verified" class="size-icon-compact" />
              تامین‌کنندگان تایید شده
            </span>
          </div>
        </div>
      </div>

      <div class="bg-white py-4 md:py-6">
        <div class="section-container flex items-center gap-8">
          <HeaderBrand />

          <div class="max-w-3xl flex-grow">
            <GlobalProductSearch variant="header" />
          </div>

          <div class="flex items-center gap-3">
            <HeaderIconButton to="/dashboard/fav" icon="i-lucide-heart" label="علاقه‌مندی‌ها" class="hidden md:flex" />
            <div class="relative">
              <button type="button" class="relative" aria-label="سبد خرید" @click="handleCartClick">
                <HeaderIconButton icon="i-lucide-shopping-cart" label="سبد خرید" />
              </button>
              <span class="size-4.5 absolute -right-1 -top-1 flex items-center justify-center rounded-full border-2 border-white bg-brand-yellow font-num text-[10px] font-bold text-slate-900 ring-1 ring-slate-100">۳</span>
            </div>
            <div class="mx-1 hidden h-6 w-px bg-slate-200 md:block"></div>
            <AuthLoginButton />
          </div>
        </div>
      </div>

      <div class="hidden border-t border-slate-50 bg-white lg:block">
        <div class="section-container flex items-center">
          <CategoryMenu />
        </div>
      </div>
    </div>

    <div v-if="variant !== 'desktop'" class="border-b border-slate-100 bg-white md:hidden">
      <div class="flex items-center justify-between gap-3 px-4 py-3">
        <HeaderBrand compact />
        <div class="flex items-center gap-2">
          <UButton to="/products" icon="i-lucide-grid-3x3" variant="ghost" color="neutral" aria-label="مشاهده دسته‌بندی کالاها" />
          <button type="button" aria-label="سبد خرید" @click="handleCartClick">
            <HeaderIconButton icon="i-lucide-shopping-cart" label="سبد خرید" />
          </button>
          <AuthLoginButton />
        </div>
      </div>

      <div class="border-t border-slate-100 px-4 py-3">
        <GlobalProductSearch variant="header" class="w-full" />
      </div>

      <div v-if="mobileCategories.length" class="border-t border-slate-100 bg-slate-50 px-4 py-3">
        <div class="flex flex-wrap gap-2">
          <NuxtLink
            v-for="category in mobileCategories"
            :key="category._id ?? category.id ?? category.name"
            :to="categoryPath(category)"
            class="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:border-brand-blue hover:text-brand-blue"
          >
            {{ category.name }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>
