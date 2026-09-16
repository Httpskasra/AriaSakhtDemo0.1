<template>
    <div class="products-page">
      <PanelPageHeader title="محصولات" subtitle="محصولات، قیمت و موجودی فروشگاه را مدیریت کنید." icon="i-lucide-boxes">
        <template #actions><UButton v-if="canCreate && canRead" icon="i-lucide-plus" color="primary" variant="solid" class="products-primary-action" @click="openModal()">محصول جدید</UButton></template>
      </PanelPageHeader>

      <section class="products-overview" aria-label="خلاصه محصولات">
        <article class="products-overview__card">
          <span>نتیجه‌های این صفحه</span>
          <strong class="font-num">{{ products.length.toLocaleString("fa-IR") }}</strong>
          <small>از {{ total.toLocaleString("fa-IR") }} محصول</small>
        </article>
        <article class="products-overview__card products-overview__card--success">
          <span>فعال</span>
          <strong class="font-num">{{ activeProductsCount.toLocaleString("fa-IR") }}</strong>
          <small>در نتیجه‌های فعلی</small>
        </article>
        <article class="products-overview__card products-overview__card--warning">
          <span>پیش‌نویس</span>
          <strong class="font-num">{{ draftProductsCount.toLocaleString("fa-IR") }}</strong>
          <small>نیازمند تکمیل یا انتشار</small>
        </article>
        <article class="products-overview__card products-overview__card--danger">
          <span>موجودی صفر</span>
          <strong class="font-num">{{ outOfStockCount.toLocaleString("fa-IR") }}</strong>
          <small>در نتیجه‌های فعلی</small>
        </article>
      </section>

      <PanelFilterBar>
        <div class="flex flex-wrap items-center gap-2">
          <TableFilterInput
            v-model="search"
            placeholder="جستجوی محصول..."
            @submit="applyProductFilters" />
          <AppSelect
            v-model="sort"
            :items="[
              { label: 'جدیدترین', value: 'createdAt:desc' },
              { label: 'قدیمی‌ترین', value: 'createdAt:asc' },
              { label: 'نام (الفبا)', value: 'name:asc' },
              { label: 'قیمت نزولی', value: 'basePrice:desc' }
            ]" />
          <AppSelect
            v-model="limit"
            :items="[
              { label: '۱۰', value: 10 },
              { label: '۲۵', value: 25 },
              { label: '۵۰', value: 50 }
            ]" />
        </div>
        <UButton v-if="search" variant="ghost" color="neutral" icon="i-lucide-x" @click="search = ''; applyProductFilters()">حذف فیلتر</UButton>
      </PanelFilterBar>

      <PanelPermissionGuard :allowed="canRead" :ready="isReady" title="دسترسی به محصولات امکان‌پذیر نیست" message="حساب کاربری شما مجوز مشاهده محصولات را ندارد.">
        <div class="products-panel panel-surface">
        <SharedAsyncState v-if="loading" state="loading" :skeleton-rows="5" />
        <SharedAsyncState
          v-else-if="loadError"
          state="error"
          title="دریافت محصولات انجام نشد"
          :message="loadError"
          @retry="fetchProducts" />
        <SharedAsyncState
          v-else-if="products.length === 0"
          state="empty"
          :title="search ? 'محصولی با این جستجو پیدا نشد' : 'هنوز محصولی ثبت نشده است'"
          :message="search ? 'عبارت جستجو یا فیلترها را تغییر دهید.' : 'برای شروع، اولین محصول خود را ثبت کنید.'">
          <UButton v-if="!search && canCreate" type="button" icon="i-lucide-plus" color="primary" variant="solid" class="products-primary-action" @click="openModal()">افزودن محصول</UButton>
        </SharedAsyncState>
        <div v-else class="products-table-wrap">
          <TableScrollContainer>
            <table class="panel-table products-table">
              <caption class="sr-only">فهرست محصولات و عملیات مدیریت آن‌ها</caption>
          <thead>
            <tr>
              <th>محصول</th>
              <th>قیمت</th>
              <th>موجودی</th>
              <th>وضعیت</th>
              <th>اقدامات</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="product in products"
              :key="product._id || product.id">
              <td class="products-table__identity">
                <img
                  v-if="product.images?.[0]?.url"
                  :src="product.images[0].url"
                  class="products-table__image"
                  :alt="`تصویر ${product.name}`"
                  loading="lazy"
                  @error="handleTableImageError" />
                <span v-else class="products-table__image products-table__image--empty" aria-hidden="true">
                  <UIcon name="i-lucide-image-off" />
                </span>
                <div class="products-table__identity-copy">
                  <strong class="products-table__name">{{ product.name }}</strong>
                  <span class="products-table__sku ltr">SKU: {{ product.sku || "-" }}</span>
                  <span v-if="product.variants?.length || Object.keys(product.attributes || {}).length" class="products-table__metadata">
                    <span v-if="product.variants?.length">{{ product.variants.length.toLocaleString("fa-IR") }} گزینه خرید</span>
                    <span v-if="product.variants?.length && Object.keys(product.attributes || {}).length"> · </span>
                    <span v-if="Object.keys(product.attributes || {}).length">{{ Object.keys(product.attributes || {}).length.toLocaleString("fa-IR") }} مشخصه فنی</span>
                  </span>
                </div>
              </td>
              <td class="products-table__price">
                <strong class="font-num">{{ numberFormat(product.finalPrice ?? product.basePrice) }} ریال</strong>
                <span v-if="product.discount" class="products-table__discount font-num">{{ product.discount }}٪ تخفیف</span>
              </td>
              <td>
                <span class="products-stock" :class="{ 'products-stock--empty': !(product.stock?.quantity ?? 0), 'products-stock--low': (product.stock?.quantity ?? 0) > 0 && (product.stock?.quantity ?? 0) <= 5 }">
                  <UIcon :name="(product.stock?.quantity ?? 0) > 0 ? 'i-lucide-package-check' : 'i-lucide-package-x'" aria-hidden="true" />
                  <span class="font-num">{{ (product.stock?.quantity ?? 0).toLocaleString("fa-IR") }}</span>
                </span>
              </td>
              <td>
                <PanelStatusBadge
                  :label="statusFa(product.status)"
                  :status="product.status"
                  size="compact" />
              </td>
              <td>
                <div class="panel-row-actions products-table__actions">
                <UButton
                  v-if="product._id || product.id"
                  :to="`/products/${product._id || product.id}`"
                  icon="i-lucide-eye"
                  size="xs"
                  color="neutral"
                  variant="soft"
                  aria-label="مشاهده محصول">
                  مشاهده
                </UButton>
                <UButton
                  v-if="canUpdate"
                  icon="i-lucide-pencil"
                  @click="openModal(product)"
                  size="xs"
                  color="neutral"
                  variant="ghost"
                  aria-label="ویرایش محصول">
                  ویرایش
                </UButton>
                <UButton
                  v-if="canDelete"
                  icon="i-lucide-trash-2"
                  @click="requestDelete(product)"
                  size="xs"
                  color="error"
                  variant="ghost"
                  :loading="deletingId === (product._id || product.id)"
                  aria-label="حذف محصول">
                  حذف
                </UButton>
                </div>
              </td>
            </tr>
          </tbody>
            </table>
          </TableScrollContainer>
        </div>
        </div>
      </PanelPermissionGuard>

      <div v-if="total > limit" class="flex justify-center py-4">
        <UPagination v-model="page" :total="total" :page-count="limit" :disabled="loading" />
      </div>

      <!-- Modal -->
      <BaseModal v-if="showModal" :busy="saving" @close="closeModal">
        <template #default>
          <header class="product-modal__header">
            <div class="product-modal__title-icon" aria-hidden="true"><UIcon :name="editMode ? 'i-lucide-pencil-line' : 'i-lucide-package-plus'" /></div>
            <div>
              <h2 id="product-form-title">{{ editMode ? "ویرایش محصول" : "محصول جدید" }}</h2>
              <p>{{ editMode ? "اطلاعات، قیمت و موجودی محصول را به‌روز کنید." : "اطلاعات محصول را وارد کنید تا در فروشگاه نمایش داده شود." }}</p>
            </div>
          </header>

          <UForm :state="form" aria-labelledby="product-form-title" @submit.prevent="saveProduct" class="product-form">
            <section class="product-form__section">
              <div class="product-form__section-heading"><span>اطلاعات اصلی</span><small>فیلدهای ضروری محصول</small></div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UFormField label="نام" name="name">
                <UInput v-model="form.name" required placeholder="مثلاً سیمان تیپ ۲" />
              </UFormField>

              <UFormField label="نامک (slug)" name="slug">
                <UInput v-model="form.slug" class="ltr" required />
              </UFormField>

              <UFormField label="SKU" name="sku">
                <UInput v-model="form.sku" class="ltr" required placeholder="مثلاً CEM-T2-001" />
              </UFormField>

              <UFormField label="قیمت پایه" name="basePrice">
                <UInput v-model.number="form.basePrice" type="number" />
              </UFormField>

              <UFormField label="تخفیف (%)" name="discount">
                <UInput v-model.number="form.discount" type="number" min="0" max="100" />
              </UFormField>

              <UFormField label="موجودی" name="stockQuantity">
                <UInput v-model.number="form.stock.quantity" type="number" min="0" />
              </UFormField>
              </div>
            </section>

            <section class="product-form__section">
              <div class="product-form__section-heading"><span>توضیحات و دسته‌بندی</span><small>به پیدا شدن و تصمیم خرید کمک می‌کند</small></div>
              <UFormField label="توضیحات" name="description">
                <UTextarea v-model="form.description" :rows="4" maxlength="500" placeholder="توضیح کوتاه و دقیق درباره محصول…" />
              </UFormField>

              <UFormField label="دسته‌بندی" name="categories">
                <div class="space-y-2">
                  <AppMultiSelect
                    v-model="form.categories"
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
                <UInput v-model="tagsInput" @blur="syncTagsFromInput" placeholder="مثلاً سیمان، ساختمانی، تیپ ۲" />
              </UFormField>
            </section>

            <section class="product-form__section">
              <div class="product-form__section-heading"><span>تصاویر محصول</span><small>حداکثر ۵ تصویر، JPG، PNG یا WEBP، هرکدام تا ۱۰ مگابایت</small></div>
              <div class="space-y-3">
                <label for="product-images" class="products-upload-dropzone">
                  <UIcon name="i-lucide-cloud-upload" aria-hidden="true" />
                  <span><strong>انتخاب تصویر</strong> یا فایل‌ها را اینجا رها کنید</span>
                  <small>تصویر اول به‌عنوان تصویر اصلی نمایش داده می‌شود.</small>
                  <input id="product-images" ref="fileInputRef" type="file" multiple accept="image/jpeg,image/png,image/webp" @change="handleImageSelection" />
                </label>

                <div v-if="imageFiles.length" class="products-pending-files">
                  <span>{{ imageFiles.length }} تصویر آماده آپلود است.</span>
                  <UButton
                    v-if="!uploading"
                    type="button"
                    size="sm"
                    icon="i-lucide-cloud-upload"
                    color="primary"
                    variant="solid"
                    class="products-primary-action"
                    @click="uploadSelectedImages">
                    آپلود و افزودن
                  </UButton>
                  <span v-else class="products-upload-status">در حال آپلود...</span>
                </div>

                <div v-if="imagePreviews.length" class="products-image-grid" aria-label="پیش‌نمایش تصاویر انتخاب‌شده">
                  <div v-for="(preview, i) in imagePreviews" :key="preview.url" class="products-image-tile products-image-tile--pending">
                    <img :src="preview.url" :alt="`پیش‌نمایش تصویر ${i + 1}`" />
                    <span class="products-image-tile__label">در انتظار آپلود</span>
                    <UButton type="button" icon="i-lucide-x" size="xs" color="error" variant="soft" aria-label="حذف تصویر انتخاب‌شده" @click="removePendingImage(i)" />
                  </div>
                </div>

                <div v-if="form.images.length" class="products-image-grid" aria-label="تصاویر آپلودشده">
                  <div
                    v-for="(img, i) in form.images"
                    :key="`${img.url}-${i}`"
                    class="products-image-tile">
                    <img :src="img.url" :alt="`تصویر محصول ${i + 1}`" @error="handleTableImageError" />
                    <span v-if="i === 0" class="products-image-tile__label">تصویر اصلی</span>
                    <UButton
                      type="button"
                      icon="i-lucide-trash-2"
                      size="xs"
                      color="error"
                      variant="soft"
                      aria-label="حذف تصویر آپلودشده"
                      @click="removeUploadedImage(i)" />
                  </div>
                </div>
                <p v-else-if="!imagePreviews.length" class="products-images-empty"><UIcon name="i-lucide-image" aria-hidden="true" /> هنوز تصویری اضافه نشده است.</p>
              </div>
            </section>

            <p v-if="formError" class="product-form-error" role="alert">{{ formError }}</p>

            <section class="product-form__section">
              <div class="product-form__section-heading">
                <div><span>گزینه‌های قابل انتخاب هنگام خرید</span><small>برای مواردی مثل رنگ، وزن یا نوع بسته‌بندی؛ مشتری هنگام خرید یکی از مقدارها را انتخاب می‌کند.</small></div>
              </div>
              <div class="product-form__explainer"><UIcon name="i-lucide-circle-help" aria-hidden="true" /><span><strong>واریانت یعنی انتخاب خرید.</strong> هر عنوان یک گروه گزینه است و باید حداقل یک مقدار داشته باشد. افزایش قیمت نسبت به قیمت پایه و به ریال وارد می‌شود.</span></div>
              <div class="product-options-editor">
                <article v-for="(variant, vi) in form.variants" :key="vi" class="product-option-card" :class="{ 'product-option-card--invalid': showFormErrors && hasVariantError(variant) }">
                  <div class="product-option-card__header">
                    <div><span class="product-option-card__step">گزینه {{ (vi + 1).toLocaleString("fa-IR") }}</span><h3>عنوان گزینه خرید</h3></div>
                    <UButton type="button" size="sm" color="error" variant="soft" icon="i-lucide-trash-2" @click="form.variants.splice(vi, 1)">حذف گزینه خرید</UButton>
                  </div>
                  <div class="product-field-row" :class="{ 'product-field-row--invalid': showFormErrors && !variant.name.trim() }">
                    <UInput v-model="variant.name" placeholder="مثلاً رنگ، وزن یا نوع بسته‌بندی" aria-label="عنوان گزینه خرید" />
                    <span v-if="showFormErrors && !variant.name.trim()" class="product-field-error">عنوان گزینه را وارد کنید.</span>
                  </div>
                  <div class="product-option-card__options">
                    <div v-for="(opt, oi) in variant.options" :key="oi" class="product-option-row" :class="{ 'product-option-row--invalid': showFormErrors && hasOptionError(opt) }">
                      <div class="product-field-row">
                        <label>مقدار قابل انتخاب</label>
                        <UInput v-model="opt.value" placeholder="مثلاً سفید یا ۵۰ کیلوگرم" aria-label="مقدار قابل انتخاب" />
                      </div>
                      <div class="product-field-row">
                        <label>افزایش قیمت نسبت به پایه (ریال)</label>
                        <UInput v-model.number="opt.priceModifier" type="number" min="0" placeholder="۰ = بدون افزایش" aria-label="افزایش قیمت نسبت به پایه" />
                      </div>
                      <UButton type="button" size="sm" color="neutral" variant="soft" icon="i-lucide-x" aria-label="حذف مقدار گزینه" @click="variant.options.splice(oi, 1)">حذف مقدار</UButton>
                      <span v-if="showFormErrors && !opt.value.trim()" class="product-field-error">مقدار را وارد کنید.</span>
                    </div>
                  </div>
                  <UButton type="button" size="sm" color="neutral" variant="outline" class="products-secondary-action" icon="i-lucide-plus" @click="variant.options.push({ value: '', priceModifier: 0 })">افزودن مقدار</UButton>
                </article>
              </div>
              <UButton type="button" size="sm" color="neutral" variant="outline" class="products-secondary-action" icon="i-lucide-plus" @click="form.variants.push({ name: '', options: [{ value: '', priceModifier: 0 }] })">افزودن گزینه خرید</UButton>
            </section>

            <section class="product-form__section">
              <div class="product-form__section-heading">
                <div><span>مشخصات فنی ثابت محصول</span><small>اطلاعاتی که مشتری می‌خواند و انتخاب نمی‌کند؛ مثل برند، جنس، استاندارد یا ابعاد.</small></div>
              </div>
              <div class="product-form__explainer"><UIcon name="i-lucide-info" aria-hidden="true" /><span><strong>ویژگی فنی یعنی مشخصه ثابت.</strong> این بخش قیمت را تغییر نمی‌دهد و در صفحه محصول به‌صورت جدول نمایش داده می‌شود.</span></div>
              <div class="product-attributes-editor">
                <div v-for="(pair, i) in attributesPairs" :key="i" class="product-attribute-row" :class="{ 'product-attribute-row--invalid': showFormErrors && hasAttributeError(pair) }">
                  <div class="product-field-row">
                    <label>عنوان مشخصه</label>
                    <UInput v-model="pair.key" placeholder="مثلاً برند، جنس یا ابعاد" aria-label="عنوان مشخصه فنی" />
                  </div>
                  <div class="product-field-row">
                    <label>مقدار مشخصه</label>
                    <UInput v-model="pair.value" placeholder="مثلاً سیمان تیپ ۲ یا ۱۰ × ۲۰ سانتی‌متر" aria-label="مقدار مشخصه فنی" />
                  </div>
                  <UButton type="button" size="sm" color="neutral" variant="soft" icon="i-lucide-x" aria-label="حذف مشخصه فنی" @click="attributesPairs.splice(i, 1)">حذف مشخصه</UButton>
                  <span v-if="showFormErrors && hasAttributeError(pair)" class="product-field-error">عنوان و مقدار مشخصه را کامل کنید.</span>
                </div>
              </div>
              <UButton type="button" size="sm" color="neutral" variant="outline" class="products-secondary-action" icon="i-lucide-plus" @click="attributesPairs.push({ key: '', value: '' })">افزودن مشخصه فنی</UButton>
            </section>

            <div class="flex items-center justify-end gap-2">
              <UButton
                type="button"
                @click="closeModal"
                color="neutral"
                variant="soft">
                انصراف
              </UButton>
              <UButton type="submit" :loading="saving" :disabled="uploading">
                ذخیره
              </UButton>
            </div>
          </UForm>
        </template>
      </BaseModal>

      <PanelConfirmModal
        v-if="deleteTarget"
        title="حذف محصول"
        :message="`آیا از حذف «${deleteTarget.name}» مطمئن هستید؟ این محصول از فهرست فروشگاه خارج می‌شود.`"
        confirm-label="حذف محصول"
        :busy="deleting"
        @close="cancelDelete"
        @confirm="confirmDelete" />
    </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ sellerOnly?: boolean }>(), { sellerOnly: false });
