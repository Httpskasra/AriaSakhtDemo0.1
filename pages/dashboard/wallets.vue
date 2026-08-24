<template>
  <section class="wallet-page" dir="rtl">
    <PanelPageHeader title="کیف پول" subtitle="موجودی و عملیات مالی حساب شما" icon="i-lucide-wallet">
      <template #actions><UButton icon="i-lucide-refresh-cw" variant="soft" :loading="walletLoading || transactionsLoading" aria-label="به‌روزرسانی کیف پول" @click="refreshWallet">به‌روزرسانی</UButton></template>
    </PanelPageHeader>

    <div class="wallet-overview">
      <div class="balance-card panel-surface">
        <SharedAsyncState v-if="!isReady || walletLoading" state="loading" :skeleton-rows="1" />
        <SharedAsyncState v-else-if="walletError" state="error" :message="walletError" @retry="fetchWallet" />
        <div v-else class="balance-content">
          <div><span class="eyebrow">موجودی قابل استفاده</span><strong>{{ formatAmount(wallet?.balance) }}</strong><span class="currency">{{ wallet?.currency || "ریال" }}</span></div>
          <UIcon name="i-lucide-wallet-cards" class="balance-icon" aria-hidden="true" />
        </div>
      </div>
      <div class="wallet-action-card panel-surface">
        <div><h2>عملیات کیف پول</h2><p>عملیات مالی مجاز را از این بخش انجام دهید.</p></div>
        <div class="wallet-actions">
          <UButton v-if="canUpdate" icon="i-lucide-plus-circle" @click="openCreditModal">شارژ کیف پول</UButton>
          <UButton v-if="canUpdate" color="error" variant="soft" icon="i-lucide-minus-circle" @click="openDebitModal">برداشت</UButton>
          <p v-if="!canUpdate" class="muted-note">مجوز انجام عملیات مالی برای حساب شما فعال نیست.</p>
        </div>
      </div>
    </div>

    <div class="transactions-section panel-surface">
      <div class="section-heading"><div><h2>تاریخچه تراکنش‌ها</h2><p>آخرین تغییرات موجودی کیف پول</p></div></div>
      <SharedAsyncState v-if="!isReady || transactionsLoading" state="loading" :skeleton-rows="5" />
      <SharedAsyncState v-else-if="transactionsError" state="error" :message="transactionsError" @retry="fetchTransactions" />
      <template v-else>
        <PanelFilterBar><TableFilterInput v-model="search" placeholder="جستجو در شرح یا نوع تراکنش" aria-label="جستجوی تراکنش‌های کیف پول" /><UButton v-if="search" variant="ghost" color="neutral" icon="i-lucide-x" @click="search = ''">حذف جستجو</UButton></PanelFilterBar>
        <SharedAsyncState v-if="!filteredTransactions.length" state="empty" title="تراکنشی یافت نشد" message="هنوز تراکنشی برای این کیف پول ثبت نشده است." />
        <PanelDataTable v-else :rows="filteredTransactions" :columns="[
          { key: 'createdAt', label: 'تاریخ' },
          { key: 'type', label: 'نوع' },
          { key: 'amount', label: 'مبلغ' },
          { key: 'description', label: 'شرح' },
          { key: 'balanceAfter', label: 'موجودی پس از تراکنش' }
        ]" min-width="44rem">
          <template #createdAt-data="{ row }">{{ formatDate(row.createdAt) }}</template>
          <template #type-data="{ row }"><StatusPill :label="row.type === 'credit' ? 'شارژ' : 'برداشت'" :semantic="row.type === 'credit' ? 'success' : 'danger'" size="compact" /></template>
          <template #amount-data="{ row }"><span class="ltr">{{ formatAmount(row.amount) }} {{ wallet?.currency || 'ریال' }}</span></template>
          <template #description-data="{ row }"><span class="long-text">{{ row.description || "—" }}</span></template>
          <template #balanceAfter-data="{ row }"><span class="ltr">{{ formatAmount(row.balanceAfter) }} {{ wallet?.currency || 'ریال' }}</span></template>
        </PanelDataTable>
      </template>
    </div>
  </section>

  <BaseModal v-if="showCreditModal" title-id="credit-wallet-title" :busy="creditLoading" @close="closeCreditModal">
    <form class="wallet-form" @submit.prevent="creditWalletHandler">
      <h2 id="credit-wallet-title">شارژ کیف پول</h2>
      <div class="form-field"><label for="credit-amount">مبلغ ({{ wallet?.currency || "ریال" }})</label><UInput id="credit-amount" v-model.number="creditForm.amount" type="number" min="1" required /></div>
      <p v-if="errorMsg" class="form-error" role="alert">{{ errorMsg }}</p>
      <div class="modal-actions"><UButton type="button" color="neutral" variant="soft" :disabled="creditLoading" @click="closeCreditModal">انصراف</UButton><UButton type="submit" :loading="creditLoading">شارژ کیف پول</UButton></div>
    </form>
  </BaseModal>

  <BaseModal v-if="showDebitModal" title-id="debit-wallet-title" :busy="debitLoading" @close="closeDebitModal">
    <form class="wallet-form" @submit.prevent="debitWalletHandler">
      <h2 id="debit-wallet-title">برداشت از کیف پول</h2>
      <div class="form-field"><label for="debit-amount">مبلغ ({{ wallet?.currency || "ریال" }})</label><UInput id="debit-amount" v-model.number="debitForm.amount" type="number" min="1" :max="wallet?.balance || 0" required /></div>
      <div class="form-field"><label for="debit-description">شرح (اختیاری)</label><UTextarea id="debit-description" v-model="debitForm.description" :rows="3" /></div>
      <p v-if="errorMsg" class="form-error" role="alert">{{ errorMsg }}</p>
      <div class="modal-actions"><UButton type="button" color="neutral" variant="soft" :disabled="debitLoading" @click="closeDebitModal">انصراف</UButton><UButton type="submit" color="error" :loading="debitLoading">برداشت</UButton></div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useAccess } from "~/composables/useAccess";
