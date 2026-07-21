<script setup lang="ts">
const searchInput = ref('');
const isFocused = ref(false);

const popularSearches = ['سیمان پاکتی', 'میلگرد ۲۰', 'پمپ بتن', 'کاشی تبریز'];

const handleSearch = () => {
  if (!searchInput.value.trim()) return;
  navigateTo({
    path: '/products',
    query: { query: searchInput.value }
  });
};
</script>

<template>
  <div class="relative w-full">
    <div 
      class="flex items-center bg-slate-100 rounded-brand border-2 transition-all duration-300"
      :class="isFocused ? 'border-brand-blue bg-white shadow-lg ring-4 ring-brand-blue/5' : 'border-transparent'"
    >
      <!-- Category Quick Filter -->
      <div class="hidden xl:flex items-center px-4 border-l border-slate-300">
        <span class="text-sm text-slate-500 whitespace-nowrap cursor-pointer hover:text-brand-blue">همه گروه‌ها</span>
        <UIcon name="i-lucide-chevron-down" class="ms-2 size-4 text-slate-400" />
      </div>

      <input
        v-model="searchInput"
        type="text"
        placeholder="جستجوی کالا، برند یا تأمین‌کننده..."
        class="w-full bg-transparent border-0 focus:ring-0 px-4 py-2.5 text-sm"
        @focus="isFocused = true"
        @blur="setTimeout(() => isFocused = false, 200)"
        @keyup.enter="handleSearch"
      />

      <button 
        class="p-2.5 text-slate-500 hover:text-brand-blue transition-colors"
        @click="handleSearch"
      >
        <UIcon name="i-lucide-search" class="size-5" />
      </button>
    </div>

    <!-- Search Suggestions / Recent -->
    <transition name="fade">
      <div 
        v-if="isFocused"
        class="absolute top-full left-0 right-0 mt-2 bg-white rounded-brand shadow-xl border border-slate-100 p-4 z-50"
      >
        <div class="space-y-4">
          <div>
            <p class="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">جستجوهای پرطرفدار</p>
            <div class="flex flex-wrap gap-2">
              <UButton
                v-for="term in popularSearches"
                :key="term"
                size="xs"
                variant="soft"
                color="neutral"
                class="rounded-full px-3 py-1 hover:bg-brand-blue/10 hover:text-brand-blue transition-colors"
                @click="searchInput = term; handleSearch()"
              >
                {{ term }}
              </UButton>
            </div>
          </div>
          
          <div v-if="searchInput" class="border-t border-slate-50 pt-3">
            <NuxtLink 
              :to="`/products?query=${searchInput}`"
              class="flex items-center gap-3 p-2 rounded-md hover:bg-slate-50 transition-colors group"
            >
              <UIcon name="i-lucide-search" class="text-slate-400 group-hover:text-brand-blue" />
              <span class="text-sm">مشاهده نتایج برای: <span class="font-bold text-brand-blue">{{ searchInput }}</span></span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
