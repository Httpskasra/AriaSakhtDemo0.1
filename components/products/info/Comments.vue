<template>
  <div>
    <article class="product-comment-card">
      <div class="product-comment-card__header">
        <div class="user">
          <UIcon name="i-lucide-user" class="size-icon-action text-muted" />
          <div class="user-info">
            <span class="rating-stars">{{
              "⭐".repeat(('rating' in props.data ? props.data.rating : 0) || 0)
            }}</span>
          </div>
        </div>
      </div>
      <div class="comment">
        <p>
          {{ props.data.comment }}
        </p>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import type { Rating } from "@/services/ratingService";

const props = defineProps<{
  data: Rating | { sender: string; comment: string };
}>();

</script>

<style scoped>
.product-comment-card {
  width: 100%;
  margin: auto;
  padding: 1.25rem;
  background-color: var(--color-bg-surface);
  border-radius: var(--radius-field);
  border: 1px solid var(--color-border);
  margin-top: 16px;
  transition: border-color .16s ease, box-shadow .16s ease;
}

.product-comment-card:hover {
  border-color: var(--color-info-border);
  box-shadow: var(--shadow-raised);
}

.product-comment-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: .75rem;
}

.user {
  display: flex;
  align-items: center;
  gap: .65rem;
}

.user svg {
  width: 24px;
  height: 24px;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.rating-stars {
  font-size: 12px;
  letter-spacing: 2px;
}

.comment {
  margin: .75rem 0;
}

.comment p {
  line-height: var(--line-height-body);
  color: var(--color-text-body);
  font-size: 14px;
  word-break: break-word;
}

@media (min-width: 768px) and (max-width: 1024px) {
  .product-comment-card {
    padding: 1rem;
  }

  .comment p {
    font-size: 13px;
  }
}

@media (max-width: 767px) {
  .product-comment-card {
    padding: .75rem;
    margin-top: .75rem;
  }

  .product-comment-card__header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .user svg {
    width: 18px;
    height: 18px;
  }

  .rating-stars {
    font-size: 10px;
  }

  .comment p {
    font-size: 12px;
    line-height: 20px;
  }
}
</style>