const feedback = useFeedback();
import { ref, computed, onMounted, watch } from "vue";
import BaseModal from "~/components/BaseModal.vue";
import { useAccess } from "~/composables/useAccess";
import { Resource } from "~/types/permissions";
import type {
  Product,
  ProductImage,
  ProductImageMeta,
} from "~/types/product";
import { listAdminProducts, listCompanyProducts, uploadProductImages, createProduct, updateProduct, deleteProduct as removeProduct } from "~/services/productService";
import { useApiClient } from '~/services/apiClient';

useHead({
  title: "داشبورد | محصولات",
});


const search = ref("");
const sort = ref("createdAt:desc");
const page = ref(1);
const limit = ref(25);
const total = ref(0);
const loading = ref(false);
const loadError = ref<string | null>(null);
const saving = ref(false);
const formError = ref("");
const showFormErrors = ref(false);
const deleting = ref(false);
const deletingId = ref<string | null>(null);
const deleteTarget = ref<Product | null>(null);
const showModal = ref(false);
const editMode = ref(false);
const selectedId = ref<string | null>(null);
const products = ref<Product[]>([]);
const { user } = useUser();

const { canCreate, canRead, canUpdate, canDelete, isReady } = useAccess(
  Resource.PRODUCTS
);

// Categories
const categoryOptions = ref<{ _id: string; name: string }[]>([]);
const categoriesLoading = ref(false);

