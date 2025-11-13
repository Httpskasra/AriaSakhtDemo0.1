<template>
  <NuxtLayout name="dashboard">
    <div class="container">
      <div class="title">
        <h1>محصولات</h1>
        <img src="/adminIcon/products.png" alt="" />
      </div>

      <div
        class="actions flex justify-between items-center mb-4 bg-white rounded-lg py-2">
        <SearchBar v-model="search" :dark="true" />
        <button
          v-if="canCreate"
          @click="openModal()"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm">
          + محصول جدید
        </button>
      </div>

      <div class="bg-white rounded-lg overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-100">
            <tr>
              <th class="p-3 text-right">تصویر</th>
              <th class="p-3 text-right">نام</th>
              <th class="p-3 text-right">SKU</th>
              <th class="p-3 text-right">قیمت پایه</th>
              <th class="p-3 text-right">موجودی</th>
              <th class="p-3 text-right">شرکت</th>
              <th class="p-3 text-right">وضعیت</th>
              <th class="p-3 text-right">اقدامات</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="product in filteredProducts"
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
              <td class="p-3 ltr text-xs">ID</td>
              <td class="p-3">
                <span
                  class="px-2 py-1 rounded text-xs"
                  :class="{
                    'bg-yellow-100 text-yellow-800': product.status === 'draft',
                    'bg-green-100 text-green-800': product.status === 'active',
                    'bg-gray-100 text-gray-800': product.status === 'inactive',
                    'bg-red-100 text-red-800': product.status === 'archived',
                  }">
                  {{ statusFa(product.status) }}
                </span>
              </td>
              <td class="p-3 flex gap-2">
                <button
                  v-if="canUpdate"
                  @click="openModal(product)"
                  class="text-blue-500 hover:underline">
                  ویرایش
                </button>
                <button
                  v-if="canDelete"
                  @click="deleteProduct(product)"
                  class="text-red-500 hover:underline">
                  حذف
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal -->
      <BaseModal v-if="showModal" @close="closeModal">
        <template #default>
          <h2 class="text-lg font-semibold mb-4">
            {{ editMode ? "ویرایش محصول" : "محصول جدید" }}
          </h2>

          <form @submit.prevent="saveProduct" class="space-y-5">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1">نام</label>
                <input
                  v-model="form.name"
                  type="text"
                  class="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required />
              </div>

              <div>
                <label class="block text-sm font-medium mb-1"
                  >نامک (slug)</label
                >
                <input
                  v-model="form.slug"
                  type="text"
                  class="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ltr"
                  required />
              </div>

              <div>
                <label class="block text-sm font-medium mb-1">SKU</label>
                <input
                  v-model="form.sku"
                  type="text"
                  class="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ltr" />
              </div>

              <div>
                <label class="block text-sm font-medium mb-1">قیمت پایه</label>
                <input
                  v-model.number="form.basePrice"
                  type="number"
                  class="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <!-- <div>
                <label class="block text-sm font-medium mb-1">شناسه شرکت</label>
                <input
                  v-model="form.companyId"
                  type="text"
                  class="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ltr" />
              </div> -->

              <div>
                <label class="block text-sm font-medium mb-1">موجودی</label>
                <input
                  v-model.number="form.stock.quantity"
                  type="number"
                  class="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">توضیحات</label>
              <textarea
                v-model="form.description"
                rows="4"
                class="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"></textarea>
            </div>

            <!-- دسته‌بندی‌ها -->
            <div>
              <label class="block text-sm font-medium mb-1">دسته‌بندی</label>
              <div class="space-y-2">
                <select
                  v-model="form.categories"
                  multiple
                  class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option
                    v-for="cat in categoryOptions"
                    :key="cat._id"
                    :value="cat._id">
                    {{ cat.name }}
                  </option>
                </select>
                <div class="text-xs text-gray-500">
                  از لیست بالا یکی را انتخاب کن؛
                </div>
              </div>
            </div>

            <!-- برچسب‌ها -->
            <div>
              <label class="block text-sm font-medium mb-1">برچسب‌ها</label>
              <input
                v-model="tagsInput"
                @blur="syncTagsFromInput"
                placeholder="برچسب‌ها را با ویرگول جدا کنید"
                class="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <!-- تصاویر -->
            <div>
              <label class="block text-sm font-medium mb-1">تصاویر</label>
              <div class="space-y-3">
                <input
                  type="file"
                  multiple
                  @change="onImageFilesSelected"
                  @click="uploadSelectedImages" />
                <div
                  v-if="imageFiles.length"
                  class="flex items-center gap-2 text-sm">
                  <span>{{ imageFiles.length }} فایل انتخاب شد.</span>
                  <button
                    type="button"
                    class="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                    :disabled="uploading"
                    @click="uploadSelectedImages">
                    {{ uploading ? "در حال آپلود..." : "آپلود تصاویر" }}
                  </button>
                </div>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div
                    v-for="(img, i) in form.images"
                    :key="i"
                    class="relative">
                    <img
                      :src="img.url"
                      alt=""
                      class="w-full h-24 object-cover rounded" />
                    <button
                      type="button"
                      class="absolute top-1 right-1 text-xs bg-white/80 px-2 py-1 rounded"
                      @click="form.images.splice(i, 1)">
                      حذف
                    </button>
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
                    <input
                      v-model="variant.name"
                      placeholder="نام واریانت (مثلا: بسته‌بندی)"
                      class="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <button
                      type="button"
                      class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                      @click="form.variants.splice(vi, 1)">
                      حذف واریانت
                    </button>
                  </div>
                  <div class="space-y-2">
                    <div
                      v-for="(opt, oi) in variant.options"
                      :key="oi"
                      class="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <input
                        v-model="opt.value"
                        placeholder="مقدار (مثلا: 50 kg)"
                        class="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      <input
                        v-model.number="opt.priceModifier"
                        type="number"
                        placeholder="تغییر قیمت"
                        class="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      <div class="md:col-span-2">
                        <button
                          type="button"
                          class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                          @click="variant.options.splice(oi, 1)">
                          حذف گزینه
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      class="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50"
                      @click="
                        variant.options.push({ value: '', priceModifier: 0 })
                      ">
                      + افزودن گزینه
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  class="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50"
                  @click="form.variants.push({ name: '', options: [] })">
                  + افزودن واریانت
                </button>
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
                  <input
                    v-model="pair.key"
                    placeholder="کلید"
                    class="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <input
                    v-model="pair.value"
                    placeholder="مقدار"
                    class="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <button
                    type="button"
                    class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                    @click="attributesPairs.splice(i, 1)">
                    حذف
                  </button>
                </div>
                <button
                  type="button"
                  class="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50"
                  @click="attributesPairs.push({ key: '', value: '' })">
                  + افزودن ویژگی
                </button>
              </div>
            </div>

            <!-- <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1"
                  >امتیاز (۰ تا ۵)</label
                >
                <input
                  v-model.number="form.rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  class="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">وضعیت</label>
                <select
                  v-model="form.status"
                  class="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="draft">پیش‌نویس</option>
                  <option value="active">فعال</option>
                  <option value="inactive">غیرفعال</option>
                  <option value="archived">آرشیو</option>
                </select>
              </div>
            </div> -->

            <div class="flex items-center justify-end gap-2">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 rounded border border-gray-300">
                انصراف
              </button>
              <button
                type="submit"
                class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
                ذخیره
              </button>
            </div>
          </form>
        </template>
      </BaseModal>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { tr } from "@nuxt/ui/runtime/locale/index.js";
