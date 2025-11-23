<template>
  <NuxtLayout name="dashboard">
    <div class="container">
      <div class="title">
        <h1>وضعیت محصولات</h1>
        <img src="/icons/product-delivered.png" alt="" />
      </div>

      <div
        class="actions flex justify-between items-center mb-4 bg-white rounded-lg py-2">
        <SearchBar v-model="search" :dark="true" />
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
                <select
                  v-if="canUpdate"
                  :value="product.status"
                  @change="(e) => updateStatus(product, (e.target as HTMLSelectElement).value as any)"
                  class="px-2 py-1 rounded text-xs border border-gray-300"
                  :class="{
                    'bg-yellow-100 text-yellow-800': product.status === 'draft',
                    'bg-green-100 text-green-800': product.status === 'active',
                    'bg-gray-100 text-gray-800': product.status === 'inactive',
                    'bg-red-100 text-red-800': product.status === 'archived',
                  }">
                  <option value="draft">پیش‌نویس</option>
                  <option value="active">فعال</option>
                  <option value="inactive">غیرفعال</option>
                  <option value="archived">آرشیو</option>
                </select>
                <span
                  v-else
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
                <span
                  v-if="loadingProductId === product._id"
                  class="text-sm text-gray-500"
                  >درحال‌بروزرسانی...</span
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useAccess } from "~/composables/useAccess";
import { Resource } from "~/types/permissions";
import dashboardAuth from "~/middleware/dashboard-auth";

useHead({
  title: " آریاساخت | داشبورد | وضعیت محصولات ",
});

definePageMeta({
  middleware: dashboardAuth,
});

type ImageItem = { url: string };

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
  variants: any[];
  attributes: Record<string, string>;
  tags: string[];
  images: ImageItem[];
  status: "draft" | "active" | "inactive" | "archived";
};

const search = ref("");
const products = ref<Product[]>([]);
const loadingProductId = ref<string | null>(null);

const { canUpdate, canRead } = useAccess(Resource.PRODUCT_STATUS);

const { $axios } = useNuxtApp();

onMounted(() => {
  fetchProducts();
});

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
    const { data } = await $axios.get("/products/admin/all-products");
    products.value = Array.isArray(data) ? data : [];
  } catch (e) {
    console.error("خطا در دریافت محصولات:", e);
  }
}

async function updateStatus(
  product: Product,
  newStatus: "draft" | "active" | "inactive" | "archived"
) {
  if (!canUpdate) {
    alert("شما اجازه تغییر وضعیت ندارید!");
    return;
  }

  if (!product._id) return;

  try {
    loadingProductId.value = product._id;
    await $axios.patch(`/products/${product._id}/status`, {
      status: newStatus,
    });
    product.status = newStatus;
  } catch (e: any) {
    console.error("خطا در بروزرسانی وضعیت:", e);
    const errorMsg = e?.response?.data?.message || e?.message || "خطای نامشخص";
    alert("خطا: " + errorMsg);
    await fetchProducts(); // بازیابی محصولات در صورت خطا
  } finally {
    loadingProductId.value = null;
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
