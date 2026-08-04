<script setup lang="ts">
import type { Product } from '~/types/product';

const props = defineProps<{ product: Product; loading?: boolean }>();
const { addProductToCart, loading: cartLoading } = useAddToCart();
const stockQuantity = computed(() => Math.max(0, Number(props.product.stock?.quantity || 0)));
const isOutOfStock = computed(() => stockQuantity.value <= 0);

const handleAddToCart = async () => {
  if (!props.product._id) return;
  if (isOutOfStock.value) return;
  await addProductToCart({
    productId: props.product._id,
    quantity: 1,
    companyId: typeof props.product.companyId === 'string' ? props.product.companyId : props.product.companyId?._id,
    priceAtAdd: props.product.basePrice,
  });
};

const companyName = computed(() => typeof props.product.companyId === 'object' && props.product.companyId
  ? props.product.companyId.name
  : 'تامین‌کننده معتبر');
const discountAmount = computed(() => props.product.discount
  ? Math.round((props.product.basePrice * props.product.discount) / 100)
  : 0);
const finalPrice = computed(() => props.product.basePrice - discountAmount.value);
</script>

<template>
  <article class="industrial-card group flex flex-col h-full overflow-hidden bg-white ring-1 ring-slate-200 surface-card">
    <NuxtLink :to="`/products/${product._id || product.id}`" class="relative block aspect-square overflow-hidden bg-slate-50" :aria-label="`مشاهده ${product.name}`">
      <img
        :src="product.images?.[0]?.url || '/products/building-material.jpg'"
        :alt="product.name"
        class="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110 p-4"
        loading="lazy" width="400" height="400" @error="($event.target as HTMLImageElement).src = '/products/building-material.jpg'" />
      <div v-if="product.discount" class="absolute top-3 right-3 bg-[var(--color-danger-fg)] text-white text-xs font-bold px-2 py-1 surface-compact-list shadow-lg font-num">
        {{ product.discount }}%
      </div>
      <FavoriteButton v-if="product._id" :product-id="product._id" class="absolute top-3 left-3" />
      <span v-if="isOutOfStock" class="absolute bottom-3 right-3 rounded-full bg-slate-800/85 px-2.5 py-1 text-xs font-bold text-white">ناموجود</span>
    </NuxtLink>

    <div class="p-4 flex flex-col flex-1">
      <div class="mb-1 flex items-center justify-between">
        <span class="text-[10px] uppercase tracking-wider text-slate-400 font-num">{{ product.sku }}</span>
        <div class="flex items-center gap-1">
          <UIcon name="i-lucide-star" class="size-icon-compact text-amber-400 fill-amber-400" aria-hidden="true" />
          <span class="text-xs font-bold font-num" :aria-label="`امتیاز ${product.avgRate || 0} از ۵`">{{ Number(product.avgRate || 0).toFixed(1) }}</span>
        </div>
      </div>
      <NuxtLink :to="`/products/${product._id || product.id}`">
        <h3 class="text-sm font-bold text-slate-800 line-clamp-2 min-h-[2.5rem] leading-snug group-hover:text-primary transition-colors">{{ product.name }}</h3>
      </NuxtLink>
      <div class="mt-2 flex items-center gap-1.5">
        <UIcon name="i-lucide-building" class="size-icon-compact text-slate-400" />
        <span class="text-xs text-slate-500 truncate">{{ companyName }}</span>
      </div>
      <div class="mt-auto pt-4 flex flex-col gap-1">
        <div v-if="product.discount" class="flex items-center gap-2 opacity-40 line-through text-xs text-slate-500 font-num">{{ product.basePrice.toLocaleString() }}</div>
        <div class="flex items-center justify-between">
          <div class="flex items-baseline gap-1">
            <span class="text-lg font-black text-slate-900 font-num">{{ finalPrice.toLocaleString() }}</span>
            <span class="text-[10px] font-bold text-slate-500">ریال</span>
          </div>
          <ActionButton icon-only icon="i-lucide-shopping-cart" tone="primary" size="sm" :loading="cartLoading" :disabled="cartLoading || isOutOfStock" :aria-label="isOutOfStock ? 'محصول ناموجود است' : 'افزودن به سبد خرید'" @click.prevent="handleAddToCart" />
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.industrial-card { transition: all 0.3s ease; }
</style>