import { ref, computed, onMounted, watch } from "vue";
import BaseModal from "~/components/BaseModal.vue";
import { useAccess } from "~/composables/useAccess";
import { Resource } from "~/types/permissions";
import dashboardAuth from "~/middleware/dashboard-auth";
useHead({
  title: " آریاساخت | داشبورد | محصولات ",
});
definePageMeta({
  middleware: dashboardAuth,
});
type VariantOption = { value: string; priceModifier: number };
type Variant = { name: string; options: VariantOption[] };
type ImageItem = { url: string };
type ImageMeta = {
  filename: string;
  contentType: string;
  size: number;
};

type PresignItem = {
  filename: string;
  contentType: string;
  presignedUrl: string;
  publicUrl: string;
};
type Product = {
  _id?: string;
  name: string;
  slug: string;
  sku: string;
  basePrice: number;
  companyId?: string;
  categories: string[];
  description: string;
  stock: { quantity: number };
  variants: Variant[];
  attributes: Record<string, string>;
  tags: string[];
  images: ImageItem[];
  status: "draft" | "active" | "inactive" | "archived";
};

type UserMe = {
  userId: string;
  phoneNumber: string;
  permissions: Array<{
    resource: string;
    actions: string[];
    companyId?: string;
    _id: string;
  }>;
  profile: {
    phoneNumber: string;
    nationalId: string;
    firstName: string;
    lastName: string;
    address: string;
    walletId: string;
  };
};

