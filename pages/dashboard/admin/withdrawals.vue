<template>
  <section class="banking-admin-page" dir="rtl">
    <PanelPageHeader title="حساب‌های بانکی و برداشت‌ها" subtitle="تأیید حساب مقصد و مدیریت امن درخواست‌های تسویه کاربران" icon="i-lucide-landmark">
      <template #actions><UButton icon="i-lucide-refresh-cw" variant="soft" :loading="loading" @click="fetchCurrent">به‌روزرسانی</UButton></template>
    </PanelPageHeader>

    <PanelPermissionGuard :allowed="canManage" :ready="isReady">
      <div class="banking-admin-tabs" role="tablist" aria-label="بخش‌های مالی">
        <button type="button" role="tab" :aria-selected="activeTab === 'accounts'" :class="{ 'is-active': activeTab === 'accounts' }" @click="switchTab('accounts')"><UIcon name="i-lucide-credit-card" aria-hidden="true" />حساب‌های بانکی</button>
        <button type="button" role="tab" :aria-selected="activeTab === 'withdrawals'" :class="{ 'is-active': activeTab === 'withdrawals' }" @click="switchTab('withdrawals')"><UIcon name="i-lucide-banknote-arrow-down" aria-hidden="true" />درخواست‌های برداشت</button>
      </div>

      <PanelFilterBar>
        <div class="filter-copy"><strong>{{ activeTab === 'accounts' ? 'صف بررسی حساب‌های بانکی' : 'صف بررسی برداشت‌ها' }}</strong><span>موارد در انتظار بررسی را سریع‌تر پیدا کنید.</span></div>
        <AppSelect v-model="statusFilter" :items="activeTab === 'accounts' ? accountStatusOptions : withdrawalStatusOptions" value-key="value" label-key="label" aria-label="فیلتر وضعیت" @update:model-value="fetchCurrent" />
      </PanelFilterBar>

      <div class="banking-admin-card panel-surface">
        <SharedAsyncState v-if="loading" state="loading" :skeleton-rows="5" />
        <SharedAsyncState v-else-if="errorMessage" state="error" :message="errorMessage" @retry="fetchCurrent" />
        <SharedAsyncState v-else-if="activeTab === 'accounts' && !accounts.length" state="empty" title="حسابی برای بررسی وجود ندارد" message="حساب‌های جدید کاربران در این بخش نمایش داده می‌شوند." />
        <SharedAsyncState v-else-if="activeTab === 'withdrawals' && !withdrawals.length" state="empty" title="درخواستی برای بررسی وجود ندارد" message="درخواست‌های برداشت کاربران در این بخش نمایش داده می‌شوند." />

        <div v-else-if="activeTab === 'accounts'" class="responsive-table-wrap">
          <table class="banking-table"><caption class="sr-only">حساب‌های بانکی کاربران</caption><thead><tr><th>صاحب حساب</th><th>بانک</th><th>شماره کارت</th><th>شبا</th><th>وضعیت</th><th>ثبت</th><th>عملیات</th></tr></thead>
            <tbody><tr v-for="account in accounts" :key="account.id"><td><strong>{{ account.accountHolderName }}</strong><small class="ltr">{{ account.userId }}</small></td><td>{{ account.bankName || '—' }}</td><td class="ltr">{{ account.cardNumber }}</td><td class="ltr">{{ account.iban }}</td><td><StatusPill :label="bankStatusLabel(account.status)" :semantic="bankStatusSemantic(account.status)" /></td><td>{{ formatDate(account.createdAt) }}</td><td><div class="row-actions"><UButton v-if="account.status === 'pending'" size="sm" color="success" icon="i-lucide-check" @click="openBankReview(account, 'approved')">تأیید</UButton><UButton v-if="account.status === 'pending'" size="sm" color="error" variant="soft" icon="i-lucide-x" @click="openBankReview(account, 'rejected')">رد</UButton><UButton size="sm" variant="soft" icon="i-lucide-eye" @click="openBankDetails(account)">مشاهده</UButton></div></td></tr></tbody>
          </table>
        </div>

        <div v-else class="responsive-table-wrap">
          <table class="banking-table"><caption class="sr-only">درخواست‌های برداشت</caption><thead><tr><th>کاربر</th><th>مبلغ</th><th>حساب مقصد</th><th>وضعیت</th><th>ثبت</th><th>عملیات</th></tr></thead>
            <tbody><tr v-for="request in withdrawals" :key="request.id"><td><strong class="ltr">{{ request.userId }}</strong><small>{{ request.description || 'بدون شرح' }}</small></td><td><strong class="ltr">{{ formatAmount(request.amount) }} {{ request.currency === 'IRR' ? 'ریال' : request.currency }}</strong></td><td><span>{{ request.bankAccount?.bankName || '—' }}</span><small class="ltr">{{ request.bankAccount?.ibanMasked || '—' }}</small></td><td><StatusPill :label="withdrawalStatusLabel(request.status)" :semantic="withdrawalStatusSemantic(request.status)" /></td><td>{{ formatDate(request.createdAt) }}</td><td><div class="row-actions"><UButton size="sm" variant="soft" icon="i-lucide-eye" @click="openWithdrawalDetails(request)">مشاهده</UButton><UButton v-if="request.status === 'pending'" size="sm" color="success" icon="i-lucide-check" @click="openWithdrawalReview(request, 'approved')">تأیید</UButton><UButton v-if="request.status === 'approved'" size="sm" color="primary" icon="i-lucide-banknote" @click="openWithdrawalReview(request, 'paid')">ثبت پرداخت</UButton><UButton v-if="request.status === 'pending' || request.status === 'approved'" size="sm" color="error" variant="soft" icon="i-lucide-x" @click="openWithdrawalReview(request, 'rejected')">رد</UButton></div></td></tr></tbody>
          </table>
        </div>
      </div>
    </PanelPermissionGuard>

    <BaseModal v-if="selectedBank" title-id="admin-bank-details-title" @close="selectedBank = null">
      <div class="details-modal"><div class="details-modal__hero"><div><span class="eyebrow">جزئیات حساب بانکی</span><h2 id="admin-bank-details-title">{{ selectedBank.accountHolderName }}</h2></div><StatusPill :label="bankStatusLabel(selectedBank.status)" :semantic="bankStatusSemantic(selectedBank.status)" /></div><dl class="details-grid"><div><dt>شناسه کاربر</dt><dd class="ltr">{{ selectedBank.userId }}</dd></div><div><dt>بانک</dt><dd>{{ selectedBank.bankName || 'ثبت نشده' }}</dd></div><div><dt>شماره کارت</dt><dd class="ltr">{{ selectedBank.cardNumber }}</dd></div><div><dt>شماره شبا</dt><dd class="ltr">{{ selectedBank.iban }}</dd></div><div v-if="selectedBank.rejectionReason" class="details-grid__wide"><dt>دلیل رد</dt><dd class="danger-text">{{ selectedBank.rejectionReason }}</dd></div></dl><div class="modal-actions"><UButton v-if="selectedBank.status === 'pending'" color="success" @click="moveBankToReview('approved')">تأیید حساب</UButton><UButton v-if="selectedBank.status === 'pending'" color="error" variant="soft" @click="moveBankToReview('rejected')">رد حساب</UButton><UButton color="neutral" variant="outline" @click="selectedBank = null">بستن</UButton></div></div>
    </BaseModal>

    <BaseModal v-if="selectedWithdrawal" title-id="admin-withdrawal-details-title" @close="selectedWithdrawal = null">
      <div class="details-modal"><div class="details-modal__hero"><div><span class="eyebrow">جزئیات درخواست برداشت</span><h2 id="admin-withdrawal-details-title" class="ltr">{{ formatAmount(selectedWithdrawal.amount) }} {{ selectedWithdrawal.currency === 'IRR' ? 'ریال' : selectedWithdrawal.currency }}</h2></div><StatusPill :label="withdrawalStatusLabel(selectedWithdrawal.status)" :semantic="withdrawalStatusSemantic(selectedWithdrawal.status)" /></div><dl class="details-grid"><div><dt>شناسه کاربر</dt><dd class="ltr">{{ selectedWithdrawal.userId }}</dd></div><div><dt>تاریخ ثبت</dt><dd>{{ formatDateTime(selectedWithdrawal.createdAt) }}</dd></div><div><dt>بانک مقصد</dt><dd>{{ selectedWithdrawal.bankAccount?.bankName || '—' }}</dd></div><div><dt>شماره کارت</dt><dd class="ltr">{{ selectedWithdrawal.bankAccount?.cardNumber || '—' }}</dd></div><div class="details-grid__wide"><dt>شماره شبا</dt><dd class="ltr">{{ selectedWithdrawal.bankAccount?.iban || '—' }}</dd></div><div v-if="selectedWithdrawal.description" class="details-grid__wide"><dt>شرح</dt><dd>{{ selectedWithdrawal.description }}</dd></div><div v-if="selectedWithdrawal.rejectionReason" class="details-grid__wide"><dt>دلیل رد</dt><dd class="danger-text">{{ selectedWithdrawal.rejectionReason }}</dd></div></dl><div class="modal-actions"><UButton v-if="selectedWithdrawal.status === 'pending'" color="success" @click="moveWithdrawalToReview('approved')">تأیید برداشت</UButton><UButton v-if="selectedWithdrawal.status === 'approved'" color="primary" @click="moveWithdrawalToReview('paid')">ثبت پرداخت</UButton><UButton v-if="selectedWithdrawal.status === 'pending' || selectedWithdrawal.status === 'approved'" color="error" variant="soft" @click="moveWithdrawalToReview('rejected')">رد درخواست</UButton><UButton color="neutral" variant="outline" @click="selectedWithdrawal = null">بستن</UButton></div></div>
    </BaseModal>

    <BaseModal v-if="reviewTarget" :title-id="reviewTargetType === 'bank' ? 'review-bank-title' : 'review-withdrawal-title'" :busy="Boolean(processingId)" @close="closeReview">
      <form class="review-form" @submit.prevent="submitReview"><h2 :id="reviewTargetType === 'bank' ? 'review-bank-title' : 'review-withdrawal-title'">{{ reviewAction === 'approved' ? 'تأیید اطلاعات' : reviewAction === 'paid' ? 'ثبت پرداخت' : 'رد درخواست' }}</h2><p>این عملیات در سوابق مالی سامانه ثبت می‌شود.</p><UFormField v-if="reviewAction === 'rejected'" label="دلیل رد" required><UTextarea v-model="rejectionReason" :rows="4" required placeholder="دلیل را برای کاربر بنویسید..." /></UFormField><p v-if="actionError" class="form-error" role="alert">{{ actionError }}</p><div class="modal-actions"><UButton type="button" color="neutral" variant="soft" :disabled="Boolean(processingId)" @click="closeReview">انصراف</UButton><UButton type="submit" :color="reviewAction === 'rejected' ? 'error' : 'success'" :loading="Boolean(processingId)">{{ reviewAction === 'paid' ? 'ثبت پرداخت' : reviewAction === 'approved' ? 'تأیید' : 'رد درخواست' }}</UButton></div></form>
    </BaseModal>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useAccess } from '~/composables/useAccess';
