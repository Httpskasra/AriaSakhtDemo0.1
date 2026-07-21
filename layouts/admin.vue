
<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-white border-e border-gray-200 hidden lg:block sticky top-0 h-screen overflow-y-auto">
      <AdminSideBar />
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Top Header for Dashboard -->
      <header class="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 shrink-0">
        <h1 class="text-xl font-bold text-gray-800">پنل مدیریت تجاریس</h1>
        <div class="flex items-center gap-4">
          <UButton
            icon="i-lucide-home"
            variant="ghost"
            color="neutral"
            to="/"
          >
            مشاهده سایت
          </UButton>
          <LoginBtn />
        </div>
      </header>

      <!-- Content Area -->
      <main class="flex-1 overflow-y-auto p-6 bg-[#f5f5f5]">
        <slot />
      </main>
    </div>

    <!-- Mobile Navigation Overlay (Could be added if needed) -->
  </div>
</template>

<script setup lang="ts">
// Layout for Admin Dashboard
</script>

<style scoped>
/* RTL Adjustments are handled by tailwind class 'border-e' */
</style>
