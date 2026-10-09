<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { listMyCustomerRequests, type CustomerRequest, type CustomerRequestStatus } from '~/services/customerRequestService';
import { toUserFacingError } from '~/services/apiClient';

definePageMeta({ layout: 'panel', middleware: ['auth'] });
useHead({ title: 'استعلام قیمت و خرید عمده | داشبورد' });

const requests = ref<CustomerRequest[]>([]);
const loading = ref(true);
const error = ref('');
const selectedId = ref<string | null>(null);
const idOf = (item: CustomerRequest) => item._id || item.id || '';
const statusLabels: Record<CustomerRequestStatus, string> = { pending: 'در انتظار بررسی', in_review: 'در حال بررسی', responded: 'پاسخ داده شد', resolved: 'نهایی شد', rejected: 'رد شد', closed: 'بسته شد' };
const typeLabels = { price_quote: 'استعلام قیمت', wholesale: 'خرید عمده' } as const;
const formatDate = (value?: string) => value ? new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : '—';
const formatAmount = (value?: number, currency = 'ریال') => value === undefined ? 'در انتظار اعلام' : `${new Intl.NumberFormat('fa-IR').format(value)} ${currency}`;
const load = async () => { loading.value = true; error.value = ''; try { const [quotes, wholesale] = await Promise.all([listMyCustomerRequests('price_quote'), listMyCustomerRequests('wholesale')]); requests.value = [...quotes, ...wholesale].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))); if (!selectedId.value && requests.value[0]) selectedId.value = idOf(requests.value[0]); } catch (err) { error.value = toUserFacingError(err, 'دریافت درخواست‌ها انجام نشد.').message; } finally { loading.value = false; } };
const selected = computed(() => requests.value.find((item) => idOf(item) === selectedId.value) || null);
onMounted(load);
</script>