import { Resource } from '~/types/permissions';
import { toUserFacingError } from '~/services/apiClient';
import { listBankAccountsForAdmin, listWithdrawalsForAdmin, reviewBankAccount, reviewWithdrawal, type BankAccount, type BankAccountStatus, type WithdrawalRequest, type WithdrawalStatus } from '~/services/bankingService';

definePageMeta({ layout: 'panel', middleware: ['auth', 'permission'], permission: { resource: 'wallets', action: 'm' } });
useHead({ title: 'داشبورد | حساب‌های بانکی و برداشت‌ها' });

const { canManage, isReady } = useAccess(Resource.WALLETS);
const activeTab = ref<'accounts' | 'withdrawals'>('accounts');
const statusFilter = ref<BankAccountStatus | WithdrawalStatus | ''>('pending');
const accounts = ref<BankAccount[]>([]);
const withdrawals = ref<WithdrawalRequest[]>([]);
const loading = ref(false);
const errorMessage = ref('');
const selectedBank = ref<BankAccount | null>(null);
const selectedWithdrawal = ref<WithdrawalRequest | null>(null);
const reviewTarget = ref<BankAccount | WithdrawalRequest | null>(null);
const reviewTargetType = ref<'bank' | 'withdrawal'>('bank');
const reviewAction = ref<'approved' | 'rejected' | 'paid'>('approved');
const rejectionReason = ref('');
const actionError = ref('');
const processingId = ref<string | null>(null);

