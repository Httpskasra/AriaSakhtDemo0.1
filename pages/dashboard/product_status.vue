<template>
  <section class="product-status-page" dir="rtl">
    <PanelPageHeader title="وضعیت محصولات" subtitle="وضعیت تأیید و انتشار محصولات خود را پیگیری کنید" icon="i-lucide-badge-check">
      <template #actions><UButton icon="i-lucide-refresh-cw" variant="soft" :loading="loading" aria-label="به‌روزرسانی وضعیت محصولات" @click="fetchProducts">به‌روزرسانی</UButton></template>
    </PanelPageHeader>
    <section class="product-status-overview" aria-label="خلاصه وضعیت محصولات">
      <article><span>کل محصولات</span><strong class="font-num">{{ products.length.toLocaleString("fa-IR") }}</strong></article>
      <article class="is-success"><span>فعال</span><strong class="font-num">{{ statusCount("active").toLocaleString("fa-IR") }}</strong></article>
      <article class="is-warning"><span>پیش‌نویس</span><strong class="font-num">{{ statusCount("draft").toLocaleString("fa-IR") }}</strong></article>
      <article class="is-danger"><span>غیرفعال یا آرشیو</span><strong class="font-num">{{ inactiveCount.toLocaleString("fa-IR") }}</strong></article>
    </section>
    <SharedAsyncState v-if="!isReady || loading" state="loading" :skeleton-rows="5" />
    <SharedAsyncState v-else-if="loadError" state="error" :message="loadError" @retry="fetchProducts" />
    <div v-else-if="!canRead" class="forbidden-state" role="alert"><UIcon name="i-lucide-lock-keyhole" aria-hidden="true" /><h2>دسترسی به وضعیت محصولات امکان‌پذیر نیست</h2><p>حساب کاربری شما مجوز مشاهده این بخش را ندارد.</p></div>
    <template v-else>
      <PanelFilterBar>
        <TableFilterInput v-model="search" placeholder="جستجو با نام یا SKU" aria-label="جستجوی وضعیت محصولات" />
        <UButton v-if="search" variant="ghost" color="neutral" icon="i-lucide-x" @click="search = ''">حذف جستجو</UButton>
      </PanelFilterBar>
      <SharedAsyncState v-if="!filteredProducts.length" state="empty" title="محصولی پیدا نشد" message="جستجو را تغییر دهید." />
      <PanelDataTable v-else :rows="filteredProducts" :columns="[
        { key: 'image', label: 'محصول' },
        { key: 'basePrice', label: 'قیمت پایه' },
        { key: 'stock', label: 'موجودی' },
        { key: 'status', label: 'وضعیت' },
        { key: 'actions', label: 'عملیات' }
      ]" min-width="48rem">
        <template #image-data="{ row }"><div class="product-identity"><img v-if="row.images?.[0]?.url" :src="row.images[0].url" :alt="`تصویر ${row.name}`" class="product-image" @error="handleImageError" /><span v-else class="product-image image-placeholder"><UIcon name="i-lucide-image-off" aria-hidden="true" /></span><div><strong>{{ row.name }}</strong><span class="ltr">SKU: {{ row.sku || "—" }}</span></div></div></template>
        <template #basePrice-data="{ row }"><span class="font-num">{{ numberFormat(row.finalPrice ?? row.basePrice) }} ریال</span></template>
        <template #stock-data="{ row }"><span class="stock-value" :class="{ 'stock-value--empty': !(row.stock?.quantity ?? 0) }"><UIcon :name="(row.stock?.quantity ?? 0) ? 'i-lucide-package-check' : 'i-lucide-package-x'" aria-hidden="true" /><span class="font-num">{{ numberFormat(row.stock?.quantity ?? 0) }}</span></span></template>
        <template #status-data="{ row }"><USelect v-if="canUpdate" :model-value="row.status" size="xs" :items="productStatusOptions" :disabled="loadingProductId === (row._id || row.id)" @update:model-value="(value) => updateStatus(row, value as Product['status'])" /><StatusPill v-else :label="statusFa(row.status)" :semantic="productStatusSemantic(row.status)" size="compact" /></template>
        <template #actions-data="{ row }"><div class="status-actions"><span v-if="loadingProductId === (row._id || row.id)" class="muted">در حال به‌روزرسانی…</span><UButton v-else-if="row._id || row.id" :to="`/products/${row._id || row.id}`" icon="i-lucide-eye" size="xs" color="neutral" variant="soft">مشاهده</UButton></div></template>
      </PanelDataTable>
    </template>
  </section>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ sellerOnly?: boolean }>(), { sellerOnly: false });
