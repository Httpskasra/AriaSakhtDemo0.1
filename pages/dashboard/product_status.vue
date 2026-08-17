<template>
  <NuxtLayout name="dashboard">
    <div class="container">
      <div class="title">
        <h1>وضعیت محصولات</h1>
        <img src="/icons/product-delivered.png" alt="" />
      </div>

      <div
        class="actions flex justify-between items-center mb-4 bg-white rounded-field py-2">
        <TableFilterInput
          v-model="search"
          placeholder="جستجوی محصول..." />
      </div>

      <div class="premium-card border border-gray-100 overflow-hidden">
  <TableScrollContainer>
    <UTable :rows="filteredProducts" :columns="productStatusColumns" class="min-w-[36rem]">
          <template #image-data="{ row }">
            <img
              v-if="row.images && row.images.length"
              :src="row.images[0].url"
              class="w-12 h-12 rounded-field object-cover" />
          </template>
          <template #sku-data="{ row }">
            <span class="ltr">{{ row.sku }}</span>
          </template>
          <template #basePrice-data="{ row }">
            {{ numberFormat(row.basePrice) }}
          </template>
          <template #stock-data="{ row }">
            {{ row.stock?.quantity ?? 0 }}
          </template>
          <template #company-data>
            <span class="ltr text-xs">ID</span>
          </template>
          <template #status-data="{ row }">
            <USelect
              v-if="canUpdate"
              :model-value="row.status"
              size="xs"
              :items="productStatusOptions"
              @update:model-value="(value) => updateStatus(row, value as any)" />
            <StatusPill
              v-else
              :label="statusFa(row.status)"
              :semantic="productStatusSemantic(row.status)"
              size="compact" />
          </template>
          <template #actions-data="{ row }">
            <span
              v-if="loadingProductId === row._id"
              class="text-sm text-gray-500">
              درحال‌بروزرسانی...
            </span>
          </template>
    </UTable>
  </TableScrollContainer>
        <SharedAsyncState
          v-if="filteredProducts.length === 0"
          state="empty"
          title="محصولی پیدا نشد"
          message="جستجو را تغییر دهید." />
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const feedback = useFeedback();
import { ref, computed, onMounted } from "vue";
import { useAccess } from "~/composables/useAccess";
import { Resource } from "~/types/permissions";
import type { Product } from "~/types/product";

useHead({
  title: "داشبورد | وضعیت محصولات",
});

definePageMeta({
  middleware: ["auth", "permission"],
  permission: { resource: "product_status", action: "u" },
});

const search = ref("");
const products = ref<Product[]>([]);
const loadingProductId = ref<string | null>(null);
const productStatusColumns = [
  { key: "image", label: "تصویر" },
  { key: "name", label: "نام" },
  { key: "sku", label: "SKU" },
  { key: "basePrice", label: "قیمت پایه" },
  { key: "stock", label: "موجودی" },
  { key: "company", label: "شرکت" },
  { key: "status", label: "وضعیت" },
  { key: "actions", label: "اقدامات" },
];
const productStatusOptions = [
  { label: "پیش‌نویس", value: "draft" },
  { label: "فعال", value: "active" },
  { label: "غیرفعال", value: "inactive" },
  { label: "آرشیو", value: "archived" },
];

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

function productStatusSemantic(s: Product["status"]) {
  return getStatusSemantic(s);
}

const filteredProducts = computed(() =>
  products.value.filter((p) =>
    (p.name || "").toLowerCase().includes(search.value.toLowerCase())
  )
);

async function fetchProducts() {
  if (!canRead.value) return;
  try {
    const { data } = await $axios.get("/products/admin/all-products");
    products.value = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
  } catch (e) {
    console.error("خطا در دریافت محصولات:", e);
  }
}

async function updateStatus(
  product: Product,
  newStatus: "draft" | "active" | "inactive" | "archived"
) {
  if (!canUpdate.value) {
    feedback.error("دسترسی کافی ندارید", "شما اجازه تغییر وضعیت ندارید.");
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
    feedback.error("تغییر وضعیت انجام نشد", errorMsg);
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
  color: var(--color-text-dark);
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
