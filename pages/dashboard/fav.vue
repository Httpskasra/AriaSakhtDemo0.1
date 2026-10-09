<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useFavoritesStore } from "~/stores/favorites";
import type { Favorite } from "~/services/favoritesService";

useHead({ title: "داشبورد | علاقه‌مندی‌ها" });

const favorites = useFavoritesStore();
const search = ref("");
const removingId = ref<string | null>(null);
const authLoading = ref(true);
const { fetchUser } = useUser();

const productSearchText = (item: Favorite) => {
  const product = item.product;
  const companyName = typeof product?.companyId === "object" ? product.companyId.name : "";
  return [product?.name, product?.sku, companyName, ...(product?.tags || [])]
    .filter(Boolean)
    .join(" ")
    .toLocaleLowerCase();
};
const formatCount = (value: number) => new Intl.NumberFormat("fa-IR").format(value);

async function remove(productId: string) {
  removingId.value = productId;
  try {
    await favorites.toggle(productId);
  } catch {
    // The store keeps the previous item on failure and exposes the user-facing error.
  } finally {
    removingId.value = null;
  }
}

const fetchFavorites = () => favorites.fetch().catch(() => undefined);
const filteredItems = computed(() => {
  const query = search.value.trim().toLocaleLowerCase();
  if (!query) return favorites.items;
  return favorites.items.filter((item) => productSearchText(item).includes(query));
});
const hasFilters = computed(() => Boolean(search.value.trim()));
const clearFilters = () => { search.value = ""; };

onMounted(() => {
  void (async () => {
    const authenticated = await fetchUser();
    authLoading.value = false;
    if (authenticated && !favorites.initialized) await fetchFavorites();
  })();
});
</script>

<template>
    <section class="favorites-page" dir="rtl">
      <PanelPageHeader title="علاقه‌مندی‌ها" subtitle="محصولاتی که برای دسترسی سریع ذخیره کرده‌اید" icon="i-lucide-heart">
        <template #actions>
          <UButton icon="i-lucide-refresh-cw" variant="soft" :loading="favorites.loading" aria-label="به‌روزرسانی علاقه‌مندی‌ها" @click="fetchFavorites">به‌روزرسانی</UButton>
        </template>
      </PanelPageHeader>
      <SharedAsyncState v-if="authLoading || favorites.loading" state="loading" />
      <SharedAsyncState v-else-if="favorites.error" state="error" :message="favorites.error" @retry="fetchFavorites" />
      <SharedAsyncState v-else-if="!favorites.items.length" state="empty" title="هنوز محصولی ذخیره نشده است" message="محصولات موردعلاقه‌تان را برای دسترسی سریع اینجا ذخیره کنید." />
      <template v-else>
        <PanelFilterBar>
          <TableFilterInput v-model="search" placeholder="جستجوی محصول" aria-label="جستجوی محصول در علاقه‌مندی‌ها" />
          <UButton v-if="hasFilters" variant="ghost" color="neutral" icon="i-lucide-x" @click="clearFilters">حذف فیلتر</UButton>
        </PanelFilterBar>
        <SharedAsyncState v-if="!filteredItems.length" state="empty" title="محصولی با این جستجو پیدا نشد" message="عبارت جستجو را تغییر دهید یا فیلتر را پاک کنید." />
        <div v-else class="favorites-results">
          <div class="favorites-results__meta" aria-live="polite">
            <span>{{ formatCount(filteredItems.length) }} محصول ذخیره‌شده</span>
            <span v-if="hasFilters">نتیجهٔ جستجو برای «{{ search.trim() }}»</span>
          </div>
          <div class="favorites-grid">
            <template v-for="item in filteredItems" :key="item.id || item.productId">
              <CatalogProductCard v-if="item.product" :product="item.product" />
              <article v-else class="favorite-unavailable">
                <div class="favorite-unavailable__icon" aria-hidden="true"><UIcon name="i-lucide-package-x" /></div>
                <div class="favorite-unavailable__content">
                  <h2>این محصول دیگر در دسترس نیست</h2>
                  <p>اطلاعات محصول ذخیره‌شده پیدا نشد و امکان نمایش جزئیات آن وجود ندارد.</p>
                </div>
                <UButton type="button" color="error" variant="soft" size="sm" :loading="removingId === item.productId" :disabled="Boolean(removingId)" @click="remove(item.productId)">حذف از علاقه‌مندی‌ها</UButton>
              </article>
            </template>
          </div>
        </div>
      </template>
    </section>
</template>

<style scoped>
.favorites-page { display: grid; gap: 1rem; }
.favorites-results { display: grid; gap: .65rem; }
.favorites-results__meta { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: .5rem 1rem; color: var(--color-text-muted); font-size: .82rem; }
.favorites-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 18rem), 22rem)); justify-content: start; gap: 1rem; }
.favorite-unavailable { display: flex; min-width: 0; flex-direction: column; gap: .85rem; padding: 1.15rem; border: 1px solid var(--color-border); border-radius: var(--radius-card); background: var(--color-bg-surface); }
.favorite-unavailable__icon { display: grid; place-items: center; width: 3rem; height: 3rem; border-radius: var(--radius-compact-list-item); background: var(--color-danger-bg); color: var(--color-danger-fg); font-size: 1.35rem; }
.favorite-unavailable__content { display: grid; gap: .35rem; }
.favorite-unavailable h2, .favorite-unavailable p { margin: 0; }
.favorite-unavailable h2 { color: var(--color-text-heading); font-size: 1rem; font-weight: var(--font-weight-extrabold); }
.favorite-unavailable p { color: var(--color-text-muted); font-size: .84rem; line-height: 1.8; }

@media (max-width: 640px) {
  .favorites-grid { grid-template-columns: minmax(0, 1fr); }
  .favorites-results__meta { align-items: flex-start; flex-direction: column; }
}
</style>
