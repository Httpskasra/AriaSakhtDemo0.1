<script setup lang="ts">
import { onMounted } from "vue";
import { useFavoritesStore } from "~/stores/favorites";
import type { Favorite } from "~/services/favoritesService";

useHead({ title: "داشبورد | علاقه‌مندی‌ها" });
definePageMeta({ layout: "dashboard", middleware: ["auth"] });

const favorites = useFavoritesStore();

const productName = (item: Favorite) => item.product?.name || "محصول ذخیره‌شده";
const productLink = (item: Favorite) => {
  const product = item.product;
  return product ? `/products/${encodeURIComponent(product.slug || product.id || product._id || item.productId)}` : `/products/${encodeURIComponent(item.productId)}`;
};

async function remove(productId: string) {
  try {
    await favorites.toggle(productId);
  } catch {
    // The store keeps the previous item on failure and exposes the user-facing error.
  }
}

onMounted(() => {
  if (!favorites.initialized) void favorites.fetch();
});
</script>

<template>
    <section class="favorites-page container" dir="rtl">
      <DashboardPageHeader title="علاقه‌مندی‌ها" icon="/dashboardIcons/products.svg" />
      <SharedAsyncState v-if="favorites.loading" state="loading" />
      <SharedAsyncState v-else-if="favorites.error" state="error" :message="favorites.error" @retry="favorites.fetch" />
      <SharedAsyncState v-else-if="!favorites.items.length" state="empty" title="هنوز محصولی ذخیره نشده است" message="محصولات موردعلاقه‌تان را برای دسترسی سریع اینجا ذخیره کنید." />
      <div v-else class="favorites-grid">
        <article v-for="item in favorites.items" :key="item.id || item.productId" class="favorite-card">
          <NuxtLink :to="productLink(item)" class="favorite-card__body">
            <img v-if="item.product?.images?.[0]?.url" :src="item.product.images[0].url" :alt="productName(item)" loading="lazy" />
            <div v-else class="favorite-card__placeholder" aria-hidden="true">♡</div>
            <div>
              <h2>{{ productName(item) }}</h2>
              <p v-if="item.product?.basePrice">{{ new Intl.NumberFormat("fa-IR").format(item.product.basePrice) }} ریال</p>
            </div>
          </NuxtLink>
          <UButton type="button" color="error" variant="soft" size="sm" @click="remove(item.productId)">حذف</UButton>
        </article>
      </div>
    </section>
</template>

<style scoped>
.favorites-page { display: grid; gap: 1rem; }
.favorites-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr)); gap: 1rem; }
.favorite-card { display: flex; flex-direction: column; gap: .75rem; padding: 1rem; background: var(--color-bg-surface); border: 1px solid var(--color-border); border-radius: var(--radius-card); }
.favorite-card__body { display: grid; gap: .75rem; color: inherit; text-decoration: none; }
.favorite-card__body img, .favorite-card__placeholder { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: var(--radius-field); background: var(--color-bg-light); }
.favorite-card__placeholder { display: grid; place-items: center; color: var(--color-text-muted); font-size: 2rem; }
.favorite-card h2 { margin: 0; color: var(--color-text-heading); font-size: 1rem; }
.favorite-card p { margin: .35rem 0 0; color: var(--color-text-muted); font-size: .85rem; }
</style>
