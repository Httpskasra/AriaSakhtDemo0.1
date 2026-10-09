<template>
  <section class="transactions-page" dir="rtl">
    <PanelPageHeader title="تراکنش‌ها" subtitle="تاریخچه‌ی تراکنش‌های مالی حساب شما" icon="i-lucide-arrow-left-right">
      <template #actions><UButton icon="i-lucide-refresh-cw" variant="soft" :loading="pending" aria-label="به‌روزرسانی تراکنش‌ها" @click="fetchTransactions">به‌روزرسانی</UButton></template>
    </PanelPageHeader>

    <SharedAsyncState v-if="!isReady || pending" state="loading" />
    <SharedAsyncState v-else-if="error" state="error" :message="error" @retry="fetchTransactions" />
    <SharedAsyncState v-else-if="!transactions.length" state="empty" title="تراکنشی ثبت نشده است" message="تراکنش‌های مالی شما پس از ثبت در این بخش نمایش داده می‌شوند." />
    <template v-else>
      <PanelFilterBar>
        <TableFilterInput v-model="search" placeholder="جستجو در شرح، مرجع یا شناسه تراکنش" aria-label="جستجوی تراکنش" />
        <AppSelect v-model="typeFilter" :items="typeOptions" value-key="value" label-key="label" aria-label="فیلتر نوع تراکنش" class="filter-select" />
        <AppSelect v-model="statusFilter" :items="statusOptions" value-key="value" label-key="label" aria-label="فیلتر وضعیت تراکنش" class="filter-select" />
        <UButton v-if="hasFilters" variant="ghost" color="neutral" icon="i-lucide-x" @click="clearFilters">حذف فیلترها</UButton>
      </PanelFilterBar>
      <SharedAsyncState v-if="!filteredTransactions.length" state="empty" title="تراکنشی با این فیلتر پیدا نشد" message="فیلترها را تغییر دهید یا همه فیلترها را پاک کنید." />
      <PanelDataTable v-else :rows="filteredTransactions" :columns="[
        { key: 'type', label: 'نوع' },
        { key: 'amount', label: 'مبلغ' },
        { key: 'date', label: 'تاریخ' },
        { key: 'status', label: 'وضعیت' },
        { key: 'reference', label: 'شناسه مرجع', class: 'ltr' },
        { key: 'actions', label: 'عملیات' }
      ]" min-width="48rem">
        <template #type-data="{ row }"><span class="transaction-type"><UIcon :name="getTransactionPresentation(row).icon" aria-hidden="true" /><StatusPill :label="typeLabel(row)" :semantic="typeSemantic(row)" size="compact" /></span></template>
        <template #amount-data="{ row }"><span class="amount" :class="`amount--${getTransactionPresentation(row).direction}`"><b>{{ getTransactionAmountSign(row) }}</b>{{ formatAmount(row.amount) }}</span></template>
        <template #date-data="{ row }">{{ formatDate(row.createdAt || row.date || row.timestamp) }}</template>
        <template #status-data="{ row }"><StatusPill :label="statusLabel(row.status)" :semantic="statusSemantic(row.status)" size="compact" /></template>
        <template #reference-data="{ row }"><span class="reference">{{ referenceOf(row) }}</span></template>
        <template #actions-data="{ row }"><UButton size="xs" variant="soft" @click="selectedTransaction = row">جزئیات</UButton></template>
      </PanelDataTable>
    </template>
  </section>

  <BaseModal v-if="selectedTransaction" title-id="transaction-details-title" @close="selectedTransaction = null">
    <div class="transaction-details">
      <h2 id="transaction-details-title">جزئیات تراکنش</h2>
      <dl>
        <div><dt>نوع</dt><dd><span class="transaction-type"><UIcon :name="getTransactionPresentation(selectedTransaction).icon" aria-hidden="true" /><StatusPill :label="typeLabel(selectedTransaction)" :semantic="typeSemantic(selectedTransaction)" size="compact" /></span></dd></div>
        <div><dt>مبلغ</dt><dd class="amount" :class="`amount--${getTransactionPresentation(selectedTransaction).direction}`"><b>{{ getTransactionAmountSign(selectedTransaction) }}</b>{{ formatAmount(selectedTransaction.amount) }}</dd></div>
        <div><dt>وضعیت</dt><dd><StatusPill :label="statusLabel(selectedTransaction.status)" :semantic="statusSemantic(selectedTransaction.status)" size="compact" /></dd></div>
        <div><dt>شناسه مرجع</dt><dd class="reference">{{ referenceOf(selectedTransaction) }}</dd></div>
        <div><dt>تاریخ</dt><dd>{{ formatDate(selectedTransaction.createdAt || selectedTransaction.date || selectedTransaction.timestamp) }}</dd></div>
        <div><dt>موجودی پس از تراکنش</dt><dd>{{ formatAmount(selectedTransaction.resultingBalance ?? selectedTransaction.balanceAfter) }}</dd></div>
        <div><dt>شرح</dt><dd>{{ getTransactionDescription(selectedTransaction) }}</dd></div>
      </dl>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { Resource } from "~/types/permissions";
import { getTransactions } from "~/services/walletService";
import type { Transaction } from "~/services/walletService";
import { toUserFacingError } from "~/services/apiClient";
import { getTransactionAmountSign, getTransactionDescription, getTransactionPresentation, getTransactionSearchText } from "~/utils/transactionPresentation";

