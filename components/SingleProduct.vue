<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useProductById } from '~/composables/useGetProductByID';
import { useAddToCart } from '~/composables/useAddToCart';

const route = useRoute();
const id = route.params.id as string;
const { data: product, loading, error } = useProductById(id);
const { addProductToCart, loading: cartLoading } = useAddToCart();

// C4: Dynamic SEO Meta Tags
watch(product, (newVal) => {
  if (newVal) {
    useSeoMeta({
      title: newVal.name,
      ogTitle: newVal.name,
      description: newVal.description || `خرید ${newVal.name} با بهترین قیمت در تجاریس`,
      ogDescription: newVal.description,
      ogImage: newVal.images?.[0]?.url || 'https://picsum.photos/seed/tejaris/600/400',
      twitterCard: 'summary_large_image',
    });
  }
}, { immediate: true });

const handleAddToCart = async () => {
  if (!product.value) return;
  await addProductToCart({
    productId: product.value.id || product.value._id,
    quantity: 1,
    companyId: typeof product.value.companyId === 'string' ? product.value.companyId : product.value.companyId._id,
    priceAtAdd: product.value.finalPrice || product.value.basePrice
  });
};

const mainImage = computed(() => product.value?.images?.[0]?.url || 'https://picsum.photos/seed/prod/400/400');
const isOutOfStock = computed(() => (product.value?.stock?.quantity ?? 0) <= 0);
const isLightboxOpen = ref(false);
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="loading" class="flex justify-center py-20">
      <UIcon name="i-lucide-loader-circle" class="w-12 h-12 animate-spin text-primary" />
    </div>

    <div v-else-if="error" class="bg-red-50 p-6 rounded-lg text-center">
      <p class="text-red-600 font-medium">{{ error }}</p>
      <UButton color="gray" variant="ghost" class="mt-4" to="/products">بازگشت به فروشگاه</UButton>
    </div>

    <div v-else-if="product" class="bg-white rounded-2xl shadow-sm p-6 lg:p-10">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Product Images -->
        <div class="space-y-4">
          <div class="relative aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-zoom-in border border-gray-100" @click="isLightboxOpen = true">
            <NuxtImg :src="mainImage" class="w-full h-full object-cover" />
            <div v-if="isOutOfStock" class="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              ناموجود
            </div>
            <div v-else-if="product.discount" class="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              {{ product.discount }}% تخفیف
            </div>
          </div>
          
          <!-- Image Thumbnails Placeholder -->
          <div class="grid grid-cols-4 gap-4">
            <div v-for="img in product.images" :key="img.url" class="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
              <NuxtImg :src="img.url" class="w-full h-full object-cover opacity-70 hover:opacity-100 transition-opacity cursor-pointer" />
            </div>
          </div>
        </div>

        <!-- Product Info -->
        <div class="flex flex-col h-full">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ product.name }}</h1>
          <p class="text-sm text-gray-500 mb-6 font-num">شناسه کالا: {{ product.sku }}</p>

          <div class="flex items-center gap-2 mb-6">
            <div class="flex text-yellow-400">
              <UIcon name="i-lucide-star" v-for="i in 5" :key="i" class="w-5 h-5 fill-current" />
            </div>
            <span class="text-sm text-gray-400 font-num">({{ product.totalRatings || 0 }} نظر)</span>
          </div>

          <div class="bg-gray-50 rounded-xl p-6 mb-8">
            <div v-if="product.discount" class="text-gray-400 line-through text-lg mb-1 font-num">
              {{ product.basePrice.toLocaleString() }} ریال
            </div>
            <div class="text-3xl font-black text-blue-600 font-num">
              {{ (product.finalPrice || product.basePrice).toLocaleString() }} <span class="text-sm font-medium">ریال</span>
            </div>
          </div>

          <div class="prose prose-sm text-gray-600 mb-8 max-w-none">
            {{ product.description }}
          </div>

          <div class="mt-auto pt-8 border-t border-gray-100 flex items-center gap-4">
            <UButton
              size="xl"
              :color="isOutOfStock ? 'gray' : 'primary'"
              block
              :disabled="isOutOfStock || cartLoading"
              :loading="cartLoading"
              @click="handleAddToCart"
              class="flex-1 h-14 text-lg"
            >
              {{ isOutOfStock ? 'ناموجود' : 'افزودن به سبد خرید' }}
            </UButton>
            <UButton size="xl" variant="soft" color="gray" class="h-14 w-14 p-0 flex items-center justify-center">
              <UIcon name="i-lucide-heart" class="w-6 h-6" />
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Lightbox Modal -->
    <UModal v-model="isLightboxOpen" fullscreen>
      <div class="flex items-center justify-center h-full bg-black/90 relative">
        <UButton color="white" variant="ghost" icon="i-lucide-x" class="absolute top-6 right-6 z-50 scale-150" @click="isLightboxOpen = false" />
        <NuxtImg :src="mainImage" class="max-w-full max-h-[90vh] object-contain shadow-2xl" />
      </div>
    </UModal>
  </div>
</template>
