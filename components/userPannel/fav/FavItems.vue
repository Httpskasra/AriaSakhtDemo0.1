<script setup lang="ts">
import { useUser } from '~/composables/useUser'

const { user, isUserLoading } = useUser()
const favorites = computed(() => user.value?.profile?.favorites || [])
</script>

<template>
  <div class="min-h-[400px] flex flex-col">
    <div v-if="isUserLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <USkeleton v-for="i in 3" :key="i" class="h-64 w-full" />
    </div>

    <template v-else>
      <div v-if="favorites.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Product v-for="product in favorites" :key="product._id || product.id" :product="product" />
      </div>

      <div v-else class="flex-1 flex flex-col items-center justify-center text-center p-12 bg-white rounded-xl border-2 border-dashed border-gray-200">
        <div class="bg-red-50 p-6 rounded-full mb-6">
          <UIcon name="i-lucide-heart-off" class="size-16 text-red-400" />
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">لیست علاقه‌مندی‌ها خالی است</h3>
        <p class="text-gray-500 max-w-xs mb-8">
          هنوز محصولی را به لیست علاقه‌مندی‌های خود اضافه نکرده‌اید. با گشت و گذار در فروشگاه، کالاهای مورد علاقه خود را ذخیره کنید.
        </p>
        <UButton
          to="/products"
          color="primary"
          size="lg"
          icon="i-lucide-shopping-bag"
        >
          مشاهده محصولات
        </UButton>
      </div>
    </template>
  </div>
</template>
