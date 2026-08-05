// src/composables/useCategories.ts
import { computed } from "vue";
import type { Category } from "~/services/categories";
import { fetchCategories } from "~/services/categories";

let inflight: Promise<Category[]> | null = null;

export function useCategories() {
  const categories = useState<Category[]>("catalog-categories", () => []);
  const loading = useState<boolean>("catalog-categories-loading", () => false);
  const loaded = useState<boolean>("catalog-categories-loaded", () => false);
  const error = useState<Error | null>("catalog-categories-error", () => null);

  async function load() {
    if (loaded.value) {
      loading.value = false;
      return categories.value;
    }
    if (inflight) {
      const data = await inflight;
      categories.value = data;
      return data;
    }

    loading.value = true;
    inflight = fetchCategories()
      .then((data) => {
        categories.value = data;
        loaded.value = true;
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

  return { categories, loading: computed(() => loading.value), error, load };
}