const search = ref("");
const showModal = ref(false);
const editMode = ref(false);
const selectedId = ref<string | null>(null);
const products = ref<Product[]>([]);
// const { canCreate, canRead, canUpdate, canDelete } = {
//   canRead: true,
//   canDelete: true,
//   canCreate: true,
//   canUpdate: true,
// };

const { canCreate, canRead, canUpdate, canDelete } = useAccess(
  Resource.PRODUCTS
);

const { $axios } = useNuxtApp();

// Categories (fetched from /categories)
const categoryOptions = ref<{ _id: string; name: string }[]>([]);
const categoriesLoading = ref(false);

// Image upload state
const imageFiles = ref<File[]>([]);
const uploading = ref(false);

onMounted(() => {
  fetchProducts();
  fetchCategories();
});

async function fetchCategories() {
  try {
    categoriesLoading.value = true;
    const { data } = await $axios.get("/categories");
    // Expecting array of { _id, name, ... }
    categoryOptions.value = Array.isArray(data) ? data : data?.items || [];
  } catch (e) {
    console.error("خطا در دریافت دسته‌بندی‌ها:", e);
  } finally {
    categoriesLoading.value = false;
  }
}

function onImageFilesSelected(e: Event) {
  const target = e.target as HTMLInputElement;
  imageFiles.value = Array.from(target.files || []);
}

async function uploadSelectedImages() {
  if (!imageFiles.value.length) return;

  try {
    uploading.value = true;

    // 1) ساخت متادیتا برای هر فایل طبق ImageMetaDto
    const filesMeta: ImageMeta[] = imageFiles.value.map((file) => ({
      filename: file.name,
      contentType: file.type || "application/octet-stream",
      size: file.size,
    }));

    // 2) درخواست presign به بک‌اند طبق /api/images/presign
    const { data: presignRes } = await $axios.post<{
      items: PresignItem[];
    }>("/images/presign", {
      type: "product",
      files: filesMeta,
    });

    const items = presignRes?.items || [];
    if (!items.length) {
      throw new Error("هیچ لینک آپلودی از سرور دریافت نشد.");
    }

    // 3) آپلود واقعی هر فایل به presignedUrl
    // فرض می‌کنیم ترتیب items با files یکی است
    await Promise.all(
      items.map((item, index) => {
        const file = imageFiles.value[index];
        if (!file) return;

        return fetch(item.presignedUrl, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type || "application/octet-stream",
          },
        }).then((res) => {
          if (!res.ok) {
            throw new Error("آپلود فایل ناموفق بود: " + item.filename);
          }
        });
      })
    );

    // 4) ثبت URLهای عمومی در فرم محصول
    const newImages = items.map((item) => ({ url: item.publicUrl }));
    form.value.images = [...form.value.images, ...newImages];

    // اگر نخواستی دوباره لیست فایل‌ها را نگه داری:
    imageFiles.value = [];
  } catch (e) {
    console.error("خطا در آپلود تصاویر:", e);
  } finally {
    uploading.value = false;
  }
}

