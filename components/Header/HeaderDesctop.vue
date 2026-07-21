<script setup lang="ts">
const { user, isAuthenticated } = useUser();
const cartBump = useState('cart-bump');

const navLinks = [
  { label: 'صفحه اصلی', to: '/' },
  { label: 'فروشگاه', to: '/products' },
  { label: 'تأمین‌کنندگان', to: '/suppliers' },
  { label: 'مجله صنعتی', to: '/blog' },
];
</script>

<template>
  <div class="flex items-center justify-between gap-8">
    <!-- Brand -->
    <NuxtLink to="/" class="flex items-center gap-2 shrink-0">
      <div class="w-10 h-10 bg-brand-blue rounded-brand flex items-center justify-center text-white shadow-lg">
        <UIcon name="i-lucide-building-2" class="size-6" />
      </div>
      <span class="text-2xl font-bold tracking-tight text-slate-900">تجاریس</span>
    </NuxtLink>

    <!-- Search (Centered & Powerful) -->
    <div class="flex-1 max-w-2xl">
      <SearchBar />
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-4 shrink-0 font-num">
      <div class="h-10 w-px bg-slate-200 mx-2 hidden xl:block"></div>

      <!-- User -->
      <NuxtLink v-if="isAuthenticated" to="/dashboard" class="flex items-center gap-2 group">
        <UAvatar
          :src="user?.profile?.avatar"
          :alt="user?.profile?.firstName || 'User'"
          size="sm"
          class="ring-2 ring-transparent group-hover:ring-brand-blue transition-all"
        />
        <div class="hidden xl:block text-right">
          <p class="text-xs text-slate-500 leading-none mb-1">خوش آمدید</p>
          <p class="text-sm font-semibold text-slate-900 leading-none">
            {{ user?.profile?.firstName || 'پنل کاربری' }}
          </p>
        </div>
      </NuxtLink>
      
      <UButton
        v-else
        to="/auth/signin"
        variant="ghost"
        color="neutral"
        class="font-semibold text-slate-700"
      >
        ورود | ثبت‌نام
      </UButton>

      <!-- Cart -->
      <NuxtLink to="/cart" class="relative group">
        <UButton
          variant="soft"
          color="neutral"
          square
          class="rounded-brand bg-slate-100 group-hover:bg-brand-blue/10 transition-all"
        >
          <UIcon name="i-lucide-shopping-cart" class="size-6 text-slate-700 group-hover:text-brand-blue" />
        </UButton>
        <transition name="scale">
          <UBadge
            v-if="cartBump"
            :key="cartBump"
            size="xs"
            color="primary"
            class="absolute -top-1 -right-1 ring-2 ring-white animate-bounce"
          >
            {{ cartBump }}
          </UBadge>
        </transition>
      </NuxtLink>
    </div>
  </div>

  <!-- Bottom Navigation Row -->
  <nav class="mt-4 flex items-center gap-6">
    <div class="relative group">
      <UButton
        color="primary"
        variant="soft"
        class="font-semibold gap-2"
        icon="i-lucide-menu"
      >
        دسته‌بندی کالاها
      </UButton>
      <!-- Reusable Category Menu component could go here -->
    </div>
    
    <div class="flex items-center gap-6">
      <NuxtLink 
        v-for="link in navLinks" 
        :key="link.to"
        :to="link.to"
        class="text-sm font-medium text-slate-600 hover:text-brand-blue transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-brand-blue hover:after:w-full after:transition-all"
      >
        {{ link.label }}
      </NuxtLink>
    </div>
    
    <div class="ms-auto flex items-center gap-4 text-sm text-slate-500">
      <div class="flex items-center gap-1">
        <UIcon name="i-lucide-phone-call" class="size-4" />
        <span>۰۲۱ - ۴۵۶۷۸</span>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.scale-enter-active, .scale-leave-active {
  transition: transform 0.2s ease;
}
.scale-enter-from, .scale-leave-to {
  transform: scale(0);
}
</style>
