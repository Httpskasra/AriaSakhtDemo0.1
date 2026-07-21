<template>
  <div class="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2 text-gray-500">
        <UIcon name="i-lucide-wallet" class="size-6 text-green-500" />
        <span class="text-sm font-bold">موجودی فعلی</span>
      </div>
      <div v-if="loading" class="h-8 w-24 bg-gray-200 animate-pulse rounded-md"></div>
      <div v-else class="flex items-baseline gap-1">
        <span class="text-2xl font-black text-gray-900 tracking-tighter">{{ formatNumber(wallet?.balance || 0) }}</span>
        <span class="text-xs font-bold text-gray-400">{{ currencyLabel }}</span>
      </div>
    </div>

    <!-- Blocked Balance indicator -->
    <div v-if="wallet?.blockedBalance > 0" class="mb-4 p-2 bg-amber-50 rounded-lg flex items-center justify-between">
      <span class="text-[10px] text-amber-700 font-medium flex items-center gap-1">
        <UIcon name="i-lucide-lock" class="size-3" />
        مبلغ در انتظار تایید (مسدود شده)
      </span>
      <span class="text-xs font-bold text-amber-900">{{ formatNumber(wallet.blockedBalance) }} {{ currencyLabel }}</span>
    </div>

    <div class="flex gap-2">
      <UButton
        block
        color="primary"
        variant="solid"
        size="md"
        class="font-bold"
        icon="i-lucide-plus-circle"
        @click="openChargeModal"
      >
        افزایش موجودی
      </UButton>
      <UButton
        block
        color="gray"
        variant="soft"
        size="md"
        class="font-bold"
        icon="i-lucide-history"
        @click="navigateTo('/dashboard/transactions')"
      >
        تراکنش‌ها
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  wallet: any
  loading?: boolean
}>()

const currencyLabel = computed(() => {
  const code = props.wallet?.currency || 'IRR'
  switch (code) {
    case 'IRR': return 'ریال'
    case 'TOM': return 'تومان'
    case 'USD': return 'دلار'
    default: return code
  }
})

const formatNumber = (val: number) => {
  return new Intl.NumberFormat('fa-IR').format(val)
}

const openChargeModal = () => {
  // Logic to open charge modal
}
</script>
