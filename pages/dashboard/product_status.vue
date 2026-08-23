<template>
  <section class="product-status-page" dir="rtl">
    <PanelPageHeader title="وضعیت محصولات" subtitle="وضعیت تأیید و انتشار محصولات خود را پیگیری کنید" icon="i-lucide-badge-check">
      <template #actions><UButton icon="i-lucide-refresh-cw" variant="soft" :loading="loading" aria-label="به‌روزرسانی وضعیت محصولات" @click="fetchProducts">به‌روزرسانی</UButton></template>
    </PanelPageHeader>
    <SharedAsyncState v-if="loading" state="loading" :skeleton-rows="5" />
    <SharedAsyncState v-else-if="loadError" state="error" :message="loadError" @retry="fetchProducts" />
    <div v-else-if="!canRead" class="forbidden-state" role="alert"><UIcon name="i-lucide-lock-keyhole" aria-hidden="true" /><h2>دسترسی به وضعیت محصولات امکان‌پذیر نیست</h2><p>حساب کاربری شما مجوز مشاهده این بخش را ندارد.</p></div>
    <template v-else>
      <PanelFilterBar>
        <TableFilterInput v-model="search" placeholder="جستجو با نام یا SKU" aria-label="جستجوی وضعیت محصولات" />
        <UButton v-if="search" variant="ghost" color="neutral" icon="i-lucide-x" @click="search = ''">حذف جستجو</UButton>
      </PanelFilterBar>
      <SharedAsyncState v-if="!filteredProducts.length" state="empty" title="محصولی پیدا نشد" message="جستجو را تغییر دهید." />
      <PanelDataTable v-else :rows="filteredProducts" :columns="[
        { key: 'image', label: 'تصویر' },
        { key: 'name', label: 'نام محصول' },
        { key: 'sku', label: 'SKU', class: 'ltr' },
        { key: 'basePrice', label: 'قیمت پایه' },
        { key: 'stock', label: 'موجودی' },
        { key: 'status', label: 'وضعیت' },
        { key: 'actions', label: 'عملیات' }
      ]" min-width="48rem">
        <template #image-data="{ row }"><img v-if="row.images?.[0]?.url" :src="row.images[0].url" :alt="row.name" class="product-image" /><span v-else class="image-placeholder">—</span></template>
        <template #sku-data="{ row }"><span class="ltr">{{ row.sku || "—" }}</span></template>
        <template #basePrice-data="{ row }">{{ numberFormat(row.basePrice) }} ریال</template>
        <template #stock-data="{ row }">{{ numberFormat(row.stock?.quantity ?? 0) }}</template>
        <template #status-data="{ row }"><USelect v-if="canUpdate" :model-value="row.status" size="xs" :items="productStatusOptions" :disabled="loadingProductId === row._id" @update:model-value="(value) => updateStatus(row, value as Product['status'])" /><StatusPill v-else :label="statusFa(row.status)" :semantic="productStatusSemantic(row.status)" size="compact" /></template>
        <template #actions-data="{ row }"><span v-if="loadingProductId === row._id" class="muted">در حال به‌روزرسانی…</span><span v-else class="muted">—</span></template>
      </PanelDataTable>
    </template>
  </section>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ sellerOnly?: boolean }>(), { sellerOnly: false });
import { computed, onMounted, ref } from "vue";
import { useAccess } from "~/composables/useAccess";
import { Resource } from "~/types/permissions";
import type { Product } from "~/types/product";
import { listCompanyProducts } from "~/services/productService";
import { toUserFacingError } from "~/services/apiClient";

useHead({ title: "داشبورد | وضعیت محصولات" });

const feedback = useFeedback();
const { canUpdate, canRead } = useAccess(Resource.PRODUCT_STATUS);
const { $axios } = useNuxtApp();
const { user } = useUser();
const search = ref("");
const products = ref<Product[]>([]);
const loading = ref(false);
const loadError = ref("");
const loadingProductId = ref<string | null>(null);
const productStatusOptions = [{ label: "پیش‌نویس", value: "draft" }, { label: "فعال", value: "active" }, { label: "غیرفعال", value: "inactive" }, { label: "آرشیو", value: "archived" }];
const filteredProducts = computed(() => { const query = search.value.trim().toLocaleLowerCase(); return products.value.filter((product) => !query || `${product.name} ${product.sku}`.toLocaleLowerCase().includes(query)); });
function statusFa(status: Product["status"]) { return status === "draft" ? "پیش‌نویس" : status === "active" ? "فعال" : status === "inactive" ? "غیرفعال" : status === "archived" ? "آرشیو" : "نامشخص"; }
function productStatusSemantic(status: Product["status"]) { return getStatusSemantic(status); }
function numberFormat(value?: number) { return typeof value === "number" ? value.toLocaleString("fa-IR") : "—"; }
async function fetchProducts() {
  if (!canRead.value) return;
  const currentUser = user.value as (typeof user.value & { companyId?: string; profile?: { companyId?: string } }) | null;
  const sellerCompanyId = currentUser?.companyId || currentUser?.profile?.companyId || "";
  if (props.sellerOnly && !sellerCompanyId) { products.value = []; loadError.value = "برای مشاهده وضعیت محصولات، ابتدا شرکت خود را ثبت کنید."; return; }
  loading.value = true; loadError.value = "";
  try {
    if (props.sellerOnly) {
      const result = await listCompanyProducts(sellerCompanyId, { limit: 100, sort: "createdAt:desc" });
      products.value = result.items;
    } else {
      const { data } = await $axios.get("/products/admin/all-products");
      products.value = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
    }
  }
  catch (error) { products.value = []; loadError.value = toUserFacingError(error, "دریافت وضعیت محصولات انجام نشد.").message; }
  finally { loading.value = false; }
}
async function updateStatus(product: Product, status: Product["status"]) {
  if (!canUpdate.value || !product._id || !status || loadingProductId.value) return;
  loadingProductId.value = product._id;
  try { await $axios.patch(`/products/${product._id}/status`, { status }); product.status = status; feedback.success("وضعیت محصول به‌روزرسانی شد"); }
  catch (error) { feedback.error("تغییر وضعیت انجام نشد", toUserFacingError(error, "تغییر وضعیت محصول انجام نشد.").message); await fetchProducts(); }
  finally { loadingProductId.value = null; }
}
onMounted(fetchProducts);
</script>

<style scoped>
.product-status-page { display: grid; gap: 1rem; }
.product-image, .image-placeholder { display: grid; place-items: center; width: 3rem; height: 3rem; object-fit: cover; border-radius: var(--radius-field); background: var(--color-bg-light); }
.muted { color: var(--color-text-muted); font-size: .8rem; }
.forbidden-state { display: grid; place-items: center; gap: .5rem; padding: 3rem 1rem; color: var(--color-text-muted); text-align: center; background: var(--color-bg-surface); border: 1px solid var(--color-border); border-radius: var(--radius-card); }
.forbidden-state h2, .forbidden-state p { margin: 0; }
.ltr { direction: ltr; text-align: left; }
</style>
