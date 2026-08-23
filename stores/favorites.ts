import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { addFavorite, listFavorites, removeFavorite, type Favorite } from '~/services/favoritesService';
import { toUserFacingError } from '~/services/apiClient';

export const useFavoritesStore = defineStore('favorites', () => {
  const items = ref<Favorite[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const initialized = ref(false);

  const productIds = computed(() => new Set(items.value.map(item => item.productId)));

  async function fetch(): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      items.value = await listFavorites();
      initialized.value = true;
    } catch (requestError) {
      error.value = toUserFacingError(requestError, 'دریافت علاقه‌مندی‌ها ممکن نیست.').message;
      throw requestError;
    } finally {
      loading.value = false;
    }
  }

  async function toggle(productId: string): Promise<boolean> {
    const existing = items.value.find(item => item.productId === productId);
    if (existing) {
      const previous = items.value;
      items.value = previous.filter(item => item.productId !== productId);
      try { await removeFavorite(productId); return false; }
      catch (requestError) { items.value = previous; throw requestError; }
    }
    const created = await addFavorite(productId);
    items.value = [...items.value, created];
    return true;
  }

  function clear(): void { items.value = []; initialized.value = false; error.value = null; }

  return { items, loading, error, initialized, productIds, fetch, toggle, clear };
});
