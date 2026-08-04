<script setup lang="ts">
import { computed, ref, reactive } from 'vue';
import { createVendorRequest } from '~/services/companyService';
import { useUser } from '~/composables/useUser';

definePageMeta({
  layout: 'default'
});

const toast = useToast();
const router = useRouter();
const { isAuthenticated } = useUser();

const loading = ref(false);
const logoUrl = ref('');
const sellerType = ref<'legal' | 'individual'>('legal');
const errors = reactive<Record<string, string>>({});
const isLegalSeller = computed(() => sellerType.value === 'legal');
const canSubmit = computed(() => Boolean(
  state.name.trim()
  && state.email.trim()
  && (!isLegalSeller.value || state.registrationNumber.trim())
));

const state = reactive({
  name: '',
  nationalId: '',
  registrationNumber: '',
  email: '',
  phone: '',
  address: ''
});

const onLogoUploaded = (publicUrl: string) => {
  // Older development processes could return the Nuxt port for local files.
  // Normalize that stale URL so the image is always requested from Nest.
  logoUrl.value = publicUrl.replace(
    /^https?:\/\/(localhost|127\.0\.0\.1):3000(?=\/uploads\/)/,
    'http://localhost:3001',
  );
};

const onLogoCleared = () => {
  logoUrl.value = '';
};

const clearErrors = () => Object.keys(errors).forEach((key) => { delete errors[key]; });

const validate = () => {
  clearErrors();
  if (!state.name.trim()) errors.name = isLegalSeller.value ? 'نام شرکت الزامی است.' : 'نام و نام خانوادگی الزامی است.';
  if (!state.email.trim()) errors.email = 'ایمیل سازمانی الزامی است.';
  else if (!/^\S+@\S+\.\S+$/.test(state.email.trim())) errors.email = 'یک ایمیل معتبر وارد کنید.';
  if (isLegalSeller.value && !state.registrationNumber.trim()) errors.registrationNumber = 'شماره ثبت برای شخص حقوقی الزامی است.';
  if (state.nationalId && !/^[0-9۰-۹]{10}$/.test(state.nationalId.trim())) errors.nationalId = 'شناسه ملی یا کد ملی باید ۱۰ رقم باشد.';
  if (state.registrationNumber && !/^[0-9۰-۹]{3,20}$/.test(state.registrationNumber.trim())) errors.registrationNumber = 'شماره ثبت باید فقط شامل اعداد باشد.';
  if (state.phone && !/^[0-9۰-۹+()\-\s]{7,15}$/.test(state.phone.trim())) errors.phone = 'شماره تماس را همراه با پیش‌شماره وارد کنید.';
  return Object.keys(errors).length === 0;
};

