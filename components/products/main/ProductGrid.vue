
<template>
  <div class="w-full">
    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <SkeletonLoaderProduct v-for="i in 8" :key="i" />
    </div>

    <!-- Empty State -->
    <div v-else-if="!products.length" class="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
      <UIcon name="i-lucide-search-x" class="size-16 text-gray-300 mb-4" />
      <h3 class="text-lg font-bold text-gray-700">محصولی یافت نشد</h3>
      <p class="text-sm text-gray-500 mt-2">لطفا فیلترهای خود را تغییر دهید یا عبارت دیگری را جستجو کنید.</p>
      <UButton
        variant="ghost"
        class="mt-4"
        @click="$emit('clear-filters')"
      >
        حذف تمام فیلترها
      </UButton>
    </div>

    <!-- Results Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <SingleProduct
        v-for="product in products"
        :key="product._id || product.id"
        :product="product"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types/product';

defineProps<{
  products: Product[];
  loading: boolean;
}>();

defineEmits<{
  (e: 'clear-filters'): void;
}>();
</script>
