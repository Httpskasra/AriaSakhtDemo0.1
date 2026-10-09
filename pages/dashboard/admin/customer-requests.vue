<script setup lang="ts">
import { ref, watch } from 'vue';
import { listCustomerRequests, reviewCustomerRequest, type CustomerRequest, type CustomerRequestStatus, type CustomerRequestType } from '~/services/customerRequestService';
import { toUserFacingError } from '~/services/apiClient';
import { Resource } from '~/types/permissions';

definePageMeta({ layout: 'panel', middleware: ['auth'] });
useHead({ title: 'درخواست‌های مشتریان | پنل مدیریت' });
const { canRead, canUpdate, isReady } = useAccess(Resource.COMPANIES);
const items = ref<CustomerRequest[]>([]); const total = ref(0); const loading = ref(false); const error = ref(''); const selected = ref<CustomerRequest | null>(null); const filterType = ref<CustomerRequestType | ''>(''); const filterStatus = ref<CustomerRequestStatus | ''>(''); const reviewLoading = ref(false); const response = ref(''); const amount = ref<number | undefined>(); const nextStatus = ref<CustomerRequestStatus>('in_review');
const statusLabels: Record<CustomerRequestStatus, string> = { pending: 'در انتظار بررسی', in_review: 'در حال بررسی', responded: 'پاسخ داده شد', resolved: 'نهایی شد', rejected: 'رد شد', closed: 'بسته شد' };
const typeLabels: Record<CustomerRequestType, string> = { price_quote: 'استعلام قیمت', wholesale: 'خرید عمده', abuse_report: 'گزارش تخلف' };
const typeOptions = [
  { label: 'همه انواع', value: '' },
  { label: 'استعلام قیمت', value: 'price_quote' },
  { label: 'خرید عمده', value: 'wholesale' },
  { label: 'گزارش تخلف', value: 'abuse_report' },
];
const statusOptions = [
  { label: 'همه وضعیت‌ها', value: '' },
  ...Object.entries(statusLabels).map(([value, label]) => ({ label, value })),
];
const idOf = (item: CustomerRequest) => item._id || item.id || '';
const formatDate = (value?: string) => value ? new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : '—';
const load = async () => { if (!canRead.value) return; loading.value = true; error.value = ''; try { const page = await listCustomerRequests({ type: filterType.value || undefined, status: filterStatus.value || undefined, page: 1, limit: 100 }); items.value = page.items; total.value = page.total; if (selected.value && !items.value.some((item) => idOf(item) === idOf(selected.value!))) selected.value = null; } catch (err) { error.value = toUserFacingError(err, 'دریافت درخواست‌ها انجام نشد.').message; } finally { loading.value = false; } };
function select(item: CustomerRequest) { selected.value = item; nextStatus.value = item.status; response.value = item.adminResponse || ''; amount.value = item.quotedAmount; }
async function saveReview() { if (!selected.value || !canUpdate.value) return; if ((nextStatus.value === 'responded' || nextStatus.value === 'rejected') && !response.value.trim()) { error.value = 'برای پاسخ یا رد درخواست، متن نتیجه را وارد کنید.'; return; } reviewLoading.value = true; error.value = ''; try { const updated = await reviewCustomerRequest(idOf(selected.value), { status: nextStatus.value, adminResponse: response.value.trim() || undefined, quotedAmount: amount.value }); const index = items.value.findIndex((item) => idOf(item) === idOf(updated)); if (index >= 0) items.value[index] = updated; selected.value = updated; } catch (err) { error.value = toUserFacingError(err, 'ثبت نتیجه انجام نشد.').message; } finally { reviewLoading.value = false; } }
watch(isReady, (ready) => { if (ready) void load(); }, { immediate: true });
</script>

