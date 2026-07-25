<script setup lang="ts">
import { useOrders } from '~/composables/useOrders';
import { useUser } from '~/composables/useUser';
import { confirmDelivery } from '~/services/orderService';
import { getValidatedPaymentUrl } from '~/utils/paymentRedirect';

const { orders, loading, updating, fetchOrders } = useOrders();
const { user } = useUser();

onMounted(() => {
  fetchOrders();
});

const handlePayment = async (orderId: string, amount: number) => {
  const { $axios } = useNuxtApp();
  try {
    const response = await $axios.post('/payment/initiate', {
      orderId,
      amount
    });
    const paymentUrl = getValidatedPaymentUrl(response.data.paymentUrl);
    if (!paymentUrl) {
      throw new Error('آدرس درگاه پرداخت نامعتبر است');
    }
    window.location.assign(paymentUrl);
  } catch (err: any) {
    useToast().add({
      title: 'خطا در اتصال به درگاه',
      description: err.response?.data?.message || 'مشکلی در ایجاد تراکنش پیش آمد',
      color: 'red'
    });
  }
};

const handleConfirmDelivery = async (orderId: string) => {
  try {
    await confirmDelivery(orderId);
    useToast().add({
      title: 'موفقیت',
      description: 'تحویل کالا با موفقیت تایید شد. مبلغ به حساب فروشنده واریز گردید.',
      color: 'success'
    });
    fetchOrders();
  } catch (err: any) {
    useToast().add({
      title: 'خطا',
      description: err.message || 'عملیات با خطا مواجه شد',
      color: 'red'
    });
  }
};
</script>

<template>
  <div class="space-y-6">
    <!-- C5: Full-page action overlay -->
    <UModal v-model="updating" prevent-close>
      <div class="p-12 flex flex-col items-center justify-center space-y-6 text-center">
        <UIcon name="i-lucide-loader-circle" class="w-16 h-16 animate-spin text-primary" />
        <div>
          <h3 class="text-xl font-bold mb-2">در حال پردازش...</h3>
          <p class="text-gray-500">لطفاً تا اتمام عملیات و دریافت تاییدیه منتظر بمانید.</p>
        </div>
      </div>
    </UModal>

    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold">سفارش‌های من</h2>
      <UButton icon="i-lucide-rotate-cw" color="gray" variant="ghost" @click="fetchOrders" :loading="loading">
        بروزرسانی لیست
      </UButton>
    </div>

    <SharedAsyncState v-if="loading && orders.length === 0" state="loading" :skeleton-rows="3" />

    <div v-else-if="orders.length === 0" class="bg-white rounded-card p-12 flex flex-col items-center text-center">
      <div class="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mb-6">
        <UIcon name="i-lucide-shopping-bag" class="w-16 h-16 text-gray-200" />
      </div>
      <h3 class="text-xl font-bold text-gray-900 mb-2">سفارشی یافت نشد</h3>
      <p class="text-gray-500 mb-6">هنوز هیچ سفارشی در تجاریس ثبت نکرده‌اید.</p>
      <UButton size="lg" to="/products">مشاهده کالاها</UButton>
    </div>

    <div v-else class="grid gap-4">
      <div v-for="order in orders" :key="order.id" class="bg-white rounded-card border border-gray-100 p-5 hover:shadow-md transition-shadow">
        <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-blue-50 rounded-field">
              <UIcon name="i-lucide-hash" class="size-icon-action text-blue-600" />
            </div>
            <div>
              <div class="text-xs text-gray-400 font-medium font-num">شماره سفارش: {{ order.id }}</div>
              <div class="text-sm font-bold font-num">{{ formatDate(order.createdAt) }}</div>
            </div>
          </div>
          <OrderStatus :status="order.status" />
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 py-4 border-t border-gray-50">
          <div>
            <div class="text-xs text-gray-400 mb-1">مبلغ کل</div>
            <div class="font-bold text-blue-600 font-num">{{ order.totalPrice.toLocaleString() }} <span class="text-[10px] font-medium">ریال</span></div>
          </div>
          <div>
            <div class="text-xs text-gray-400 mb-1">تعداد اقلام</div>
            <div class="font-bold font-num">{{ order.items.length }} قلم</div>
          </div>
          <div>
            <div class="text-xs text-gray-400 mb-1">روش پرداخت</div>
            <div class="font-medium text-sm">{{ order.paymentMethod || 'پرداخت آنلاین' }}</div>
          </div>
        </div>

        <div class="mt-4 pt-4 border-t border-gray-50 flex justify-end gap-3">
          <UButton v-if="order.status === 'pending'" color="primary" @click="handlePayment(order.id, order.totalPrice)">
            پرداخت آنلاین
          </UButton>
          <UButton v-if="order.status === 'delivered'" color="green" variant="soft" @click="handleConfirmDelivery(order.id)">
            تایید تحویل و آزادسازی وجه
          </UButton>
          <UButton color="gray" variant="ghost" :to="`/dashboard/orders/${order.id}`">
            مشاهده جزئیات
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>
