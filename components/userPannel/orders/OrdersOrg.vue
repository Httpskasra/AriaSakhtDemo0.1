<script setup lang="ts">
import { useOrders } from '~/composables/useOrders'

const { orders, loading, fetchOrders } = useOrders()

onMounted(() => {
  fetchOrders()
})
</script>

<template>
  <div class="min-h-[400px] flex flex-col">
    <div v-if="loading" class="space-y-4">
      <USkeleton v-for="i in 3" :key="i" class="h-32 w-full" />
    </div>

    <template v-else>
      <div v-if="orders.length > 0" class="space-y-4">
        <div 
          v-for="order in orders" 
          :key="order.id || order._id" 
          class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 transition-colors"
        >
          <div class="flex justify-between items-start mb-4">
            <div>
              <span class="text-xs font-bold text-gray-400">شماره سفارش:</span>
              <span class="text-sm font-black mr-1 uppercase">{{ (order.id || order._id).slice(-8) }}</span>
            </div>
            <OrderStatus :status="order.status" />
          </div>
          
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-600">
              <span class="ml-4 font-medium">مبلغ کل: {{ order.totalPrice.toLocaleString() }} تومان</span>
              <span class="text-gray-300">|</span>
              <span class="mr-4">{{ order.items.length }} آیتم</span>
            </div>
            <UButton
              variant="soft"
              color="primary"
              size="sm"
              trailing-icon="i-lucide-chevron-left"
              :to="`/dashboard/orders/${order.id || order._id}`"
            >
              مشاهده جزئیات
            </UButton>
          </div>
        </div>
      </div>

      <div v-else class="flex-1 flex flex-col items-center justify-center text-center p-12 bg-white rounded-xl border-2 border-dashed border-gray-200">
        <div class="bg-blue-50 p-6 rounded-full mb-6">
          <UIcon name="i-lucide-shopping-bag" class="size-16 text-blue-400" />
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">هنوز هیچ سفارشی ثبت نشده است</h3>
        <p class="text-gray-500 max-w-xs mb-8">
          تاریخچه سفارش‌های شما خالی است. همین حالا می‌توانید اولین سفارش خود را از تجاریس ثبت کنید.
        </p>
        <UButton
          to="/products"
          color="primary"
          size="lg"
          icon="i-lucide-search"
        >
          جستجوی کالا
        </UButton>
      </div>
    </template>
  </div>
</template>