useHead({ title: "داشبورد | تراکنش‌ها" });

const { canRead, isReady } = useAccess(Resource.TRANSACTION);
const transactions = ref<Transaction[]>([]);
const pending = ref(false);
const error = ref("");
const search = ref("");
const typeFilter = ref("");
const statusFilter = ref("");
const selectedTransaction = ref<Transaction | null>(null);
let transactionsRequest: Promise<void> | null = null;
const typeOptions = [
  { label: "همه انواع", value: "" },
  { label: "واریز", value: "CREDIT" },
  { label: "کسر موجودی", value: "DEBIT" },
  { label: "رزرو مبلغ", value: "BLOCK" },
  { label: "آزادسازی مبلغ", value: "UNBLOCK" },
  { label: "بازگشت وجه", value: "REFUND" },
  { label: "انتقال", value: "TRANSFER" },
];
const statusOptions = [{ label: "همه وضعیت‌ها", value: "" }, { label: "در انتظار", value: "pending" }, { label: "موفق", value: "completed" }, { label: "ناموفق", value: "failed" }, { label: "بازگشت داده‌شده", value: "refunded" }];
const hasFilters = computed(() => Boolean(search.value.trim() || typeFilter.value || statusFilter.value));
const filteredTransactions = computed(() => {
  const query = search.value.trim().toLocaleLowerCase();
  return transactions.value.filter((transaction) => {
    const type = String(transaction.type || "").toUpperCase();
    const status = String(transaction.status || "").toLocaleLowerCase();
    const haystack = `${getTransactionSearchText(transaction)} ${transaction.reference || ""} ${transaction.transactionId || ""}`.toLocaleLowerCase();
    return (!typeFilter.value || type === typeFilter.value) && (!statusFilter.value || status === statusFilter.value) && (!query || haystack.includes(query));
  });
});

async function fetchTransactions() {
  if (transactionsRequest) return transactionsRequest;

  const request = (async () => {
    if (!canRead.value) return;
    pending.value = true; error.value = "";
    try { transactions.value = await getTransactions(); }
    catch (requestError) { transactions.value = []; error.value = toUserFacingError(requestError, "دریافت تراکنش‌ها انجام نشد.").message; }
    finally { pending.value = false; }
  })();

  transactionsRequest = request;
  try {
    await request;
  } finally {
    if (transactionsRequest === request) transactionsRequest = null;
  }
}
function clearFilters() { search.value = ""; typeFilter.value = ""; statusFilter.value = ""; }
function formatAmount(amount: unknown) { const value = Number(amount); return Number.isFinite(value) ? `${value.toLocaleString("fa-IR")} ریال` : "—"; }
function formatDate(value: unknown) { if (!value) return "—"; const date = new Date(String(value)); return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium", timeStyle: "short" }).format(date); }
function referenceOf(transaction: Transaction) { return transaction.reference || transaction.orderId || transaction.trackId || transaction.transactionId || transaction.localId || "—"; }
function typeLabel(transaction: Transaction) { return getTransactionPresentation(transaction).label; }
function typeSemantic(transaction: Transaction) { return getTransactionPresentation(transaction).semantic; }
function statusLabel(status: unknown) { return status === "success" || status === "completed" ? "موفق" : status === "failed" || status === "error" ? "ناموفق" : status === "pending" ? "در انتظار" : "نامشخص"; }
function statusSemantic(status: unknown) { return status === "success" || status === "completed" ? "success" : status === "failed" || status === "error" ? "danger" : status === "pending" ? "warning" : "neutral"; }
onMounted(() => { if (isReady.value) fetchTransactions(); });
watch(isReady, (ready) => { if (ready) fetchTransactions(); }, { once: true });
</script>

<style scoped>
.transactions-page { display: grid; gap: 1rem; }
.filter-select { min-width: 10rem; }
.amount, .reference, .ltr { direction: ltr; text-align: left; }
.amount { display: inline-flex; align-items: center; gap: .25rem; font-weight: var(--font-weight-bold); white-space: nowrap; }
.amount--in { color: var(--color-success-fg); }
.amount--out { color: var(--color-danger-fg); }
.amount--neutral { color: var(--color-text-body); }
.transaction-type { display: inline-flex; align-items: center; gap: .45rem; min-width: 9rem; }
.transaction-type > :first-child { width: 1rem; height: 1rem; color: var(--color-text-muted); }
.reference { font-size: .8rem; font-variant-numeric: lining-nums tabular-nums; }
.transaction-details { display: grid; gap: 1rem; }
.transaction-details h2 { margin: 0; color: var(--color-text-heading); font-size: 1.1rem; }
.transaction-details dl { display: grid; gap: .75rem; margin: 0; }
.transaction-details dl > div { display: grid; grid-template-columns: 8rem minmax(0, 1fr); gap: 1rem; padding-bottom: .7rem; border-bottom: 1px solid var(--color-border); }
.transaction-details dt { color: var(--color-text-muted); font-size: .85rem; }
.transaction-details dd { min-width: 0; margin: 0; color: var(--color-text-body); overflow-wrap: anywhere; }
@media (max-width: 600px) { .filter-select { min-width: 0; } .transaction-details dl > div { grid-template-columns: 1fr; gap: .25rem; } }
</style>