const onSubmit = async () => {
  if (!validate()) return;

  loading.value = true;
  try {
    const payload = {
      companyName: state.name,
      email: state.email,
      phone: state.phone || undefined,
      registrationNumber: isLegalSeller.value ? state.registrationNumber || undefined : undefined,
      nationalId: state.nationalId || undefined,
      address: state.address || undefined,
      imageUrl: logoUrl.value || undefined,
    };

    await createVendorRequest(payload);

    toast.add({
      title: 'موفقیت',
      description: 'درخواست ثبت کسب‌وکار شما با موفقیت ارسال شد و در حال بررسی است.',
      color: 'success'
    });

    state.name = '';
    state.nationalId = '';
    state.registrationNumber = '';
    state.email = '';
    state.phone = '';
    state.address = '';
    logoUrl.value = '';

    router.push(isAuthenticated.value ? '/dashboard' : '/');
  } catch (err: any) {
    toast.add({
      title: 'خطا در ثبت',
      description: err.response?.data?.message || 'مشکلی در ثبت کسب‌وکار پیش آمد',
      color: 'error'
    });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="seller-page">
    <PublicPageHeader
      icon="i-lucide-store"
      title="تکمیل اطلاعات فروشنده"
      description="نوع فروشنده را انتخاب کنید و اطلاعات لازم برای بررسی درخواست فروشندگی را وارد کنید."
    />
    <div class="section-container seller-page__content">

    <UCard class="company-card">
      <form @submit.prevent="onSubmit" class="company-form space-y-6 text-right text-slate-800" dir="rtl">
        <div class="form-guidance" role="note">
          فیلدهای دارای ستاره (*) الزامی هستند. فیلدهای اختیاری: شناسه ملی/کد ملی، شماره تماس ثابت، آدرس دفتر مرکزی و لوگوی کسب‌وکار.
        </div>

        <UFormField label="نوع تأمین‌کننده" required class="company-field company-field--full" description="نوع فعالیت خود را انتخاب کنید تا فیلدهای شناسایی متناسب نمایش داده شوند.">
          <div class="seller-type-options" role="radiogroup" aria-label="نوع تأمین‌کننده">
            <button
              type="button"
              class="seller-type-option"
              :class="{ 'seller-type-option--active': sellerType === 'legal' }"
              :aria-checked="sellerType === 'legal'"
              role="radio"
              @click="sellerType = 'legal'"
            >
              <span class="seller-type-icon" aria-hidden="true"><UIcon name="i-lucide-building-2" /></span>
              <span class="seller-type-copy">
                <strong>شخص حقوقی</strong>
                <small>شرکت یا مؤسسه</small>
              </span>
              <UIcon v-if="sellerType === 'legal'" name="i-lucide-circle-check" class="seller-type-check" aria-hidden="true" />
            </button>
            <button
              type="button"
              class="seller-type-option"
              :class="{ 'seller-type-option--active': sellerType === 'individual' }"
              :aria-checked="sellerType === 'individual'"
              role="radio"
              @click="sellerType = 'individual'"
            >
              <span class="seller-type-icon" aria-hidden="true"><UIcon name="i-lucide-user-round" /></span>
              <span class="seller-type-copy">
                <strong>شخص حقیقی</strong>
                <small>فرد مستقل</small>
              </span>
              <UIcon v-if="sellerType === 'individual'" name="i-lucide-circle-check" class="seller-type-check" aria-hidden="true" />
            </button>
          </div>
        </UFormField>

        <div class="company-fields">
          <UFormField :label="isLegalSeller ? 'نام شرکت یا موسسه' : 'نام و نام خانوادگی'" required class="company-field" :error="errors.name" :description="isLegalSeller ? 'نام رسمی ثبت‌شدهٔ کسب‌وکار را وارد کنید.' : 'نام مطابق کد ملی را وارد کنید.'">
            <div class="company-input-shell">
              <UIcon name="i-lucide-building-2" class="company-input-icon" aria-hidden="true" />
              <UInput v-model="state.name" class="company-input" :placeholder="isLegalSeller ? 'مثال: فولاد آریا' : 'مثال: علی رضایی'" :autocomplete="isLegalSeller ? 'organization' : 'name'" />
            </div>
          </UFormField>

          <UFormField :label="`${isLegalSeller ? 'شناسه ملی' : 'کد ملی'} (اختیاری)`" class="company-field" :error="errors.nationalId" description="در صورت تکمیل، باید دقیقاً ۱۰ رقم باشد.">
            <div class="company-input-shell">
              <UIcon name="i-lucide-hash" class="company-input-icon" aria-hidden="true" />
              <UInput v-model="state.nationalId" class="company-input font-num" placeholder="مثال: ۱۲۳۴۵۶۷۸۹۰" maxlength="10" inputmode="numeric" autocomplete="off" />
            </div>
          </UFormField>

          <UFormField v-if="isLegalSeller" label="شماره ثبت" required class="company-field" :error="errors.registrationNumber" description="فقط عدد، بدون فاصله یا خط تیره.">
            <div class="company-input-shell">
              <UIcon name="i-lucide-file-text" class="company-input-icon" aria-hidden="true" />
              <UInput v-model="state.registrationNumber" class="company-input font-num" placeholder="مثال: ۱۲۳۴۵" maxlength="20" inputmode="numeric" autocomplete="off" />
            </div>
          </UFormField>

          <UFormField label="ایمیل سازمانی" required class="company-field" :error="errors.email" description="برای دریافت اعلان‌های مربوط به درخواست و سفارش‌ها استفاده می‌شود.">
            <div class="company-input-shell">
              <UIcon name="i-lucide-mail" class="company-input-icon" aria-hidden="true" />
              <UInput v-model="state.email" class="company-input" type="email" placeholder="name@company.com" autocomplete="email" />
            </div>
          </UFormField>

          <UFormField label="شماره تماس ثابت (اختیاری)" class="company-field" :error="errors.phone" description="در صورت تکمیل، همراه با پیش‌شماره شهر مثل ۰۲۱ وارد شود.">
            <div class="company-input-shell">
              <UIcon name="i-lucide-phone" class="company-input-icon" aria-hidden="true" />
              <UInput v-model="state.phone" class="company-input company-input--phone font-num" type="tel" placeholder="مثال: ۰۲۱۱۲۳۴۵۶۷۸" maxlength="15" autocomplete="tel" inputmode="tel" />
            </div>
          </UFormField>

        </div>

        <UFormField label="آدرس دفتر مرکزی (اختیاری)" class="company-field company-field--full" description="استان، شهر و نشانی کامل را وارد کنید؛ حداکثر ۵۰۰ نویسه.">
          <UTextarea v-model="state.address" class="company-textarea" :rows="4" maxlength="500" placeholder="مثال: تهران، خیابان ولیعصر..." autocomplete="street-address" />
        </UFormField>

        <UFormField label="لوگو یا تصویر کسب‌وکار (اختیاری)" class="company-field company-field--full" description="فرمت‌های JPG، PNG یا WEBP؛ حداکثر ۱۰ مگابایت.">
          <div class="company-upload">
            <div v-if="logoUrl" class="company-logo-preview">
              <img :src="logoUrl" alt="پیش‌نمایش لوگوی کسب‌وکار" class="h-full w-full object-cover" />
            </div>
            <CompanyFileUpload type="company" @success="onLogoUploaded" @clear="onLogoCleared" />
          </div>
        </UFormField>

        <div class="company-actions flex justify-start gap-3 border-t pt-4">
          <UButton
            type="submit" 
            color="primary" 
            variant="solid"
            size="lg" 
            :loading="loading"
            :disabled="loading || !canSubmit"
            icon="i-lucide-send"
            class="company-submit"
          >
            ارسال درخواست فروشندگی
          </UButton>
          <UButton
            color="neutral"
            variant="outline"
            to="/dashboard"
            size="lg"
            class="company-cancel"
          >
            انصراف
          </UButton>
        </div>
      </form>
    </UCard>

    <div class="seller-help mt-8 bg-blue-50 p-4 rounded-field flex items-start gap-3 border border-blue-100">
      <UIcon name="i-lucide-info" class="size-icon-action text-blue-600 shrink-0 mt-0.5" />
      <div class="text-sm text-blue-800 leading-relaxed">
        <p class="font-bold mb-1">راهنما:</p>
        <p>پس از ارسال درخواست، کارشناسان ما ظرف مدت ۲۴ ساعت کاری مدارک شما را بررسی و پنل فروشندگی شما را فعال خواهند کرد. در صورت نیاز به راهنمایی بیشتر با پشتیبانی تماس بگیرید.</p>
      </div>
    </div>
    </div>
  </div>
</template>

<style scoped>
.company-card {
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-card);
  box-shadow: none;
}

.seller-page__content {
  max-width: 64rem;
  padding-block: 2.5rem 4rem;
}

.company-form :deep(label) {
  color: var(--color-text-heading);
  font-size: 0.875rem;
  font-weight: 600;
}

.form-guidance {
  padding: .75rem 1rem;
  border: 1px solid #bfdbfe;
  border-radius: var(--radius-field);
  background: #eff6ff;
  color: #1e3a8a;
  font-size: .8125rem;
  line-height: 1.75;
}

.company-fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.5rem;
}

