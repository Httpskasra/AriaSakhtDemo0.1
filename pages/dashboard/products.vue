<template>
    <div class="container">
      <DashboardPageHeader
        title="محصولات"
        subtitle="محصولات، قیمت و موجودی فروشگاه را مدیریت کنید."
        icon="/adminIcon/products.png"
        alt="محصولات"
      />

      <div
        class="actions flex flex-wrap justify-between items-center gap-2 mb-4 bg-white rounded-field py-2">
        <div class="flex flex-wrap items-center gap-2">
          <TableFilterInput
            v-model="search"
            placeholder="جستجوی محصول..."
            @submit="applyProductFilters" />
          <USelect
            v-model="sort"
            :items="[
              { label: 'جدیدترین', value: 'createdAt:desc' },
              { label: 'قدیمی‌ترین', value: 'createdAt:asc' },
              { label: 'نام (الفبا)', value: 'name:asc' },
              { label: 'قیمت نزولی', value: 'basePrice:desc' }
            ]" />
          <USelect
            v-model="limit"
            :items="[
              { label: '۱۰', value: 10 },
              { label: '۲۵', value: 25 },
              { label: '۵۰', value: 50 }
            ]" />
        </div>
        <UButton
          v-if="canCreate"
          @click="openModal()">
          + محصول جدید
        </UButton>
      </div>

      <div class="products-panel bg-white rounded-field overflow-hidden">
        <div v-if="!canRead" class="state-card state-card--error">
          <UIcon name="i-lucide-lock-keyhole" aria-hidden="true" />
          <h2>دسترسی به محصولات امکان‌پذیر نیست</h2>
          <p>حساب کاربری شما مجوز مشاهده محصولات را ندارد.</p>
        </div>
        <div v-else-if="loading" class="state-card" aria-live="polite">
          <UIcon name="i-lucide-loader-circle" class="animate-spin" aria-hidden="true" />
          <h2>در حال دریافت محصولات</h2>
          <p>لطفاً چند لحظه صبر کنید.</p>
        </div>
        <div v-else-if="loadError" class="state-card state-card--error" role="alert">
          <UIcon name="i-lucide-circle-alert" aria-hidden="true" />
          <h2>دریافت محصولات انجام نشد</h2>
          <p>{{ loadError }}</p>
          <UButton type="button" variant="soft" @click="fetchProducts">تلاش دوباره</UButton>
        </div>
        <div v-else-if="products.length === 0" class="state-card">
          <UIcon name="i-lucide-package-search" aria-hidden="true" />
          <h2>{{ search ? "محصولی با این جستجو پیدا نشد" : "هنوز محصولی ثبت نشده است" }}</h2>
          <p>{{ search ? "عبارت جستجو یا فیلترها را تغییر دهید." : "برای شروع، اولین محصول خود را ثبت کنید." }}</p>
          <UButton v-if="!search && canCreate" type="button" @click="openModal()">افزودن محصول</UButton>
        </div>
        <div v-else class="mb-3 flex flex-wrap items-center gap-2">
          <TableScrollContainer>
            <table class="w-full min-w-[36rem]">
          <thead class="bg-gray-100">
            <tr>
              <th class="p-3 text-right">تصویر</th>
              <th class="p-3 text-right">نام</th>
              <th class="p-3 text-right">SKU</th>
              <th class="p-3 text-right">قیمت پایه</th>
              <th class="p-3 text-right">موجودی</th>
              <!-- <th class="p-3 text-right">شرکت</th> -->
              <th class="p-3 text-right">وضعیت</th>
              <th class="p-3 text-right">اقدامات</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="product in products"
              :key="product._id"
              class="border-b hover:bg-gray-50">
              <td class="p-3">
                <img
                  v-if="product.images && product.images.length"
                  :src="product.images[0].url"
                  class="w-12 h-12 rounded object-cover" />
              </td>
              <td class="p-3">{{ product.name }}</td>
              <td class="p-3 ltr">{{ product.sku }}</td>
              <td class="p-3">{{ numberFormat(product.basePrice) }}</td>
              <td class="p-3">{{ product.stock?.quantity ?? 0 }}</td>
              <!-- <td class="p-3 ltr text-xs">{{ product.companyId }}</td> -->
              <!-- <td class="p-3 ltr text-xs">ID</td> -->
              <td class="p-3">
                <StatusPill
                  :label="statusFa(product.status)"
                  :semantic="getStatusSemantic(product.status)"
                  size="compact" />
              </td>
              <td class="p-3 flex gap-2">
                <UButton
                  v-if="canUpdate"
                  @click="openModal(product)"
                  size="xs"
                  variant="ghost">
                  ویرایش
                </UButton>
                <UButton
                  v-if="canDelete"
                  @click="requestDelete(product)"
                  size="xs"
                  color="error"
                  variant="ghost"
                  :loading="deletingId === (product._id || product.id)">
                  حذف
                </UButton>
              </td>
            </tr>
          </tbody>
            </table>
          </TableScrollContainer>
        </div>
      </div>

      <div v-if="total > limit" class="flex justify-center py-4">
        <UPagination v-model="page" :total="total" :page-count="limit" :disabled="loading" />
      </div>

      <!-- Modal -->
      <BaseModal v-if="showModal" :busy="saving" @close="closeModal">
        <template #default>
          <h2 class="text-lg font-semibold mb-4">
            {{ editMode ? "ویرایش محصول" : "محصول جدید" }}
          </h2>

          <UForm :state="form" @submit.prevent="saveProduct" class="space-y-5">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UFormField label="نام" name="name">
                <UInput v-model="form.name" required />
              </UFormField>

              <UFormField label="نامک (slug)" name="slug">
                <UInput v-model="form.slug" class="ltr" required />
              </UFormField>

              <UFormField label="SKU" name="sku">
                <UInput v-model="form.sku" class="ltr" />
              </UFormField>

              <UFormField label="قیمت پایه" name="basePrice">
                <UInput v-model.number="form.basePrice" type="number" />
              </UFormField>

              <UFormField label="تخفیف (%)" name="discount">
                <UInput v-model.number="form.discount" type="number" min="0" max="100" />
              </UFormField>

              <UFormField label="موجودی" name="stockQuantity">
                <UInput v-model.number="form.stock.quantity" type="number" />
              </UFormField>
            </div>

            <UFormField label="توضیحات" name="description">
              <UTextarea v-model="form.description" :rows="4" />
            </UFormField>

            <!-- دسته‌بندی‌ها -->
            <UFormField label="دسته‌بندی" name="categories">
              <div class="space-y-2">
                <USelectMenu
                  v-model="form.categories"
                  multiple
                  :options="categoryOptions"
                  value-attribute="_id"
                  option-attribute="name" />
                <div class="text-xs text-gray-500">
                  از لیست بالا یکی را انتخاب کن؛
                </div>
              </div>
            </UFormField>

            <!-- برچسب‌ها -->
            <UFormField label="برچسب‌ها" name="tags">
              <UInput
                v-model="tagsInput"
                @blur="syncTagsFromInput"
                placeholder="برچسب‌ها را با ویرگول جدا کنید" />
            </UFormField>

            <!-- تصاویر (Choose + Upload → images / imagesMeta) -->
            <div>
              <label class="block text-sm font-medium mb-1">تصاویر</label>
              <div class="space-y-3">
                <!-- Specialized upload control: native file input is required for FileList/ref handling. -->
                <input
                  ref="fileInputRef"
                  type="file"
                  multiple
                  accept="image/*"
                  @change="handleImageSelection"
                  class="block text-sm text-gray-600" />

                <!-- Upload button / state -->
                <div
                  v-if="imageFiles.length"
                  class="flex items-center gap-2 text-sm">
                  <span>{{ imageFiles.length }} فایل انتخاب شد.</span>
                  <UButton
                    v-if="!uploading"
                    type="button"
                    size="sm"
                    @click="uploadSelectedImages">
                    آپلود تصاویر
                  </UButton>
                  <span v-else class="text-blue-600">در حال آپلود...</span>
                </div>

                <!-- Preview of form.images -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div
                    v-for="(img, i) in form.images"
                    :key="i"
                    class="relative">
                    <img
                      :src="img.url"
                      alt=""
                      class="w-full h-24 object-cover rounded" />
                    <UButton
                      type="button"
                      class="absolute top-1 right-1"
                      size="xs"
                      color="error"
                      variant="soft"
                      @click="
                        () => {
                          form.images.splice(i, 1);
                          if (form.imagesMeta) form.imagesMeta.splice(i, 1);
                        }
                      ">
                      حذف
                    </UButton>
                  </div>
                </div>
              </div>
            </div>

            <!-- واریانت‌ها -->
            <div>
              <label class="block text-sm font-medium mb-2">واریانت‌ها</label>
              <div class="space-y-4">
                <div
                  v-for="(variant, vi) in form.variants"
                  :key="vi"
                  class="border rounded p-3">
                  <div class="flex items-center gap-2 mb-2">
                    <UInput
                      v-model="variant.name"
                      placeholder="نام واریانت (مثلا: بسته‌بندی)"
                      class="flex-1" />
                    <UButton
                      type="button"
                      size="sm"
                      color="neutral"
                      variant="soft"
                      @click="form.variants.splice(vi, 1)">
                      حذف واریانت
                    </UButton>
                  </div>
                  <div class="space-y-2">
                    <div
                      v-for="(opt, oi) in variant.options"
                      :key="oi"
                      class="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <UInput
                        v-model="opt.value"
                        placeholder="مقدار (مثلا: 50 kg)" />
                      <UInput
                        v-model.number="opt.priceModifier"
                        type="number"
                        placeholder="تغییر قیمت" />
                      <div class="md:col-span-2">
                        <UButton
                          type="button"
                          size="sm"
                          color="neutral"
                          variant="soft"
                          @click="variant.options.splice(oi, 1)">
                          حذف گزینه
                        </UButton>
                      </div>
                    </div>
                    <UButton
                      type="button"
                      size="sm"
                      color="neutral"
                      variant="outline"
                      @click="
                        variant.options.push({ value: '', priceModifier: 0 })
                      ">
                      + افزودن گزینه
                    </UButton>
                  </div>
                </div>
                <UButton
                  type="button"
                  size="sm"
                  color="neutral"
                  variant="outline"
                  @click="form.variants.push({ name: '', options: [] })">
                  + افزودن واریانت
                </UButton>
              </div>
            </div>

            <!-- ویژگی‌ها -->
            <div>
              <label class="block text-sm font-medium mb-2">ویژگی‌ها</label>
              <div class="space-y-2">
                <div
                  v-for="(pair, i) in attributesPairs"
                  :key="i"
                  class="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <UInput
                    v-model="pair.key"
                    placeholder="کلید" />
                  <UInput
                    v-model="pair.value"
                    placeholder="مقدار" />
                  <UButton
                    type="button"
                    size="sm"
                    color="neutral"
                    variant="soft"
                    @click="attributesPairs.splice(i, 1)">
                    حذف
                  </UButton>
                </div>
                <UButton
                  type="button"
                  size="sm"
                  color="neutral"
                  variant="outline"
                  @click="attributesPairs.push({ key: '', value: '' })">
                  + افزودن ویژگی
                </UButton>
              </div>
            </div>

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

      <BaseModal v-if="deleteTarget" title-id="delete-product-title" @close="cancelDelete">
        <div class="delete-confirmation">
          <UIcon name="i-lucide-trash-2" aria-hidden="true" />
          <h2 id="delete-product-title">حذف محصول</h2>
          <p>آیا از حذف «{{ deleteTarget.name }}» مطمئن هستید؟ این محصول از فهرست فروشگاه خارج می‌شود.</p>
          <div class="flex justify-end gap-2">
            <UButton type="button" color="neutral" variant="soft" :disabled="deleting" @click="cancelDelete">انصراف</UButton>
            <UButton type="button" color="error" :loading="deleting" @click="confirmDelete">حذف محصول</UButton>
          </div>
        </div>
      </BaseModal>
    </div>
