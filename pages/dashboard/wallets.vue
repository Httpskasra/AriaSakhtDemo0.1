<template>
  <section class="wallet-page" dir="rtl">
    <PanelPageHeader title="کیف پول" subtitle="موجودی و عملیات مالی حساب شما" icon="i-lucide-wallet">
      <template #actions><UButton icon="i-lucide-refresh-cw" variant="soft" :loading="walletLoading || transactionsLoading" aria-label="به‌روزرسانی کیف پول" @click="refreshWallet">به‌روزرسانی</UButton></template>
    </PanelPageHeader>

    <div class="wallet-overview">
      <div class="balance-card panel-surface">
        <SharedAsyncState v-if="!isReady || walletLoading" state="loading" :skeleton-rows="1" />
        <div v-else-if="!canRead" class="permission-state" role="status">
          <UIcon name="i-lucide-lock-keyhole" aria-hidden="true" />
          <strong>دسترسی به کیف پول محدود است</strong>
          <p>برای مشاهده موجودی و تراکنش‌ها، مجوز مشاهده کیف پول لازم است.</p>
        </div>
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
          <p v-if="!canUpdate" class="muted-note">مجوز انجام عملیات مالی برای حساب شما فعال نیست.</p>
        </div>
      </div>
    </div>

    <section class="banking-grid" aria-label="حساب بانکی و درخواست برداشت">
      <div class="bank-accounts-card panel-surface">
        <div class="section-heading banking-heading">
          <div>
            <span class="eyebrow">مقصد امن پرداخت</span>
            <h2>حساب‌های بانکی</h2>
            <p>برای برداشت، کارت و شماره شبای شما باید ابتدا توسط مدیریت تأیید شود.</p>
          </div>
          <UButton v-if="canUpdate" icon="i-lucide-plus" @click="openBankAccountModal">ثبت حساب بانکی</UButton>
        </div>
        <SharedAsyncState v-if="bankingLoading" state="loading" :skeleton-rows="2" />
        <SharedAsyncState v-else-if="bankingError" state="error" :message="bankingError" @retry="fetchBanking" />
        <div v-else-if="!bankAccounts.length" class="bank-empty" role="status">
          <UIcon name="i-lucide-landmark" aria-hidden="true" />
          <strong>هنوز حساب بانکی ثبت نکرده‌اید</strong>
          <p>یک حساب به نام خودتان ثبت کنید تا پس از تأیید، امکان ثبت درخواست برداشت فعال شود.</p>
          <UButton v-if="canUpdate" variant="soft" icon="i-lucide-plus" @click="openBankAccountModal">ثبت اولین حساب</UButton>
        </div>
        <div v-else class="bank-account-list">
          <article v-for="account in bankAccounts" :key="account.id" class="bank-account-item" :class="`bank-account-item--${account.status}`">
            <div class="bank-account-item__icon"><UIcon name="i-lucide-credit-card" aria-hidden="true" /></div>
            <div class="bank-account-item__content">
              <div class="bank-account-item__topline">
                <strong>{{ account.bankName || "حساب بانکی" }}</strong>
                <StatusPill :label="bankStatusLabel(account.status)" :semantic="bankStatusSemantic(account.status)" size="compact" />
              </div>
              <span>{{ account.accountHolderName }}</span>
              <div class="bank-account-item__numbers"><span class="ltr">{{ account.cardNumber }}</span><span class="ltr">{{ account.iban }}</span></div>
              <small v-if="account.status === 'pending'">درخواست شما در صف بررسی مدیریت است.</small>
              <small v-else-if="account.status === 'rejected'" class="bank-rejection">{{ account.rejectionReason || "این حساب تأیید نشد؛ اطلاعات را اصلاح و دوباره ثبت کنید." }}</small>
            </div>
            <UButton v-if="account.status !== 'approved'" color="error" variant="ghost" icon="i-lucide-trash-2" aria-label="حذف حساب بانکی" :disabled="bankingActionId === account.id" @click="removeBankAccountHandler(account)">حذف</UButton>
          </article>
        </div>
      </div>

      <div class="withdrawal-card panel-surface">
        <div class="section-heading">
          <div><span class="eyebrow">تسویه موجودی</span><h2>درخواست برداشت</h2><p>پس از ثبت، مبلغ تا پایان بررسی در موجودی قابل برداشت رزرو می‌شود.</p></div>
          <UIcon name="i-lucide-banknote-arrow-down" class="withdrawal-heading-icon" aria-hidden="true" />
        </div>
        <form v-if="canUpdate" class="withdrawal-form" @submit.prevent="submitWithdrawal">
          <UFormField label="حساب مقصد" required>
            <AppSelect v-model="withdrawalForm.bankAccountId" :items="approvedBankOptions" value-key="value" label-key="label" placeholder="حساب تأییدشده را انتخاب کنید" :disabled="!approvedBankOptions.length || withdrawalLoading" />
          </UFormField>
          <UFormField label="مبلغ برداشت (ریال)" required hint="مبلغ از موجودی قابل برداشت کسر و تا بررسی نهایی رزرو می‌شود.">
            <UInput v-model.number="withdrawalForm.amount" type="number" min="1" :max="wallet?.balance || 0" inputmode="numeric" :disabled="!approvedBankOptions.length || withdrawalLoading" />
          </UFormField>
          <UFormField label="شرح (اختیاری)">
            <UTextarea v-model="withdrawalForm.description" :rows="2" maxlength="240" placeholder="مثلاً تسویه فروش این ماه" :disabled="withdrawalLoading" />
          </UFormField>
          <p v-if="withdrawalError" class="form-error" role="alert">{{ withdrawalError }}</p>
          <UButton type="submit" color="error" icon="i-lucide-send" :loading="withdrawalLoading" :disabled="!approvedBankOptions.length">ثبت درخواست برداشت</UButton>
          <p v-if="!approvedBankOptions.length" class="muted-note">برای شروع برداشت، ابتدا یک حساب بانکی ثبت کنید و منتظر تأیید مدیریت بمانید.</p>
        </form>
        <p v-else class="muted-note">مجوز ثبت درخواست برداشت برای این حساب فعال نیست.</p>
      </div>
    </section>

    <section class="withdrawals-history panel-surface" aria-labelledby="withdrawals-history-title">
      <div class="section-heading"><div><h2 id="withdrawals-history-title">درخواست‌های برداشت من</h2><p>وضعیت بررسی و تسویه درخواست‌های شما</p></div></div>
      <SharedAsyncState v-if="bankingLoading" state="loading" :skeleton-rows="3" />
      <SharedAsyncState v-else-if="bankingError" state="error" :message="bankingError" @retry="fetchBanking" />
      <SharedAsyncState v-else-if="!withdrawals.length" state="empty" title="درخواست برداشتی ثبت نشده است" message="درخواست‌های جدید شما پس از ثبت در اینجا نمایش داده می‌شوند." />
      <div v-else class="withdrawal-list">
        <article v-for="request in withdrawals" :key="request.id" class="withdrawal-item">
          <div><strong class="ltr">{{ formatAmount(request.amount) }} {{ request.currency === "IRR" ? "ریال" : request.currency }}</strong><span>{{ request.bankAccount?.ibanMasked || "حساب بانکی ثبت‌شده" }}</span></div>
          <div><StatusPill :label="withdrawalStatusLabel(request.status)" :semantic="withdrawalStatusSemantic(request.status)" size="compact" /><small>{{ formatDate(request.createdAt) }}</small></div>
          <p v-if="request.rejectionReason" class="bank-rejection">{{ request.rejectionReason }}</p>
        </article>
      </div>
    </section>

    <div class="transactions-section panel-surface">
      <div class="section-heading"><div><h2>تاریخچه تراکنش‌ها</h2><p>آخرین تغییرات موجودی کیف پول</p></div></div>
      <SharedAsyncState v-if="!isReady || transactionsLoading" state="loading" :skeleton-rows="5" />
      <div v-else-if="!canRead" class="permission-state" role="status">
        <UIcon name="i-lucide-lock-keyhole" aria-hidden="true" />
        <strong>تاریخچه تراکنش‌ها قابل نمایش نیست</strong>
        <p>مجوز مشاهده تراکنش‌های کیف پول برای این حساب فعال نیست.</p>
      </div>
      <SharedAsyncState v-else-if="transactionsError" state="error" :message="transactionsError" @retry="fetchTransactions" />
      <template v-else>
        <PanelFilterBar><TableFilterInput v-model="search" placeholder="جستجو در شرح یا نوع تراکنش" aria-label="جستجوی تراکنش‌های کیف پول" /><UButton v-if="search" variant="ghost" color="neutral" icon="i-lucide-x" @click="search = ''">حذف جستجو</UButton></PanelFilterBar>
        <SharedAsyncState v-if="!filteredTransactions.length" state="empty" title="تراکنشی یافت نشد" message="هنوز تراکنشی برای این کیف پول ثبت نشده است." />
        <PanelDataTable v-else class="transactions-table" :rows="filteredTransactions" :columns="[
          { key: 'createdAt', label: 'تاریخ' },
          { key: 'type', label: 'نوع' },
          { key: 'amount', label: 'مبلغ' },
          { key: 'status', label: 'وضعیت' },
          { key: 'description', label: 'شرح' },
          { key: 'balanceAfter', label: 'موجودی پس از تراکنش' }
        ]" min-width="44rem">
          <template #createdAt-data="{ row }">{{ formatDate(row.createdAt) }}</template>
          <template #type-data="{ row }"><span class="transaction-type"><UIcon :name="transactionPresentation(row).icon" aria-hidden="true" /><StatusPill :label="transactionPresentation(row).label" :semantic="transactionPresentation(row).semantic" size="compact" /></span></template>
          <template #amount-data="{ row }"><span class="transaction-amount" :class="`transaction-amount--${transactionPresentation(row).direction}`"><b>{{ transactionAmountSign(row) }}</b><span class="ltr">{{ formatAmount(row.amount) }} {{ row.currency || wallet?.currency || 'ریال' }}</span></span></template>
          <template #status-data="{ row }"><StatusPill :label="transactionStatusLabel(row.status)" :semantic="transactionStatusSemantic(row.status)" size="compact" /></template>
          <template #description-data="{ row }"><span class="long-text">{{ transactionDescription(row) }}</span></template>
          <template #balanceAfter-data="{ row }"><span class="ltr">{{ formatAmount(row.balanceAfter ?? row.resultingBalance) }} {{ row.currency || wallet?.currency || 'ریال' }}</span></template>
        </PanelDataTable>
      </template>
    </div>
  </section>

  <BaseModal v-if="showCreditModal" title-id="credit-wallet-title" :busy="creditLoading" @close="closeCreditModal">
    <form class="wallet-form" @submit.prevent="creditWalletHandler">
      <h2 id="credit-wallet-title">شارژ کیف پول</h2>
      <div class="form-field"><label for="credit-amount">مبلغ ({{ wallet?.currency || "ریال" }})</label><UInput id="credit-amount" v-model.number="creditForm.amount" type="number" min="1001" inputmode="numeric" required /><small>حداقل مبلغ شارژ آنلاین ۱۰۰۱ ریال است.</small></div>
      <p v-if="errorMsg" class="form-error" role="alert">{{ errorMsg }}</p>
      <div class="modal-actions"><UButton type="button" color="neutral" variant="soft" :disabled="creditLoading" @click="closeCreditModal">انصراف</UButton><UButton type="submit" :loading="creditLoading">شارژ کیف پول</UButton></div>
    </form>
  </BaseModal>

  <BaseModal v-if="showBankAccountModal" title-id="bank-account-title" :busy="bankAccountLoading" @close="closeBankAccountModal">
    <form class="wallet-form" @submit.prevent="submitBankAccount">
      <div><span class="eyebrow">ثبت برای برداشت</span><h2 id="bank-account-title">افزودن حساب بانکی</h2><p class="modal-help">حساب باید به نام صاحب حساب کاربری باشد. پس از ثبت، مدیریت اطلاعات را بررسی می‌کند.</p></div>
      <UFormField label="نام صاحب حساب" required><UInput v-model="bankAccountForm.accountHolderName" autocomplete="name" placeholder="مطابق نام حساب بانکی" /></UFormField>
      <UFormField label="شماره کارت" required hint="۱۶ رقم، بدون فاصله یا با فاصله قابل ورود است."><UInput v-model="bankAccountForm.cardNumber" inputmode="numeric" autocomplete="cc-number" placeholder="مثلاً 6037991234567890" /></UFormField>
      <UFormField label="شماره شبا" required hint="با IR یا فقط ۲۴ رقم شبا وارد کنید."><UInput v-model="bankAccountForm.iban" dir="ltr" inputmode="latin" placeholder="IR820540102680020817909002" /></UFormField>
      <UFormField label="نام بانک (اختیاری)"><UInput v-model="bankAccountForm.bankName" placeholder="مثلاً بانک ملت" /></UFormField>
      <p v-if="bankAccountError" class="form-error" role="alert">{{ bankAccountError }}</p>
      <div class="modal-actions"><UButton type="button" color="neutral" variant="soft" :disabled="bankAccountLoading" @click="closeBankAccountModal">انصراف</UButton><UButton type="submit" :loading="bankAccountLoading">ثبت برای بررسی</UButton></div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useAccess } from "~/composables/useAccess";
