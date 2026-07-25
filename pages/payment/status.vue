<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { getTransactionStatus, type PaymentTransaction } from '~/services/transactionService';
import { formatDate } from '~/utils/date';

definePageMeta({ layout: 'default' });

const route = useRoute();
const trackId = computed(() => String(route.query.trackId || ''));
const transaction = ref<PaymentTransaction | null>(null);
const loading = ref(true);
const errorMessage = ref('');

const status = computed(() => transaction.value?.status?.toLowerCase() || 'unknown');
const isSuccess = computed(() => ['completed', 'success', 'paid', 'verified'].includes(status.value));
const isPending = computed(() => ['pending', 'processing'].includes(status.value));
const statusTitle = computed(() => {
  if (loading.value) return 'در حال بررسی پرداخت';
  if (isSuccess.value) return 'پرداخت موفق';
  if (isPending.value) return 'پرداخت در حال بررسی';
  return 'پرداخت ناموفق';
});

const loadTransaction = async () => {
  loading.value = true;
  errorMessage.value = '';
  try {
    if (!trackId.value) throw new Error('شناسه تراکنش دریافت نشد');
    transaction.value = await getTransactionStatus(trackId.value);
  } catch {
    errorMessage.value = 'وضعیت تراکنش از سرور قابل دریافت نیست.';
  } finally {
    loading.value = false;
  }
};

await loadTransaction();
</script>

<template>
  <div class="min-h-[60vh] flex items-center justify-center p-4">
    <div class="max-w-md w-full premium-card overflow-hidden border border-gray-100">
      <div :class="['py-12 flex flex-col items-center justify-center text-white', loading || isPending ? 'bg-amber-500' : isSuccess ? 'bg-green-500' : 'bg-red-500']">
        <UIcon :name="loading || isPending ? 'i-lucide-loader-circle' : isSuccess ? 'i-lucide-check-circle' : 'i-lucide-x-circle'" class="size-icon-hero" :class="{ 'animate-spin': loading }" />
        <h1 class="text-3xl font-black mt-4 mb-2">{{ statusTitle }}</h1>
        <p class="text-white/85 font-medium text-center px-4">
          {{ loading ? 'لطفاً چند لحظه صبر کنید.' : errorMessage || (isSuccess ? 'وضعیت تراکنش توسط سرور تایید شده است.' : isPending ? 'نتیجه نهایی هنوز از درگاه دریافت نشده است.' : 'تراکنش توسط سرور تایید نشده است.') }}
        </p>
      </div>

      <div class="p-8">
        <div class="space-y-4 mb-8">
          <div class="flex justify-between items-center py-3 border-b border-gray-50">
            <span class="text-gray-400 text-sm">شماره پیگیری:</span>
            <span class="text-gray-900 font-mono font-bold">{{ trackId || '---' }}</span>
          </div>
          <div v-if="transaction?.createdAt" class="flex justify-between items-center py-3 border-b border-gray-50">
            <span class="text-gray-400 text-sm">تاریخ:</span>
            <span class="text-gray-900 font-bold">{{ formatDate(new Date(transaction.createdAt)) }}</span>
          </div>
          <div class="flex justify-between items-center py-3">
            <span class="text-gray-400 text-sm">وضعیت نهایی:</span>
            <span :class="['font-bold', loading || isPending ? 'text-amber-600' : isSuccess ? 'text-green-600' : 'text-red-600']">
              {{ loading ? 'در حال استعلام' : isPending ? 'در انتظار تایید' : isSuccess ? 'تایید شده' : 'تایید نشده' }}
            </span>
          </div>
        </div>

        <div class="flex flex-col gap-3">
          <UButton v-if="isSuccess" to="/dashboard/orders" color="primary" size="xl" block>مشاهده سفارش‌های من</UButton>
          <UButton v-else-if="!loading" @click="loadTransaction" color="primary" size="xl" block>استعلام مجدد</UButton>
          <UButton to="/" variant="ghost" color="neutral" size="lg" block>بازگشت به صفحه اصلی</UButton>
        </div>
      </div>
    </div>
  </div>
</template>
