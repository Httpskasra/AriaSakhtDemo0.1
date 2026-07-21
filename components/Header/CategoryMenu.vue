<template>
  <div class="relative group h-full py-4">
    <button class="flex items-center gap-2 text-slate-700 font-bold text-sm hover:text-primary-600 transition-colors outline-none">
      <UIcon name="i-lucide-grid-3x3" class="size-5" />
      دسته‌بندی کالاها
      <UIcon name="i-lucide-chevron-down" class="size-4 group-hover:rotate-180 transition-transform" />
    </button>
    <!-- Basic Dropdown Shell -->
    <div class="absolute top-full start-0 mt-0 w-[80vw] max-w-5xl bg-white shadow-2xl rounded-b-2xl border-x border-b border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-6 flex gap-8">
      <div class="w-1/4 border-l border-slate-100 pr-2">
        <div class="space-y-4">
          <div v-for="cat in mockCats" :key="cat" class="text-sm font-bold text-slate-700 hover:text-primary-600 cursor-pointer transition-colors flex items-center justify-between group/item">
            {{ cat }}
            <UIcon name="i-lucide-chevron-left" class="size-3.5 opacity-0 group-hover/item:opacity-100 -translate-x-2 group-hover/item:translate-x-0 transition-all" />
          </div>
        </div>
      </div>
      <div class="flex-grow grid grid-cols-3 gap-8">
        <div v-for="i in 3" :key="i">
          <h4 class="font-black text-primary-600 text-sm mb-4">آهن آلات ساختمانی</h4>
          <ul class="space-y-3 text-slate-500 text-xs font-medium">
            <li class="hover:text-slate-900 cursor-pointer">میلگرد آجدار</li>
            <li class="hover:text-slate-900 cursor-pointer">تیرآهن هاش</li>
            <li class="hover:text-slate-900 cursor-pointer">نبشی و ناودانی</li>
            <li class="hover:text-slate-900 cursor-pointer">ورق سیاه</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const mockCats = ['آهن آلات', 'تاسیسات', 'برق و روشنایی', 'ابزارآلات', 'مصالح پایه', 'شیمی ساختمان']
</script>