<script setup lang="ts">
defineProps<{
  balance: number;
  blockedBalance: number;
  currency: string;
}>();
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <!-- Main Balance -->
    <div class="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-2xl text-white shadow-md relative overflow-hidden">
      <div class="relative z-10">
        <p class="text-sm opacity-80 mb-2">موجودی فعلی</p>
        <div class="flex items-baseline gap-2">
          <span class="text-3xl font-num font-iran-yekan-Bold">{{ balance.toLocaleString() }}</span>
          <span class="text-sm opacity-80">{{ currency }}</span>
        </div>
      </div>
      <!-- Ghost Background Icon -->
      <UIcon name="i-lucide-wallet" class="absolute -bottom-4 -right-4 size-32 opacity-10 rotate-12" />
    </div>

    <!-- Blocked Balance (Escrow) -->
    <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
      <div class="relative z-10 text-gray-800">
        <div class="flex items-center gap-1.5 mb-2">
          <p class="text-sm text-gray-500 font-medium">موجودی مسدود شده</p>
          <UTooltip text="این مبلغ برای سفارشات در جریان مسدود شده است.">
            <UIcon name="i-lucide-info" class="size-4 text-gray-400 cursor-help" />
          </UTooltip>
        </div>
        <div class="flex items-baseline gap-2">
          <span class="text-2xl font-num font-iran-yekan-Bold text-gray-600">{{ blockedBalance.toLocaleString() }}</span>
          <span class="text-sm text-gray-400">{{ currency }}</span>
        </div>
      </div>
      <UIcon name="i-lucide-lock" class="absolute -bottom-2 -right-2 size-20 text-gray-50 opacity-5" />
    </div>
  </div>
</template>