const accountStatusOptions = [{ label: 'در انتظار بررسی', value: 'pending' }, { label: 'تأییدشده', value: 'approved' }, { label: 'ردشده', value: 'rejected' }, { label: 'همه', value: '' }];
const withdrawalStatusOptions = [{ label: 'در انتظار بررسی', value: 'pending' }, { label: 'تأییدشده', value: 'approved' }, { label: 'ردشده', value: 'rejected' }, { label: 'پرداخت‌شده', value: 'paid' }, { label: 'همه', value: '' }];

function formatAmount(value: number) { return Number(value || 0).toLocaleString('fa-IR'); }
function formatDate(value?: string) { return value ? new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium' }).format(new Date(value)) : '—'; }
function formatDateTime(value?: string) { return value ? new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : '—'; }
function bankStatusLabel(status: BankAccountStatus) { return status === 'approved' ? 'تأییدشده' : status === 'rejected' ? 'ردشده' : 'در انتظار بررسی'; }
function bankStatusSemantic(status: BankAccountStatus) { return status === 'approved' ? 'success' : status === 'rejected' ? 'danger' : 'warning'; }
function withdrawalStatusLabel(status: WithdrawalStatus) { return status === 'paid' ? 'پرداخت‌شده' : status === 'approved' ? 'تأیید برداشت' : status === 'rejected' ? 'ردشده' : 'در انتظار بررسی'; }
function withdrawalStatusSemantic(status: WithdrawalStatus) { return status === 'paid' ? 'success' : status === 'rejected' ? 'danger' : 'warning'; }

async function fetchCurrent() {
  if (!canManage.value) return;
  loading.value = true; errorMessage.value = '';
  try {
    if (activeTab.value === 'accounts') accounts.value = await listBankAccountsForAdmin(statusFilter.value as BankAccountStatus | '');
    else withdrawals.value = await listWithdrawalsForAdmin(statusFilter.value as WithdrawalStatus | '');
  } catch (error) { errorMessage.value = toUserFacingError(error, 'دریافت اطلاعات مالی انجام نشد.').message; }
  finally { loading.value = false; }
}
function switchTab(tab: 'accounts' | 'withdrawals') { activeTab.value = tab; statusFilter.value = 'pending'; fetchCurrent(); }
function openBankDetails(account: BankAccount) { selectedBank.value = account; }
function openWithdrawalDetails(request: WithdrawalRequest) { selectedWithdrawal.value = request; }
function openBankReview(account: BankAccount, action: 'approved' | 'rejected') { reviewTarget.value = account; reviewTargetType.value = 'bank'; reviewAction.value = action; rejectionReason.value = ''; actionError.value = ''; }
function openWithdrawalReview(request: WithdrawalRequest, action: 'approved' | 'rejected' | 'paid') { reviewTarget.value = request; reviewTargetType.value = 'withdrawal'; reviewAction.value = action; rejectionReason.value = ''; actionError.value = ''; }
function moveBankToReview(action: 'approved' | 'rejected') { if (!selectedBank.value) return; const target = selectedBank.value; selectedBank.value = null; openBankReview(target, action); }
function moveWithdrawalToReview(action: 'approved' | 'rejected' | 'paid') { if (!selectedWithdrawal.value) return; const target = selectedWithdrawal.value; selectedWithdrawal.value = null; openWithdrawalReview(target, action); }
function closeReview() { if (!processingId.value) reviewTarget.value = null; }
async function submitReview() {
  if (!reviewTarget.value || processingId.value) return;
  if (reviewAction.value === 'rejected' && !rejectionReason.value.trim()) { actionError.value = 'برای رد درخواست، دلیل را وارد کنید.'; return; }
  processingId.value = reviewTarget.value.id; actionError.value = '';
  try {
    if (reviewTargetType.value === 'bank') await reviewBankAccount(reviewTarget.value.id, reviewAction.value as 'approved' | 'rejected', rejectionReason.value);
    else await reviewWithdrawal(reviewTarget.value.id, reviewAction.value, rejectionReason.value);
    reviewTarget.value = null;
    await fetchCurrent();
  } catch (error) { actionError.value = toUserFacingError(error, 'ثبت نتیجه بررسی انجام نشد.').message; }
  finally { processingId.value = null; }
}

onMounted(() => { if (isReady.value) fetchCurrent(); });
</script>

<style scoped>
.banking-admin-page { display: grid; gap: 1rem; min-width: 0; }
.banking-admin-tabs { display: flex; gap: .5rem; flex-wrap: wrap; padding: .35rem; border: 1px solid var(--color-border); border-radius: var(--radius-card); background: var(--color-bg-surface); }
.banking-admin-tabs button { min-height: 2.75rem; display: inline-flex; align-items: center; gap: .45rem; padding: .65rem 1rem; border: 0; border-radius: var(--radius-field); color: var(--color-text-muted); background: transparent; font: inherit; font-size: .85rem; font-weight: var(--font-weight-bold); cursor: pointer; }
.banking-admin-tabs button:hover, .banking-admin-tabs button:focus-visible { color: var(--color-brand-blue); background: var(--color-info-bg); outline: none; }
.banking-admin-tabs button.is-active { color: var(--color-brand-blue); background: var(--color-info-bg); box-shadow: inset 0 -2px 0 var(--color-brand-blue); }
.filter-copy { display: grid; gap: .2rem; margin-inline-end: auto; color: var(--color-text-muted); font-size: .78rem; }
.filter-copy strong { color: var(--color-text-heading); font-size: .9rem; }
.banking-admin-card { min-width: 0; padding: 1rem; overflow: hidden; }
.responsive-table-wrap { overflow-x: auto; }
.banking-table { width: 100%; min-width: 62rem; border-collapse: collapse; text-align: right; }
.banking-table th { padding: .85rem .7rem; color: var(--color-text-muted); background: var(--color-bg-light); font-size: .78rem; white-space: nowrap; }
.banking-table td { padding: .9rem .7rem; border-top: 1px solid var(--color-border); color: var(--color-text-body); font-size: .8rem; vertical-align: middle; }
.banking-table td > strong, .banking-table td > span, .banking-table td > small { display: block; }
.banking-table td small { margin-top: .25rem; color: var(--color-text-muted); font-size: .72rem; }
.row-actions { display: flex; align-items: center; flex-wrap: wrap; gap: .4rem; }
.details-modal, .review-form { display: grid; gap: 1rem; min-width: min(34rem, 80vw); }
.details-modal__hero { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; }
.details-modal h2, .review-form h2 { margin: .25rem 0 0; color: var(--color-text-heading); font-size: 1.15rem; }
.details-modal__hero .eyebrow { color: var(--color-text-muted); font-size: .78rem; }
.details-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .7rem; margin: 0; }
.details-grid > div { display: grid; gap: .25rem; padding: .75rem; border: 1px solid var(--color-border); border-radius: var(--radius-field); background: var(--color-bg-light); }
.details-grid__wide { grid-column: 1 / -1; }
.details-grid dt { color: var(--color-text-muted); font-size: .74rem; }
.details-grid dd { margin: 0; color: var(--color-text-heading); font-size: .82rem; overflow-wrap: anywhere; }
.danger-text { color: var(--color-danger-fg) !important; }
.review-form > p { margin: 0; color: var(--color-text-muted); font-size: .85rem; }
.modal-actions { display: flex; justify-content: flex-end; flex-wrap: wrap; gap: .55rem; }
.form-error { margin: 0; padding: .65rem .75rem; color: var(--color-danger-fg); background: var(--color-danger-bg); border-radius: var(--radius-field); font-size: .8rem; }
@media (max-width: 600px) { .details-grid { grid-template-columns: 1fr; } .details-grid__wide { grid-column: auto; } .details-modal, .review-form { min-width: 0; } .filter-copy { width: 100%; } }
</style>