// Image upload state (Choose → Upload → images / imagesMeta)
const fileInputRef = ref<HTMLInputElement | null>(null);
const imageFiles = ref<File[]>([]);
const imagePreviews = ref<{ file: File; url: string }[]>([]);
const uploading = ref(false);
const maxProductImages = 5;

// فرم محصول
const form = ref<Product>({
  name: "",
  slug: "",
  sku: "",
  basePrice: 0,
  discount: 0,
  categories: [],
  description: "",
  stock: { quantity: 0 },
  variants: [],
  attributes: {},
  tags: [],
  images: [],
  imagesMeta: [],
  status: "draft",
});

// helpers
const tagsInput = ref("");
const attributesPairs = ref<{ key: string; value: string }[]>([]);

const activeProductsCount = computed(() => products.value.filter((product) => product.status === "active").length);
const draftProductsCount = computed(() => products.value.filter((product) => product.status === "draft").length);
const outOfStockCount = computed(() => products.value.filter((product) => Number(product.stock?.quantity || 0) <= 0).length);

onMounted(() => {
  if (!isReady.value) return;
  if (canRead.value) fetchProducts();
  if (canCreate.value || canUpdate.value) fetchCategories();
});

watch(isReady, (ready) => {
  if (!ready) return;
  if (canRead.value) fetchProducts();
  if (canCreate.value || canUpdate.value) fetchCategories();
}, { once: true });

