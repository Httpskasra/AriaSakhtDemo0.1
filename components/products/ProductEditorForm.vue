<script setup lang="ts">
import { nextTick, reactive, ref, watch } from "vue";
import type { Product, ProductVariant, ProductVariantOption } from "~/types/product";

type AttributePair = { key: string; value: string };
type CategoryOption = { _id: string; name: string };
type ImagePreview = { file: File; url: string };

const props = withDefaults(defineProps<{
  form: Product;
  editMode?: boolean;
  fullPage?: boolean;
  categoryOptions: CategoryOption[];
  categoriesLoading?: boolean;
  tagsInput: string;
  attributesPairs: AttributePair[];
  imageFiles: File[];
  imagePreviews: ImagePreview[];
  saving?: boolean;
  uploading?: boolean;
  showFormErrors?: boolean;
  formError?: string;
}>(), {
  editMode: false,
  fullPage: false,
  categoriesLoading: false,
  saving: false,
  uploading: false,
  showFormErrors: false,
  formError: "",
});

const emit = defineEmits<{
  (event: "submit", value: Product): void;
  (event: "cancel"): void;
  (event: "upload"): void;
  (event: "update:form", value: Product): void;
  (event: "select-images", value: Event): void;
  (event: "image-error", value: Event): void;
  (event: "update:tagsInput", value: string): void;
  (event: "remove-pending-image", index: number): void;
  (event: "remove-uploaded-image", index: number): void;
  (event: "remove-variant", index: number): void;
  (event: "add-variant"): void;
  (event: "remove-option", variantIndex: number, optionIndex: number): void;
  (event: "add-option", variantIndex: number): void;
  (event: "remove-attribute", index: number): void;
  (event: "add-attribute"): void;
}>();

function cloneProduct(value: Product): Product {
  return {
    ...value,
    categories: [...(value.categories || [])],
    stock: { ...(value.stock || { quantity: 0 }) },
    variants: (value.variants || []).map((variant) => ({
      ...variant,
      options: (variant.options || []).map((option) => ({ ...option })),
    })),
    attributes: { ...(value.attributes || {}) },
    tags: [...(value.tags || [])],
    images: (value.images || []).map((image) => ({ ...image })),
    imagesMeta: (value.imagesMeta || []).map((image) => ({ ...image })),
  };
}

const localForm = reactive(cloneProduct(props.form));
const imageInput = ref<HTMLInputElement | null>(null);
let syncingFromParent = false;

watch(() => props.form, (value) => {
  syncingFromParent = true;
  Object.assign(localForm, cloneProduct(value));
  nextTick(() => { syncingFromParent = false; });
}, { deep: true });

watch(localForm, (value) => {
  if (!syncingFromParent) emit("update:form", cloneProduct(value));
}, { deep: true });

watch(() => props.imageFiles.length, (length) => {
  if (length === 0 && imageInput.value) imageInput.value.value = "";
});

function variantHasError(variant: ProductVariant) {
  return !variant.name.trim() || !variant.options?.length || variant.options.some(optionHasError);
}

function optionHasError(option: ProductVariantOption) {
  const modifier = Number(option.priceModifier ?? 0);
  return !option.value.trim() || !Number.isFinite(modifier) || modifier < 0;
}

function attributeHasError(pair: AttributePair) {
  return Boolean(pair.key.trim()) !== Boolean(pair.value.trim());
}
</script>

