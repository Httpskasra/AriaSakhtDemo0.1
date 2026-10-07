<template>
  <article class="product-comment-card">
    <header class="product-comment-card__header">
      <div class="product-comment-card__author">
        <span class="product-comment-card__avatar" aria-hidden="true"><UIcon name="i-lucide-user" /></span>
        <span>بازخورد خریدار</span>
      </div>
      <div class="product-comment-card__rating">
        <span class="product-comment-card__stars" :aria-label="`امتیاز ${ratingValue} از ۵`">
          <UIcon v-for="star in 5" :key="star" name="i-lucide-star" :class="{ 'product-comment-card__star--active': star <= ratingValue }" aria-hidden="true" />
        </span>
        <span v-if="dateLabel" class="product-comment-card__date font-num">{{ dateLabel }}</span>
      </div>
    </header>
    <p class="product-comment-card__text">{{ props.data.comment }}</p>
  </article>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Rating } from "@/services/ratingService";

const props = defineProps<{
  data: Rating | { sender: string; comment: string };
}>();

const ratingValue = computed(() => "rating" in props.data ? Math.max(0, Math.min(5, Number(props.data.rating || 0))) : 0);
const dateLabel = computed(() => {
  const value = "createdAt" in props.data ? props.data.createdAt : "";
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString("fa-IR");
});
</script>

<style scoped>
.product-comment-card {
  width: 100%;
  padding-block: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.product-comment-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.product-comment-card__author, .product-comment-card__rating {
  display: flex;
  align-items: center;
  gap: .65rem;
  color: var(--color-text-muted);
  font-size: .75rem;
  font-weight: 700;
}

.product-comment-card__avatar {
  display: inline-grid;
  width: 2rem;
  height: 2rem;
  place-items: center;
  border-radius: var(--radius-pill);
  color: var(--color-brand-blue);
  background: var(--color-info-bg);
}

.product-comment-card__stars { display: inline-flex; gap: .1rem; color: var(--color-border-strong); }
.product-comment-card__stars svg { width: .95rem; height: .95rem; }
.product-comment-card__star--active { color: var(--color-brand-yellow); fill: currentColor; }
.product-comment-card__date { color: var(--color-text-muted); font-size: .68rem; font-weight: 500; }
.product-comment-card__text {
  max-width: 75ch;
  margin: .75rem 0 0;
  color: var(--color-text-body);
  font-size: .84rem;
  line-height: 2;
  overflow-wrap: anywhere;
}

@media (max-width: 767px) {
  .product-comment-card__header { align-items: flex-start; flex-direction: column; gap: .6rem; }
  .product-comment-card__text { font-size: .8rem; }
}
</style>