const form = ref<Product>({
  name: "",
  slug: "",
  sku: "",
  basePrice: 0,
  // companyId: "",
  categories: [],
  description: "",
  stock: { quantity: 0 },
  variants: [],
  attributes: {},
  tags: [],
  images: [],
  status: "draft",
});

// helpers for chip-like inputs
const categoriesInput = ref("");
const tagsInput = ref("");

const attributesPairs = ref<{ key: string; value: string }[]>([]);

watch(showModal, (val) => {
  if (val) {
    // sync helpers when opening
    categoriesInput.value = form.value.categories?.join(", ") ?? "";
    tagsInput.value = form.value.tags?.join(", ") ?? "";
    attributesPairs.value = Object.entries(form.value.attributes || {}).map(
      ([k, v]) => ({ key: k, value: v })
    );
  }
});

function syncCategoriesFromInput() {
  form.value.categories = categoriesInput.value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}
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

const filteredProducts = computed(() =>
  products.value.filter((p) =>
    (p.name || "").toLowerCase().includes(search.value.toLowerCase())
  )
);

async function fetchProducts() {
  if (!canRead) return;
  try {
    const { data } = await $axios.get("/products");
    // assume API returns array
    products.value = data;
  } catch (e) {
    console.error("خطا در دریافت محصولات:", e);
  }
}

function openModal(product: Product | null = null) {
  if (product) {
    if (!canUpdate) return alert("شما اجازه ویرایش ندارید!");
    editMode.value = true;
    selectedId.value = product._id || null;
    form.value = JSON.parse(JSON.stringify(product));
  } else {
    if (!canCreate) return alert("شما اجازه ایجاد ندارید!");
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
      status: "draft",
    };
  }
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

async function saveProduct() {
  // sync helper inputs back (tags only)
  syncTagsFromInput();
  // attributes from pairs
  form.value.attributes = {};
  attributesPairs.value.forEach(({ key, value }) => {
    if (key && value) form.value.attributes[key] = value;
  });

  try {
    if (editMode.value && selectedId.value) {
      const payload = { ...form.value };
      await $axios.patch(`/products/${selectedId.value}`, payload);
    } else {
      // برای ایجاد محصول جدید، companyId را از /me بگیر
      const meResponse = await $axios.get<UserMe>("/me");
      const userData = meResponse.data;

      // companyId را از permissions بگیر (برای محصولات)
      const productPermission = userData.permissions.find(
        (p) => p.resource === "products"
      );
      const companyId = productPermission?.companyId;

      if (!companyId) {
        throw new Error("companyId برای این کاربر یافت نشد");
      }

      const payload = { ...form.value, companyId };
      await $axios.post("/products", payload);
    }
    await fetchProducts();
    closeModal();
  } catch (e) {
    console.error("خطا در ذخیره محصول:", e);
  }
}

async function deleteProduct(product: Product) {
  if (!canDelete) return alert("شما اجازه حذف ندارید!");
  if (!product._id) return;
  if (!confirm(`حذف «${product.name}»؟`)) return;
  try {
    await $axios.delete(`/products/${product._id}`);
    await fetchProducts();
  } catch (e) {
    console.error("خطا در حذف محصول:", e);
  }
}

function numberFormat(n?: number) {
  if (typeof n !== "number") return "-";
  return n.toLocaleString("fa-IR");
}
</script>

<style scoped>
.container {
  width: 100%;
}
.title {
  color: var(--text, #333);
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 15px 0;
}
.title img {
  width: 50px;
  height: 50px;
}

/* removed @apply-based rules; utilities moved inline in template */
.ltr {
  direction: ltr;
}
</style>
