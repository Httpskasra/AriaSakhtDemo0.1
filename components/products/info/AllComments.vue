<template>
  <section class="product-comments-list" aria-labelledby="product-comments-title">
    <h3 id="product-comments-title" class="sr-only">نظرات کاربران</h3>
    <div v-if="loading" class="loading" role="status" aria-live="polite">
      <UIcon name="i-lucide-loader-circle" class="animate-spin" aria-hidden="true" />
      <span>در حال بارگذاری نظرات محصول…</span>
    </div>
    <div v-else-if="errorMsg" class="error-message" role="alert">
      <p>{{ errorMsg }}</p>
      <UButton type="button" color="primary" variant="soft" size="sm" @click="fetchRatings">تلاش دوباره</UButton>
    </div>
    <div v-else-if="ratings.length === 0" class="no-comments">
      <p>هنوز نظری برای این محصول ثبت نشده است.</p>
    </div>
    <template v-else>
      <Comments v-for="(rating, index) in ratings" :key="rating._id || rating.id || `${rating.productId}-${index}`" class="comment" :data="rating" />
      <nav v-if="totalPages > 1" class="comments-pagination" aria-label="صفحه‌های نظرات">
        <UButton type="button" color="neutral" variant="soft" size="sm" :disabled="page <= 1 || loading" @click="goToPage(page - 1)">قبلی</UButton>
        <span aria-live="polite">صفحه {{ page.toLocaleString('fa-IR') }} از {{ totalPages.toLocaleString('fa-IR') }}</span>
        <UButton type="button" color="neutral" variant="soft" size="sm" :disabled="page >= totalPages || loading" @click="goToPage(page + 1)">بعدی</UButton>
      </nav>
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { getRatingsByProduct, type Rating } from "~/services/ratingService";
import { toUserFacingError } from "~/services/apiClient";
import Comments from "./Comments.vue";

const props = defineProps<{ productId: string }>();
const ratings = ref<Rating[]>([]);
const loading = ref(false);
const errorMsg = ref("");
const page = ref(1);
const limit = 5;
const total = ref(0);
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / limit)));

const fetchRatings = async () => {
  loading.value = true;
  errorMsg.value = "";
  try {
    const result = await getRatingsByProduct(props.productId, { page: page.value, limit });
    ratings.value = result.items;
    total.value = result.total;
  } catch (requestError) {
    ratings.value = [];
    total.value = 0;
    errorMsg.value = toUserFacingError(requestError, "دریافت نظرات فعلاً ممکن نیست.").message;
  } finally {
    loading.value = false;
  }
};

async function goToPage(nextPage: number) {
  if (nextPage < 1 || nextPage > totalPages.value || nextPage === page.value) return;
  page.value = nextPage;
  await fetchRatings();
}

defineExpose({ refresh: fetchRatings });
onMounted(fetchRatings);
</script>

<style scoped>
.product-comments-list { width: 100%; margin-top: 1.25rem; }
.loading, .no-comments { display: flex; align-items: center; justify-content: center; gap: .5rem; min-height: 8rem; padding: 1.5rem; color: var(--color-text-muted); text-align: center; }
.error-message { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 1rem; border: 1px solid color-mix(in srgb, var(--color-danger-fg) 25%, var(--color-bg-surface)); border-radius: var(--radius-field); color: var(--color-danger-fg); background: var(--color-danger-bg); }
.error-message p { margin: 0; line-height: 1.8; }
.no-comments { border: 1px solid var(--color-border); border-radius: var(--radius-field); background: var(--color-bg-light); }
.no-comments p { margin: 0; }
.comment { margin: .75rem 0; }
.comments-pagination { display: flex; align-items: center; justify-content: center; gap: .75rem; margin-top: 1rem; color: var(--color-text-muted); font-size: .8rem; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
@media (max-width: 640px) { .error-message { align-items: stretch; flex-direction: column; } .comments-pagination { flex-wrap: wrap; } }
</style>