</template>

<script setup lang="ts">
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
import { listAdminProducts, uploadProductImages, createProduct, updateProduct, deleteProduct as removeProduct } from "~/services/productService";
import { useApiClient } from '~/services/apiClient';

useHead({
  title: "داشبورد | محصولات",
});

definePageMeta({
  layout: "dashboard",
  middleware: ["auth", "permission"],
      permission: { resource: "products", action: "r" },
});

const search = ref("");
const sort = ref("createdAt:desc");
const page = ref(1);
const limit = ref(25);
const total = ref(0);
const loading = ref(false);
const loadError = ref<string | null>(null);
const saving = ref(false);
const deleting = ref(false);
const deletingId = ref<string | null>(null);
const deleteTarget = ref<Product | null>(null);
const showModal = ref(false);
const editMode = ref(false);
const selectedId = ref<string | null>(null);
const products = ref<Product[]>([]);

const { canCreate, canRead, canUpdate, canDelete } = useAccess(
  Resource.PRODUCTS
);

// Categories
const categoryOptions = ref<{ _id: string; name: string }[]>([]);
const categoriesLoading = ref(false);

// Image upload state (Choose → Upload → images / imagesMeta)
const fileInputRef = ref<HTMLInputElement | null>(null);
const imageFiles = ref<File[]>([]);
const uploading = ref(false);

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

