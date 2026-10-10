<script setup lang="ts">
import type { Product } from '~/types/product';

withDefaults(defineProps<{
  id: string;
  title: string;
  subtitle: string;
  products: Product[] | null;
  loading: boolean;
  badge: string;
  badgeTone: 'offer' | 'new' | 'popular';
}>(), { products: () => [], loading: false });
</script>

<template>
  <section :aria-labelledby="id" class="landing-product-rail">
    <LandingSectionHeader :id="id" :title="title" :subtitle="subtitle">
      <template #action>
        <NuxtLink to="/products" class="landing-product-rail__all">
          مشاهده همه
          <UIcon name="i-lucide-arrow-left" aria-hidden="true" />
        </NuxtLink>
      </template>
    </LandingSectionHeader>

    <div v-if="loading" class="landing-product-rail__grid" aria-busy="true">
      <div v-for="item in 4" :key="item" class="landing-product-skeleton">
        <div class="landing-product-skeleton__image"></div>
        <div class="landing-product-skeleton__body">
          <span></span><span></span><span></span>
        </div>
      </div>
    </div>

    <div v-else-if="products?.length" class="landing-product-rail__grid">
      <LandingProductCard
        v-for="product in products"
        :key="product._id || product.id"
        :product="product"
        :badge="badge"
        :badge-tone="badgeTone"
      />
    </div>
  </section>
</template>

<style scoped>
.landing-product-rail__all { display:inline-flex; min-height:2.15rem; align-items:center; gap:.3rem; color:var(--color-brand-blue); font-size:.68rem; font-weight:var(--font-weight-extrabold); }
.landing-product-rail__all:hover { color:var(--color-brand-blue-hover); }
.landing-product-rail__all :deep(svg) { width:.85rem; }
.landing-product-rail__grid { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:var(--landing-grid-gap); }
.landing-product-skeleton { overflow:hidden; border:1px solid var(--color-border); border-radius:var(--radius-card); background:var(--color-bg-surface); box-shadow:var(--shadow-raised); }
.landing-product-skeleton__image { aspect-ratio:1.18; background:var(--color-border-strong); animation:landing-product-pulse 1.4s ease-in-out infinite; }
.landing-product-skeleton__body { display:grid; gap:.5rem; padding:.75rem; }
.landing-product-skeleton__body span { display:block; width:75%; height:.7rem; border-radius:var(--radius-pill); background:var(--color-border-strong); animation:landing-product-pulse 1.4s ease-in-out infinite; }
.landing-product-skeleton__body span:nth-child(2) { width:55%; }
.landing-product-skeleton__body span:nth-child(3) { width:42%; height:1.1rem; margin-top:.4rem; }
@keyframes landing-product-pulse { 50% { opacity:.45; } }
@media (min-width:1200px) { .landing-product-rail__grid { grid-template-columns:repeat(5,minmax(0,1fr)); } }
@media (max-width:1023px) { .landing-product-rail__grid { grid-template-columns:repeat(3,minmax(0,1fr)); } }
@media (max-width:767px) {
  .landing-product-rail__grid { display:flex; gap:.65rem; overflow-x:auto; padding:.1rem .05rem .45rem; scroll-snap-type:x proximity; scrollbar-width:thin; }
  .landing-product-rail__grid > * { flex:0 0 min(14.5rem,74vw); scroll-snap-align:start; }
}
@media (prefers-reduced-motion:reduce) { .landing-product-skeleton__image, .landing-product-skeleton__body span { animation:none; } }
</style>
