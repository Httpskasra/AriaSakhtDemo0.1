<template>
  <header class="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
    <!-- Top Bar: Trust & Quick Links -->
    <div class="bg-slate-900 text-white py-2 overflow-hidden hidden md:block text-[11px] font-medium">
      <div class="section-container flex justify-between items-center">
        <div class="flex gap-6 items-center">
          <span class="flex items-center gap-1.5 opacity-90">
            <UIcon name="i-lucide-phone" class="size-3.5" />
            ۰۲۱-۱۲۳۴۵۶۷۸
          </span>
          <span class="flex items-center gap-1.5 opacity-90">
            <UIcon name="i-lucide-verified" class="size-3.5" />
            تامین‌کنندگان تایید شده
          </span>
        </div>
        <div class="flex gap-4">
          <NuxtLink to="/suppliers" class="hover:text-brand-yellow transition-colors">فروشنده شوید</NuxtLink>
          <NuxtLink to="/help" class="hover:text-brand-yellow transition-colors">راهنمای خرید</NuxtLink>
        </div>
      </div>
    </div>

    <!-- Main Header -->
    <div class="py-4 md:py-6 bg-white">
      <div class="section-container flex items-center gap-8">
        <!-- Logo -->
        <NuxtLink to="/" class="flex-shrink-0 group">
          <div class="flex items-center gap-2">
            <div class="size-10 bg-primary-500 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <UIcon name="i-lucide-layers" class="text-white size-6" />
            </div>
            <span class="text-2xl font-black tracking-tighter text-slate-800">تجاریس</span>
          </div>
        </NuxtLink>

        <!-- Search Bar: Core Engagement Element -->
        <div class="flex-grow max-w-3xl hidden md:block">
          <div class="relative group">
            <div class="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
              <UIcon name="i-lucide-search" class="text-slate-400 group-focus-within:text-primary-500 size-5 transition-colors" />
            </div>
            <input 
              type="text" 
              placeholder="جستجو در میان ۵۰,۰۰۰ کالای صنعتی و ساختمانی..."
              class="w-full bg-slate-50 border-0 ring-1 ring-slate-200 rounded-xl py-3 ps-12 pe-4 focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm outline-none"
            >
            <div class="absolute inset-y-1.5 end-1.5">
              <UButton color="primary" class="rounded-lg px-6" label="جستجو" />
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-3">
          <UButton 
            variant="ghost" 
            color="neutral" 
            square 
            class="hidden md:flex rounded-xl"
            icon="i-lucide-heart"
          />
          <div class="relative">
            <UButton 
              variant="ghost" 
              color="neutral" 
              square 
              class="rounded-xl"
              icon="i-lucide-shopping-cart"
            />
            <span class="absolute -top-1 -right-1 bg-brand-yellow text-slate-900 text-[10px] font-bold size-4.5 rounded-full flex items-center justify-center border-2 border-white ring-1 ring-slate-100 font-num">۳</span>
          </div>
          <div class="h-6 w-px bg-slate-200 mx-1 hidden md:block"></div>
          <LoginBtn />
        </div>
      </div>
    </div>

    <!-- Navigation Menu -->
    <div class="border-t border-slate-50 hidden lg:block bg-white">
      <div class="section-container flex items-center">
        <CategoryMenu />
        <div class="h-5 w-px bg-slate-200 mx-4"></div>
        <NavigationDesctop />
      </div>
    </div>
  </header>
</template>

<script setup>
// Component logic
</script>