onMounted(() => {
  fetchProducts();
  fetchCategories();
});

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

function handleImageSelection(e: Event) {
  const target = e.target as HTMLInputElement;
  const files = Array.from(target.files || []);
  const maxFileSize = 5 * 1024 * 1024;
  const validFiles = files.filter((file) => file.type.startsWith("image/") && file.size <= maxFileSize);

  if (validFiles.length !== files.length) {
    feedback.error("تصویر نامعتبر است", "فقط فایل تصویری با حجم حداکثر ۵ مگابایت قابل انتخاب است.");
  }
  imageFiles.value = validFiles.slice(0, 8);
  if (validFiles.length > 8) {
    feedback.info("تعداد تصاویر محدود شد", "حداکثر ۸ تصویر در هر بار انتخاب قابل آپلود است.");
  }
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

    const newImagesMeta: ProductImageMeta[] = items.map((item) => ({
      filename: item.filename,
      contentType: item.contentType,
      size: imageFiles.value.find((f) => f.name === item.filename)?.size ?? 0,
    }));

    form.value.images = [...form.value.images, ...newImages];
    form.value.imagesMeta = [
      ...(form.value.imagesMeta || []),
      ...newImagesMeta,
    ];
    feedback.success("تصاویر آپلود شدند", `${items.length} تصویر با موفقیت اضافه شد.`);

    // پاک‌سازی input انتخاب فایل
    imageFiles.value = [];
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
    tagsInput.value = form.value.tags?.join(", ") ?? "";
    attributesPairs.value = Object.entries(form.value.attributes || {}).map(
      ([k, v]) => ({ key: k, value: v })
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
  return s === "draft"
    ? "پیش‌نویس"
    : s === "active"
    ? "فعال"
    : s === "inactive"
    ? "غیرفعال"
    : "آرشیو";
}

async function fetchProducts() {
  if (!canRead.value) return;
  loading.value = true;
  loadError.value = null;
  try {
    const result = await listAdminProducts({
      page: page.value,
      limit: limit.value,
      sort: sort.value,
      filter: search.value.trim() || undefined,
    });
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

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / limit.value)));

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
    };
  }
  showModal.value = true;
}

