<script setup lang="ts">
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
  <slot v-else-if="props.allowed" />
  <div v-else class="panel-permission-state" role="status">
    <UIcon name="i-lucide-lock-keyhole" aria-hidden="true" />
    <h2>{{ title }}</h2>
    <p>{{ message }}</p>
  </div>
</template>
