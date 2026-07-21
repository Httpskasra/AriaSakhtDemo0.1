<script setup lang="ts">
import { useUser } from "~/composables/useUser";
import { formatPhoneForDisplay } from "~/utils/PhoneNumber";

const { user, isUserLoading, isAuthenticated, clearUser } = useUser();
const { setStep } = useAuthStep();

const handleLogout = () => {
  const authStore = useAuthStore();
  authStore.clearTokens();
  clearUser();
};
</script>

<template>
  <!-- Desktop Header: Optimized for screen widths 1024px and above -->
  <header class="hidden lg:block w-full bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
    <div class="container mx-auto px-4 py-3 flex items-center justify-between gap-8 h-20">
      <!-- Logo -->
      <NuxtLink to="/" class="shrink-0 flex items-center gap-2">
        <NuxtImg src="https://picsum.photos/seed/tejaris-logo/120/40" width="120" height="40" alt="تجاریس" />
      </NuxtLink>

      <!-- Search Area -->
      <div class="flex-1 max-w-2xl">
        <SearchBar />
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-6 shrink-0 h-10">
        <!-- Auth Loading Guard (Fixed F1) -->
        <div v-if="isUserLoading" class="w-32 h-10 bg-gray-50 animate-pulse rounded-lg"></div>

        <template v-else>
          <!-- User Profile Dropdown -->
          <div v-if="isAuthenticated && user" class="flex items-center gap-4">
            <UDropdownMenu :items="[
              [{ label: 'پنل کاربری', icon: 'i-lucide-layout-dashboard', to: '/dashboard' }],
              [{ label: 'سفارش‌های من', icon: 'i-lucide-shopping-bag', to: '/dashboard/orders' }],
              [{ label: 'اعلان‌ها', icon: 'i-lucide-bell', to: '/dashboard/notifications' }],
              [{ label: 'خروج', icon: 'i-lucide-log-out', color: 'error', onSelect: handleLogout }]
            ]">
              <UButton variant="ghost" color="neutral" class="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50">
                <UAvatar src="https://picsum.photos/seed/user/32/32" size="sm" />
                <div class="text-right hidden xl:block">
                  <p class="text-xs font-bold text-gray-900 leading-none">{{ user.profile?.firstName || 'کاربر تجاریس' }}</p>
                  <p class="text-[10px] text-gray-500 mt-1">{{ formatPhoneForDisplay(user.phoneNumber) }}</p>
                </div>
                <UIcon name="i-lucide-chevron-down" class="size-4 text-gray-400" />
              </UButton>
            </UDropdownMenu>

            <UButton to="/cart" color="neutral" variant="ghost" class="relative group">
              <UIcon name="i-lucide-shopping-cart" class="size-6 text-gray-600 group-hover:text-primary-600" />
              <span class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white">۳</span>
            </UButton>
          </div>

          <!-- Guest Login -->
          <UButton v-else @click="setStep('signin')" color="primary" class="rounded-xl px-6 font-bold shadow-md shadow-primary-100">
            ورود یا ثبت‌نام
          </UButton>
        </template>
      </div>
    </div>
  </header>
</template>
