<script setup lang="ts">
import { computed } from 'vue';
import { useAddToCart } from '~/composables/useAddToCart';

const props = defineProps<{
  summary: {
    totalValue: number;
    totalItems: number;
    shippingCost?: number;
    vat?: number;
  }
}>();

const { checkout, loading } = useAddToCart();
const isProcessing = ref(false);

const finalTotal = computed(() => {
  const base = props.summary.totalValue || 0;
  const shipping = props.summary.shippingCost || 0;
  const vat = props.summary.vat || (base * 0.09); // Default 9% VAT for B2B
  return base + shipping + vat;
});

const handleCheckout = async () => {
  isProcessing.value = true;
  try {
    const result = await checkout();
    if (result && result.orders?.[0]?.id) {
      // Redirect to the first generated order for payment
      const order = result.orders[0];
      const { $axios } = useNuxtApp();
      const payRes = await $axios.post('/payment/initiate', {
        orderId: order.id,
        amount: order.totalPrice
      });
      if (payRes.data.paymentUrl) {
        window.location.href = payRes.data.paymentUrl;
      }
    }
  } catch (err) {
    // Error handled by useAddToCart toast
  } finally {
    isProcessing.value = false;
  }
};
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
    <!-- C5: Payment Loading Overlay -->
    <UModal v-model="isProcessing" prevent-close>
      <div class="p-10 flex flex-col items-center justify-center space-y-6 text-center">
        <UIcon name="i-lucide-credit-card" class="w-16 h-16 animate-pulse text-blue-600" />
        <div>
          <h3 class="text-xl font-bold mb-2">در حال اتصال به درگاه...</h3>
          <p class="text-gray-500">لطفاً از دکمه بازگشت مرورگر استفاده نکنید.</p>
        </div>
      </div>
    </UModal>

    <div class="p-6 bg-blue-600 text-white">
      <h3 class="text-lg font-bold">خلاصه صورتحساب</h3>
    </div>

    <div class="p-6 space-y-4 font-num">
      <div class="flex justify-between text-sm text-gray-500">
        <span>قیمت کالاها ({{ summary.totalItems }} مورد)</span>
        <span>{{ (summary.totalValue || 0).toLocaleString() }} ریال</span>
      </div>

      <div class="flex justify-between text-sm text-gray-500">
        <span>هزینه ارسال</span>
        <span v-if="summary.shippingCost">{{ summary.shippingCost.toLocaleString() }} ریال</span>
        <span v-else class="text-blue-600 font-medium">پس کرایه</span>
      </div>

      <div class="flex justify-between text-sm text-gray-500 border-b border-gray-50 pb-4">
        <span>مالیات بر ارزش افزوده (۹٪)</span>
        <span>{{ (summary.vat || (summary.totalValue * 0.09)).toLocaleString() }} ریال</span>
      </div>

      <div class="flex justify-between items-center pt-2">
        <span class="font-bold text-gray-900">مبلغ قابل پرداخت:</span>
        <span class="text-2xl font-black text-blue-600">{{ finalTotal.toLocaleString() }} <span class="text-xs font-medium">ریال</span></span>
      </div>

      <UButton
        size="xl"
        color="primary"
        block
        class="h-14 text-lg font-bold mt-6 shadow-lg shadow-blue-200"
        :loading="isProcessing"
        @click="handleCheckout"
      >
        تایید و پرداخت نهایی
      </UButton>

      <div class="flex items-center gap-2 justify-center mt-4 text-[10px] text-gray-400">
        <UIcon name="i-lucide-shield-check" class="w-4 h-4" />
        تضمین پرداخت امن و ضمانت بازگشت کالا
      </div>
    </div>
  </div>
</template>
