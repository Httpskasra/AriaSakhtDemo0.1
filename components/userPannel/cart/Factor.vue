<template>
  <div class="bg-white rounded-xl shadow-md border border-gray-100 p-6 flex flex-col gap-6 sticky top-24">
    <h2 class="text-xl font-bold text-gray-900 border-b pb-4">خلاصه صورت‌حساب</h2>

    <!-- Address Selection -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <label class="text-sm font-bold text-gray-700 flex items-center gap-1.5">
          <UIcon name="i-lucide-map-pin" class="text-green-600" />
          نشانی تحویل
        </label>
        <button @click="showAddressInput = !showAddressSelection" class="text-xs text-blue-600 font-medium">
          {{ selectedAddress ? 'تغییر نشانی' : 'افزودن نشانی' }}
        </button>
      </div>
      
      <div v-if="selectedAddress" class="p-3 bg-gray-50 rounded-lg text-sm text-gray-600 border border-gray-200">
        {{ selectedAddress }}
      </div>
      <div v-else class="p-3 bg-red-50 text-red-600 rounded-lg text-xs italic border border-red-100">
        نشانی تحویل انتخاب نشده است.
      </div>

      <UModal v-model="showAddressSelection">
        <div class="p-6">
          <h3 class="text-lg font-bold mb-4">ثبت نشانی جدید</h3>
          <UTextarea v-model="tempAddress" placeholder="استان، شهر، خیابان، کوچه، پلاک، واحد..." :rows="3" />
          <div class="flex justify-end mt-4 gap-2">
            <UButton color="gray" variant="ghost" @click="showAddressSelection = false">انصراف</UButton>
            <UButton color="primary" @click="saveAddress">تایید نشانی</UButton>
          </div>
        </div>
      </UModal>
    </div>

    <!-- Price Details -->
    <div class="space-y-4">
      <div class="flex justify-between text-sm text-gray-600 font-medium">
        <span>قیمت کالاها ({{ cartItemCount }} مورد)</span>
        <span>{{ formatPrice(subtotal) }} تومان</span>
      </div>

      <div class="flex justify-between text-sm text-gray-600 font-medium">
        <span>مالیات بر ارزش افزوده (۹٪)</span>
        <span>{{ formatPrice(taxAmount) }} تومان</span>
      </div>

      <div class="flex justify-between text-sm text-gray-600 font-medium">
        <span>هزینه ارسال</span>
        <span v-if="shippingCost === 0" class="text-green-600 font-bold">رایگان</span>
        <span v-else>{{ formatPrice(shippingCost) }} تومان</span>
      </div>

      <div v-if="discountAmount > 0" class="flex justify-between text-sm text-red-500 font-bold">
        <span>سود شما از خرید</span>
        <span>{{ formatPrice(discountAmount) }} تومان</span>
      </div>

      <div class="border-t border-dashed pt-4 flex justify-between items-center">
        <span class="text-base font-bold text-gray-900">مبلغ قابل پرداخت</span>
        <span class="text-xl font-black text-green-600">{{ formatPrice(total) }} تومان</span>
      </div>
    </div>

    <!-- Action Button -->
    <UButton
      size="xl"
      block
      color="primary"
      class="font-bold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all"
      :loading="loading"
      :disabled="!selectedAddress || cartItemCount === 0"
      icon="i-lucide-credit-card"
      @click="handleCheckout"
    >
      تکمیل سفارش و پرداخت
    </UButton>

    <p class="text-[10px] text-gray-400 text-center leading-relaxed">
      با ثبت سفارش، قوانین و مقررات تجاریس را می‌پذیرم. قیمت‌های نمایش داده شده برای کالاهای استراتژیک بر اساس نرخ روز بورس کالا محاسبه می‌گردد.
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { checkoutCart } from '~/services/cartService'

const props = defineProps<{
  cart: any
}>()

const toast = useToast()
const loading = ref(false)
const showAddressSelection = ref(false)
const selectedAddress = ref('')
const tempAddress = ref('')

const cartItemCount = computed(() => {
  return props.cart?.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0
})

const subtotal = computed(() => props.cart?.totalAmount || 0)
const taxAmount = computed(() => Math.round(subtotal.value * 0.09))
const shippingCost = computed(() => subtotal.value > 10000000 ? 0 : 150000) // Free shipping over 10M
const discountAmount = ref(0) // Logic for coupons could go here

const total = computed(() => subtotal.value + taxAmount.value + shippingCost.value)

const formatPrice = (value: number) => {
  return new Intl.NumberFormat('fa-IR').format(value)
}

const saveAddress = () => {
  if (tempAddress.value.trim().length < 10) {
    toast.add({ title: 'خطا', description: 'نشانی وارد شده بسیار کوتاه است', color: 'red' })
    return
  }
  selectedAddress.value = tempAddress.value
  showAddressSelection.value = false
}

const handleCheckout = async () => {
  loading.value = true
  try {
    const res = await checkoutCart({ 
      shippingAddress: selectedAddress.value,
      paymentMethod: 'GATEWAY'
    })
    
    // Typically redirect to a payment page or the generated Zibal URL
    toast.add({ title: 'موفقیت', description: 'در حال انتقال به درگاه پرداخت...', color: 'green' })
    
    if (res.data?.paymentUrl) {
      window.location.href = res.data.paymentUrl
    } else {
      navigateTo('/dashboard/orders')
    }
  } catch (err: any) {
    toast.add({ 
      title: 'خطا در ثبت سفارش', 
      description: err.response?.data?.message || 'مشکلی در عملیات تسویه حساب رخ داد', 
      color: 'red' 
    })
  } finally {
    loading.value = false
  }
}
</script>
