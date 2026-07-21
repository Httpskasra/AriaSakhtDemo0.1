<template>
  <section class="py-8 lg:py-16 bg-white rounded-2xl shadow-sm my-8">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center mb-8">
        <h2 class="text-2xl font-bold text-gray-800">دسته‌بندی‌های محبوب</h2>
        <ULink to="/products" class="text-primary hover:underline flex items-center gap-1 text-sm font-medium">
          مشاهده همه
          <UIcon name="i-lucide-arrow-left" class="size-4" />
        </ULink>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        <div v-for="cat in categories" :key="cat.id" 
             class="group cursor-pointer flex flex-col items-center p-6 rounded-xl transition-all hover:bg-blue-50 hover:shadow-md border border-transparent hover:border-blue-100">
          <div class="bg-gray-100 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 mb-4
                      size-16 lg:size-24">
            <img :src="cat.image" :alt="cat.name" class="size-10 lg:size-16 object-contain" />
          </div>
          <span class="text-sm lg:text-base font-semibold text-gray-700 text-center group-hover:text-primary transition-colors">
            {{ cat.name }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const categories = [
  { id: 1, name: 'مصالح ساختمانی', image: 'https://picsum.photos/seed/c1/100/100' },
  { id: 2, name: 'ابزارآلات', image: 'https://picsum.photos/seed/c2/100/100' },
  { id: 3, name: 'تجهیزات ایمنی', image: 'https://picsum.photos/seed/c3/100/100' },
  { id: 4, name: 'برق و روشنایی', image: 'https://picsum.photos/seed/c4/100/100' },
  { id: 5, name: 'لوله و اتصالات', image: 'https://picsum.photos/seed/c5/100/100' },
  { id: 6, name: 'ماشین‌آلات', image: 'https://picsum.photos/seed/c6/100/100' }
]
</script>
