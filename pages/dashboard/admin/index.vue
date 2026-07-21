
<template>
  <div class="space-y-6">
    <!-- Overview Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <UCard v-for="stat in stats" :key="stat.label">
        <div class="flex items-center gap-4">
          <div :class="`p-3 rounded-lg ${stat.color} text-white`">
            <UIcon :name="stat.icon" class="size-6" />
          </div>
          <div>
            <p class="text-sm text-gray-500">{{ stat.label }}</p>
            <p class="text-2xl font-bold text-gray-800">{{ stat.value }}</p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Main Grid -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <!-- Wallet & Financials -->
      <div class="xl:col-span-1">
        <AdminWalletOrg />
      </div>

      <!-- Inventory Management -->
      <div class="xl:col-span-2">
        <AdminInventory />
      </div>

      <!-- Recent Orders -->
      <div class="xl:col-span-3">
        <AdminOrdersOrg />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'dashboard-auth'
});

const stats = [
  { label: 'کل محصولات', value: '۱۲۸', icon: 'i-lucide-package', color: 'bg-blue-500' },
  { label: 'سفارشات جدید', value: '۱۵', icon: 'i-lucide-shopping-cart', color: 'bg-green-500' },
  { label: 'تیکت‌های باز', value: '۴', icon: 'i-lucide-message-square', color: 'bg-yellow-500' },
  { label: 'موجودی کل (تومان)', value: '۸۵,۰۰۰,۰۰۰', icon: 'i-lucide-wallet', color: 'bg-purple-500' }
];
</script>