.company-field {
  min-width: 0;
}

.company-field--full {
  width: 100%;
}

:deep(.company-input),
:deep(.company-textarea),
:deep(.company-select) {
  width: 100%;
}

.seller-type-options {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: .75rem;
}

.seller-type-option {
  display: flex;
  min-height: 4.25rem;
  align-items: center;
  gap: .75rem;
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-field);
  padding: .75rem 1rem;
  background: #fff;
  color: var(--color-text-heading);
  text-align: right;
  transition: border-color 150ms ease, background-color 150ms ease, box-shadow 150ms ease;
}

.seller-type-option:hover,
.seller-type-option:focus-visible {
  border-color: var(--color-brand-blue);
  background: #f8fbff;
}

.seller-type-option:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}

.seller-type-option--active {
  border-color: var(--color-brand-blue);
  background: #eff6ff;
  box-shadow: 0 0 0 2px rgb(22 115 255 / 12%);
}

.seller-type-icon {
  display: inline-flex;
  flex: 0 0 2.25rem;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: .75rem;
  background: #dbeafe;
  color: var(--color-brand-blue);
}

.seller-type-copy {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: .125rem;
}

.seller-type-copy strong {
  font-size: .875rem;
  font-weight: 700;
}

.seller-type-copy small {
  color: #475569;
  font-size: .75rem;
}

