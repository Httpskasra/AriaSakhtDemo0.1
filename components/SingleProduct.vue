<template>
  <div v-if="product" class="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 lg:p-8 bg-white rounded-2xl shadow-sm">
    <!-- Image Section -->
    <div class="space-y-4">
      <div class="relative overflow-hidden rounded-2xl border border-gray-100 aspect-square">
        <NuxtImg
          v-if="currentImage && !imageError"
          :src="currentImage"
          class="w-full h-full object-contain p-4 transition-opacity duration-300"
          :class="imageError ? 'opacity-0' : 'opacity-100'"
          @error="imageError = true"
        />
        <div v-else class="flex items-center justify-center w-full h-full bg-gray-50">
          <UIcon name="i-lucide-image-off" class="size-20 text-gray-300" />
        </div>
        
        <!-- Stock Overlay -->
        <div v-if="isOutOfStock" class="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[2px] z-10">
          <div class="px-6 py-2 bg-red-600 text-white font-bold text-xl rounded-full shadow-xl rotate-[-8deg] border-2 border-white">
            ناموجود در انبار
          </div>
        </div>
      </div>
      
      <!-- Thumbnails -->
      <div v-if="product.images && product.images.length > 1" class="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        <div 
          v-for="(img, idx) in product.images" 
          :key="idx"
          class="size-20 border rounded-lg overflow-hidden cursor-pointer flex-shrink-0 transition-all"
          :class="currentImage === img.url ? 'border-primary ring-2 ring-primary/20 scale-95' : 'border-gray-200 hover:border-primary/50'"
          @click="currentImage = img.url; imageError = false"
        >
          <NuxtImg :src="img.url" class="size-full object-cover" @error="(e) => (e.target as HTMLImageElement).src = '/favicon.ico'" />
        </div>
      </div>
    </div>

    <!-- Info Section -->
    <div class="flex flex-col gap-6">
      <div>
        <h1 class="text-2xl lg:text-3xl font-black text-gray-900 leading-tight">
          {{ product.name }}
        </h1>
        <div class="mt-2 flex items-center gap-4 text-sm text-gray-500">
          <span class="flex items-center gap-1">
            <UIcon name="i-lucide-hash" class="size-4 text-primary" />
            شناسه: {{ product.sku }}
          </span>
          <span class="flex items-center gap-1">
            <UIcon name="i-lucide-building" class="size-4 text-primary" />
            {{ companyName }}
          </span>
        </div>
      </div>

      <div class="p-6 bg-gray-50 rounded-2xl space-y-5">
        <div class="flex items-center justify-between">
          <span class="text-gray-600 font-medium">قیمت واحد:</span>
          <div class="text-right">
            <div v-if="product.discount" class="text-sm text-gray-400 line-through">
              {{ formatPrice(product.basePrice) }}
            </div>
            <div class="text-3xl font-black text-primary flex items-baseline gap-1">
              {{ formatPrice(product.finalPrice || product.basePrice) }}
              <span class="text-sm font-normal text-gray-500">تومان</span>
            </div>
          </div>
        </div>

        <div class="h-px bg-gray-200 w-full" />

        <!-- Stock Info -->
        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-600">وضعیت موجودی:</span>
          <div class="flex items-center gap-1.5" :class="isOutOfStock ? 'text-red-500 font-bold' : 'text-green-600 font-medium'">
            <UIcon :name="isOutOfStock ? 'i-lucide-alert-circle' : 'i-lucide-check-circle'" class="size-4" />
            {{ isOutOfStock ? 'اتمام موجودی' : `${product.stock?.quantity} عدد در انبار` }}
          </div>
        </div>

        <!-- Add to Cart -->
        <div class="flex flex-col gap-4 mt-2">
          <div v-if="!isOutOfStock" class="flex items-center gap-4">
            <div class="flex items-center border rounded-lg bg-white p-1">
              <UButton icon="i-lucide-plus" variant="ghost" color="neutral" @click="quantity++" :disabled="quantity >= (product.stock?.quantity || 1)" />
              <input type="number" v-model="quantity" readonly class="w-12 text-center border-none focus:ring-0 text-sm font-bold" />
              <UButton icon="i-lucide-minus" variant="ghost" color="neutral" @click="quantity > 1 && quantity--" :disabled="quantity <= 1" />
            </div>
            <span class="text-xs text-gray-400 font-medium">تعداد مورد نیاز</span>
          </div>

          <UButton
            size="xl"
            block
            :color="isOutOfStock ? 'neutral' : 'primary'"
            :disabled="isOutOfStock || cartLoading"
            :loading="cartLoading"
            :icon="isOutOfStock ? 'i-lucide-bell' : 'i-lucide-shopping-cart'"
            @click="onAddToCart"
          >
            {{ isOutOfStock ? 'موجود شد خبرم کن' : 'افزودن به سبد خرید' }}
          </UButton>
        </div>
      </div>
      
      <!-- Description -->
      <div class="border-t pt-4">
        <h3 class="font-bold text-gray-900 mb-2 flex items-center gap-2">
          <UIcon name="i-lucide-info" class="size-5 text-primary" />
          توضیحات محصول
        </h3>
        <p class="text-gray-600 text-sm leading-7 text-justify">
          {{ product.description || 'توضیحاتی برای این محصول ثبت نشده است.' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { Product } from '~/types/product';
import { useAddToCart } from '~/composables/useAddToCart';

const props = defineProps<{
  product: Product;
}>();

const quantity = ref(1);
const imageError = ref(false);
const currentImage = ref(props.product?.images?.[0]?.url || '');
const { addProductToCart, loading: cartLoading } = useAddToCart();

const isOutOfStock = computed(() => (props.product?.stock?.quantity || 0) <= 0);
const companyName = computed(() => typeof props.product?.companyId === 'object' ? props.product.companyId.name : 'تأمین‌کننده تجاریس');

const formatPrice = (val: number) => new Intl.NumberFormat('fa-IR').format(val);

const onAddToCart = async () => {
  if (isOutOfStock.value) {
    // Notify logic or modal would be triggered here
    return;
  }
  
  await addProductToCart({
    productId: (props.product._id || props.product.id) as string,
    quantity: quantity.value,
    companyId: (typeof props.product.companyId === 'object' ? props.product.companyId._id : props.product.companyId) as string,
    priceAtAdd: props.product.finalPrice || props.product.basePrice,
    userId: ''
  });
};

watch(() => props.product, (newProd) => {
  if (newProd?.images?.[0]) {
    currentImage.value = newProd.images[0].url;
    imageError.value = false;
  }
}, { immediate: true });
</script>
