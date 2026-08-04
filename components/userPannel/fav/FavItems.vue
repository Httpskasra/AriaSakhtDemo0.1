<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useFavoritesStore } from '~/stores/favorites';

const favoritesStore = useFavoritesStore();
const products = computed(() => favoritesStore.items.flatMap(item => item.product ? [item.product] : []));

async function load() {
  try { await favoritesStore.fetch(); } catch { /* rendered through the safe error state */ }
}
async function remove(productId: string) {
  try { await favoritesStore.toggle(productId); }
  catch { /* rollback is handled by the store */ }
}
onMounted(() => { if (!favoritesStore.initialized) void load(); });
</script>

<template>
  <div class="p-4 sm:p-6 min-h-[400px]">
    <h2 class="text-xl font-yekan font-bold text-gray-800 mb-6">لیست علاقه‌مندی‌ها</h2>

    <div v-if="favoritesStore.loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <SkeletonLoaderProduct v-for="i in 3" :key="i" />
    </div>

    <div v-else-if="favoritesStore.error" class="py-20 text-center">
      <p class="text-red-600">{{ favoritesStore.error }}</p>
      <UButton class="mt-4" variant="soft" @click="load">تلاش دوباره</UButton>
    </div>

    <div v-else-if="products.length === 0" class="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div class="relative mb-6">
        <UIcon name="i-lucide-heart" class="size-icon-hero text-red-50" />
        <div class="absolute inset-0 flex items-center justify-center">
          <UIcon name="i-lucide-heart-off" class="size-icon-hero text-gray-300" />
        </div>
      </div>
      <h3 class="text-lg font-yekan font-bold text-gray-700">لیست علاقه‌مندی‌های شما خالی است</h3>
      <p class="text-sm text-gray-500 mt-2">
        با کلیک روی آیکون قلب در صفحه محصولات، می‌توانید کالاهای مورد نظر را اینجا ذخیره کنید.
      </p>
      <UButton
        to="/products"
        color="gray"
        variant="soft"
        class="mt-8 rounded-full px-8"
        label="شروع گشت و گذار"
      />
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="product in products" :key="product.id || product._id" class="relative">
        <CatalogProductCard :product="product" />
        <UButton class="absolute top-3 left-3" size="xs" color="red" variant="soft" icon="i-lucide-heart-off" aria-label="حذف از علاقه‌مندی‌ها" @click="remove(product.id || product._id || '')" />
      </div>
    </div>
  </div>
</template>