<template>
  <div class="product-editor" :class="{ 'product-editor--page': fullPage }" dir="rtl">
    <header class="product-editor__header">
      <div class="product-modal__title-icon" aria-hidden="true">
        <UIcon :name="editMode ? 'i-lucide-pencil-line' : 'i-lucide-package-plus'" />
      </div>
      <div>
        <p class="product-editor__eyebrow">{{ fullPage ? "فرم حرفه‌ای ثبت محصول" : "مدیریت محصول" }}</p>
        <h2 :id="fullPage ? 'product-page-form-title' : 'product-form-title'">{{ editMode ? "ویرایش محصول" : "محصول جدید" }}</h2>
        <p>{{ editMode ? "اطلاعات، قیمت و موجودی محصول را به‌روز کنید." : "اطلاعات را با دقت وارد کنید؛ تغییرات فرم به‌صورت خودکار به‌عنوان پیش‌نویس محلی ذخیره می‌شوند." }}</p>
      </div>
    </header>

    <UAlert
      v-if="fullPage && !editMode"
      color="info"
      variant="soft"
      icon="i-lucide-save"
      title="ذخیره‌ی خودکار فعال است"
      description="اطلاعات متنی فرم هنگام ورود ذخیره می‌شود. برای ثبت فایل تصویر، ابتدا آن را آپلود کنید؛ فایل انتخاب‌شده‌ی آپلودنشده با بستن یا refresh قابل بازیابی نیست." />

    <UForm :state="localForm" :aria-labelledby="fullPage ? 'product-page-form-title' : 'product-form-title'" class="product-form" @submit.prevent="emit('submit', cloneProduct(localForm))">
      <section class="product-form__section">
        <div class="product-form__section-heading"><span>اطلاعات اصلی</span><small>فیلدهای ضروری محصول</small></div>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <UFormField label="نام" name="name">
            <UInput v-model="localForm.name" required placeholder="مثلاً سیمان تیپ ۲" />
          </UFormField>
          <UFormField label="نامک (slug)" name="slug">
            <UInput v-model="localForm.slug" class="ltr" required placeholder="مثلاً cement-type-2" />
          </UFormField>
          <UFormField label="SKU" name="sku">
            <UInput v-model="localForm.sku" class="ltr" required placeholder="مثلاً CEM-T2-001" />
          </UFormField>
          <UFormField label="قیمت پایه (ریال)" name="basePrice">
            <UInput v-model.number="localForm.basePrice" type="number" min="0" inputmode="numeric" />
          </UFormField>
          <UFormField label="تخفیف (%)" name="discount">
            <UInput v-model.number="localForm.discount" type="number" min="0" max="100" inputmode="numeric" />
          </UFormField>
          <UFormField label="موجودی" name="stockQuantity">
            <UInput v-model.number="localForm.stock.quantity" type="number" min="0" inputmode="numeric" />
          </UFormField>
        </div>
      </section>

      <section class="product-form__section">
        <div class="product-form__section-heading"><span>توضیحات و دسته‌بندی</span><small>به پیدا شدن و تصمیم خرید کمک می‌کند</small></div>
        <UFormField label="توضیحات" name="description">
          <UTextarea v-model="localForm.description" :rows="4" maxlength="500" placeholder="توضیح کوتاه و دقیق درباره محصول…" />
        </UFormField>
        <UFormField label="دسته‌بندی" name="categories">
          <div class="space-y-2">
            <AppMultiSelect
              v-model="localForm.categories"
              :loading="categoriesLoading"
              :items="categoryOptions"
              value-key="_id"
              label-key="name"
              aria-label="دسته‌بندی محصول"
              placeholder="دسته‌بندی محصول را انتخاب کنید" />
            <div class="products-form-hint">می‌توانید چند دسته‌بندی مرتبط انتخاب کنید.</div>
          </div>
        </UFormField>
        <UFormField label="برچسب‌ها" name="tags">
          <UInput :model-value="tagsInput" placeholder="مثلاً سیمان، ساختمانی، تیپ ۲" @update:model-value="emit('update:tagsInput', $event)" />
        </UFormField>
      </section>

      <section class="product-form__section">
        <div class="product-form__section-heading"><span>تصاویر محصول</span><small>حداکثر ۵ تصویر، JPG، PNG یا WEBP، هرکدام تا ۱۰ مگابایت</small></div>
        <div class="space-y-3">
          <label for="product-images" class="products-upload-dropzone">
            <UIcon name="i-lucide-cloud-upload" aria-hidden="true" />
            <span><strong>انتخاب تصویر</strong> یا فایل‌ها را اینجا رها کنید</span>
            <small>تصویر اول به‌عنوان تصویر اصلی نمایش داده می‌شود.</small>
            <input id="product-images" ref="imageInput" type="file" multiple accept="image/jpeg,image/png,image/webp" @change="emit('select-images', $event)" />
          </label>

          <div v-if="imageFiles.length" class="products-pending-files">
            <span>{{ imageFiles.length }} تصویر آماده آپلود است.</span>
            <UButton v-if="!uploading" type="button" size="sm" icon="i-lucide-cloud-upload" color="primary" variant="solid" class="products-primary-action" @click="emit('upload')">آپلود و افزودن</UButton>
            <span v-else class="products-upload-status">در حال آپلود...</span>
          </div>

          <div v-if="imagePreviews.length" class="products-image-grid" aria-label="پیش‌نمایش تصاویر انتخاب‌شده">
            <div v-for="(preview, i) in imagePreviews" :key="preview.url" class="products-image-tile products-image-tile--pending">
              <img :src="preview.url" :alt="`پیش‌نمایش تصویر ${i + 1}`" />
              <span class="products-image-tile__label">در انتظار آپلود</span>
              <UButton type="button" icon="i-lucide-x" size="xs" color="error" variant="soft" aria-label="حذف تصویر انتخاب‌شده" @click="emit('remove-pending-image', i)" />
            </div>
          </div>

          <div v-if="localForm.images.length" class="products-image-grid" aria-label="تصاویر آپلودشده">
            <div v-for="(img, i) in localForm.images" :key="`${img.url}-${i}`" class="products-image-tile">
              <img :src="img.url" :alt="`تصویر محصول ${i + 1}`" @error="emit('image-error', $event)" />
              <span v-if="i === 0" class="products-image-tile__label">تصویر اصلی</span>
              <UButton type="button" icon="i-lucide-trash-2" size="xs" color="error" variant="soft" aria-label="حذف تصویر آپلودشده" @click="emit('remove-uploaded-image', i)" />
            </div>
          </div>
          <p v-else-if="!imagePreviews.length" class="products-images-empty"><UIcon name="i-lucide-image" aria-hidden="true" /> هنوز تصویری اضافه نشده است.</p>
        </div>
      </section>

      <p v-if="formError" class="product-form-error" role="alert">{{ formError }}</p>

      <section class="product-form__section">
        <div class="product-form__section-heading"><div><span>گزینه‌های قابل انتخاب هنگام خرید</span><small>برای رنگ، وزن یا نوع بسته‌بندی؛ مشتری هنگام خرید یکی از مقدارها را انتخاب می‌کند.</small></div></div>
        <div class="product-form__explainer"><UIcon name="i-lucide-circle-help" aria-hidden="true" /><span><strong>واریانت یعنی انتخاب خرید.</strong> هر عنوان یک گروه گزینه است و باید حداقل یک مقدار داشته باشد. افزایش قیمت به ریال وارد می‌شود.</span></div>
        <div class="product-options-editor">
          <article v-for="(variant, vi) in localForm.variants" :key="vi" class="product-option-card" :class="{ 'product-option-card--invalid': showFormErrors && variantHasError(variant) }">
            <div class="product-option-card__header">
              <div><span class="product-option-card__step">گزینه {{ (vi + 1).toLocaleString("fa-IR") }}</span><h3>عنوان گزینه خرید</h3></div>
              <UButton type="button" size="sm" color="error" variant="soft" icon="i-lucide-trash-2" @click="emit('remove-variant', vi)">حذف گزینه خرید</UButton>
            </div>
            <div class="product-field-row" :class="{ 'product-field-row--invalid': showFormErrors && !variant.name.trim() }">
              <UInput v-model="variant.name" placeholder="مثلاً رنگ، وزن یا نوع بسته‌بندی" aria-label="عنوان گزینه خرید" />
              <span v-if="showFormErrors && !variant.name.trim()" class="product-field-error">عنوان گزینه را وارد کنید.</span>
            </div>
            <div class="product-option-card__options">
              <div v-for="(option, oi) in variant.options" :key="oi" class="product-option-row" :class="{ 'product-option-row--invalid': showFormErrors && optionHasError(option) }">
                <div class="product-field-row"><label>مقدار قابل انتخاب</label><UInput v-model="option.value" placeholder="مثلاً سفید یا ۵۰ کیلوگرم" aria-label="مقدار قابل انتخاب" /></div>
                <div class="product-field-row"><label>افزایش قیمت نسبت به پایه (ریال)</label><UInput v-model.number="option.priceModifier" type="number" min="0" placeholder="۰ = بدون افزایش" aria-label="افزایش قیمت نسبت به پایه" /></div>
                <UButton type="button" size="sm" color="neutral" variant="soft" icon="i-lucide-x" aria-label="حذف مقدار گزینه" @click="emit('remove-option', vi, oi)">حذف مقدار</UButton>
                <span v-if="showFormErrors && !option.value.trim()" class="product-field-error">مقدار را وارد کنید.</span>
              </div>
            </div>
            <UButton type="button" size="sm" color="neutral" variant="outline" class="products-secondary-action" icon="i-lucide-plus" @click="emit('add-option', vi)">افزودن مقدار</UButton>
          </article>
        </div>
        <UButton type="button" size="sm" color="neutral" variant="outline" class="products-secondary-action" icon="i-lucide-plus" @click="emit('add-variant')">افزودن گزینه خرید</UButton>
      </section>

      <section class="product-form__section">
        <div class="product-form__section-heading"><div><span>مشخصات فنی ثابت محصول</span><small>اطلاعاتی که مشتری می‌خواند و انتخاب نمی‌کند؛ مثل برند، جنس، استاندارد یا ابعاد.</small></div></div>
        <div class="product-form__explainer"><UIcon name="i-lucide-info" aria-hidden="true" /><span><strong>ویژگی فنی یعنی مشخصه ثابت.</strong> این بخش قیمت را تغییر نمی‌دهد و در صفحه محصول به‌صورت جدول نمایش داده می‌شود.</span></div>
        <div class="product-attributes-editor">
          <div v-for="(pair, i) in attributesPairs" :key="i" class="product-attribute-row" :class="{ 'product-attribute-row--invalid': showFormErrors && attributeHasError(pair) }">
            <div class="product-field-row"><label>عنوان مشخصه</label><UInput v-model="pair.key" placeholder="مثلاً برند، جنس یا ابعاد" aria-label="عنوان مشخصه فنی" /></div>
            <div class="product-field-row"><label>مقدار مشخصه</label><UInput v-model="pair.value" placeholder="مثلاً سیمان تیپ ۲ یا ۱۰ × ۲۰ سانتی‌متر" aria-label="مقدار مشخصه فنی" /></div>
            <UButton type="button" size="sm" color="neutral" variant="soft" icon="i-lucide-x" aria-label="حذف مشخصه فنی" @click="emit('remove-attribute', i)">حذف مشخصه</UButton>
            <span v-if="showFormErrors && attributeHasError(pair)" class="product-field-error">عنوان و مقدار مشخصه را کامل کنید.</span>
          </div>
        </div>
        <UButton type="button" size="sm" color="neutral" variant="outline" class="products-secondary-action" icon="i-lucide-plus" @click="emit('add-attribute')">افزودن مشخصه فنی</UButton>
      </section>

      <div class="product-editor__actions">
        <UButton type="button" color="neutral" variant="soft" @click="emit('cancel')">{{ fullPage ? "بازگشت به فهرست" : "انصراف" }}</UButton>
        <UButton type="submit" icon="i-lucide-save" :loading="saving" :disabled="saving || uploading">{{ fullPage && !editMode ? "ذخیره پیش‌نویس" : "ذخیره" }}</UButton>
      </div>
    </UForm>
  </div>
