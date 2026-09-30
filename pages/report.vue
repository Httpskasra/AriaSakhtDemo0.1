<script setup lang="ts">
import { reactive, ref } from 'vue';
import { createAbuseReport } from '~/services/customerRequestService';
import { toUserFacingError } from '~/services/apiClient';

const form = reactive({ title: '', description: '', reporterName: '', reporterEmail: '', targetUrl: '', targetReference: '' });
const loading = ref(false); const error = ref(''); const success = ref('');
const submit = async () => {
  error.value = ''; success.value = '';
  if (!form.title.trim() || form.description.trim().length < 10 || !form.reporterName.trim() || !form.reporterEmail.trim()) { error.value = 'موضوع، شرح حداقل ۱۰ نویسه، نام و ایمیل را کامل کنید.'; return; }
  loading.value = true;
  try { await createAbuseReport({ ...form, title: form.title.trim(), description: form.description.trim(), reporterName: form.reporterName.trim(), reporterEmail: form.reporterEmail.trim().toLowerCase(), targetUrl: form.targetUrl.trim() || undefined, targetReference: form.targetReference.trim() || undefined }); success.value = 'گزارش شما ثبت شد و توسط تیم بررسی پیگیری می‌شود.'; Object.assign(form, { title: '', description: '', reporterName: '', reporterEmail: '', targetUrl: '', targetReference: '' }); }
  catch (err) { error.value = toUserFacingError(err, 'ثبت گزارش انجام نشد.').message; }
  finally { loading.value = false; }
};
useHead({ title: 'گزارش تخلف | تجاریس' });
</script>

<template>
  <div class="public-page" dir="rtl">
    <PublicPageHeader icon="i-lucide-flag" title="گزارش تخلف" description="اگر محتوای نادرست، رفتار غیرحرفه‌ای یا مغایر با قوانین مشاهده کردید، آن را مستقیم برای تیم بررسی ارسال کنید." />
    <main class="section-container report-page__content">
      <div class="report-page__notice"><UIcon name="i-lucide-shield-check" aria-hidden="true" /><span>گزارش شما محرمانه بررسی می‌شود. برای پیگیری دقیق، لینک یا شناسه مورد گزارش را هم وارد کنید.</span></div>
      <form class="panel-surface report-form" @submit.prevent="submit">
        <div class="report-form__fields">
          <UFormField label="موضوع گزارش" required><UInput v-model="form.title" placeholder="مثلاً اطلاعات نادرست محصول" /></UFormField>
          <UFormField label="لینک مورد گزارش"><UInput v-model="form.targetUrl" type="url" placeholder="https://tejaris.ir/..." /></UFormField>
          <UFormField label="شناسه محصول، شرکت یا سفارش"><UInput v-model="form.targetReference" placeholder="در صورت وجود" /></UFormField>
          <UFormField label="نام و نام خانوادگی" required><UInput v-model="form.reporterName" autocomplete="name" /></UFormField>
          <UFormField label="ایمیل برای پیگیری" required><UInput v-model="form.reporterEmail" type="email" autocomplete="email" /></UFormField>
          <UFormField label="شرح گزارش" required class="report-form__wide"><UTextarea v-model="form.description" :rows="6" placeholder="مشکل را با جزئیات بنویسید…" /></UFormField>
        </div>
        <div v-if="error" class="form-feedback form-feedback--error" role="alert">{{ error }}</div><div v-if="success" class="form-feedback form-feedback--success" role="status">{{ success }}</div>
        <UButton type="submit" size="lg" icon="i-lucide-send" :loading="loading">ارسال گزارش</UButton>
      </form>
    </main>
  </div>
</template>

<style scoped>
.report-page__content { display: grid; gap: 1rem; padding-block: 2rem 4rem; }
.report-page__notice { display: flex; align-items: flex-start; gap: .65rem; border: 1px solid var(--color-warning-border); border-radius: var(--radius-card); padding: 1rem; background: var(--color-warning-bg); color: var(--color-warning-fg); font-size: .8rem; line-height: 1.9; }
.report-page__notice :deep(svg) { flex: 0 0 1.25rem; margin-top: .25rem; }
.report-form { padding: clamp(1.25rem, 3vw, 2rem); }
.report-form__fields { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
.report-form__wide { grid-column: 1 / -1; }
.form-feedback { margin-top: 1rem; border-radius: var(--radius-field); padding: .75rem; font-size: .8rem; }.form-feedback--error { color: var(--color-danger-fg); background: var(--color-danger-bg); }.form-feedback--success { color: var(--color-success-fg); background: var(--color-success-bg); }
.report-form > :deep(button) { min-height: 2.875rem; margin-top: 1rem; }
@media (max-width: 640px) { .report-form__fields { grid-template-columns: 1fr; }.report-form__wide { grid-column: auto; } }
</style>
