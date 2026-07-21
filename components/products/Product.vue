<template>
  <UCard class="h-full overflow-hidden transition-all duration-300 hover:shadow-lg group">
    <template #header>
      <div class="relative cursor-pointer" @click="navigateToProduct">
        <ProductImage 
          :src="mainImage" 
          :alt="product.name" 
          :out-of-stock="isOutOfStock"
        />
        
        <!-- Discount Badge -->
        <div v-if="product.discount && !isOutOfStock" class="absolute top-2 right-2 px-2 py-1 text-xs font-bold text-white bg-green-500 rounded z-20">
          {{ product.discount }}% تخفیف
        </div>
      </div>
    </template>

    <div class="flex flex-col gap-2">
      <h3 class="text-sm font-bold text-gray-800 line-clamp-2 min-h-[40px] cursor-pointer hover:text-primary transition-colors" @click="navigateToProduct">
        {{ product.name }}
      </h3>
      
      <div class="flex items-center gap-1 text-xs text-gray-500">
        <UIcon name="i-lucide-building" class="size-3" />
        <span class="truncate">{{ companyName }}</span>
      </div>

      <div class="mt-2 flex flex-col items-start gap-1">
        <div v-if="product.discount" class="text-xs text-gray-400 line-through decoration-red-400">
          {{ formatPrice(product.basePrice) }}
        </div>
        <div class="text-lg font-black text-primary">
          {{ formatPrice(product.finalPrice || product.basePrice) }}
          <span class="text-[10px] font-normal mr-1 text-gray-500">تومان</span>
        </div>
      </div>
    </div>

    <template #footer>
      <UButton
        block
        :color="isOutOfStock ? 'neutral' : 'primary'"
        :variant="isOutOfStock ? 'soft' : 'solid'"
        :disabled="isOutOfStock || loading"
        :loading="loading"
        :icon="isOutOfStock ? 'i-lucide-slash' : 'i-lucide-shopping-cart'"
        @click="onAddToCart"
      >
        {{ isOutOfStock ? 'ناموجود' : 'افزودن به سبد' }}
      </UButton>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Product } from '~/types/product';
import { useAddToCart } from '~/composables/useAddToCart';

const props = defineProps<{
  product: Product;
}>();

const router = useRouter();
const { addProductToCart, loading } = useAddToCart();

const isOutOfStock = computed(() => (props.product.stock?.quantity || 0) <= 0);
const mainImage = computed(() => props.product.images?.[0]?.url);
const companyName = computed(() => typeof props.product.companyId === 'object' ? props.product.companyId.name : 'تأمین‌کننده تجاریس');

const formatPrice = (val: number) => new Intl.NumberFormat('fa-IR').format(val);

const navigateToProduct = () => {
  router.push(`/products/${props.product._id || props.product.id}`);
};

const onAddToCart = async () => {
  if (isOutOfStock.value) return;
  
  await addProductToCart({
    productId: (props.product._id || props.product.id) as string,
    quantity: 1,
    companyId: (typeof props.product.companyId === 'object' ? props.product.companyId._id : props.product.companyId) as string,
    priceAtAdd: props.product.finalPrice || props.product.basePrice,
    userId: ''
  });
};
</script>