async function fetchCategories() {
  try {
    categoriesLoading.value = true;
    const { data } = await useApiClient().get<Array<{ _id?: string; id?: string; name: string }> | { items: Array<{ _id?: string; id?: string; name: string }> }>("/categories");
    const categories = Array.isArray(data) ? data : data?.items || [];
    categoryOptions.value = categories
      .map((category) => ({ _id: category._id || category.id || "", name: category.name }))
      .filter((category) => category._id && category.name);
  } catch (e) {
    console.error("خطا در دریافت دسته‌بندی‌ها:", e);
    feedback.error("دسته‌بندی‌ها دریافت نشد", errorMessage(e));
  } finally {
    categoriesLoading.value = false;
  }
}

function fileKey(file: File) {
  return `${file.name}:${file.size}:${file.lastModified}`;
}

function releaseImagePreviews() {
  imagePreviews.value.forEach((preview) => URL.revokeObjectURL(preview.url));
  imagePreviews.value = [];
  imageFiles.value = [];
}

function handleImageSelection(e: Event) {
  const target = e.target as HTMLInputElement;
  const files = Array.from(target.files || []);
  const maxFileSize = 10 * 1024 * 1024;
  const validFiles = files.filter((file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type) && file.size <= maxFileSize);

  if (validFiles.length !== files.length) {
    feedback.error("تصویر نامعتبر است", "فقط JPG، PNG یا WEBP با حجم حداکثر ۱۰ مگابایت قابل انتخاب است.");
  }
  const existingKeys = new Set(imageFiles.value.map(fileKey));
  const remaining = Math.max(0, maxProductImages - form.value.images.length - imageFiles.value.length);
  const nextFiles = validFiles.filter((file) => {
    const key = fileKey(file);
    if (existingKeys.has(key)) return false;
    existingKeys.add(key);
    return true;
  }).slice(0, remaining);
  imageFiles.value.push(...nextFiles);
  imagePreviews.value.push(...nextFiles.map((file) => ({ file, url: URL.createObjectURL(file) })));
  if (validFiles.length > nextFiles.length) {
    feedback.info("تعداد تصاویر محدود شد", `حداکثر ${maxProductImages} تصویر برای هر محصول قابل ذخیره است.`);
  }
}