.seller-type-check {
  flex: 0 0 auto;
  color: var(--color-brand-blue);
}

.company-input-shell {
  position: relative;
  width: 100%;
}

.company-input-icon {
  position: absolute;
  z-index: 2;
  inset-inline-start: .875rem;
  top: 50%;
  width: 1.125rem;
  height: 1.125rem;
  color: #475569;
  pointer-events: none;
  transform: translateY(-50%);
}

:deep(.company-input input) {
  min-height: 2.875rem;
  width: 100%;
  padding-block: 0.6875rem;
  padding-inline-start: 3.25rem;
  padding-inline-end: 0.875rem;
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-field);
  background: #fff;
  color: var(--color-text-heading);
  transition: border-color 150ms ease, box-shadow 150ms ease, background-color 150ms ease;
}

:deep(.company-input:hover input:not(:disabled)),
:deep(.company-textarea:hover textarea:not(:disabled)) {
  border-color: #94a3b8;
  background: #f8fafc;
}

:deep(.company-input input:focus-visible),
:deep(.company-textarea textarea:focus-visible) {
  border-color: var(--color-brand-blue);
  outline: none;
  box-shadow: var(--focus-ring);
}

:deep(.company-input input::placeholder),
:deep(.company-textarea textarea::placeholder) {
  color: var(--color-text-body);
  opacity: 1;
}

:deep(.company-textarea textarea) {
  min-height: 7rem;
  width: 100%;
  padding: 0.75rem 0.875rem;
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-field);
  background: #fff;
  color: var(--color-text-heading);
  resize: vertical;
  transition: border-color 150ms ease, box-shadow 150ms ease, background-color 150ms ease;
}

.company-upload {
  display: flex;
  align-items: stretch;
  gap: 1rem;
}

.company-actions {
  border-color: var(--gray-200);
}

.company-submit,
.company-cancel {
  min-height: 2.75rem;
}

.company-submit {
  background: var(--color-brand-blue) !important;
  color: #fff !important;
}

.company-submit :deep(svg) {
  color: #fff !important;
}

.company-submit:not(:disabled):hover {
  background: #0f5dcc !important;
}

.company-submit:disabled {
  color: #64748b !important;
  background: #e2e8f0 !important;
}

.company-submit:disabled :deep(svg) {
  color: #64748b !important;
}

.company-upload :deep(> div:last-child) {
  flex: 1;
}

.company-logo-preview {
  width: 7rem;
  min-width: 7rem;
  height: 7rem;
  overflow: hidden;
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-field);
  background: var(--gray-50);
}

@media (max-width: 767px) {
  .seller-type-options {
    grid-template-columns: 1fr;
  }

  .company-fields {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }

  .company-upload {
    flex-direction: column;
  }

  .company-logo-preview {
    width: 6rem;
    height: 6rem;
  }
}
</style>