import { Resource } from "~/types/permissions";
import type { Transaction } from "~/services/walletService";
import { getTransactions, getWallet, initiateWalletTopUp } from "~/services/walletService";
import { toUserFacingError } from "~/services/apiClient";
import { getValidatedPaymentUrl } from "~/utils/paymentRedirect";
import { getTransactionAmountSign, getTransactionDescription, getTransactionPresentation, getTransactionSearchText } from "~/utils/transactionPresentation";
import {
  createWithdrawal,
  listMyBankAccounts,
  listMyWithdrawals,
  registerBankAccount,
  removeBankAccount,
  type BankAccount,
  type BankAccountStatus,
  type WithdrawalRequest,
  type WithdrawalStatus,
} from "~/services/bankingService";

useHead({ title: "داشبورد | کیف پول" });

const feedback = useFeedback();
const { canUpdate, canRead, isReady } = useAccess(Resource.WALLETS);
type Wallet = { balance: number; blockedBalance?: number; currency?: string };
const wallet = ref<Wallet | null>(null);
const transactions = ref<Transaction[]>([]);
const search = ref("");
const walletLoading = ref(false);
const transactionsLoading = ref(false);
const walletError = ref("");
const transactionsError = ref("");
const showCreditModal = ref(false);
const creditLoading = ref(false);
const errorMsg = ref("");
const creditForm = ref({ amount: 0 });
const bankAccounts = ref<BankAccount[]>([]);
const withdrawals = ref<WithdrawalRequest[]>([]);
const bankingLoading = ref(false);
const bankingError = ref("");
const bankAccountLoading = ref(false);
const bankAccountError = ref("");
const withdrawalLoading = ref(false);
const withdrawalError = ref("");
const bankingActionId = ref<string | null>(null);
const showBankAccountModal = ref(false);
const bankAccountForm = reactive({ accountHolderName: "", cardNumber: "", iban: "", bankName: "" });
const withdrawalForm = reactive({ bankAccountId: "", amount: 0, description: "" });
let walletRequest: Promise<void> | null = null;