function removePendingImage(index: number) {
  const preview = imagePreviews.value[index];
  if (!preview) return;
  URL.revokeObjectURL(preview.url);
  imagePreviews.value.splice(index, 1);
  imageFiles.value.splice(index, 1);
}

function removeUploadedImage(index: number) {
  form.value.images.splice(index, 1);
  form.value.imagesMeta?.splice(index, 1);
}

function handleTableImageError(event: Event) {
  const image = event.target as HTMLImageElement;
  image.style.display = "none";
}

// uploadSelectedImages → POST /api/images/upload (multipart/form-data)
async function uploadSelectedImages() {
  if (!imageFiles.value.length) return;

  try {
    uploading.value = true;

    // ساخت FormData برای آپلود مستقیم
    const items = await uploadProductImages(imageFiles.value);
    if (!items.length) {
      throw new Error("هیچ فایلی آپلود نشد.");
    }

    //console.log("upload response items:", items);

    // ست کردن images و imagesMeta روی فرم
    const newImages: ProductImage[] = items.map((item) => ({
      url: item.publicUrl,
    }));

    const newImagesMeta: ProductImageMeta[] = items.map((item, index) => ({
      filename: item.filename,
      contentType: item.contentType,
      size: imageFiles.value.find((file) => file.name === item.filename)?.size ?? imageFiles.value[index]?.size ?? 0,
    }));

    form.value.images = [...form.value.images, ...newImages];
    form.value.imagesMeta = [
      ...(form.value.imagesMeta || []),
      ...newImagesMeta,
    ];
    feedback.success("تصاویر آپلود شدند", `${items.length} تصویر با موفقیت اضافه شد.`);

    // پاک‌سازی input انتخاب فایل
    releaseImagePreviews();
    if (fileInputRef.value) {
      fileInputRef.value.value = "";
    }

    //console.log("upload done, images:", form.value.images);
  } catch (e) {
    console.error("خطا در آپلود تصاویر:", e);
    feedback.error("آپلود انجام نشد", e instanceof Error ? e.message : "خطا در آپلود تصاویر.");
  } finally {
    uploading.value = false;
  }
}

watch(showModal, (val) => {
  if (val) {
    formError.value = "";
    showFormErrors.value = false;
    tagsInput.value = form.value.tags?.join(", ") ?? "";
    attributesPairs.value = Object.entries(form.value.attributes || {}).map(
      ([k, v]) => ({ key: k, value: String(v) })
    );
  }
});

