<script setup lang="ts">
// Logic assumed to be provided by parent or fetched via store
const props = defineProps<{
  favorites?: any[];
  loading?: boolean;
}>();
</script>

<template>
  <div class="p-4 sm:p-6 min-h-[400px]">
    <h2 class="text-xl font-iran-yekan-Bold text-gray-800 mb-6">لیست علاقه‌مندی‌ها</h2>

    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <SkeletonLoaderProduct v-for="i in 3" :key="i" />
    </div>

    <div v-else-if="!favorites || favorites.length === 0" class="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div class="relative mb-6">
        <UIcon name="i-lucide-heart" class="size-24 text-red-50" />
        <div class="absolute inset-0 flex items-center justify-center">
          <UIcon name="i-lucide-heart-off" class="size-12 text-gray-300" />
        </div>
      </div>
      <h3 class="text-lg font-iran-yekan-Bold text-gray-700">لیست علاقه‌مندی‌های شما خالی است</h3>
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
      <Product v-for="product in favorites" :key="product.id" :product="product" />
    </div>
  </div>
</template>
