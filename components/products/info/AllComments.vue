<template>
  <section class="product-comments-list">
    <div v-if="loading" class="loading">
      <p>درحال بارگیری نقدهای محصول...</p>
    </div>
    <div v-else-if="errorMsg" class="error-message">
      {{ errorMsg }}
    </div>
    <div v-else-if="ratings.length === 0" class="no-comments">
      <p>هیچ نقدی برای این محصول ثبت نشده است</p>
    </div>
    <Comments
      class="comment"
      v-for="rating in ratings"
      :key="rating._id || rating.id"
      :data="rating" />
  </section>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { Product } from "~/types/product";
import { getRatingsByProduct } from "@/services/ratingService";
import Comments from "./Comments.vue";

const props = defineProps<{
  data: Product;
}>();

const ratings = ref<any[]>([]);
const loading = ref(false);
const errorMsg = ref("");

const fetchRatings = async () => {
  loading.value = true;
  errorMsg.value = "";

  try {
    const productId = props.data.id || props.data._id || "";
    const result = await getRatingsByProduct(productId);
    ratings.value = result;
  } catch (err: any) {
    console.error("خطا در دریافت نقدهای محصول:", err);
    errorMsg.value = "خطا در بارگیری نقدها";
    ratings.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchRatings();
});
</script>
<style scoped>
.product-comments-list {
  width: 100%;
  margin-top: 40px;
}

.loading {
  text-align: center;
  padding: 2.5rem 1.25rem;
  color: var(--color-text-muted);
  font-size: .85rem;
}

.error-message {
  padding: 1rem;
  background-color: var(--color-danger-bg);
  color: var(--color-danger-fg);
  border: 1px solid color-mix(in srgb, var(--color-danger-fg) 25%, var(--color-bg-surface));
  border-radius: var(--radius-field);
  text-align: center;
  margin-bottom: 1.25rem;
}

.no-comments {
  text-align: center;
  padding: 2rem 1.25rem;
  color: var(--color-text-muted);
  font-size: .85rem;
  background-color: var(--color-bg-light);
  border-radius: var(--radius-field);
  border: 1px solid var(--color-border);
}

.comment {
  margin: 12px 0;
}

@media (min-width: 768px) and (max-width: 1024px) {
  .product-comments-list {
    margin-top: 1.5rem;
  }

  .comment {
    margin: 10px 0;
  }
}

@media (max-width: 767px) {
  .product-comments-list {
    margin-top: 1.5rem;
  }

  .comment {
    margin: 12px 0;
  }

  .loading,
  .error-message,
  .no-comments {
    font-size: 12px;
    padding: 20px 12px;
  }
}
</style>