function syncTagsFromInput() {
  form.value.tags = tagsInput.value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function statusFa(s: Product["status"]) {
  return s === "draft" ? "پیش‌نویس" : s === "active" ? "فعال" : s === "inactive" ? "غیرفعال" : s === "deleted" ? "حذف‌شده" : "آرشیو";
}

async function fetchProducts() {
  if (!canRead.value) return;
  const currentUser = user.value as (typeof user.value & { companyId?: string; profile?: { companyId?: string } }) | null;
  const sellerCompanyId = currentUser?.companyId || currentUser?.profile?.companyId || "";
  if (props.sellerOnly && !sellerCompanyId) {
    products.value = [];
    total.value = 0;
    loadError.value = "برای مشاهده محصولات، ابتدا شرکت خود را ثبت کنید.";
    return;
  }
  loading.value = true;
  loadError.value = null;
  try {
    const result = props.sellerOnly
      ? await listCompanyProducts(sellerCompanyId, { page: page.value, limit: limit.value, sort: sort.value })
      : await listAdminProducts({ page: page.value, limit: limit.value, sort: sort.value, filter: search.value.trim() || undefined });
    products.value = result.items;
    total.value = result.total;
    const lastPage = Math.max(1, Math.ceil(result.total / limit.value));
    if (page.value > lastPage) {
      page.value = lastPage;
      await fetchProducts();
      return;
    }
  } catch (e) {
    console.error("خطا در دریافت محصولات:", e);
    products.value = [];
    total.value = 0;
    loadError.value = errorMessage(e);
  } finally {
    loading.value = false;
  }
}

function applyProductFilters() {
  page.value = 1;
  fetchProducts();
}

watch([sort, limit], applyProductFilters);
watch(page, (nextPage, previousPage) => {
  if (nextPage !== previousPage && !loading.value) fetchProducts();
});

function openModal(product: Product | null = null) {
  if (product) {
    if (!canUpdate.value) return feedback.error("دسترسی کافی ندارید", "شما اجازه ویرایش ندارید.");
    editMode.value = true;
    selectedId.value = product._id || product.id || null;
    form.value = {
      ...product,
      images: product.images || [],
      imagesMeta: product.imagesMeta || [],
      variants: product.variants || [],
      attributes: product.attributes || {},
      tags: product.tags || [],
      discount: product.discount ?? 0,
    };
  } else {
    if (!canCreate.value) return feedback.error("دسترسی کافی ندارید", "شما اجازه ایجاد ندارید.");
    editMode.value = false;
    selectedId.value = null;
    form.value = {
      name: "",
      slug: "",
      sku: "",
      basePrice: 0,
      categories: [],
      description: "",
      stock: { quantity: 0 },
      variants: [],
      attributes: {},
      tags: [],
      images: [],
      imagesMeta: [],
      status: "draft",
    };
  }
  showModal.value = true;
}

function closeModal() {
  if (saving.value) return;
  showModal.value = false;
  releaseImagePreviews();
  if (fileInputRef.value) {
    fileInputRef.value.value = "";
  }
}

async function saveProduct() {
  if (imageFiles.value.length) {
    feedback.info("تصاویر آپلود نشده‌اند", "ابتدا روی «آپلود و افزودن» بزنید یا تصاویر انتخاب‌شده را حذف کنید.");
    return;
  }
  // sync helpers
  syncTagsFromInput();
  showFormErrors.value = true;
  const validationError = validateProductForm();
  if (validationError) {
    formError.value = validationError;
    feedback.error("اطلاعات محصول کامل نیست", validationError);
    return;
  }

  formError.value = "";
  form.value.variants = normalizeVariants(form.value.variants);
  form.value.attributes = normalizeAttributes(attributesPairs.value);

  const cleanPayload: Record<string, unknown> = {
    name: form.value.name,
    slug: form.value.slug,
    sku: form.value.sku,
    basePrice: Number(form.value.basePrice) || 0,
    discount:
      form.value.discount !== undefined ? Number(form.value.discount) : 0,
    categories: normalizeCategoryIds(form.value.categories),
    description: form.value.description || undefined,
    stock: {
      quantity: Number(form.value.stock?.quantity) || 0,
    },
    variants: form.value.variants?.length ? form.value.variants : undefined,
    attributes: Object.keys(form.value.attributes || {}).length
      ? form.value.attributes
      : undefined,
    tags: form.value.tags?.length ? form.value.tags : undefined,
    status: form.value.status,
  };

  // images + imagesMeta طبق Swagger
  if (editMode.value || form.value.images.length > 0) {
    cleanPayload.images = form.value.images;
  }
  if (form.value.imagesMeta && form.value.imagesMeta.length > 0) {
    cleanPayload.imagesMeta = form.value.imagesMeta;
  }

  try {
    saving.value = true;
    if (editMode.value && selectedId.value) {
      await updateProduct(selectedId.value, cleanPayload);
    } else {
      await createProduct(cleanPayload);
    }
    await fetchProducts();
    closeModal();
  } catch (e: any) {
    console.error("خطا در ذخیره محصول:", e);
    const errorMsg =
      errorMessage(e);
    feedback.error("ذخیره انجام نشد", errorMsg);
  } finally {
    saving.value = false;
  }
}

function requestDelete(product: Product) {
  if (!canDelete.value) return feedback.error("دسترسی کافی ندارید", "شما اجازه حذف ندارید.");
  if (!(product._id || product.id)) {
    return feedback.error("حذف انجام نشد", "شناسه محصول معتبر نیست.");
  }
  deleteTarget.value = product;
}

function cancelDelete() {
  if (!deleting.value) deleteTarget.value = null;
}

async function confirmDelete() {
  const product = deleteTarget.value;
  const id = product?._id || product?.id;
  if (!product || !id) return;

  try {
    deleting.value = true;
    deletingId.value = id;
    await removeProduct(id);
    feedback.success("محصول حذف شد", `محصول «${product.name}» با موفقیت حذف شد.`);
    deleteTarget.value = null;
    if (products.value.length === 1 && page.value > 1) {
      page.value -= 1;
    } else {
      await fetchProducts();
    }
  } catch (e) {
    console.error("خطا در حذف محصول:", e);
    feedback.error("حذف محصول انجام نشد", errorMessage(e));
  } finally {
    deleting.value = false;
    deletingId.value = null;
  }
}

function normalizeCategoryIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((category) => typeof category === "string" ? category : (category as { _id?: string; id?: string })?._id || (category as { id?: string })?.id)
    .filter((id): id is string => Boolean(id));
}