const filteredTransactions = computed(() => {
  const query = search.value.trim().toLocaleLowerCase();
  return transactions.value.filter((transaction) => !query || getTransactionSearchText(transaction).includes(query));
});

const approvedBankOptions = computed(() => bankAccounts.value
  .filter((account) => account.status === "approved")
  .map((account) => ({ value: account.id, label: `${account.bankName || "حساب بانکی"} — ${account.cardNumberMasked}` })));

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
async function fetchBanking() {
  if (!canRead.value) return;
  bankingLoading.value = true;
  bankingError.value = "";
  try {
    const [accounts, requests] = await Promise.all([listMyBankAccounts(), listMyWithdrawals()]);
    bankAccounts.value = accounts;
    withdrawals.value = requests;
    if (!approvedBankOptions.value.some((option) => option.value === withdrawalForm.bankAccountId)) {
      withdrawalForm.bankAccountId = approvedBankOptions.value[0]?.value || "";
    }
  } catch (error) {
    bankAccounts.value = [];
    withdrawals.value = [];
    bankingError.value = toUserFacingError(error, "دریافت اطلاعات حساب بانکی انجام نشد.").message;
  } finally {
    bankingLoading.value = false;
  }
}
async function refreshWallet() {
  if (walletRequest) return walletRequest;
  const request = Promise.all([fetchWallet(), fetchTransactions(), fetchBanking()]).then(() => undefined);
  walletRequest = request;
  try {
    await request;
  } finally {
    if (walletRequest === request) walletRequest = null;
  }
}

