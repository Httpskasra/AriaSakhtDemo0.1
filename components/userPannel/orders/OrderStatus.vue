<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  status: string
}>()

interface StatusConfig {
  label: string
  color: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'
  icon: string
}

const statusMap: Record<string, StatusConfig> = {
  pending: {
    label: 'در انتظار پرداخت',
    color: 'warning',
    icon: 'i-lucide-clock'
  },
  paid: {
    label: 'پرداخت شده',
    color: 'info',
    icon: 'i-lucide-check-circle-2'
  },
  shipped: {
    label: 'ارسال شده',
    color: 'secondary',
    icon: 'i-lucide-truck'
  },
  delivered: {
    label: 'تحویل شده',
    color: 'success',
    icon: 'i-lucide-package-check'
  },
  completed: {
    label: 'تکمیل شده',
    color: 'primary',
    icon: 'i-lucide-award'
  },
  refunded: {
    label: 'مرجوع شده',
    color: 'neutral',
    icon: 'i-lucide-rotate-ccw'
  },
  failed: {
    label: 'ناموفق',
    color: 'error',
    icon: 'i-lucide-alert-circle'
  }
}

const config = computed(() => {
  return statusMap[props.status.toLowerCase()] || {
    label: props.status,
    color: 'neutral',
    icon: 'i-lucide-help-circle'
  }
})
</script>

<template>
  <UBadge
    :color="config.color"
    variant="subtle"
    class="flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium"
  >
    <UIcon :name="config.icon" class="size-3.5" />
    <span>{{ config.label }}</span>
  </UBadge>
</template>