<template>
  <section class="admin-requests" dir="rtl">
    <PanelPageHeader title="درخواست‌های مشتریان" subtitle="استعلام قیمت، خرید عمده و گزارش تخلف را از یک میز کار اختصاصی مدیریت کنید." icon="i-lucide-clipboard-check"><template #actions><UButton icon="i-lucide-refresh-cw" variant="soft" :loading="loading" @click="load">به‌روزرسانی</UButton></template></PanelPageHeader>
    <div v-if="!canRead" class="admin-requests__empty">شما به مدیریت درخواست‌های مشتریان دسترسی ندارید.</div>
    <template v-else>
      <PanelFilterBar>
        <div class="admin-requests__filter-intro">
          <span><UIcon name="i-lucide-sliders-horizontal" aria-hidden="true" /> فیلتر درخواست‌ها</span>
          <small>نوع و وضعیت درخواست را برای بررسی سریع‌تر انتخاب کنید.</small>
        </div>
        <div class="admin-requests__filter-controls">
          <label class="admin-requests__filter-field">
            <span>نوع درخواست</span>
            <AppSelect
              v-model="filterType"
              :items="typeOptions"
              value-key="value"
              label-key="label"
              size="lg"
              aria-label="فیلتر نوع درخواست"
              class="admin-requests__filter-select"
              @update:model-value="load" />
          </label>
          <label class="admin-requests__filter-field">
            <span>وضعیت</span>
            <AppSelect
              v-model="filterStatus"
              :items="statusOptions"
              value-key="value"
              label-key="label"
              size="lg"
              aria-label="فیلتر وضعیت درخواست"
              class="admin-requests__filter-select"
              @update:model-value="load" />
          </label>
          <span class="admin-requests__total"><UIcon name="i-lucide-list-filter" aria-hidden="true" /> {{ new Intl.NumberFormat('fa-IR').format(total) }} درخواست</span>
        </div>
      </PanelFilterBar>
      <div v-if="error" class="admin-requests__error" role="alert">{{ error }} <UButton size="xs" variant="ghost" @click="load">تلاش مجدد</UButton></div>
      <SharedAsyncState v-if="loading" state="loading" /><SharedAsyncState v-else-if="!items.length" state="empty" title="درخواستی پیدا نشد" message="با تغییر فیلترها دوباره جستجو کنید." />
      <div v-else class="admin-requests__workspace"><div class="admin-requests__list"><button v-for="item in items" :key="idOf(item)" type="button" class="admin-request-card" :class="{ active: selected && idOf(selected) === idOf(item) }" @click="select(item)"><span><b>{{ typeLabels[item.type] }}</b><em :data-status="item.status">{{ statusLabels[item.status] }}</em></span><strong>{{ item.productName || item.title }}</strong><small>{{ item.reporterName || item.deliveryLocation || 'کاربر واردشده' }} · {{ formatDate(item.createdAt) }}</small></button></div><article v-if="selected" class="admin-request-detail panel-surface"><div class="admin-request-detail__header"><div><span class="section-kicker">{{ typeLabels[selected.type] }}</span><h2>{{ selected.title }}</h2></div><span class="admin-status" :data-status="selected.status">{{ statusLabels[selected.status] }}</span></div><dl class="admin-request-detail__facts"><div><dt>محصول</dt><dd>{{ selected.productName || '—' }}</dd></div><div><dt>مقدار</dt><dd>{{ selected.quantity ? `${new Intl.NumberFormat('fa-IR').format(selected.quantity)} ${selected.unit || ''}` : '—' }}</dd></div><div><dt>محل تحویل</dt><dd>{{ selected.deliveryLocation || '—' }}</dd></div><div><dt>تماس گزارش‌دهنده</dt><dd>{{ selected.reporterEmail || 'کاربر واردشده' }}</dd></div></dl><div class="admin-request-detail__description"><h3>شرح درخواست</h3><p>{{ selected.description }}</p><a v-if="selected.targetUrl" :href="selected.targetUrl" target="_blank" rel="noopener noreferrer">مشاهده مورد گزارش</a></div><form class="admin-request-detail__review" @submit.prevent="saveReview"><h3>ثبت نتیجه بررسی</h3><div class="admin-request-detail__review-grid"><label>وضعیت<select v-model="nextStatus"><option v-for="(label, value) in statusLabels" :key="value" :value="value">{{ label }}</option></select></label><label v-if="selected.type !== 'abuse_report'">قیمت اعلامی (ریال)<input v-model.number="amount" type="number" min="0" placeholder="در صورت وجود" /></label></div><label>پاسخ برای کاربر<textarea v-model="response" rows="5" placeholder="نتیجه بررسی یا توضیحات تکمیلی را بنویسید…"></textarea></label><UButton type="submit" icon="i-lucide-save" :loading="reviewLoading" :disabled="!canUpdate">ذخیره نتیجه</UButton></form></article></div>
    </template>
  </section>
</template>