function openCreditModal() { if (!canUpdate.value) return; creditForm.value.amount = 0; errorMsg.value = ""; showCreditModal.value = true; }
function closeCreditModal() { if (creditLoading.value) return; showCreditModal.value = false; errorMsg.value = ""; }

function openBankAccountModal() {
  if (!canUpdate.value) return;
  Object.assign(bankAccountForm, { accountHolderName: "", cardNumber: "", iban: "", bankName: "" });
  bankAccountError.value = "";
  showBankAccountModal.value = true;
}
function closeBankAccountModal() {
  if (bankAccountLoading.value) return;
  showBankAccountModal.value = false;
  bankAccountError.value = "";
}
async function submitBankAccount() {
  if (!canUpdate.value) return;
  bankAccountLoading.value = true;
  bankAccountError.value = "";
  try {
    await registerBankAccount({ ...bankAccountForm });
    showBankAccountModal.value = false;
    await fetchBanking();
    feedback.success("حساب بانکی ثبت شد", "پس از تأیید مدیریت، امکان برداشت فعال می‌شود.");
  } catch (error) {
    bankAccountError.value = toUserFacingError(error, "ثبت حساب بانکی انجام نشد.").message;
  } finally {
    bankAccountLoading.value = false;
  }
}
async function removeBankAccountHandler(account: BankAccount) {
  if (!canUpdate.value || bankingActionId.value) return;
  if (!window.confirm("این حساب بانکی حذف شود؟")) return;
  bankingActionId.value = account.id;
  try {
    await removeBankAccount(account.id);
    await fetchBanking();
    feedback.success("حساب بانکی حذف شد", "");
  } catch (error) {
    bankingError.value = toUserFacingError(error, "حذف حساب بانکی انجام نشد.").message;
  } finally {
    bankingActionId.value = null;
  }
}
async function submitWithdrawal() {
  if (!canUpdate.value) return;
  withdrawalError.value = "";
  if (!withdrawalForm.bankAccountId) { withdrawalError.value = "یک حساب بانکی تأییدشده انتخاب کنید."; return; }
  if (!Number.isInteger(withdrawalForm.amount) || withdrawalForm.amount <= 0) { withdrawalError.value = "مبلغ برداشت باید عددی بزرگ‌تر از صفر باشد."; return; }
  if (withdrawalForm.amount > (wallet.value?.balance || 0)) { withdrawalError.value = "موجودی قابل برداشت کافی نیست."; return; }
  withdrawalLoading.value = true;
  try {
    await createWithdrawal({ bankAccountId: withdrawalForm.bankAccountId, amount: withdrawalForm.amount, description: withdrawalForm.description.trim() || undefined });
    withdrawalForm.amount = 0;
    withdrawalForm.description = "";
    await refreshWallet();
    feedback.success("درخواست برداشت ثبت شد", "مبلغ تا پایان بررسی مدیریت رزرو شده است.");
  } catch (error) {
    withdrawalError.value = toUserFacingError(error, "ثبت درخواست برداشت انجام نشد.").message;
  } finally {
    withdrawalLoading.value = false;
  }
}