function closeModal() {
  if (saving.value) return;
  showModal.value = false;
  imageFiles.value = [];
  if (fileInputRef.value) {
    fileInputRef.value.value = "";
  }
}

async function saveProduct() {
  // sync helpers
  syncTagsFromInput();
  form.value.attributes = {};
  attributesPairs.value.forEach(({ key, value }) => {
    if (key && value) form.value.attributes[key] = value;
  });

  const validationError = validateProductForm();
  if (validationError) {
    feedback.error("اطلاعات محصول کامل نیست", validationError);
    return;
  }

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
  if (form.value.images && form.value.images.length > 0) {
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
  return null;
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
.container {
  width: 100%;
  max-width: 92rem;
  margin-inline: auto;
}
.page-heading {
  color: var(--color-text-heading);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin: 0 0 1.5rem;
}
.page-heading h1 {
  margin: 0.25rem 0;
  font-size: clamp(1.5rem, 2vw, 2rem);
  font-weight: 800;
}
.page-eyebrow {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.8125rem;
  font-weight: 700;
}
.page-description {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.875rem;
}
.page-heading img {
  width: 3.5rem;
  height: 3.5rem;
  object-fit: contain;
}
.products-panel {
  min-height: 20rem;
}
.state-card {
  min-height: 20rem;
  padding: 3rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 0.75rem;
  color: var(--color-text-muted);
  text-align: center;
}
.state-card > svg { width: 2.5rem; height: 2.5rem; color: var(--blue-dark); }
.state-card h2 { margin: 0; color: var(--color-text-heading); font-size: 1.125rem; font-weight: 800; }
.state-card p { margin: 0 0 0.5rem; }
.state-card--error > svg { color: var(--color-danger-fg); }
.state-card--error h2 { color: var(--color-danger-fg); }
.delete-confirmation { display: flex; flex-direction: column; gap: 0.75rem; padding-top: 1rem; }
.delete-confirmation > svg { width: 2.5rem; height: 2.5rem; color: var(--color-danger-fg); }
.delete-confirmation h2 { margin: 0; color: var(--color-text-heading); font-size: 1.125rem; font-weight: 800; }
.delete-confirmation p { margin: 0 0 0.75rem; color: var(--color-text-muted); line-height: 1.8; }
@media (max-width: 640px) {
  .page-heading img { width: 2.75rem; height: 2.75rem; }
  .page-heading { align-items: flex-start; }
}
.ltr {
  direction: ltr;
}
</style>