<style scoped>
.admin-requests__filter-intro { display: grid; flex: 1 1 16rem; gap: .25rem; min-width: 12rem; color: var(--color-text-muted); }
.admin-requests__filter-intro span { display: inline-flex; align-items: center; gap: .45rem; color: var(--color-text-heading); font-size: .88rem; font-weight: var(--font-weight-extrabold); }
.admin-requests__filter-intro span :deep(svg) { color: var(--color-brand-blue); }
.admin-requests__filter-intro small { font-size: .72rem; line-height: 1.7; }
.admin-requests__filter-controls { display: flex; flex-wrap: wrap; align-items: flex-end; gap: .75rem; margin-inline-start: auto; }
.admin-requests__filter-field { display: grid; min-width: 13rem; gap: .35rem; color: var(--color-text-muted); font-size: .7rem; font-weight: var(--font-weight-bold); }
.admin-requests__filter-select { width: 100%; }
.admin-requests__filter-select :deep(.app-select__control) { min-height: 3rem; border-color: var(--color-border); background: var(--color-bg-light); font-size: .8rem; }
.admin-requests__filter-select :deep(.app-select__control:hover), .admin-requests__filter-select :deep(.app-select__control:focus-visible) { border-color: var(--color-brand-blue); background: var(--color-bg-surface); }
.admin-requests__filter-controls > .admin-requests__total { display: inline-flex; align-items: center; align-self: flex-end; gap: .35rem; white-space: nowrap; }
.admin-requests__total :deep(svg) { color: var(--color-brand-blue); }
@media (max-width: 780px) { .admin-requests__filter-intro { flex-basis: 100%; }.admin-requests__filter-controls { width: 100%; margin-inline-start: 0; }.admin-requests__filter-field { flex: 1 1 12rem; } }
.admin-requests { display: grid; gap: 1rem; }.admin-requests__filters { display: flex; align-items: center; gap: .75rem; padding: .8rem 1rem; }.admin-requests__filters select, .admin-request-detail select, .admin-request-detail input, .admin-request-detail textarea { min-height: 2.75rem; border: 1px solid var(--color-border-strong); border-radius: var(--radius-field); background: var(--color-bg-surface); color: var(--color-text-heading); font: inherit; padding: .5rem .7rem; }.admin-requests__filters select { min-width: 10rem; }.admin-requests__total { margin-inline-start: auto; color: var(--color-text-muted); font-size: .75rem; }.admin-requests__empty, .admin-requests__error { border-radius: var(--radius-card); padding: 1rem; background: var(--color-bg-surface); color: var(--color-text-muted); }.admin-requests__error { color: var(--color-danger-fg); background: var(--color-danger-bg); }.admin-requests__workspace { display: grid; grid-template-columns: minmax(18rem, .75fr) minmax(0, 1.25fr); gap: 1rem; align-items: start; }.admin-requests__list { display: grid; gap: .65rem; }.admin-request-card { display: grid; gap: .45rem; width: 100%; border: 1px solid var(--color-border); border-radius: var(--radius-card); padding: 1rem; background: var(--color-bg-surface); color: var(--color-text-body); text-align: right; cursor: pointer; }.admin-request-card:hover, .admin-request-card.active { border-color: var(--color-info-border); box-shadow: var(--shadow-raised); }.admin-request-card span { display: flex; align-items: center; justify-content: space-between; gap: .5rem; color: var(--color-brand-blue); font-size: .72rem; }.admin-request-card em, .admin-status { border-radius: var(--radius-pill); padding: .25rem .5rem; background: var(--color-bg-light); color: var(--color-text-muted); font-size: .65rem; font-style: normal; font-weight: var(--font-weight-extrabold); }.admin-request-card em[data-status='responded'], .admin-request-card em[data-status='resolved'], .admin-status[data-status='responded'], .admin-status[data-status='resolved'] { background: var(--color-success-bg); color: var(--color-success-fg); }.admin-request-card em[data-status='rejected'], .admin-status[data-status='rejected'] { background: var(--color-danger-bg); color: var(--color-danger-fg); }.admin-request-card strong { color: var(--color-text-heading); font-size: .85rem; }.admin-request-card small { color: var(--color-text-muted); font-size: .68rem; }.admin-request-detail { padding: clamp(1.25rem, 3vw, 2rem); }.admin-request-detail__header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--color-border); }.admin-request-detail h2 { margin-top: .35rem; color: var(--color-text-heading); font-size: 1.2rem; font-weight: var(--font-weight-extrabold); }.admin-request-detail h3 { margin-bottom: .65rem; color: var(--color-text-heading); font-size: .85rem; font-weight: var(--font-weight-extrabold); }.admin-request-detail__facts { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .75rem; margin-top: 1rem; }.admin-request-detail__facts div { border: 1px solid var(--color-border); border-radius: var(--radius-field); padding: .7rem; }.admin-request-detail dt { color: var(--color-text-muted); font-size: .68rem; }.admin-request-detail dd { margin-top: .25rem; color: var(--color-text-heading); font-size: .8rem; }.admin-request-detail__description { margin-top: 1rem; border-radius: var(--radius-field); padding: 1rem; background: var(--color-bg-light); }.admin-request-detail__description p { color: var(--color-text-body); font-size: .8rem; line-height: 2; white-space: pre-wrap; }.admin-request-detail__description a { display: inline-block; margin-top: .65rem; color: var(--color-brand-blue); font-size: .75rem; }.admin-request-detail__review { display: grid; gap: .85rem; margin-top: 1rem; border-top: 1px solid var(--color-border); padding-top: 1.25rem; }.admin-request-detail__review-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .75rem; }.admin-request-detail__review label { display: grid; gap: .35rem; color: var(--color-text-body); font-size: .72rem; }.admin-request-detail__review textarea { min-height: 7rem; resize: vertical; }.admin-request-detail__review > :deep(button) { justify-self: start; min-height: 2.75rem; }@media (max-width: 850px) { .admin-requests__workspace { grid-template-columns: 1fr; }.admin-request-detail__header { flex-direction: column; } }@media (max-width: 560px) { .admin-requests__filters { align-items: stretch; flex-direction: column; }.admin-requests__filters select { width: 100%; }.admin-requests__total { margin-inline-start: 0; }.admin-request-detail__facts, .admin-request-detail__review-grid { grid-template-columns: 1fr; } }
</style>