<template>
  <section class="requests-page" dir="rtl">
    <PanelPageHeader title="استعلام قیمت و خرید عمده" subtitle="درخواست‌ها، وضعیت بررسی و پاسخ تیم تجاریس را یک‌جا پیگیری کنید." icon="i-lucide-clipboard-list"><template #actions><UButton to="/price-quote" variant="soft" icon="i-lucide-plus">استعلام جدید</UButton><UButton icon="i-lucide-refresh-cw" variant="soft" :loading="loading" @click="load">به‌روزرسانی</UButton></template></PanelPageHeader>
    <div v-if="error" class="requests-page__feedback" role="alert">{{ error }} <UButton size="xs" variant="ghost" @click="load">تلاش مجدد</UButton></div>
    <SharedAsyncState v-if="loading" state="loading" />
    <SharedAsyncState v-else-if="!requests.length" state="empty" title="درخواستی ثبت نشده است" message="برای دریافت قیمت یا خرید پروژه‌ای، درخواست جدید ثبت کنید." />
    <div v-else class="requests-page__layout">
      <div class="requests-page__list" aria-label="فهرست درخواست‌ها">
        <button v-for="request in requests" :key="idOf(request)" type="button" class="request-card" :class="{ 'request-card--active': idOf(request) === selectedId }" @click="selectedId = idOf(request)">
          <span class="request-card__top"><strong>{{ typeLabels[request.type as keyof typeof typeLabels] || 'درخواست' }}</strong><span class="request-status" :data-status="request.status">{{ statusLabels[request.status] }}</span></span>
          <b>{{ request.productName || request.title }}</b><small>{{ formatDate(request.createdAt) }}</small>
        </button>
      </div>
      <article v-if="selected" class="request-detail panel-surface">
        <div class="request-detail__header"><div><span class="section-kicker">{{ typeLabels[selected.type as keyof typeof typeLabels] || 'درخواست' }}</span><h2>{{ selected.title }}</h2></div><span class="request-status request-status--large" :data-status="selected.status">{{ statusLabels[selected.status] }}</span></div>
        <dl class="request-detail__facts"><div><dt>محصول</dt><dd>{{ selected.productName || '—' }}</dd></div><div><dt>مقدار</dt><dd>{{ selected.quantity ? `${new Intl.NumberFormat('fa-IR').format(selected.quantity)} ${selected.unit || ''}` : '—' }}</dd></div><div><dt>محل تحویل</dt><dd>{{ selected.deliveryLocation || '—' }}</dd></div><div><dt>قیمت اعلامی</dt><dd>{{ formatAmount(selected.quotedAmount, selected.currency) }}</dd></div><div><dt>تاریخ ثبت</dt><dd>{{ formatDate(selected.createdAt) }}</dd></div></dl>
        <div class="request-detail__message"><h3>توضیحات شما</h3><p>{{ selected.description }}</p></div>
        <div v-if="selected.adminResponse" class="request-detail__response"><h3><UIcon name="i-lucide-message-circle-check" aria-hidden="true" /> پاسخ تیم تجاریس</h3><p>{{ selected.adminResponse }}</p></div>
        <div v-else class="request-detail__pending"><UIcon name="i-lucide-clock-3" aria-hidden="true" /> پاسخ کارشناسان پس از بررسی در همین صفحه نمایش داده می‌شود.</div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.requests-page { display: grid; gap: 1rem; }.requests-page__feedback { display: flex; align-items: center; gap: .5rem; border-radius: var(--radius-field); padding: .75rem 1rem; color: var(--color-danger-fg); background: var(--color-danger-bg); font-size: .8rem; }.requests-page__layout { display: grid; grid-template-columns: minmax(16rem, .7fr) minmax(0, 1.3fr); gap: 1rem; align-items: start; }.requests-page__list { display: grid; gap: .65rem; }.request-card { display: grid; gap: .45rem; width: 100%; padding: 1rem; border: 1px solid var(--color-border); border-radius: var(--radius-card); background: var(--color-bg-surface); color: var(--color-text-body); text-align: right; cursor: pointer; box-shadow: var(--shadow-card); }.request-card:hover, .request-card--active { border-color: var(--color-info-border); box-shadow: var(--shadow-raised); }.request-card__top { display: flex; align-items: center; justify-content: space-between; gap: .5rem; color: var(--color-brand-blue); font-size: .72rem; }.request-card b { color: var(--color-text-heading); font-size: .9rem; }.request-card small { color: var(--color-text-muted); font-size: .7rem; }.request-status { display: inline-flex; align-items: center; width: fit-content; border-radius: var(--radius-pill); padding: .25rem .55rem; background: var(--color-bg-light); color: var(--color-text-muted); font-size: .66rem; font-weight: var(--font-weight-extrabold); }.request-status[data-status='responded'], .request-status[data-status='resolved'] { background: var(--color-success-bg); color: var(--color-success-fg); }.request-status[data-status='rejected'] { background: var(--color-danger-bg); color: var(--color-danger-fg); }.request-detail { min-width: 0; padding: clamp(1.25rem, 3vw, 2rem); }.request-detail__header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--color-border); }.request-detail h2 { margin-top: .35rem; color: var(--color-text-heading); font-size: 1.25rem; font-weight: var(--font-weight-extrabold); }.request-status--large { padding: .4rem .75rem; }.request-detail__facts { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .75rem; margin-top: 1.25rem; }.request-detail__facts div { border: 1px solid var(--color-border); border-radius: var(--radius-field); padding: .75rem; }.request-detail dt { color: var(--color-text-muted); font-size: .7rem; }.request-detail dd { margin-top: .25rem; color: var(--color-text-heading); font-size: .82rem; font-weight: var(--font-weight-bold); }.request-detail__message, .request-detail__response, .request-detail__pending { margin-top: 1.25rem; border-radius: var(--radius-field); padding: 1rem; }.request-detail__message { background: var(--color-bg-light); }.request-detail__response { background: var(--color-success-bg); color: var(--color-success-fg); }.request-detail__pending { display: flex; align-items: center; gap: .5rem; background: var(--color-info-bg); color: var(--color-info-fg); font-size: .78rem; }.request-detail h3 { color: inherit; font-size: .8rem; font-weight: var(--font-weight-extrabold); }.request-detail p { margin-top: .5rem; color: inherit; font-size: .8rem; line-height: 2; }@media (max-width: 800px) { .requests-page__layout { grid-template-columns: 1fr; }.request-detail__header { flex-direction: column; }.request-detail__facts { grid-template-columns: 1fr; } }
</style>
