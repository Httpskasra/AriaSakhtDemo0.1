<script setup lang="ts">
import type { Product } from '~/types/product';
import { formatPhoneForDisplay } from '~/utils/PhoneNumber';

const props = defineProps<{
  product: Product;
  loading?: boolean;
}>();

const { addProductToCart, loading: cartLoading } = useAddToCart();

const handleAddToCart = async () => {
  if (!props.product._id) return;
  
  await addProductToCart({
    productId: props.product._id,
    quantity: 1,
    companyId: typeof props.product.companyId === 'string' ? props.product.companyId : props.product.companyId._id,
    priceAtAdd: props.product.basePrice,
    userId: '' // Handled by composable
  });
};

const companyName = computed(() => {
  if (typeof props.product.companyId === 'string') return 'تامین‌کننده معتبر';
  return props.product.companyId.name;
});

const discountAmount = computed(() => {
  if (!props.product.discount) return 0;
  return Math.round((props.product.basePrice * props.product.discount) / 100);
});

const finalPrice = computed(() => {
  return props.product.basePrice - discountAmount.value;
});
</script>

<template>
  <div class="industrial-card group flex flex-col h-full overflow-hidden bg-white ring-1 ring-slate-200">
    <!-- Image Section -->
    <NuxtLink :to="`/products/${product._id}`" class="relative block aspect-square overflow-hidden bg-slate-50">
      <img
        :src="product.images?.[0]?.url || 'https://picsum.photos/seed/tejaris-prod/400/400'"
        :alt="product.name"
        class="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110 p-4"
        loading="lazy"
      />
      <!-- Discount Badge -->
      <div v-if="product.discount" class="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg font-num">
        {{ product.discount }}%
      </div>
    </NuxtLink>

    <!-- Content Section -->
    <div class="p-4 flex flex-col flex-1">
      <div class="mb-1 flex items-center justify-between">
        <span class="text-[10px] uppercase tracking-wider text-slate-400 font-num">{{ product.sku }}</span>
        <div class="flex items-center gap-1">
          <UIcon name="i-lucide-star" class="size-3 text-amber-400 fill-amber-400" />
          <span class="text-xs font-bold font-num">{{ product.avgRate || '0' }}</span>
        </div>
      </div>

      <NuxtLink :to="`/products/${product._id}`">
        <h3 class="text-sm font-bold text-slate-800 line-clamp-2 min-h-[2.5rem] leading-snug group-hover:text-blue-600 transition-colors">
          {{ product.name }}
        </h3>
      </NuxtLink>

      <div class="mt-2 flex items-center gap-1.5">
        <UIcon name="i-lucide-building" class="size-3.5 text-slate-400" />
        <span class="text-xs text-slate-500 truncate">{{ companyName }}</span>
      </div>

      <!-- Price Section -->
      <div class="mt-auto pt-4 flex flex-col gap-1">
        <div v-if="product.discount" class="flex items-center gap-2 opacity-40 line-through text-xs text-slate-500 font-num">
          {{ product.basePrice.toLocaleString() }}
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-baseline gap-1">
            <span class="text-lg font-black text-slate-900 font-num">{{ finalPrice.toLocaleString() }}</span>
            <span class="text-[10px] font-bold text-slate-500">ریال</span>
          </div>
          
          <UButton
            @click.prevent="handleAddToCart"
            color="primary"
            variant="soft"
            size="sm"
            class="rounded-lg shadow-sm"
            :loading="cartLoading"
            square
          >
            <UIcon name="i-lucide-shopping-cart" class="size-4" />
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Standard CSS for visual polish */
.industrial-card {
  transition: all 0.3s ease;
}
</style>