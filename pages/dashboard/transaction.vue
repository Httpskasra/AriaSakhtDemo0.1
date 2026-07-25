<template>
  <NuxtLayout name="dashboard">
    <div class="container">
      <!-- عنوان صفحه -->
      <div class="title">
        <div class="title-left">
          <h1>تراکنش‌ها</h1>
          <p class="subtitle">لیست تراکنش‌های کیف پول شما</p>
        </div>
        <div class="title-right">
          <!-- <button class="refresh-btn" @click="refresh">بروزرسانی لیست</button> -->
        </div>
      </div>

      <!-- فیلتر و سرچ شبیه users -->
      <div class="filter-bar">
        <div class="filter-left">
          <USelect
            v-model="typeFilter"
            :items="[
              { label: 'نوع تراکنش (همه)', value: '' },
              { label: 'واریز', value: 'credit' },
              { label: 'برداشت', value: 'debit' },
              { label: 'انتقال', value: 'transfer' }
            ]" />

          <USelect
            v-model="statusFilter"
            :items="[
              { label: 'وضعیت (همه)', value: '' },
              { label: 'در انتظار', value: 'pending' },
              { label: 'موفق', value: 'success' },
              { label: 'ناموفق', value: 'failed' }
            ]" />
        </div>

        <div class="filter-right">
          <TableFilterInput
            v-model="search"
            placeholder="جستجو در توضیحات، مرجع، شناسه تراکنش ..." />
        </div>
      </div>

      <SharedAsyncState v-if="pending" state="loading" />
      <SharedAsyncState
        v-else-if="error"
        state="error"
        message="خطا در دریافت تراکنش‌ها. لطفاً دوباره تلاش کنید."
        @retry="fetchTransactions" />

      <!-- جدول تراکنش‌ها -->
      <div v-else-if="canRead" class="premium-card border border-gray-100 overflow-hidden">
  <TableScrollContainer>
    <UTable :rows="transactionRows" :columns="transactionColumns" class="min-w-[42rem]">
          <template #type-data="{ row }">
            <StatusPill
              v-bind="getTransactionTypeConfig(row.type)"
              size="compact" />
          </template>
          <template #amount-data="{ row }">
            <span class="amount">{{ formatAmount(row.amount) }}</span>
          </template>
          <template #date-data="{ row }">
            {{ formatDate(row.createdAt || row.date || row.timestamp) }}
          </template>
          <template #status-data="{ row }">
            <StatusPill
              v-bind="getTransactionStatusConfig(row.status || 'unknown')"
              size="compact" />
          </template>
          <template #reference-data="{ row }">
            <span class="ref">{{ row.reference || row.orderId || row.trackId || "-" }}</span>
          </template>
    </UTable>
  </TableScrollContainer>
        <SharedAsyncState
          v-if="filteredTransactions.length === 0"
          state="empty"
          title="تراکنشی پیدا نشد"
          message="هیچ تراکنشی برای نمایش وجود ندارد." />
      </div>
      <SharedAsyncState
        v-else
        state="error"
        title="دسترسی ندارید"
        message="شما اجازه دسترسی ندارید." />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { Resource } from "~/types/permissions";
definePageMeta({
  middleware: ["auth", "permission"],
  permission: { resource: "transaction", action: "r" },
});
const { canRead } = useAccess(Resource.TRANSACTION);
/**
 * گرفتن دیتای تراکنش‌ها از API طبق Swagger:
 * GET /api/transaction  →  array of Transaction
 */
const data = ref<any[]>([]);
const pending = ref(false);
const error = ref<any>(null);

const search = ref("");
const typeFilter = ref("");
const statusFilter = ref("");
const transactionColumns = [
  { key: "rowNumber", label: "#" },
  { key: "type", label: "نوع" },
  { key: "amount", label: "مبلغ" },
  { key: "date", label: "تاریخ" },
  { key: "status", label: "وضعیت" },
  { key: "reference", label: "شناسه مرجع" },
];

// تابع برای دریافت تراکنش‌ها
const fetchTransactions = async () => {
  pending.value = true;
  error.value = null;
  try {
    const { $axios } = useNuxtApp();
    const response = await $axios.get("/transaction");
    data.value = response.data || [];
  } catch (err) {
    error.value = err;
    console.error("Error fetching transactions:", err);
  } finally {
    pending.value = false;
  }
};

// تابع بروزرسانی

// در هنگام mount، داده‌ها را دریافت کن
onMounted(() => {
  fetchTransactions();
});

const transactions = computed(() => data.value || []);

// فیلتر نهایی (سرچ + نوع + وضعیت)
const filteredTransactions = computed(() => {
  return transactions.value.filter((tx: any) => {
    if (!tx) return false;

    // فیلتر نوع
    if (
      typeFilter.value &&
      (tx.type || "").toLowerCase() !== typeFilter.value.toLowerCase()
    ) {
      return false;
    }

    // فیلتر وضعیت
    if (
      statusFilter.value &&
      (tx.status || "").toLowerCase() !== statusFilter.value.toLowerCase()
    ) {
      return false;
    }

    // فیلتر سرچ
    if (!search.value) return true;

    const haystack = [
      tx.type,
      tx.status,
      tx.reference,
      tx.orderId,
      tx.description,
      tx.transactionId,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(search.value.toLowerCase());
  });
});

const transactionRows = computed(() =>
  filteredTransactions.value.map((tx: any, index) => ({
    ...tx,
    rowNumber: index + 1,
  }))
);

// فرمت مبلغ
const formatAmount = (amount: any) => {
  if (amount == null) return "-";
  const num = Number(amount);
  if (Number.isNaN(num)) return amount;
  try {
    return new Intl.NumberFormat("fa-IR", {
      style: "currency",
      currency: "IRR",
      maximumFractionDigits: 0,
    }).format(num);
  } catch {
    return num.toLocaleString("fa-IR") + " ریال";
  }
};

// فرمت تاریخ
const formatDate = (value: any) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("fa-IR");
};
</script>

<style scoped>
.container {
  padding: 1.5rem;
}

/* عنوان صفحه (مثل users / tickets) */
.title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.title-left h1 {
  font-size: 1.4rem;
  font-weight: 700;
}

.subtitle {
  margin-top: 0.25rem;
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.title-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* نوار فیلتر و سرچ */
.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.filter-left {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

/* کارت‌ها */
.card {
  background: white;
  border-radius: var(--radius-card);
  padding: 1rem 1.25rem;
  box-shadow: var(--shadow-raised);
  font-size: 0.9rem;
}

.info-card {
  color: var(--color-text-body);
}

.error-card {
  color: var(--color-danger-fg);
  border: 1px solid var(--color-danger-bg);
}

.table-card {
  padding: 0;
  overflow: visible;
  -webkit-overflow-scrolling: touch;
}

/* جدول */
.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 0.75rem 1rem;
  text-align: right;
  font-size: 0.85rem;
}

.table thead {
  background: #f9fafb;
}

.table tbody tr:nth-child(even) {
  background: #f9fafb;
}

.table tbody tr:hover {
  background: #eff6ff;
}

/* مبلغ و مرجع */
.amount {
  direction: ltr;
  font-family: inherit;
}

.ref {
  /* Monospace is intentional for transaction reference identifiers. */
  font-family: monospace;
  font-size: 0.8rem;
}

/* خالی بودن لیست */
.empty-state {
  padding: 1.25rem;
  text-align: center;
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

/* ریسپانسیو */
@media (max-width: 768px) {
  .title {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .filter-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-right {
    justify-content: stretch;
  }

  .table th,
  .table td {
    padding-inline: 0.5rem;
  }
}
</style>