function validateProductForm(): string | null {
  if (!form.value.name.trim()) return "نام محصول را وارد کنید.";
  if (!form.value.slug.trim()) return "نامک محصول را وارد کنید.";
  if (Number(form.value.basePrice) < 0) return "قیمت پایه نمی‌تواند منفی باشد.";
  if (Number(form.value.discount) < 0 || Number(form.value.discount) > 100) return "تخفیف باید بین صفر تا صد باشد.";
  if (Number(form.value.stock?.quantity) < 0) return "موجودی نمی‌تواند منفی باشد.";

  const variantNames = new Set<string>();
  for (const variant of form.value.variants || []) {
    const name = variant.name.trim();
    if (name.length < 2) return "عنوان هر گزینه خرید باید حداقل ۲ کاراکتر باشد.";
    const normalizedName = name.toLocaleLowerCase();
    if (variantNames.has(normalizedName)) return `گزینه خرید «${name}» تکراری است.`;
    variantNames.add(normalizedName);
    if (!variant.options?.length) return `برای گزینه «${name}» حداقل یک مقدار اضافه کنید.`;
    const optionValues = new Set<string>();
    for (const option of variant.options) {
      const value = option.value.trim();
      if (!value) return `مقدار گزینه «${name}» را وارد کنید.`;
      const normalizedValue = value.toLocaleLowerCase();
      if (optionValues.has(normalizedValue)) return `مقدار «${value}» در گزینه «${name}» تکراری است.`;
      optionValues.add(normalizedValue);
      const modifier = Number(option.priceModifier ?? 0);
      if (!Number.isFinite(modifier) || modifier < 0) return `افزایش قیمت مقدار «${value}» معتبر نیست.`;
    }
  }

  const attributeNames = new Set<string>();
  for (const attribute of attributesPairs.value) {
    const key = attribute.key.trim();
    const value = attribute.value.trim();
    if (Boolean(key) !== Boolean(value)) return "عنوان و مقدار هر مشخصه فنی را کامل کنید.";
    if (key) {
      const normalizedKey = key.toLocaleLowerCase();
      if (attributeNames.has(normalizedKey)) return `مشخصه فنی «${key}» تکراری است.`;
      attributeNames.add(normalizedKey);
    }
  }
  return null;
}

function normalizeVariants(variants: Product["variants"]): Product["variants"] {
  return (variants || []).map((variant) => ({
    name: variant.name.trim(),
    options: (variant.options || []).map((option) => ({
      value: option.value.trim(),
      priceModifier: Math.round(Number(option.priceModifier ?? 0)),
    })),
  }));
}

function normalizeAttributes(pairs: { key: string; value: string }[]): Record<string, string> {
  return pairs.reduce<Record<string, string>>((result, pair) => {
    const key = pair.key.trim();
    const value = pair.value.trim();
    if (key && value) result[key] = value;
    return result;
  }, {});
}

function hasVariantError(variant: Product["variants"][number]): boolean {
  return !variant.name.trim() || !variant.options?.length || variant.options.some(hasOptionError);
}

function hasOptionError(option: Product["variants"][number]["options"][number]): boolean {
  const modifier = Number(option.priceModifier ?? 0);
  return !option.value.trim() || !Number.isFinite(modifier) || modifier < 0;
}

function hasAttributeError(pair: { key: string; value: string }): boolean {
  return Boolean(pair.key.trim()) !== Boolean(pair.value.trim());
}

function errorMessage(error: unknown): string {
  const candidate = error as { info?: { message?: string }; message?: string };
  return candidate.info?.message || candidate.message || "خطای نامشخصی رخ داد. دوباره تلاش کنید.";
}

function numberFormat(n?: number) {
  if (typeof n !== "number") return "-";
  return n.toLocaleString("fa-IR");
}
</script>