</template>

<style scoped>
.product-editor { display: grid; gap: 1rem; width: 100%; min-width: 0; }
.product-editor--page { max-width: 70rem; margin-inline: auto; padding-bottom: 2rem; }
.product-editor__header { display: flex; align-items: center; gap: .75rem; padding-bottom: .25rem; }
.product-editor__header h2 { margin: 0; color: var(--color-text-heading); font-size: clamp(1.1rem, 2vw, 1.35rem); font-weight: 900; }
.product-editor__header p { margin: .2rem 0 0; color: var(--color-text-muted); font-size: .75rem; line-height: 1.7; }
.product-editor__eyebrow { color: var(--color-brand-blue) !important; font-size: .7rem !important; font-weight: 800; }
.product-modal__title-icon { display: grid; flex: 0 0 auto; width: 2.75rem; height: 2.75rem; place-items: center; border-radius: var(--radius-compact-list-item); color: var(--color-brand-blue); background: var(--color-info-bg); font-size: 1.25rem; }
.product-form { display: grid; gap: 1rem; }
.product-form__section { display: grid; gap: 1rem; padding: 1rem; border: 1px solid var(--color-border); border-radius: var(--radius-card); background: var(--color-bg-light); }
.product-form__section-heading { display: flex; align-items: baseline; justify-content: space-between; gap: .75rem; padding-bottom: .65rem; border-bottom: 1px solid var(--color-border); color: var(--color-text-heading); font-size: .9rem; font-weight: 800; }
.product-form__section-heading small { color: var(--color-text-muted); font-size: .68rem; font-weight: 500; line-height: 1.7; }
.products-form-hint { color: var(--color-text-muted); font-size: .75rem; }
.product-form-error { margin: 0; padding: .7rem .8rem; border: 1px solid var(--color-danger-border); border-radius: var(--radius-field); color: var(--color-danger-fg); background: var(--color-danger-bg); font-size: .78rem; font-weight: 700; line-height: 1.7; }
.product-form__explainer { display: flex; align-items: flex-start; gap: .5rem; padding: .7rem .8rem; border: 1px solid var(--color-info-border); border-radius: var(--radius-field); color: var(--color-text-muted); background: var(--color-info-bg); font-size: .74rem; line-height: 1.8; }
.product-form__explainer :deep(svg) { flex: 0 0 auto; margin-top: .2rem; color: var(--color-brand-blue); }
.product-form__explainer strong { color: var(--color-text-heading); }
.product-options-editor, .product-attributes-editor { display: grid; gap: .75rem; }
.product-option-card, .product-attribute-row { display: grid; gap: .75rem; padding: .85rem; border: 1px solid var(--color-border); border-radius: var(--radius-field); background: var(--color-bg-surface); }
.product-option-card--invalid, .product-attribute-row--invalid { border-color: var(--color-danger-border); }
.product-option-card__header { display: flex; align-items: flex-start; justify-content: space-between; gap: .75rem; }
.product-option-card__header h3 { margin: .2rem 0 0; color: var(--color-text-heading); font-size: .82rem; }
.product-option-card__step { color: var(--color-brand-blue); font-size: .68rem; font-weight: 800; }
.product-field-row { display: grid; min-width: 0; gap: .3rem; }
.product-field-row label { color: var(--color-text-muted); font-size: .7rem; font-weight: 700; }
.product-field-row--invalid :deep(input), .product-option-row--invalid :deep(input), .product-attribute-row--invalid :deep(input) { border-color: var(--color-danger-fg) !important; }
.product-field-error { color: var(--color-danger-fg); font-size: .68rem; font-weight: 700; }
.product-option-card > .product-field-row { max-width: 34rem; }
.product-option-card__options { display: grid; gap: .65rem; }
.product-option-row { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr) auto; gap: .6rem; align-items: end; padding: .7rem; border: 1px dashed var(--color-border); border-radius: var(--radius-field); background: var(--color-bg-light); }
.product-option-row .product-field-error, .product-attribute-row .product-field-error { grid-column: 1 / -1; }
.product-attribute-row { grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr) auto; align-items: end; }
.products-upload-dropzone { display: grid; place-items: center; gap: .4rem; min-height: 8rem; padding: 1rem; border: 1px dashed var(--color-info-border); border-radius: var(--radius-field); color: var(--color-text-body); background: var(--color-bg-surface); text-align: center; cursor: pointer; }
.products-upload-dropzone > :deep(svg) { color: var(--color-brand-blue); font-size: 1.5rem; }
.products-upload-dropzone strong { color: var(--color-brand-blue); }
.products-upload-dropzone small { color: var(--color-text-muted); font-size: .7rem; }
.products-upload-dropzone input { position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; }
.products-upload-dropzone:focus-within { box-shadow: var(--focus-ring); }
.products-pending-files { display: flex; align-items: center; justify-content: space-between; gap: .75rem; padding: .65rem .75rem; border-radius: var(--radius-field); color: var(--color-brand-blue); background: var(--color-info-bg); font-size: .78rem; }
.products-upload-status { color: var(--color-brand-blue); font-weight: 700; }
.products-primary-action { min-height: 2.75rem; border: 1px solid var(--color-brand-blue) !important; background: var(--color-brand-blue) !important; color: var(--color-bg-surface) !important; font-weight: 800; }
.products-secondary-action { min-height: 2.5rem; border: 1px solid var(--color-border-strong) !important; background: var(--color-bg-surface) !important; color: var(--color-text-heading) !important; font-weight: 800; }
.products-secondary-action:hover:not(:disabled) { border-color: var(--color-brand-blue) !important; background: var(--color-info-bg) !important; color: var(--color-brand-blue) !important; }
.products-image-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: .65rem; }
.products-image-tile { position: relative; display: grid; min-width: 0; aspect-ratio: 1; overflow: hidden; border: 1px solid var(--color-border); border-radius: var(--radius-field); background: var(--color-bg-surface); }
.products-image-tile img { width: 100%; height: 100%; padding: .3rem; object-fit: contain; }
.products-image-tile :deep(button) { position: absolute; inset-block-start: .3rem; inset-inline-end: .3rem; }
.products-image-tile__label { position: absolute; inset-inline: .35rem; inset-block-end: .35rem; padding: .2rem .3rem; border-radius: var(--radius-pill); color: var(--color-text-heading); background: color-mix(in srgb, var(--color-bg-surface) 88%, transparent); font-size: .62rem; text-align: center; }
.products-image-tile--pending { border-style: dashed; border-color: var(--color-info-border); }
.products-images-empty { display: flex; align-items: center; justify-content: center; gap: .4rem; min-height: 5rem; margin: 0; border: 1px dashed var(--color-border); border-radius: var(--radius-field); color: var(--color-text-muted); font-size: .78rem; }
.product-editor__actions { display: flex; justify-content: flex-start; gap: .6rem; padding: 1rem; border: 1px solid var(--color-border); border-radius: var(--radius-card); background: var(--color-bg-surface); box-shadow: var(--shadow-raised); position: sticky; bottom: .75rem; z-index: 3; }
.product-editor__actions :deep(button) { min-height: 2.75rem; }
.ltr { direction: ltr; }
@media (max-width: 700px) { .product-option-row, .product-attribute-row { grid-template-columns: 1fr; align-items: stretch; } .product-option-row .product-field-error, .product-attribute-row .product-field-error { grid-column: auto; } }
@media (max-width: 480px) { .product-form__section { padding: .75rem; } .product-form__section-heading { align-items: flex-start; flex-direction: column; gap: .2rem; } .product-option-card, .product-attribute-row { padding: .7rem; } .product-option-card__header { align-items: stretch; flex-direction: column; } .products-image-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } .products-pending-files, .product-editor__actions { align-items: stretch; flex-direction: column; } }
@media (prefers-reduced-motion: reduce) { .product-editor__actions { transition: none; } }
</style>