import { Resource } from "~/types/permissions";
import { creditWallet, debitWallet, getTransactions, getWallet } from "~/services/walletService";
import { toUserFacingError } from "~/services/apiClient";

useHead({ title: "داشبورد | کیف پول" });

const feedback = useFeedback();
const { canUpdate, canRead, isReady } = useAccess(Resource.WALLETS);
type Wallet = { balance: number; currency?: string };
type Transaction = { type: "credit" | "debit"; amount: number; description?: string; balanceAfter?: number; createdAt?: string };
const wallet = ref<Wallet | null>(null);
const transactions = ref<Transaction[]>([]);
const search = ref("");
const walletLoading = ref(false);
const transactionsLoading = ref(false);
const walletError = ref("");
const transactionsError = ref("");
const showCreditModal = ref(false);
const showDebitModal = ref(false);
const creditLoading = ref(false);
const debitLoading = ref(false);
const errorMsg = ref("");
const creditForm = ref({ amount: 0 });
const debitForm = ref({ amount: 0, description: "" });

const filteredTransactions = computed(() => {
  const query = search.value.trim().toLocaleLowerCase();
  return transactions.value.filter((transaction) => !query || `${transaction.description || ""} ${transaction.type}`.toLocaleLowerCase().includes(query));
});

const formatAmount = (amount?: number) => typeof amount === "number" ? amount.toLocaleString("fa-IR") : "—";
const formatDate = (date?: string) => date ? new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(date)) : "—";

async function fetchWallet() {
  if (!canRead.value) return;
  walletLoading.value = true; walletError.value = "";
  try { wallet.value = await getWallet(); }
  catch (error) { wallet.value = null; walletError.value = toUserFacingError(error, "دریافت کیف پول انجام نشد.").message; }
  finally { walletLoading.value = false; }
}
async function fetchTransactions() {
  if (!canRead.value) return;
  transactionsLoading.value = true; transactionsError.value = "";
  try { transactions.value = await getTransactions(); }
  catch (error) { transactions.value = []; transactionsError.value = toUserFacingError(error, "دریافت تراکنش‌ها انجام نشد.").message; }
  finally { transactionsLoading.value = false; }
}
async function refreshWallet() { await Promise.all([fetchWallet(), fetchTransactions()]); }