function bankStatusLabel(status: BankAccountStatus) { return status === "approved" ? "تأییدشده" : status === "rejected" ? "ردشده" : "در انتظار بررسی"; }
function bankStatusSemantic(status: BankAccountStatus) { return status === "approved" ? "success" : status === "rejected" ? "danger" : "warning"; }
function withdrawalStatusLabel(status: WithdrawalStatus) { return status === "paid" ? "پرداخت‌شده" : status === "approved" ? "تأیید برداشت" : status === "rejected" ? "ردشده" : "در انتظار بررسی"; }
function withdrawalStatusSemantic(status: WithdrawalStatus) { return status === "paid" ? "success" : status === "rejected" ? "danger" : "warning"; }
function transactionPresentation(transaction: Transaction) { return getTransactionPresentation(transaction); }
function transactionAmountSign(transaction: Transaction) { return getTransactionAmountSign(transaction); }
function transactionDescription(transaction: Transaction) { return getTransactionDescription(transaction); }
function transactionStatusLabel(status: unknown) { return status === "completed" || status === "success" ? "موفق" : status === "failed" || status === "error" ? "ناموفق" : status === "pending" ? "در انتظار" : status === "refunded" ? "بازگشت داده‌شده" : "نامشخص"; }
function transactionStatusSemantic(status: unknown) { return status === "completed" || status === "success" ? "success" : status === "failed" || status === "error" ? "danger" : status === "pending" ? "warning" : status === "refunded" ? "info" : "neutral"; }

