<script setup lang="ts">
import { reactive, ref } from 'vue';
import { sendContactInquiry } from '~/services/contactService';
import { toUserFacingError } from '~/services/apiClient';

const contactForm = reactive({ name: '', email: '', message: '' });
const fieldErrors = reactive({ name: '', email: '', message: '' });
const loading = ref(false);
const error = ref<string | null>(null);
const success = ref<string | null>(null);

const resetForm = () => {
  Object.assign(contactForm, { name: '', email: '', message: '' });
  Object.assign(fieldErrors, { name: '', email: '', message: '' });
};

const validateForm = () => {
  Object.assign(fieldErrors, { name: '', email: '', message: '' });
  const name = contactForm.name.trim();
  const email = contactForm.email.trim();
  const message = contactForm.message.trim();

  if (!name) fieldErrors.name = 'نام و نام خانوادگی الزامی است.';
  else if (name.length < 3) fieldErrors.name = 'نام باید حداقل ۳ کاراکتر باشد.';

  if (!email) fieldErrors.email = 'ایمیل الزامی است.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fieldErrors.email = 'ایمیل واردشده معتبر نیست.';

  if (!message) fieldErrors.message = 'متن پیام الزامی است.';
  else if (message.length < 10) fieldErrors.message = 'پیام باید حداقل ۱۰ کاراکتر باشد.';

  return !Object.values(fieldErrors).some(Boolean);
};

const clearFieldError = (field: keyof typeof fieldErrors) => {
  fieldErrors[field] = '';
  error.value = null;
  success.value = null;
};

const submit = async () => {
  if (loading.value || !validateForm()) return;
  error.value = null;
  success.value = null;
  loading.value = true;

  try {
    await sendContactInquiry({
      name: contactForm.name.trim(),
      email: contactForm.email.trim().toLowerCase(),
      message: contactForm.message.trim(),
    });
    success.value = 'پیام شما با موفقیت ارسال شد. در اولین فرصت با شما تماس می‌گیریم.';
    resetForm();
  } catch (err) {
    error.value = toUserFacingError(err, 'ارسال پیام انجام نشد. لطفاً دوباره تلاش کنید.').message;
  } finally {
    loading.value = false;
  }
};

useHead({ title: 'تماس با تجاریس' });
</script>

<template>
  <div class="public-page" dir="rtl">
    <PublicPageHeader
      icon="i-lucide-message-circle"
      title="تماس با تجاریس"
      description="برای دریافت مشاوره، استعلام قیمت یا پیگیری درخواست‌ها، پیام خود را برای ما ارسال کنید."
    />

    <main class="section-container contact-page__content">
      <section class="contact-layout" aria-label="اطلاعات تماس و فرم پیام">
        <div class="contact-info panel-surface">
          <div>
            <p class="section-kicker">در ارتباط بمانیم</p>
            <h2 class="section-title">چطور می‌توانیم کمک کنیم؟</h2>
            <p class="section-copy">پرسش خود را با جزئیات بنویسید تا تیم پشتیبانی بتواند سریع‌تر راهنمایی‌تان کند.</p>
          </div>

          <div class="contact-info__list">
            <a href="tel:+989026995994" class="contact-item">
              <span class="contact-item__icon" aria-hidden="true"><UIcon name="i-lucide-phone" class="size-icon-inline" /></span>
              <span><small>شماره تماس</small><strong dir="ltr">+98 902 699 5994</strong></span>
            </a>
            <div class="contact-item contact-item--static">
              <span class="contact-item__icon" aria-hidden="true"><UIcon name="i-lucide-map-pin" class="size-icon-inline" /></span>
              <span><small>نشانی دفتر</small><strong>استان فارس، شهرستان شیراز، شهرک کوثر</strong></span>
            </div>
          </div>

          <div class="contact-note">
            <UIcon name="i-lucide-clock-3" class="size-icon-inline" aria-hidden="true" />
            <span>پاسخ‌گویی در روزهای کاری انجام می‌شود.</span>
          </div>
        </div>

        <UForm :state="contactForm" class="contact-form panel-surface" @submit.prevent="submit">
          <div class="contact-form__heading">
            <div>
              <p class="section-kicker">پشتیبانی و مشاوره</p>
              <h2 class="section-title">ارسال پیام</h2>
            </div>
            <span class="contact-form__required-hint">فیلدهای ستاره‌دار الزامی هستند.</span>
          </div>

          <div class="contact-form__fields">
            <UFormField label="نام و نام خانوادگی" name="name" required :error="fieldErrors.name || undefined">
              <UInput v-model="contactForm.name" class="contact-input" placeholder="مثال: علی رضایی" autocomplete="name" :aria-invalid="Boolean(fieldErrors.name)" @update:model-value="clearFieldError('name')">
                <template #leading><UIcon name="i-lucide-user-round" aria-hidden="true" /></template>
              </UInput>
            </UFormField>
            <UFormField label="ایمیل" name="email" required :error="fieldErrors.email || undefined">
              <UInput v-model="contactForm.email" class="contact-input" type="email" placeholder="name@example.com" autocomplete="email" :aria-invalid="Boolean(fieldErrors.email)" @update:model-value="clearFieldError('email')">
                <template #leading><UIcon name="i-lucide-mail" aria-hidden="true" /></template>
              </UInput>
            </UFormField>
            <UFormField label="پیام شما" name="message" required :error="fieldErrors.message || undefined" class="contact-form__message">
              <UTextarea v-model="contactForm.message" class="contact-textarea" :rows="6" placeholder="موضوع یا درخواست خود را بنویسید..." :aria-invalid="Boolean(fieldErrors.message)" @update:model-value="clearFieldError('message')" />
            </UFormField>
          </div>

          <div v-if="error" class="form-feedback form-feedback--error" role="alert">
            <UIcon name="i-lucide-circle-alert" class="size-icon-inline" aria-hidden="true" />
            {{ error }}
          </div>
          <div v-if="success" class="form-feedback form-feedback--success" role="status">
            <UIcon name="i-lucide-circle-check" class="size-icon-inline" aria-hidden="true" />
            {{ success }}
          </div>

          <UButton type="submit" color="primary" size="lg" block :loading="loading" :disabled="loading" icon="i-lucide-send" class="contact-form__submit">
            ارسال پیام
          </UButton>
        </UForm>
      </section>
    </main>
  </div>
