// src/composables/useCategories.ts
import { computed } from "vue";
import type { Category } from "~/services/categories";
import { fetchCategories } from "~/services/categories";

let inflight: Promise<Category[]> | null = null;

// Values kept in useState are serialized into the SSR payload. Never put an
// AxiosError (or another class instance containing request/socket references)
// in that state: devalue cannot serialize those objects.
export interface CategoriesError {
  message: string;
  status?: number;
  retryable: boolean;
}

function toCategoriesError(error: unknown): CategoriesError {
  const candidate = error as {
    message?: unknown;
    response?: { status?: unknown };
  };
  const status = typeof candidate?.response?.status === "number"
    ? candidate.response.status
    : undefined;

  return {
    message: typeof candidate?.message === "string"
      ? candidate.message
      : "ارتباط با سرور با مشکل مواجه شد.",
    ...(status === undefined ? {} : { status }),
    retryable: status === undefined || status >= 500 || status === 408 || status === 429,
  };
}

export function useCategories() {
  const categories = useState<Category[]>("catalog-categories", () => []);
  const loading = useState<boolean>("catalog-categories-loading", () => false);
  const loaded = useState<boolean>("catalog-categories-loaded", () => false);
  const error = useState<CategoriesError | null>("catalog-categories-error", () => null);

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
    error.value = null;
    inflight = fetchCategories()
      .then((data) => {
        categories.value = data;
        loaded.value = true;
        loading.value = false;
        inflight = null;
        return data;
      })
      .catch((err) => {
        error.value = toCategoriesError(err);
        loading.value = false;
        inflight = null;
        throw err;
      });

    return inflight;
  }

  return { categories, loading: computed(() => loading.value), error, load };
}