async function creditWalletHandler() {
  if (!canUpdate.value || creditForm.value.amount < 1001) { errorMsg.value = "مبلغ شارژ باید بیشتر از ۱۰۰۰ ریال باشد."; return; }
  creditLoading.value = true; errorMsg.value = "";
  try {
    const response = await initiateWalletTopUp({ amount: creditForm.value.amount });
    const paymentUrl = getValidatedPaymentUrl(response.paymentUrl);
    if (!paymentUrl) throw new Error("آدرس درگاه پرداخت از سرور دریافت نشد.");
    showCreditModal.value = false;
    window.location.assign(paymentUrl);
  }
  catch (error) { errorMsg.value = toUserFacingError(error, "شارژ کیف پول انجام نشد.").message; }
  finally { creditLoading.value = false; }
}
onMounted(() => { if (isReady.value) refreshWallet(); });
watch(isReady, (ready) => { if (ready) refreshWallet(); }, { once: true });
</script>

<style scoped>
.wallet-page { display: grid; gap: 1rem; min-width: 0; }
.wallet-overview { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(18rem, .9fr); gap: 1rem; }
.banking-grid { display: grid; grid-template-columns: minmax(0, 1.08fr) minmax(18rem, .92fr); gap: 1rem; }
.balance-card, .wallet-action-card, .bank-accounts-card, .withdrawal-card, .withdrawals-history, .transactions-section { padding: 1.25rem; }
.balance-content { display: flex; justify-content: space-between; align-items: center; gap: 1rem; min-height: 8rem; }
.balance-content > div { display: grid; gap: .4rem; }
.eyebrow { color: var(--color-text-muted); font-size: .85rem; }
.balance-content strong { color: var(--color-brand-blue); font-size: clamp(1.7rem, 4vw, 2.5rem); line-height: 1.2; }
.currency { color: var(--color-text-muted); font-size: .85rem; }
.balance-icon { width: 3rem; height: 3rem; color: var(--color-brand-blue); opacity: .8; }
.wallet-action-card { display: grid; gap: 1rem; }
.bank-accounts-card, .withdrawal-card, .withdrawals-history { display: grid; gap: 1rem; }
.banking-heading { align-items: flex-start; }
.banking-heading h2, .withdrawal-card h2 { margin: .25rem 0 0; color: var(--color-text-heading); font-size: 1.1rem; }
.bank-accounts-card p, .withdrawal-card p, .withdrawals-history p { margin: .35rem 0 0; color: var(--color-text-muted); font-size: .85rem; }
.bank-account-list, .withdrawal-list { display: grid; gap: .7rem; }
.bank-account-item { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: .75rem; padding: .85rem; border: 1px solid var(--color-border); border-radius: var(--radius-card); background: var(--color-bg-light); }
.bank-account-item__icon { display: grid; place-items: center; width: 2.75rem; height: 2.75rem; border-radius: 50%; color: var(--color-brand-blue); background: var(--color-info-bg); }
.bank-account-item__content { display: grid; gap: .25rem; min-width: 0; }
.bank-account-item__topline, .bank-account-item__numbers { display: flex; align-items: center; justify-content: space-between; gap: .75rem; flex-wrap: wrap; }
.bank-account-item__numbers { justify-content: flex-start; color: var(--color-text-muted); font-size: .78rem; }
.bank-account-item small, .withdrawal-item small { color: var(--color-text-muted); font-size: .75rem; }
.bank-rejection { color: var(--color-danger-fg) !important; }
.bank-empty { display: grid; justify-items: center; gap: .45rem; padding: 1.5rem 1rem; color: var(--color-text-muted); text-align: center; }
.bank-empty > :first-child { width: 2rem; height: 2rem; color: var(--color-brand-blue); }
.bank-empty strong { color: var(--color-text-heading); }
.bank-empty p { max-width: 28rem; margin: 0; }
.withdrawal-heading-icon { width: 2rem; height: 2rem; color: var(--color-brand-blue); }
.withdrawal-form { display: grid; gap: .85rem; }
.withdrawal-form > :deep(.app-select), .withdrawal-form > :deep(.form-field) { width: 100%; }
.withdrawal-form > :deep(button) { justify-self: start; }
.withdrawal-item { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: .3rem 1rem; padding: .85rem 0; border-bottom: 1px solid var(--color-border); }
.withdrawal-item:last-child { border-bottom: 0; }
.withdrawal-item > div { display: grid; gap: .25rem; }
.withdrawal-item > div:last-of-type { justify-items: end; }
.withdrawal-item strong { color: var(--color-text-heading); }
.withdrawal-item span { color: var(--color-text-muted); font-size: .78rem; }
.withdrawal-item p { grid-column: 1 / -1; margin: .2rem 0 0; }
.modal-help { margin: .35rem 0 0; color: var(--color-text-muted); font-size: .8rem; line-height: 1.7; }
.wallet-action-card h2, .transactions-section h2, .wallet-form h2 { margin: 0; color: var(--color-text-heading); font-size: 1.05rem; }
.wallet-action-card p, .transactions-section p { margin: .35rem 0 0; color: var(--color-text-muted); font-size: .85rem; }
.wallet-actions { display: flex; align-items: center; flex-wrap: wrap; gap: .65rem; }
.muted-note { margin: 0; }
.permission-state { display: grid; justify-items: center; gap: .5rem; min-height: 8rem; padding: 1.25rem; color: var(--color-text-muted); text-align: center; }
.permission-state > :first-child { color: var(--color-warning-fg); font-size: 1.4rem; }
.permission-state strong { color: var(--color-text-heading); }
.permission-state p { max-width: 34rem; margin: 0; font-size: .85rem; }
.section-heading { margin-bottom: 1rem; }
.ltr { direction: ltr; text-align: right; }
.long-text { display: block; max-width: 18rem; overflow: hidden; text-overflow: ellipsis; }
.transactions-table :deep(table) { min-width: 52rem; }
.transactions-table :deep(th), .transactions-table :deep(td) { vertical-align: middle; }
.transaction-type { display: inline-flex; align-items: center; gap: .45rem; min-width: 9rem; }
.transaction-type > :first-child { width: 1rem; height: 1rem; color: var(--color-text-muted); }
.transaction-amount { display: inline-flex; align-items: center; gap: .25rem; font-weight: 700; white-space: nowrap; }
.transaction-amount b { font-size: 1rem; }
.transaction-amount--in { color: var(--color-success-fg); }
.transaction-amount--out { color: var(--color-danger-fg); }
.transaction-amount--neutral { color: var(--color-text-body); }
.wallet-form { display: grid; gap: 1rem; }
.form-field { display: grid; gap: .4rem; }
.form-field label { color: var(--color-text-heading); font-size: .85rem; font-weight: 600; }
.form-field small { color: var(--color-text-muted); font-size: .75rem; }
.form-error { margin: 0; padding: .65rem .75rem; color: var(--color-danger-fg); background: var(--color-danger-bg); border-radius: var(--radius-field); font-size: .82rem; }
@media (max-width: 900px) { .wallet-overview, .banking-grid { grid-template-columns: 1fr; } }
@media (max-width: 560px) {
  .balance-card, .wallet-action-card, .bank-accounts-card, .withdrawal-card, .withdrawals-history, .transactions-section { padding: 1rem; }
  .balance-content { align-items: flex-start; flex-direction: column-reverse; }
  .balance-content > div { width: 100%; }
  .wallet-actions { flex-direction: column; align-items: stretch; }
  .wallet-actions :deep(button) { width: 100%; }
  .modal-actions { flex-direction: column-reverse; }
  .wallet-form { min-width: 0; }
  .bank-account-item { grid-template-columns: auto minmax(0, 1fr); }
  .bank-account-item > :last-child { grid-column: 2; justify-self: start; }
  .bank-account-item__numbers { flex-direction: column; align-items: flex-start; }
  .withdrawal-item { grid-template-columns: 1fr; }
  .withdrawal-item > div:last-of-type { justify-items: start; }
}
</style>
