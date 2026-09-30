<script setup lang="ts">
import { reactive, ref } from 'vue';
import { createPriceQuote, createWholesaleRequest, type QuoteRequestPayload } from '~/services/customerRequestService';
import { toUserFacingError } from '~/services/apiClient';

const props = defineProps<{
  type: 'price_quote' | 'wholesale';
  title: string;
  description: string;
}>();

const { isAuthenticated } = useUser();
const { setStep } = useAuthStep();
const form = reactive<QuoteRequestPayload>({
  title: props.type === 'wholesale' ? 'درخواست خرید عمده' : 'استعلام قیمت',
  productName: '',
  quantity: 1,
  unit: 'عدد',
  deliveryLocation: '',
  description: '',
});
const errors = reactive<Record<string, string>>({});
const loading = ref(false);
const error = ref('');
const success = ref('');

function validate() {
  Object.keys(errors).forEach((key) => { errors[key] = ''; });
  if (!form.productName.trim()) errors.productName = 'نام محصول یا کالای موردنیاز را وارد کنید.';
  if (!Number.isInteger(Number(form.quantity)) || Number(form.quantity) < 1) errors.quantity = 'مقدار باید حداقل ۱ باشد.';
  if (!form.unit.trim()) errors.unit = 'واحد را وارد کنید.';
  if (!form.deliveryLocation.trim()) errors.deliveryLocation = 'محل تحویل را وارد کنید.';
  return !Object.values(errors).some(Boolean);
}

function clearError(field: string) {
  errors[field] = '';
  error.value = '';
}

async function submit() {
  if (!isAuthenticated.value) {
    setStep('signin');
    return;
  }
  if (loading.value || !validate()) return;
  loading.value = true;
  error.value = '';
  success.value = '';
  try {
    const payload = { ...form, title: form.title.trim(), productName: form.productName.trim(), quantity: Number(form.quantity), unit: form.unit.trim(), deliveryLocation: form.deliveryLocation.trim(), description: form.description?.trim() };
    if (props.type === 'wholesale') await createWholesaleRequest(payload);
    else await createPriceQuote(payload);
    success.value = 'درخواست شما ثبت شد. نتیجه و پاسخ کارشناسان را از پنل کاربری پیگیری کنید.';
    Object.assign(form, { productName: '', quantity: 1, unit: 'عدد', deliveryLocation: '', description: '' });
  } catch (err) {
    error.value = toUserFacingError(err, 'ثبت درخواست انجام نشد. لطفاً دوباره تلاش کنید.').message;
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <section class="customer-request-form panel-surface" aria-labelledby="customer-request-form-title">
    <div class="customer-request-form__heading">
      <div>
        <p class="section-kicker">فرم اختصاصی درخواست</p>
        <h2 id="customer-request-form-title" class="section-title">{{ title }}</h2>
        <p class="section-copy">{{ description }}</p>
      </div>
      <div class="customer-request-form__secure" aria-hidden="true"><UIcon name="i-lucide-clipboard-check" /></div>
    </div>

    <div v-if="!isAuthenticated" class="customer-request-form__login" role="note">
      <UIcon name="i-lucide-log-in" aria-hidden="true" />
      <span>برای ثبت و پیگیری درخواست، ابتدا وارد حساب کاربری شوید.</span>
      <UButton type="button" size="sm" variant="soft" @click="setStep('signin')">ورود به حساب</UButton>
    </div>

    <form class="customer-request-form__fields" @submit.prevent="submit">
      <UFormField label="نام محصول یا کالای موردنیاز" required :error="errors.productName || undefined">
        <UInput v-model="form.productName" placeholder="مثلاً سیمان تیپ ۲" :aria-invalid="Boolean(errors.productName)" @update:model-value="clearError('productName')" />
      </UFormField>
      <UFormField label="مقدار موردنیاز" required :error="errors.quantity || undefined">
        <UInput v-model.number="form.quantity" type="number" min="1" placeholder="مثلاً ۱۰۰" :aria-invalid="Boolean(errors.quantity)" @update:model-value="clearError('quantity')" />
      </UFormField>
      <UFormField label="واحد" required :error="errors.unit || undefined">
        <UInput v-model="form.unit" placeholder="تن، عدد، مترمربع…" :aria-invalid="Boolean(errors.unit)" @update:model-value="clearError('unit')" />
      </UFormField>
      <UFormField label="محل تحویل" required :error="errors.deliveryLocation || undefined">
        <UInput v-model="form.deliveryLocation" placeholder="استان، شهر یا آدرس پروژه" :aria-invalid="Boolean(errors.deliveryLocation)" @update:model-value="clearError('deliveryLocation')" />
      </UFormField>
      <UFormField label="توضیحات تکمیلی" class="customer-request-form__wide">
        <UTextarea v-model="form.description" :rows="5" placeholder="زمان‌بندی، مشخصات فنی، نوع بسته‌بندی یا هر توضیحی که به اعلام قیمت دقیق‌تر کمک می‌کند…" />
      </UFormField>

      <div v-if="error" class="form-feedback form-feedback--error" role="alert"><UIcon name="i-lucide-circle-alert" aria-hidden="true" />{{ error }}</div>
      <div v-if="success" class="form-feedback form-feedback--success" role="status"><UIcon name="i-lucide-circle-check" aria-hidden="true" />{{ success }}</div>
      <UButton type="submit" size="lg" block icon="i-lucide-send" :loading="loading" :disabled="loading" class="customer-request-form__submit">
        {{ isAuthenticated ? 'ثبت درخواست' : 'ورود و ثبت درخواست' }}
      </UButton>
    </form>
  </section>
</template>

<style scoped>
.customer-request-form { padding: clamp(1.25rem, 3vw, 2rem); }
.customer-request-form__heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; padding-bottom: 1.25rem; border-bottom: 1px solid var(--color-border); }
.section-copy { margin-top: .5rem; color: var(--color-text-body); line-height: 2; }
.customer-request-form__secure { display: grid; flex: 0 0 3rem; width: 3rem; height: 3rem; place-items: center; border-radius: var(--radius-card); background: var(--color-info-bg); color: var(--color-brand-blue); font-size: 1.4rem; }
.customer-request-form__login { display: flex; align-items: center; gap: .65rem; margin-top: 1.25rem; border: 1px solid var(--color-info-border); border-radius: var(--radius-field); padding: .75rem; color: var(--color-info-fg); background: var(--color-info-bg); font-size: .8rem; line-height: 1.8; }
.customer-request-form__login span { flex: 1; }
.customer-request-form__fields { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; margin-top: 1.25rem; }
.customer-request-form__wide, .form-feedback, .customer-request-form__submit { grid-column: 1 / -1; }
.customer-request-form__submit { min-height: 2.875rem; }
.form-feedback { display: flex; align-items: flex-start; gap: .5rem; border-radius: var(--radius-field); padding: .75rem; font-size: .8rem; line-height: 1.8; }
.form-feedback--error { color: var(--color-danger-fg); background: var(--color-danger-bg); }
.form-feedback--success { color: var(--color-success-fg); background: var(--color-success-bg); }
@media (max-width: 640px) { .customer-request-form__fields { grid-template-columns: 1fr; } .customer-request-form__wide, .form-feedback, .customer-request-form__submit { grid-column: auto; } .customer-request-form__login { align-items: flex-start; flex-wrap: wrap; } }
</style>