<style scoped>
.products-page { width: 100%; max-width: 92rem; margin-inline: auto; }
.products-overview { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: .75rem; margin-bottom: 1rem; }
.products-overview__card { display: grid; gap: .15rem; min-width: 0; padding: 1rem; border: 1px solid var(--color-border); border-radius: var(--radius-card); background: var(--color-bg-surface); box-shadow: var(--shadow-raised); }
.products-overview__card span { color: var(--color-text-muted); font-size: .75rem; }
.products-overview__card strong { color: var(--color-text-heading); font-size: 1.45rem; line-height: 1.3; }
.products-overview__card small { color: var(--color-text-muted); font-size: .68rem; }
.products-overview__card--success { border-color: var(--color-success-border); }
.products-overview__card--success strong { color: var(--color-success-fg); }
.products-overview__card--warning { border-color: var(--color-warning-border); }
.products-overview__card--warning strong { color: var(--color-warning-fg); }
.products-overview__card--danger { border-color: var(--color-danger-border); }
.products-overview__card--danger strong { color: var(--color-danger-fg); }
.products-panel { min-height: 20rem; overflow: hidden; }
.products-table-wrap { overflow: hidden; }
.products-table__identity { display: flex; align-items: center; gap: .75rem; min-width: 15rem; }
.products-table__image { display: block; flex: 0 0 auto; width: 3.5rem; height: 3.5rem; padding: .2rem; border: 1px solid var(--color-border); border-radius: var(--radius-compact-list-item); object-fit: contain; background: var(--color-bg-light); }
.products-table__image--empty { display: grid; place-items: center; color: var(--color-text-disabled); background: var(--color-bg-light); }
.products-table__identity-copy { display: grid; min-width: 0; gap: .25rem; }
.products-table__name { max-width: 18rem; overflow: hidden; color: var(--color-text-heading); font-weight: 800; text-overflow: ellipsis; white-space: nowrap; }
.products-table__sku { color: var(--color-text-muted); font-size: .72rem; }
.products-table__metadata { color: var(--color-brand-blue); font-size: .68rem; font-weight: 700; }
.products-table__price { display: grid; gap: .25rem; color: var(--color-text-heading); }
.products-table__discount { color: var(--color-success-fg); font-size: .7rem; }
.products-stock { display: inline-flex; align-items: center; gap: .35rem; color: var(--color-success-fg); font-weight: 800; }
.products-stock--low { color: var(--color-warning-fg); }
.products-stock--empty { color: var(--color-danger-fg); }
.products-table__actions { flex-wrap: wrap; min-width: 12rem; }
.products-form { display: grid; gap: 1rem; }
.product-modal__header { display: flex; align-items: center; gap: .75rem; padding-inline-end: 2.5rem; margin-bottom: 1.25rem; }
.product-modal__title-icon { display: grid; flex: 0 0 auto; width: 2.75rem; height: 2.75rem; place-items: center; border-radius: var(--radius-compact-list-item); color: var(--color-brand-blue); background: var(--color-info-bg); font-size: 1.25rem; }
.product-modal__header h2 { margin: 0; color: var(--color-text-heading); font-size: 1.15rem; font-weight: 800; }
.product-modal__header p { margin: .2rem 0 0; color: var(--color-text-muted); font-size: .75rem; }
.product-form__section { display: grid; gap: 1rem; padding: 1rem; border: 1px solid var(--color-border); border-radius: var(--radius-card); background: var(--color-bg-light); }
.product-form__section-heading { display: flex; align-items: baseline; justify-content: space-between; gap: .75rem; padding-bottom: .65rem; border-bottom: 1px solid var(--color-border); color: var(--color-text-heading); font-size: .9rem; font-weight: 800; }
.product-form__section-heading small { color: var(--color-text-muted); font-size: .68rem; font-weight: 500; }
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
.product-option-row .product-field-error { grid-column: 1 / -1; }
.product-attribute-row { grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr) auto; align-items: end; }
.product-attribute-row .product-field-error { grid-column: 1 / -1; }
.products-upload-dropzone { display: grid; place-items: center; gap: .4rem; min-height: 8rem; padding: 1rem; border: 1px dashed var(--color-info-border); border-radius: var(--radius-field); color: var(--color-text-body); background: var(--color-bg-surface); text-align: center; cursor: pointer; }
.products-upload-dropzone > svg { color: var(--color-brand-blue); font-size: 1.5rem; }
.products-upload-dropzone strong { color: var(--color-brand-blue); }
.products-upload-dropzone small { color: var(--color-text-muted); font-size: .7rem; }
.products-upload-dropzone input { position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; }
.products-upload-dropzone:focus-within { box-shadow: var(--focus-ring); }
.products-pending-files { display: flex; align-items: center; justify-content: space-between; gap: .75rem; padding: .65rem .75rem; border-radius: var(--radius-field); color: var(--color-brand-blue); background: var(--color-info-bg); font-size: .78rem; }
.products-upload-status { color: var(--color-brand-blue); font-weight: 700; }
.products-primary-action {
  min-height: 2.75rem;
  border: 1px solid var(--color-brand-blue) !important;
  background: var(--color-brand-blue) !important;
  color: var(--color-bg-surface) !important;
  font-weight: 800;
  transition: background-color .16s ease, border-color .16s ease, box-shadow .16s ease;
}
.products-primary-action:hover:not(:disabled) {
  border-color: var(--color-brand-blue-hover) !important;
  background: var(--color-brand-blue-hover) !important;
}
.products-primary-action:focus-visible { box-shadow: var(--focus-ring); }
.products-primary-action :deep(svg) { color: currentColor !important; }
.products-secondary-action {
  min-height: 2.5rem;
  border: 1px solid var(--color-border-strong) !important;
  background: var(--color-bg-surface) !important;
  color: var(--color-text-heading) !important;
  font-weight: 800;
}
.products-secondary-action:hover:not(:disabled) {
  border-color: var(--color-brand-blue) !important;
  background: var(--color-info-bg) !important;
  color: var(--color-brand-blue) !important;
}
.products-secondary-action:focus-visible { box-shadow: var(--focus-ring); }
.products-image-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: .65rem; }
.products-image-tile { position: relative; display: grid; min-width: 0; aspect-ratio: 1; overflow: hidden; border: 1px solid var(--color-border); border-radius: var(--radius-field); background: var(--color-bg-surface); }
.products-image-tile img { width: 100%; height: 100%; padding: .3rem; object-fit: contain; }
.products-image-tile :deep(button) { position: absolute; inset-block-start: .3rem; inset-inline-end: .3rem; }
.products-image-tile__label { position: absolute; inset-inline: .35rem; inset-block-end: .35rem; padding: .2rem .3rem; border-radius: var(--radius-pill); color: var(--color-text-heading); background: color-mix(in srgb, var(--color-bg-surface) 88%, transparent); font-size: .62rem; text-align: center; }
.products-image-tile--pending { border-style: dashed; border-color: var(--color-info-border); }
.products-images-empty { display: flex; align-items: center; justify-content: center; gap: .4rem; min-height: 5rem; margin: 0; border: 1px dashed var(--color-border); border-radius: var(--radius-field); color: var(--color-text-muted); font-size: .78rem; }
.ltr { direction: ltr; }
@media (max-width: 800px) { .products-overview { grid-template-columns: repeat(2, minmax(0, 1fr)); } .products-image-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
@media (max-width: 700px) { .product-option-row, .product-attribute-row { grid-template-columns: 1fr; align-items: stretch; } .product-option-row .product-field-error, .product-attribute-row .product-field-error { grid-column: auto; } }
@media (max-width: 480px) { .products-overview__card { padding: .75rem; } .products-overview__card strong { font-size: 1.2rem; } .products-image-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } .product-form__section { padding: .75rem; } .product-form__section-heading { align-items: flex-start; flex-direction: column; gap: .2rem; } .products-table__identity { min-width: 13rem; } .product-option-card, .product-attribute-row { padding: .7rem; } .product-option-card__header { align-items: stretch; flex-direction: column; } }
</style>
