<template>
    <div class="products-page">
      <PanelPageHeader title="محصولات" subtitle="محصولات، قیمت و موجودی فروشگاه را مدیریت کنید." icon="i-lucide-boxes">
        <template #actions><UButton v-if="canCreate && canRead" icon="i-lucide-plus" @click="openModal()">محصول جدید</UButton></template>
      </PanelPageHeader>

      <PanelFilterBar>
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
          <UButton v-if="!search && canCreate" type="button" @click="openModal()">افزودن محصول</UButton>
        </SharedAsyncState>
        <div v-else class="products-table-wrap">
          <TableScrollContainer>
            <table class="panel-table products-table">
          <thead>
            <tr>
              <th>تصویر</th>
              <th>نام</th>
              <th>SKU</th>
              <th>قیمت پایه</th>
              <th>موجودی</th>
              <th>وضعیت</th>
              <th>اقدامات</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="product in products"
              :key="product._id || product.id">
              <td>
                <img
                  v-if="product.images && product.images.length"
                  :src="product.images[0].url"
                  class="products-table__image"
                  alt="" />
                <span v-else class="products-table__image products-table__image--empty" aria-hidden="true">
                  <UIcon name="i-lucide-image-off" />
                </span>
              </td>
              <td class="products-table__name">{{ product.name }}</td>
              <td class="ltr">{{ product.sku || "-" }}</td>
              <td class="font-num">{{ numberFormat(product.basePrice) }}</td>
              <td class="font-num">{{ (product.stock?.quantity ?? 0).toLocaleString("fa-IR") }}</td>
              <td>
                <PanelStatusBadge
                  :label="statusFa(product.status)"
                  :semantic="getStatusSemantic(product.status)"
                  size="compact" />
              </td>
              <td>
                <div class="panel-row-actions">
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
                <div class="products-form-hint">
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
                  class="products-file-input" />

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
                  <span v-else class="products-upload-status">در حال آپلود...</span>
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
.products-page { width: 100%; max-width: 92rem; margin-inline: auto; }
.products-panel { min-height: 20rem; overflow: hidden; }
.products-table-wrap { overflow: hidden; }
.products-upload-status { color: var(--color-brand-blue); font-weight: 700; }
.products-form-hint { color: var(--color-text-muted); font-size: .75rem; }
.products-file-input { display: block; color: var(--color-text-body); font-size: .875rem; }
.products-table__image { display: block; width: 3rem; height: 3rem; border-radius: var(--radius-compact-list-item); object-fit: cover; }
.products-table__image--empty { display: grid; place-items: center; color: var(--color-text-disabled); background: var(--color-bg-light); }
.products-table__name { max-width: 16rem; color: var(--color-text-heading); font-weight: 700; white-space: normal; }
.products-table td { white-space: nowrap; }
@media (max-width: 640px) { .products-table__name { max-width: 10rem; } }
.ltr {
  direction: ltr;
}
</style>
