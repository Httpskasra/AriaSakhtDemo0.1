<script setup lang="ts">
import { getTransactions, getWallet } from '~/services/walletService';
import { useWalletStore } from '~/stores/wallet';
import AsyncState from '~/components/shared/AsyncState.vue';

const walletStore = useWalletStore();
const { data: walletResponse, error: walletError, pending: walletPending, refresh: refreshWallet } = await useAsyncData('wallet-info', getWallet);
const { data: transactionsResponse, error: transactionError, pending: transactionsPending, refresh: refreshTransactions } = await useAsyncData('wallet-transactions', getTransactions);
watch(walletResponse, (value) => walletStore.setWallet(value ?? null), { immediate: true });
watch(transactionsResponse, (value) => walletStore.setTransactions(value ?? []), { immediate: true });
const retry = async () => { await Promise.all([refreshWallet(), refreshTransactions()]); };

const filterPeriod = ref('all');
const periods = [
  { label: 'همه زمان‌ها', value: 'all' },
  { label: '۷ روز اخیر', value: '7' },
  { label: '۳۰ روز اخیر', value: '30' }
];

const filteredTransactions = computed(() => {
  if (filterPeriod.value === 'all') return walletStore.transactions;
  const days = parseInt(filterPeriod.value);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  
  return walletStore.transactions.filter(tx => {
    const txDate = new Date(tx.createdAt || '');
    return txDate >= cutoff;
  });
});
</script>

<template>
  <div class="space-y-6">
    <AsyncState v-if="walletPending || transactionsPending" state="loading" />
    <AsyncState v-else-if="walletError || transactionError" state="error" @retry="retry" />
    <template v-else>
    <UCard class="bg-gradient-to-br from-primary to-green-700 text-white">
      <div class="flex justify-between items-center">
        <div>
          <p class="opacity-80 text-sm mb-1">موجودی کیف پول</p>
          <h2 class="text-3xl font-bold">{{ walletStore.wallet?.balance?.toLocaleString() || 0 }} {{ walletStore.wallet?.currency || 'IRR' }}</h2>
        </div>
        <UButton color="white" variant="soft" icon="i-lucide-plus" size="lg">افزایش موجودی</UButton>
      </div>
      <div v-if="walletStore.wallet?.blockedBalance" class="mt-4 pt-4 border-t border-white/20 text-sm">
        <span>موجودی مسدود شده (در انتظار تأیید): </span>
        <span class="font-bold">{{ walletStore.wallet.blockedBalance.toLocaleString() }} {{ walletStore.wallet.currency }}</span>
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
          <StatusPill
            :label="row.status === 'completed' ? 'موفق' : 'در جریان'"
            :semantic="row.status === 'completed' ? 'success' : 'warning'"
            size="compact" />
        </template>
      </UTable>
    </UCard>
    </template>
  </div>
</template>
