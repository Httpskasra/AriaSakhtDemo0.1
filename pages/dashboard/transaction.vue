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
        <USelect v-model="typeFilter" :items="typeOptions" value-key="value" label-key="label" aria-label="فیلتر نوع تراکنش" class="filter-select" />
        <USelect v-model="statusFilter" :items="statusOptions" value-key="value" label-key="label" aria-label="فیلتر وضعیت تراکنش" class="filter-select" />
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
        <template #type-data="{ row }"><StatusPill :label="typeLabel(row.type)" :semantic="typeSemantic(row.type)" size="compact" /></template>
        <template #amount-data="{ row }"><span class="amount">{{ formatAmount(row.amount) }}</span></template>
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
        <div><dt>نوع</dt><dd><StatusPill :label="typeLabel(selectedTransaction.type)" :semantic="typeSemantic(selectedTransaction.type)" size="compact" /></dd></div>
        <div><dt>مبلغ</dt><dd class="amount">{{ formatAmount(selectedTransaction.amount) }}</dd></div>
        <div><dt>وضعیت</dt><dd><StatusPill :label="statusLabel(selectedTransaction.status)" :semantic="statusSemantic(selectedTransaction.status)" size="compact" /></dd></div>
        <div><dt>شناسه مرجع</dt><dd class="reference">{{ referenceOf(selectedTransaction) }}</dd></div>
        <div><dt>تاریخ</dt><dd>{{ formatDate(selectedTransaction.createdAt || selectedTransaction.date || selectedTransaction.timestamp) }}</dd></div>
        <div><dt>شرح</dt><dd>{{ selectedTransaction.description || "—" }}</dd></div>
      </dl>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { Resource } from "~/types/permissions";
import { getTransactions } from "~/services/walletService";
import { toUserFacingError } from "~/services/apiClient";

useHead({ title: "داشبورد | تراکنش‌ها" });

const { canRead, isReady } = useAccess(Resource.TRANSACTION);
type Transaction = Record<string, any>;
const transactions = ref<Transaction[]>([]);
const pending = ref(false);
const error = ref("");
const search = ref("");
const typeFilter = ref("");
const statusFilter = ref("");
const selectedTransaction = ref<Transaction | null>(null);
const typeOptions = [{ label: "همه انواع", value: "" }, { label: "واریز", value: "credit" }, { label: "برداشت", value: "debit" }, { label: "انتقال", value: "transfer" }];
const statusOptions = [{ label: "همه وضعیت‌ها", value: "" }, { label: "در انتظار", value: "pending" }, { label: "موفق", value: "success" }, { label: "ناموفق", value: "failed" }];
const hasFilters = computed(() => Boolean(search.value.trim() || typeFilter.value || statusFilter.value));
const filteredTransactions = computed(() => {
  const query = search.value.trim().toLocaleLowerCase();
  return transactions.value.filter((transaction) => {
    const type = String(transaction.type || "").toLocaleLowerCase();
    const status = String(transaction.status || "").toLocaleLowerCase();
    const haystack = [transaction.type, transaction.status, transaction.reference, transaction.orderId, transaction.trackId, transaction.description, transaction.transactionId, transaction.localId].filter(Boolean).join(" ").toLocaleLowerCase();
    return (!typeFilter.value || type === typeFilter.value) && (!statusFilter.value || status === statusFilter.value) && (!query || haystack.includes(query));
  });
});

async function fetchTransactions() {
  if (!canRead.value) return;
  pending.value = true; error.value = "";
  try { transactions.value = await getTransactions(); }
  catch (requestError) { transactions.value = []; error.value = toUserFacingError(requestError, "دریافت تراکنش‌ها انجام نشد.").message; }
  finally { pending.value = false; }
}
function clearFilters() { search.value = ""; typeFilter.value = ""; statusFilter.value = ""; }
function formatAmount(amount: unknown) { const value = Number(amount); return Number.isFinite(value) ? `${value.toLocaleString("fa-IR")} ریال` : "—"; }
function formatDate(value: unknown) { if (!value) return "—"; const date = new Date(String(value)); return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium", timeStyle: "short" }).format(date); }
function referenceOf(transaction: Transaction) { return transaction.reference || transaction.orderId || transaction.trackId || transaction.transactionId || transaction.localId || "—"; }
function typeLabel(type: unknown) { return type === "credit" ? "واریز" : type === "debit" ? "برداشت" : type === "transfer" ? "انتقال" : "نامشخص"; }
function typeSemantic(type: unknown) { return type === "credit" ? "success" : type === "debit" ? "danger" : "info"; }
function statusLabel(status: unknown) { return status === "success" || status === "completed" ? "موفق" : status === "failed" || status === "error" ? "ناموفق" : status === "pending" ? "در انتظار" : "نامشخص"; }
function statusSemantic(status: unknown) { return status === "success" || status === "completed" ? "success" : status === "failed" || status === "error" ? "danger" : status === "pending" ? "warning" : "neutral"; }
onMounted(() => { if (isReady.value) fetchTransactions(); });
watch(isReady, (ready) => { if (ready) fetchTransactions(); }, { once: true });
</script>

<style scoped>
.transactions-page { display: grid; gap: 1rem; }
.filter-select { min-width: 10rem; }
.amount, .reference, .ltr { direction: ltr; text-align: left; }
.reference { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: .8rem; }
.transaction-details { display: grid; gap: 1rem; }
.transaction-details h2 { margin: 0; color: var(--color-text-heading); font-size: 1.1rem; }
.transaction-details dl { display: grid; gap: .75rem; margin: 0; }
.transaction-details dl > div { display: grid; grid-template-columns: 8rem minmax(0, 1fr); gap: 1rem; padding-bottom: .7rem; border-bottom: 1px solid var(--color-border); }
.transaction-details dt { color: var(--color-text-muted); font-size: .85rem; }
.transaction-details dd { min-width: 0; margin: 0; color: var(--color-text-body); overflow-wrap: anywhere; }
@media (max-width: 600px) { .filter-select { min-width: 0; } .transaction-details dl > div { grid-template-columns: 1fr; gap: .25rem; } }
</style>
