<template>
  <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
    <!-- Header -->
    <div class="hidden md:grid grid-cols-12 gap-4 p-6 bg-gray-50 border-b border-gray-100 text-sm font-bold text-gray-600">
      <div class="col-span-6">محصول</div>
      <div class="col-span-2 text-center">قیمت واحد</div>
      <div class="col-span-2 text-center">تعداد (بسته ۱۰تایی)</div>
      <div class="col-span-2 text-center">جمع کل</div>
    </div>

    <!-- Items -->
    <div class="divide-y divide-gray-50">
      <div v-for="item in cartItems" :key="item.productId" class="p-4 md:p-6 grid grid-cols-12 gap-4 items-center">
        <!-- Product Info -->
        <div class="col-span-12 md:col-span-6 flex items-center gap-4">
          <div class="size-20 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-50">
            <img :src="item.image || 'https://picsum.photos/seed/cart/100/100'" class="size-full object-cover" />
          </div>
          <div class="min-w-0">
            <h3 class="font-bold text-gray-800 truncate mb-1">{{ item.name }}</h3>
            <p class="text-xs text-muted truncate">شناسه کالا: {{ item.sku || 'CEM-882' }}</p>
            <div class="mt-2 flex gap-2">
              <UButton color="red" variant="ghost" icon="i-lucide-trash-2" size="xs" label="حذف" @click="onRemove(item.productId)" />
            </div>
          </div>
        </div>

        <!-- Unit Price -->
        <div class="col-span-6 md:col-span-2 text-center md:text-gray-700 font-medium">
          <span class="md:hidden text-xs text-muted block mb-1">قیمت واحد</span>
          <span class="font-num">{{ formatPrice(item.priceAtAdd) }}</span>
          <span class="text-[10px] mr-1">تومان</span>
        </div>

        <!-- Quantity with B2B Step -->
        <div class="col-span-6 md:col-span-2 flex flex-col items-center gap-1">
          <span class="md:hidden text-xs text-muted block mb-1 text-center">تعداد</span>
          <div class="flex items-center border border-gray-200 rounded-lg overflow-hidden h-9">
            <UButton
              color="gray"
              variant="ghost"
              icon="i-lucide-minus"
              size="xs"
              class="rounded-none hover:bg-gray-50"
              :disabled="item.quantity <= 10"
              @click="updateQty(item.productId, item.quantity - 10)"
            />
            <input
              type="number"
              v-model.number="item.quantity"
              class="w-12 text-center text-sm border-0 focus:ring-0 font-num"
              @change="onManualQtyChange(item)"
            />
            <UButton
              color="gray"
              variant="ghost"
              icon="i-lucide-plus"
              size="xs"
              class="rounded-none hover:bg-gray-50"
              @click="updateQty(item.productId, item.quantity + 10)"
            />
          </div>
          <span class="text-[10px] text-primary-600 font-medium">حداقل سفارش: ۱۰ عدد</span>
        </div>

        <!-- Row Total -->
        <div class="col-span-12 md:col-span-2 text-center text-primary font-bold">
          <span class="md:hidden text-xs text-muted block mb-1">جمع کل آیتم</span>
          <span class="font-num text-lg">{{ formatPrice(item.priceAtAdd * item.quantity) }}</span>
          <span class="text-xs mr-1 font-normal">تومان</span>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!cartItems?.length" class="p-16 flex flex-col items-center justify-center text-center">
      <div class="size-32 bg-gray-50 rounded-full flex items-center justify-center mb-6">
        <UIcon name="i-lucide-shopping-cart" class="size-16 text-gray-300" />
      </div>
      <h3 class="text-xl font-bold text-gray-800 mb-2">سبد خرید شما خالی است</h3>
      <p class="text-muted mb-8 max-w-sm">هنوز هیچ محصولی به سبد خرید خود اضافه نکرده‌اید. همین حالا محصولات ما را بررسی کنید.</p>
      <UButton to="/products" color="primary" size="lg" label="مشاهده محصولات" />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  cartItems: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update-qty', 'remove'])

const formatPrice = (p) => new Intl.NumberFormat('fa-IR').format(p)

const updateQty = (id, newQty) => {
  if (newQty < 10) return
  emit('update-qty', { productId: id, quantity: newQty })
}

const onManualQtyChange = (item) => {
  // Enforce multiples of 10 and min value
  let val = Math.max(10, Math.round(item.quantity / 10) * 10)
  item.quantity = val
  emit('update-qty', { productId: item.productId, quantity: val })
}

const onRemove = (id) => {
  emit('remove', id)
}
</script>

<style scoped>
/* Remove arrows from number input */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type=number] {
  -moz-appearance: textfield;
}
</style>
