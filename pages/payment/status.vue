<script setup lang="ts">
import { useRoute } from 'vue-router';
import { formatDate } from '~/utils/date';

const route = useRoute();
const isSuccess = route.query.success === '1' || route.query.success === 'true' || route.query.success === 'OK';
const trackId = route.query.trackId as string;
const today = new Date();

definePageMeta({
  layout: 'default'
});
</script>

<template>
  <div class="min-h-[60vh] flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 transform transition-all hover:scale-[1.01]">
      <!-- Status Header -->
      <div :class="['py-12 flex flex-col items-center justify-center text-white relative', isSuccess ? 'bg-green-500' : 'bg-red-500']">
        <div class="absolute inset-0 opacity-10 pointer-events-none">
          <UIcon name="i-lucide-activity" class="size-64 -rotate-12 translate-x-10 translate-y-10" />
        </div>
        
        <div class="bg-white/20 p-4 rounded-full backdrop-blur-md mb-4 border border-white/30 animate-bounce">
          <UIcon 
            :name="isSuccess ? 'i-lucide-check-circle' : 'i-lucide-x-circle'" 
            class="size-16"
          />
        </div>
        <h1 class="text-3xl font-black mb-2">{{ isSuccess ? 'پرداخت موفق' : 'پرداخت ناموفق' }}</h1>
        <p class="text-white/80 font-medium">{{ isSuccess ? 'سفارش شما با موفقیت ثبت و تایید شد' : 'مشکلی در فرآیند پرداخت به وجود آمده است' }}</p>
      </div>

      <!-- Details Body -->
      <div class="p-8">
        <div class="space-y-4 mb-8">
          <div class="flex justify-between items-center py-3 border-b border-gray-50">
            <span class="text-gray-400 text-sm">شماره پیگیری (تراکنش):</span>
            <span class="text-gray-900 font-mono font-bold">{{ trackId || '---' }}</span>
          </div>
          <div class="flex justify-between items-center py-3 border-b border-gray-50">
            <span class="text-gray-400 text-sm">تاریخ:</span>
            <span class="text-gray-900 font-bold">{{ formatDate(today) }}</span>
          </div>
          <div class="flex justify-between items-center py-3">
            <span class="text-gray-400 text-sm">وضعیت نهایی:</span>
            <span :class="['font-bold', isSuccess ? 'text-green-600' : 'text-red-600']">
              {{ isSuccess ? 'تایید شده' : 'برگشت خورده' }}
            </span>
          </div>
        </div>

        <!-- Feedback Messages -->
        <div v-if="!isSuccess" class="bg-red-50 p-4 rounded-xl mb-8 flex gap-3 items-start border border-red-100 text-red-700 text-sm leading-relaxed">
          <UIcon name="i-lucide-bell" class="size-5 shrink-0 mt-0.5" />
          <p>اگر مبلغی از حساب شما کسر شده است، نهایتاً تا ۷۲ ساعت آینده به صورت خودکار توسط بانک بازگشت داده خواهد شد.</p>
        </div>
        <div v-else class="bg-green-50 p-4 rounded-xl mb-8 flex gap-3 items-start border border-green-100 text-green-700 text-sm leading-relaxed">
          <UIcon name="i-lucide-activity" class="size-5 shrink-0 mt-0.5" />
          <p>تجاریس هم‌اکنون در حال آماده‌سازی سفارش شماست. وضعیت ارسال را می‌توانید از پنل کاربری دنبال کنید.</p>
        </div>

        <!-- Actions -->
        <div class="flex flex-col gap-3">
          <UButton 
            v-if="isSuccess"
            to="/dashboard/orders" 
            color="primary" 
            size="xl" 
            block
            class="rounded-xl shadow-lg shadow-primary-200"
          >
            مشاهده سفارش‌های من
          </UButton>
          <UButton 
            v-else
            to="/cart" 
            color="error" 
            size="xl" 
            block
            class="rounded-xl shadow-lg shadow-red-200"
          >
            تلاش مجدد در سبد خرید
          </UButton>
          
          <UButton 
            to="/" 
            variant="ghost" 
            color="neutral" 
            size="lg" 
            block
            class="rounded-xl"
          >
            بازگشت به صفحه اصلی
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>
