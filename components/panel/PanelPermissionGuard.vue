<script setup lang="ts">
const { authUnavailable, isAuthenticated } = useUser();
const props = withDefaults(defineProps<{
  allowed: boolean;
  ready?: boolean;
  title?: string;
  message?: string;
}>(), {
  ready: true,
  title: "دسترسی به این بخش امکان‌پذیر نیست",
  message: "حساب کاربری شما مجوز لازم برای مشاهده این بخش را ندارد.",
});
</script>

<template>
  <div v-if="!props.ready" class="panel-permission-state" role="status" aria-live="polite">
    <UIcon name="i-lucide-loader-circle" class="panel-permission-state__spinner" aria-hidden="true" />
    <span>در حال بررسی دسترسی…</span>
  </div>
  <div v-else-if="authUnavailable && !isAuthenticated" class="panel-permission-state" role="alert">
    <UIcon name="i-lucide-cloud-off" aria-hidden="true" />
    <h2>بررسی حساب کاربری انجام نشد</h2>
    <p>ارتباط با سرویس ورود موقتاً برقرار نیست. لطفاً چند لحظه بعد دوباره تلاش کنید.</p>
  </div>
  <slot v-else-if="props.allowed" />
  <div v-else class="panel-permission-state" role="status">
    <UIcon name="i-lucide-lock-keyhole" aria-hidden="true" />
    <h2>{{ title }}</h2>
    <p>{{ message }}</p>
  </div>
</template>
