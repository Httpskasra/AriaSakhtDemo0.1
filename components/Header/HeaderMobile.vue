<script setup lang="ts">
import { useUser } from "~/composables/useUser";

const { user, isUserLoading, isAuthenticated } = useUser();
const { setStep } = useAuthStep();
const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
</script>

<template>
  <!-- Mobile Header: Optimized for all screen widths below 1024px (Fixed C3) -->
  <header class="block lg:hidden w-full bg-white border-b border-gray-100 sticky top-0 z-50 h-16 shadow-sm">
    <div class="flex items-center justify-between px-4 h-full gap-4">
      <div class="flex items-center gap-3">
        <UButton 
          variant="ghost" 
          color="neutral" 
          icon="i-lucide-menu" 
          class="rounded-lg" 
          @click="toggleMenu"
        />
        <NuxtLink to="/">
          <NuxtImg src="https://picsum.photos/seed/logo-mobile/100/30" width="100" height="30" alt="تجاریس" />
        </NuxtLink>
      </div>

      <div class="flex items-center gap-2">
        <UButton to="/search" variant="ghost" color="neutral" icon="i-lucide-search" />
        
        <!-- Auth Hydration Container (Fixed F1) -->
        <div class="min-w-[40px] flex justify-center">
          <div v-if="isUserLoading" class="size-8 rounded-full bg-gray-50 animate-pulse"></div>
          
          <template v-else>
            <NuxtLink v-if="isAuthenticated" to="/dashboard" class="group">
              <UAvatar src="https://picsum.photos/seed/user-mobile/32/32" size="sm" class="ring-2 ring-transparent group-hover:ring-primary-500 transition-all" />
            </NuxtLink>
            <UButton v-else @click="setStep('signin')" variant="soft" color="primary" icon="i-lucide-user" square />
          </template>
        </div>

        <UButton to="/cart" variant="ghost" color="neutral" class="relative">
          <UIcon name="i-lucide-shopping-cart" class="size-6" />
          <span class="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full ring-1 ring-white">۳</span>
        </UButton>
      </div>
    </div>

    <!-- Simple Mobile Menu Overlay -->
    <USlideover v-model="isMenuOpen" side="left">
      <div class="p-4 flex flex-col h-full bg-white">
        <div class="flex justify-between items-center mb-8 border-b border-gray-50 pb-4">
          <NuxtImg src="https://picsum.photos/seed/logo-slide/120/40" width="120" height="40" alt="تجاریس" />
          <UButton variant="ghost" color="neutral" icon="i-lucide-x" @click="isMenuOpen = false" />
        </div>
        
        <nav class="flex flex-col gap-1 overflow-y-auto flex-1">
          <UButton to="/" variant="ghost" color="neutral" class="justify-start gap-3 py-3" @click="isMenuOpen = false">
            <UIcon name="i-lucide-home" class="size-5" /> صفحه اصلی
          </UButton>
          <UButton to="/products" variant="ghost" color="neutral" class="justify-start gap-3 py-3" @click="isMenuOpen = false">
            <UIcon name="i-lucide-grid" class="size-5" /> محصولات صنعتی
          </UButton>
          <UButton to="/dashboard/orders" variant="ghost" color="neutral" class="justify-start gap-3 py-3" @click="isMenuOpen = false">
            <UIcon name="i-lucide-activity" class="size-5" /> پیگیری سفارش
          </UButton>
          <UButton to="/dashboard/support" variant="ghost" color="neutral" class="justify-start gap-3 py-3" @click="isMenuOpen = false">
            <UIcon name="i-lucide-bell" class="size-5" /> پشتیبانی و اعلان‌ها
          </UButton>
        </nav>

        <div class="mt-auto pt-4 border-t border-gray-50 text-center">
          <p class="text-[10px] text-gray-400">تجاریس - پلتفرم صنعتی بیست‌وبی</p>
        </div>
      </div>
    </USlideover>
  </header>
</template>
