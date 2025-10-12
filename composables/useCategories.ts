// src/composables/useCategories.ts
import { ref } from "vue";
import type { Category } from "~/services/categories";
import { fetchCategories } from "~/services/categories";

let cache: Category[] | null = null;
let inflight: Promise<Category[]> | null = null;

export function useCategories() {
  const categories = ref<Category[]>(cache ?? []);
  const loading = ref<boolean>(!cache);
  const error = ref<Error | null>(null);

  async function load() {
    if (cache) {
      categories.value = cache;
      loading.value = false;
      return cache;
    }
    if (inflight) {
      const data = await inflight;
      categories.value = data;
      return data;
    }

    loading.value = true;
    inflight = fetchCategories()
      .then((data) => {
        cache = data;
        categories.value = data;
        loading.value = false;
        inflight = null;
        return data;
      })
      .catch((err) => {
        error.value = err;
        loading.value = false;
        inflight = null;
        throw err;
      });

    return inflight;
  }

  return { categories, loading, error, load };
}