function openCreditModal() { if (!canUpdate.value) return; creditForm.value.amount = 0; errorMsg.value = ""; showCreditModal.value = true; }
function closeCreditModal() { if (creditLoading.value) return; showCreditModal.value = false; errorMsg.value = ""; }
function openDebitModal() { if (!canUpdate.value) return; debitForm.value = { amount: 0, description: "" }; errorMsg.value = ""; showDebitModal.value = true; }
function closeDebitModal() { if (debitLoading.value) return; showDebitModal.value = false; errorMsg.value = ""; }

async function creditWalletHandler() {
  if (!canUpdate.value || creditForm.value.amount <= 0) { errorMsg.value = "مبلغ باید بزرگ‌تر از صفر باشد."; return; }
  creditLoading.value = true; errorMsg.value = "";
  try { await creditWallet({ amount: creditForm.value.amount }); await refreshWallet(); showCreditModal.value = false; feedback.success("شارژ انجام شد", "کیف پول با موفقیت شارژ شد."); }
  catch (error) { errorMsg.value = toUserFacingError(error, "شارژ کیف پول انجام نشد.").message; }
  finally { creditLoading.value = false; }
}
async function debitWalletHandler() {
  if (!canUpdate.value || debitForm.value.amount <= 0) { errorMsg.value = "مبلغ باید بزرگ‌تر از صفر باشد."; return; }
  if ((wallet.value?.balance || 0) < debitForm.value.amount) { errorMsg.value = "موجودی کیف پول کافی نیست."; return; }
  debitLoading.value = true; errorMsg.value = "";
  try { await debitWallet({ amount: debitForm.value.amount }); await refreshWallet(); showDebitModal.value = false; feedback.success("برداشت انجام شد", "درخواست برداشت با موفقیت ثبت شد."); }
  catch (error) { errorMsg.value = toUserFacingError(error, "برداشت از کیف پول انجام نشد.").message; }
  finally { debitLoading.value = false; }
}
onMounted(() => { if (isReady.value) refreshWallet(); });
watch(isReady, (ready) => { if (ready) refreshWallet(); }, { once: true });
</script>

<style scoped>
.wallet-page { display: grid; gap: 1rem; }
.wallet-overview { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(18rem, .9fr); gap: 1rem; }
.balance-card, .wallet-action-card, .transactions-section { padding: 1.25rem; }
.balance-content { display: flex; justify-content: space-between; align-items: center; gap: 1rem; min-height: 8rem; }
.balance-content > div { display: grid; gap: .4rem; }
.eyebrow { color: var(--color-text-muted); font-size: .85rem; }
.balance-content strong { color: var(--color-brand-blue); font-size: clamp(1.7rem, 4vw, 2.5rem); line-height: 1.2; }
.currency { color: var(--color-text-muted); font-size: .85rem; }
.balance-icon { width: 3rem; height: 3rem; color: var(--color-brand-blue); opacity: .8; }
.wallet-action-card { display: grid; gap: 1rem; }
.wallet-action-card h2, .transactions-section h2, .wallet-form h2 { margin: 0; color: var(--color-text-heading); font-size: 1.05rem; }
.wallet-action-card p, .transactions-section p { margin: .35rem 0 0; color: var(--color-text-muted); font-size: .85rem; }
.wallet-actions { display: flex; align-items: center; flex-wrap: wrap; gap: .65rem; }
.muted-note { margin: 0; }
.section-heading { margin-bottom: 1rem; }
.ltr { direction: ltr; text-align: right; }
.long-text { display: block; max-width: 18rem; overflow: hidden; text-overflow: ellipsis; }
.wallet-form { display: grid; gap: 1rem; }
.form-field { display: grid; gap: .4rem; }
.form-field label { color: var(--color-text-heading); font-size: .85rem; font-weight: 600; }
.form-error { margin: 0; padding: .65rem .75rem; color: var(--color-danger-fg); background: var(--color-danger-bg); border-radius: var(--radius-field); font-size: .82rem; }
@media (max-width: 800px) { .wallet-overview { grid-template-columns: 1fr; } }
@media (max-width: 560px) { .balance-card, .wallet-action-card, .transactions-section { padding: 1rem; } .balance-content { align-items: flex-start; } .wallet-actions { flex-direction: column; align-items: stretch; } .modal-actions { flex-direction: column-reverse; } }
</style>