import { computed, onMounted, ref, watch } from "vue";
import { useAccess } from "~/composables/useAccess";
import { getStatusSemantic } from "~/composables/useStatusStyle";
import { Resource } from "~/types/permissions";
import type { Product } from "~/types/product";
import { listCompanyProducts } from "~/services/productService";
import { toUserFacingError } from "~/services/apiClient";

useHead({ title: "داشبورد | وضعیت محصولات" });

const feedback = useFeedback();
const { canUpdate, canRead, isReady } = useAccess(Resource.PRODUCT_STATUS);
const { $axios } = useNuxtApp();
const { user } = useUser();
const search = ref("");
const products = ref<Product[]>([]);
const loading = ref(false);
const loadError = ref("");
const loadingProductId = ref<string | null>(null);
const productStatusOptions = [{ label: "پیش‌نویس", value: "draft" }, { label: "فعال", value: "active" }, { label: "غیرفعال", value: "inactive" }, { label: "آرشیو", value: "archived" }, { label: "حذف‌شده", value: "deleted" }];
const filteredProducts = computed(() => { const query = search.value.trim().toLocaleLowerCase(); return products.value.filter((product) => !query || `${product.name} ${product.sku}`.toLocaleLowerCase().includes(query)); });
function statusFa(status: Product["status"]) { return status === "draft" ? "پیش‌نویس" : status === "active" ? "فعال" : status === "inactive" ? "غیرفعال" : status === "archived" ? "آرشیو" : status === "deleted" ? "حذف‌شده" : "نامشخص"; }
function productStatusSemantic(status: Product["status"]) { return getStatusSemantic(status); }
function numberFormat(value?: number) { return typeof value === "number" ? value.toLocaleString("fa-IR") : "—"; }
function statusCount(status: NonNullable<Product["status"]>) { return products.value.filter((product) => product.status === status).length; }
const inactiveCount = computed(() => products.value.filter((product) => ["inactive", "archived", "deleted"].includes(product.status || "")).length);
function handleImageError(event: Event) { (event.target as HTMLImageElement).style.display = "none"; }
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
onMounted(() => { if (isReady.value) fetchProducts(); });
watch(isReady, (ready) => { if (ready) fetchProducts(); }, { once: true });
</script>

<style scoped>
.product-status-page { display: grid; gap: 1rem; }
.product-status-overview { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: .75rem; }
.product-status-overview article { display: grid; gap: .2rem; padding: 1rem; border: 1px solid var(--color-border); border-radius: var(--radius-card); background: var(--color-bg-surface); box-shadow: var(--shadow-raised); }
.product-status-overview span { color: var(--color-text-muted); font-size: .75rem; }
.product-status-overview strong { color: var(--color-text-heading); font-size: 1.4rem; }
.product-status-overview .is-success { border-color: var(--color-success-border); }
.product-status-overview .is-success strong { color: var(--color-success-fg); }
.product-status-overview .is-warning { border-color: var(--color-warning-border); }
.product-status-overview .is-warning strong { color: var(--color-warning-fg); }
.product-status-overview .is-danger { border-color: var(--color-danger-border); }
.product-status-overview .is-danger strong { color: var(--color-danger-fg); }
.product-identity { display: flex; align-items: center; gap: .65rem; min-width: 13rem; }
.product-identity > div { display: grid; gap: .2rem; min-width: 0; }
.product-identity strong { max-width: 14rem; overflow: hidden; color: var(--color-text-heading); text-overflow: ellipsis; white-space: nowrap; }
.product-identity span { color: var(--color-text-muted); font-size: .7rem; }
.product-image, .image-placeholder { display: grid; place-items: center; width: 3rem; height: 3rem; padding: .2rem; object-fit: contain; border-radius: var(--radius-field); background: var(--color-bg-light); }
.image-placeholder { color: var(--color-text-disabled); }
.stock-value { display: inline-flex; align-items: center; gap: .35rem; color: var(--color-success-fg); font-weight: 700; }
.stock-value--empty { color: var(--color-danger-fg); }
.status-actions { display: flex; align-items: center; min-width: 5rem; }
.muted { color: var(--color-text-muted); font-size: .8rem; }
.forbidden-state { display: grid; place-items: center; gap: .5rem; padding: 3rem 1rem; color: var(--color-text-muted); text-align: center; background: var(--color-bg-surface); border: 1px solid var(--color-border); border-radius: var(--radius-card); }
.forbidden-state h2, .forbidden-state p { margin: 0; }
.ltr { direction: ltr; text-align: left; }
@media (max-width: 800px) { .product-status-overview { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 480px) { .product-status-overview article { padding: .75rem; } .product-status-overview strong { font-size: 1.15rem; } }
</style>
