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

      <div class="bg-white rounded-lg shadow p-4 overflow-x-auto">
        <table class="w-full text-sm text-right border-collapse">
          <thead class="border-b">
            <tr class="text-gray-600">
              <th class="p-3">تصویر</th>
              <th class="p-3">نام</th>
              <th class="p-3">کد</th>
              <th class="p-3">قیمت پایه (﷼)</th>
              <th class="p-3">موجودی</th>
              <th class="p-3">شرکت</th>
              <th class="p-3">وضعیت</th>
              <th class="p-3">امتیاز</th>
              <th class="p-3">عملیات</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(product, idx) in filteredProducts"
              :key="product._id || idx"
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
              <td class="p-3 ltr text-xs">{{ product.companyId }}</td>
              <td class="p-3">
                <span
                  class="px-2 py-1 rounded text-white"
                  :class="{
                    'bg-gray-500': product.status === 'draft',
                    'bg-green-600': product.status === 'published',
                    'bg-red-500': product.status === 'archived',
                  }">
                  {{ statusFa(product.status) }}
                </span>
              </td>
              <td class="p-3">{{ product.rating ?? "-" }}</td>
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
        <h2 class="text-lg font-bold mb-4">
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
              <label class="block text-sm font-medium mb-1">نامک (slug)</label>
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
                class="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ltr"
                required />
            </div>

            <div>
              <label class="block text-sm font-medium mb-1"
                >قیمت پایه (﷼)</label
              >
              <input
                v-model.number="form.basePrice"
                type="number"
                min="0"
                class="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required />
            </div>

            <div>
              <label class="block text-sm font-medium mb-1"
                >شناسه شرکت (companyId)</label
              >
              <input
                v-model="form.companyId"
                type="text"
                class="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ltr"
                placeholder="ObjectId" />
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">تعداد موجودی</label>
              <input
                v-model.number="form.stock.quantity"
                type="number"
                min="0"
                class="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">توضیحات</label>
            <textarea
              v-model="form.description"
              rows="3"
              class="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
          </div>

          <!-- دسته‌بندی‌ها -->
          <div>
            <label class="block text-sm font-medium mb-1"
              >دسته‌بندی‌ها (IDs)</label
            >
            <input
              v-model="categoriesInput"
              @blur="syncCategoriesFromInput"
              placeholder="شناسه‌ها را با ویرگول جدا کنید"
              class="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ltr" />
            <div class="text-xs text-gray-500 mt-1">
              مثال: 507f1..., 60ad..., ...
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
            <label class="block text-sm font-medium mb-1">تصاویر (URL)</label>
            <div class="space-y-2">
              <div
                v-for="(img, i) in form.images"
                :key="i"
                class="flex items-center gap-2">
                <input
                  v-model="img.url"
                  type="text"
                  class="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ltr"
                  placeholder="https://..." />
                <button
                  type="button"
                  class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                  @click="form.images.splice(i, 1)">
                  حذف
                </button>
              </div>
              <button
                type="button"
                class="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50"
                @click="form.images.push({ url: '' })">
                + افزودن تصویر
              </button>
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
            <label class="block text-sm font-medium mb-2"
              >ویژگی‌ها (کلید/مقدار)</label
            >
            <div class="space-y-2">
              <div
                v-for="(pair, i) in attributesPairs"
                :key="i"
                class="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input
                  v-model="pair.key"
                  placeholder="کلید (مثلا: strength)"
                  class="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input
                  v-model="pair.value"
                  placeholder="مقدار (مثلا: 42.5 MPa)"
                  class="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <div class="md:col-span-2">
                  <button
                    type="button"
                    class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                    @click="attributesPairs.splice(i, 1)">
                    حذف
                  </button>
                </div>
              </div>
              <button
                type="button"
                class="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50"
                @click="attributesPairs.push({ key: '', value: '' })">
                + افزودن ویژگی
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <option value="published">منتشر شده</option>
                <option value="archived">آرشیو</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end gap-2">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">
              انصراف
            </button>
            <button
              type="submit"
              class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
              ذخیره
            </button>
          </div>
        </form>
      </BaseModal>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import BaseModal from "~/components/BaseModal.vue";
import { useAccess } from "~/composables/useAccess";
import { Resource } from "~/types/permissions";
// import dashboardAuth from "~/middleware/dashboard-auth";

// definePageMeta({ middleware: dashboardAuth });

type VariantOption = { value: string; priceModifier: number };
type Variant = { name: string; options: VariantOption[] };
type ImageItem = { url: string };
type Product = {
  _id?: string;
  name: string;
  slug: string;
  sku: string;
  basePrice: number;
  companyId?: string;
  categories: string[];
  description?: string;
  stock: { quantity: number };
  variants: Variant[];
  attributes: Record<string, string>;
  tags: string[];
  images: ImageItem[];
  comments: string[];
  rating?: number;
  status: "draft" | "published" | "archived";
};

const search = ref("");
const showModal = ref(false);
const editMode = ref(false);
const selectedId = ref<string | null>(null);
const products = ref<Product[]>([]);

const { canCreate, canRead, canUpdate, canDelete } = useAccess(
  Resource.PRODUCTS
);

const { $axios } = useNuxtApp();

const form = ref<Product>({
  name: "",
  slug: "",
  sku: "",
  basePrice: 0,
  companyId: "",
  categories: [],
  description: "",
  stock: { quantity: 0 },
  variants: [],
  attributes: {},
  tags: [],
  images: [],
  comments: [],
  rating: 0,
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
  return s === "draft" ? "پیش‌نویس" : s === "published" ? "منتشر شده" : "آرشیو";
}
function numberFormat(n?: number) {
  if (typeof n !== "number") return "-";
  return n.toLocaleString("fa-IR");
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
      companyId: "",
      categories: [],
      description: "",
      stock: { quantity: 0 },
      variants: [],
      attributes: {},
      tags: [],
      images: [],
      comments: [],
      rating: 0,
      status: "draft",
    };
  }
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

async function saveProduct() {
  // sync helper inputs back
  syncCategoriesFromInput();
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
      await $axios.post("/products", form.value);
    }
    await fetchProducts();
    closeModal();
  } catch (e) {
    console.error("خطا در ذخیره محصول:", e);
  }
}

async function deleteProduct(product: Product) {
  if (!canDelete) return alert("شما اجازه حذف ندارید!");
  if (!confirm("آیا از حذف این محصول مطمئن هستید؟")) return;
  try {
    await $axios.delete(`/products/${product._id}`);
    await fetchProducts();
  } catch (e) {
    console.error("خطا در حذف محصول:", e);
  }
}

onMounted(() => {
  fetchProducts();
});
</script>

<style scoped>
.container {
  width: 100%;
}
.title {
  color: var(--blue-dark);
  font-family: "iran-yekan-Bold";
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
