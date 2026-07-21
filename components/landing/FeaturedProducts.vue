<script setup lang="ts">
import type { Product } from '~/types/product'

defineProps<{
  products: Product[] | null
  loading: boolean
}>()

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fa-IR').format(price)
}
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
    <template v-if="loading">
      <div v-for="i in 4" :key="i" class="premium-card overflow-hidden">
        <div class="aspect-square bg-slate-200 animate-pulse"></div>
        <div class="p-5 space-y-3">
          <div class="h-5 bg-slate-200 rounded w-3/4 animate-pulse"></div>
          <div class="h-4 bg-slate-100 rounded w-1/2 animate-pulse"></div>
          <div class="pt-4 flex justify-between">
            <div class="h-6 bg-slate-200 rounded w-24 animate-pulse"></div>
            <div class="h-6 bg-slate-200 rounded w-12 animate-pulse"></div>
          </div>
        </div>
      </div>
    </template>

    <template v-else-if="products && products.length > 0">
      <NuxtLink 
        v-for="product in products" 
        :key="product._id"
        :to="`/products/${product._id}`"
        class="premium-card group overflow-hidden flex flex-col h-full"
      >
        <!-- Image Area -->
        <div class="aspect-square overflow-hidden relative bg-slate-100">
          <NuxtImg 
            :src="product.images?.[0]?.url || 'https://picsum.photos/seed/tejaris-placeholder/400/400'" 
            :alt="product.name"
            class="size-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
            data-ai-hint="product image"
          />
          <div v-if="product.discount" class="absolute top-3 left-3 bg-red-500 text-white font-num text-xs px-2 py-1 rounded-md font-bold shadow-lg">
            {{ product.discount }}٪ تخفیف
          </div>
        </div>

        <!-- Info Area -->
        <div class="p-5 flex-1 flex flex-col justify-between">
          <div class="space-y-2">
            <div class="text-[10px] text-slate-400 font-bold tracking-widest uppercase truncate">
               {{ typeof product.companyId === 'object' ? product.companyId.name : 'تامین‌کننده معتبر' }}
            </div>
            <h3 class="font-bold text-slate-900 line-clamp-2 leading-snug h-12 group-hover:text-brand-blue transition-colors">
              {{ product.name }}
            </h3>
          </div>

          <div class="pt-4 mt-4 border-t border-slate-50 flex items-center justify-between">
            <div class="space-y-0.5 text-left rtl:text-right">
              <div v-if="product.discount" class="text-[10px] text-slate-400 line-through font-num decoration-red-400/50">
                {{ formatPrice(product.basePrice) }}
              </div>
              <div class="font-num text-lg font-black text-slate-900 flex items-baseline gap-1">
                {{ formatPrice(product.finalPrice || product.basePrice) }}
                <span class="text-[10px] text-slate-500 font-medium">تومان</span>
              </div>
            </div>
            <UButton 
              size="sm" 
              color="primary" 
              variant="soft" 
              icon="i-lucide-shopping-cart"
              square
              class="group-hover:bg-brand-blue group-hover:text-white transition-colors"
            />
          </div>
        </div>
      </NuxtLink>
    </template>

    <div v-else class="col-span-full py-20 text-center">
      <UIcon name="i-lucide-package-search" class="size-16 mx-auto text-slate-200 mb-4" />
      <h3 class="heading-md text-slate-400">محصولی یافت نشد</h3>
    </div>
  </div>
</template>
