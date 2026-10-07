<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useFavoritesStore } from '~/stores/favorites';
import { useUser } from '~/composables/useUser';

const props = defineProps<{ productId: string }>();
const store = useFavoritesStore();
const { isAuthenticated, isUserLoading } = useUser();
const busy = ref(false);
const isFavorite = computed(() => store.productIds.has(props.productId));

watch([isAuthenticated, isUserLoading], ([authenticated, loading]) => {
  if (loading) return;
  if (!authenticated) { store.clear(); return; }
  if (!store.initialized && !store.loading) void store.fetch().catch(() => undefined);
}, { immediate: true });

async function toggle() {
  if (busy.value || !props.productId) return;
  busy.value = true;
  try { await store.toggle(props.productId); }
  catch { useToast().add({ title: 'تغییر علاقه‌مندی انجام نشد', description: 'لطفاً دوباره تلاش کنید.', color: 'error' }); }
  finally { busy.value = false; }
}
</script>

<template>
  <UButton type="button" size="sm" color="neutral" variant="soft" :loading="busy" :disabled="busy" :aria-label="isFavorite ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'" :aria-pressed="isFavorite" @click.stop.prevent="toggle">
    <UIcon :name="isFavorite ? 'i-lucide-heart-off' : 'i-lucide-heart'" :class="isFavorite ? 'text-red-600' : 'text-gray-600'" />
  </UButton>
</template>
