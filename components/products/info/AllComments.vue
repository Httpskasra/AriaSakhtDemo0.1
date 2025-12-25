<template>
  <div class="container">
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
  </div>
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
.container {
  width: 100%;
  margin-top: 40px;
}

.loading {
  text-align: center;
  padding: 40px 20px;
  color: #666;
  font-size: 14px;
}

.error-message {
  padding: 15px;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 20px;
}

.no-comments {
  text-align: center;
  padding: 30px 20px;
  color: #999;
  font-size: 14px;
  background-color: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #eee;
}

.comment {
  margin: 12px 0;
}

@media (min-width: 768px) and (max-width: 1024px) {
  .container {
    margin-top: 30px;
  }

  .comment {
    margin: 10px 0;
  }
}

@media (max-width: 767px) {
  .container {
    margin-top: 30px;
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
