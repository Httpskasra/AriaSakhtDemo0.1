<template>
  <div class="product-skeleton premium-card">
    <!-- Image Skeleton with reserved Badge space -->
    <div class="product-skeleton__image">
      <USkeleton class="product-skeleton__fill" />
      <!-- Ghost Badge -->
      <div class="product-skeleton__badge">
        <USkeleton class="product-skeleton__badge-fill" />
      </div>
    </div>

    <!-- Content Skeletons -->
    <div class="product-skeleton__body">
      <div class="product-skeleton__copy">
        <USkeleton class="product-skeleton__line product-skeleton__line--wide" />
        <USkeleton class="product-skeleton__line product-skeleton__line--medium" />
      </div>

      <div class="product-skeleton__price">
        <div class="product-skeleton__price-copy">
          <USkeleton class="product-skeleton__line product-skeleton__line--price" />
          <USkeleton class="product-skeleton__line product-skeleton__line--small" />
        </div>
        <USkeleton class="product-skeleton__action" />
      </div>
    </div>
    
    <!-- Action Bar Mirroring Product.vue -->
    <div class="product-skeleton__footer">
      <USkeleton class="product-skeleton__footer-main" />
      <USkeleton class="product-skeleton__footer-action" />
    </div>
  </div>
</template>

<style scoped>
.product-skeleton { display: flex; height: 100%; flex-direction: column; gap: 1rem; padding: 1rem; border: 1px solid var(--color-border); }
.product-skeleton__image { position: relative; overflow: hidden; aspect-ratio: 1; border-radius: var(--radius-card); background: var(--color-bg-light); }
.product-skeleton__fill { width: 100%; height: 100%; }
.product-skeleton__badge { position: absolute; inset-block-start: .5rem; inset-inline-end: .5rem; }
.product-skeleton__badge-fill { width: 4rem; height: 1.5rem; border-radius: var(--radius-pill); opacity: .5; }
.product-skeleton__body { display: grid; flex: 1; gap: 1rem; }
.product-skeleton__copy, .product-skeleton__price-copy { display: grid; gap: .5rem; }
.product-skeleton__price { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding-top: .5rem; }
.product-skeleton__line { display: block; height: .75rem; border-radius: var(--radius-compact-list-item); }
.product-skeleton__line--wide { width: 75%; height: 1rem; }
.product-skeleton__line--medium { width: 50%; }
.product-skeleton__line--price { width: 6rem; height: 1.25rem; }
.product-skeleton__line--small { width: 4rem; opacity: .5; }
.product-skeleton__action, .product-skeleton__footer-action { width: 2.5rem; height: 2.5rem; border-radius: var(--radius-field); }
.product-skeleton__footer { display: flex; gap: .5rem; padding-top: 1rem; border-top: 1px solid var(--color-border); }
.product-skeleton__footer-main { flex: 1; height: 2.5rem; border-radius: var(--radius-field); }
</style>
