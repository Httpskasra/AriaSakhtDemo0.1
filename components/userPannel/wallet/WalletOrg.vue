<script setup lang="ts">
import { getTransactions, getWallet } from '~/services/walletService';

const { data: wallet } = await useAsyncData('wallet-info', getWallet);
const { data: allTransactions } = await useAsyncData('wallet-transactions', getTransactions);

const filterPeriod = ref('all');
const periods = [
  { label: 'همه زمان‌ها', value: 'all' },
  { label: '۷ روز اخیر', value: '7' },
  { label: '۳۰ روز اخیر', value: '30' }
];

const filteredTransactions = computed(() => {
  if (filterPeriod.value === 'all') return allTransactions.value;
  const days = parseInt(filterPeriod.value);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  
  return (allTransactions.value || []).filter(tx => {
    const txDate = new Date(tx.createdAt || '');
    return txDate >= cutoff;
  });
});
</script>

<template>
  <div class="space-y-6">
    <UCard class="bg-gradient-to-br from-primary to-green-700 text-white">
      <div class="flex justify-between items-center">
        <div>
          <p class="opacity-80 text-sm mb-1">موجودی کیف پول</p>
          <h2 class="text-3xl font-bold">{{ wallet?.balance?.toLocaleString() || 0 }} {{ wallet?.currency || 'IRR' }}</h2>
        </div>
        <UButton color="white" variant="soft" icon="i-lucide-plus" size="lg">افزایش موجودی</UButton>
      </div>
      <div v-if="wallet?.blockedBalance" class="mt-4 pt-4 border-t border-white/20 text-sm">
        <span>موجودی مسدود شده (در انتظار تأیید): </span>
        <span class="font-bold">{{ wallet.blockedBalance.toLocaleString() }} {{ wallet.currency }}</span>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h3 class="font-bold">تاریخچه تراکنش‌ها</h3>
          <USelectMenu v-model="filterPeriod" :options="periods" class="w-40" />
        </div>
      </template>

      <UTable :rows="filteredTransactions || []" :columns="[
        { key: 'type', label: 'نوع' },
        { key: 'amount', label: 'مبلغ' },
        { key: 'createdAt', label: 'تاریخ' },
        { key: 'status', label: 'وضعیت' }
      ]">
        <template #createdAt-data="{ row }">
          {{ formatDate(row.createdAt) }}
        </template>
        <template #amount-data="{ row }">
          <span :class="row.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'">
            {{ row.type === 'CREDIT' ? '+' : '-' }}{{ row.amount.toLocaleString() }}
          </span>
        </template>
        <template #status-data="{ row }">
          <UBadge :color="row.status === 'completed' ? 'success' : 'warning'" variant="soft">
            {{ row.status === 'completed' ? 'موفق' : 'در جریان' }}
          </UBadge>
        </template>
      </UTable>
    </UCard>
  </div>
</template>