</template>

<style scoped>
.contact-page__content {
  padding-block: 2.25rem 4.5rem;
}

.contact-layout {
  display: grid;
  grid-template-columns: minmax(17rem, .85fr) minmax(0, 1.15fr);
  gap: 1.5rem;
  align-items: start;
}

.contact-info,
.contact-form {
  padding: clamp(1.25rem, 3vw, 2rem);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
}
.contact-info { padding: clamp(1.25rem, 3vw, 2rem); }

.section-copy { margin-top: .625rem; color: var(--color-text-body); line-height: 2; }

.contact-info__list {
  display: grid;
  gap: .75rem;
  margin-top: 1.5rem;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: .75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-field);
  padding: .75rem;
  color: var(--color-text-heading);
  transition: border-color 150ms ease, background-color 150ms ease;
}

a.contact-item:hover { border-color: var(--ui-color-primary-300); background: var(--color-bg-light); }
.contact-item__icon { display: flex; flex: 0 0 2.25rem; align-items: center; justify-content: center; width: 2.25rem; height: 2.25rem; border-radius: var(--radius-compact-list-item); background: var(--ui-color-primary-50); color: var(--color-brand-blue); }
.contact-item small,
.contact-item strong { display: block; }
.contact-item small { color: var(--color-text-muted); font-size: .75rem; }
.contact-item strong { margin-top: .2rem; font-size: .8125rem; line-height: 1.7; }

.contact-note { display: flex; align-items: center; gap: .5rem; margin-top: 1.25rem; color: var(--color-text-muted); font-size: .75rem; }

.contact-form__heading { display: flex; align-items: flex-end; justify-content: space-between; gap: 1rem; padding-bottom: 1.15rem; border-bottom: 1px solid var(--color-border); }
.contact-form__heading .section-kicker { margin: 0; }
.contact-form__required-hint { color: var(--color-text-muted); font-size: .7rem; line-height: 1.7; text-align: left; }
.contact-form__fields { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; margin-top: 1.25rem; }
.contact-form__message { grid-column: 1 / -1; }
.contact-input, .contact-textarea { width: 100%; }
:deep(.contact-input input), :deep(.contact-textarea textarea) { min-height: 2.875rem; border: 1px solid var(--gray-300); border-radius: var(--radius-field); background: var(--color-bg-surface); color: var(--color-text-heading); transition: border-color 150ms ease, box-shadow 150ms ease, background-color 150ms ease; }
:deep(.contact-input input) { padding-inline: .875rem; }
:deep(.contact-textarea textarea) { padding: .75rem .875rem; resize: vertical; }
:deep(.contact-input input:focus-visible), :deep(.contact-textarea textarea:focus-visible) { border-color: var(--color-brand-blue); outline: none; box-shadow: var(--focus-ring); }
:deep(.contact-input input:hover), :deep(.contact-textarea textarea:hover) { border-color: var(--gray-400); background: var(--color-bg-light); }
:deep(.contact-input input[aria-invalid="true"]), :deep(.contact-textarea textarea[aria-invalid="true"]) { border-color: var(--color-danger-fg); }
:deep(.contact-input input::placeholder), :deep(.contact-textarea textarea::placeholder) { color: var(--color-text-body); opacity: 1; }
.form-feedback { display: flex; align-items: flex-start; gap: .5rem; margin-top: 1rem; border-radius: var(--radius-field); padding: .75rem; font-size: .8125rem; line-height: 1.8; }
.form-feedback--error { color: var(--color-danger-fg); background: var(--color-danger-bg); }
.form-feedback--success { color: var(--color-success-fg); background: var(--color-success-bg); }
.contact-form__submit { min-height: 2.875rem; margin-top: 1.25rem; }

@media (max-width: 767px) {
  .contact-page__content { padding-block: 1.5rem 3rem; }
  .contact-layout, .contact-form__fields { grid-template-columns: 1fr; }
  .contact-form__message { grid-column: auto; }
  .contact-form__heading { align-items: flex-start; flex-direction: column; gap: .35rem; }
  .contact-form__required-hint { text-align: right; }
}
</style>
