<template>
  <div class="mt-10 px-4 sm:px-6 lg:px-8">
    <div class="flex items-baseline justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-900">محبوب‌ترین محصولات</h2>
      <NuxtLink to="/products" class="text-sm font-medium text-green-600 hover:text-green-500">
        مشاهده همه <span aria-hidden="true"> &larr;</span>
      </NuxtLink>
    </div>

    <div v-if="loading" class="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
      <SkeletonLoaderProduct v-for="i in 4" :key="i" />
    </div>

    <div v-else-if="products.length === 0" class="text-center py-10 bg-white rounded-lg shadow-sm">
      <UIcon name="i-lucide-package-search" class="size-12 mx-auto text-gray-400 mb-2" />
      <p class="text-gray-500 italic">هنوز محصولی برای نمایش وجود ندارد.</p>
    </div>

    <div v-else class="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
      <Product
        v-for="product in products"
        :key="product._id || product.id"
        :product="product"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getTopProducts } from '~/services/productService'
import type { Product as ProductType } from '~/types/product'

const products = ref<ProductType[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await getTopProducts(8)
    products.value = Array.isArray(response.data) ? response.data : []
  } catch (error) {
    console.error('Failed to fetch popular products:', error)
  } finally {
    loading.value = false
  }
})
</script>
