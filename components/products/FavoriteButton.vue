<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useFavoritesStore } from '~/stores/favorites';

const props = defineProps<{ productId: string }>();
const store = useFavoritesStore();
const busy = ref(false);
const isFavorite = computed(() => store.productIds.has(props.productId));

onMounted(() => {
  if (!store.initialized && !store.loading) void store.fetch().catch(() => undefined);
});

async function toggle() {
  if (busy.value || !props.productId) return;
  busy.value = true;
  try { await store.toggle(props.productId); }
  catch { useToast().add({ title: 'تغییر علاقه‌مندی انجام نشد', description: 'لطفاً دوباره تلاش کنید.', color: 'red' }); }
  finally { busy.value = false; }
}
</script>

<template>
  <UButton type="button" size="sm" color="white" variant="solid" :loading="busy" :disabled="busy" :aria-label="isFavorite ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'" :aria-pressed="isFavorite" @click.stop.prevent="toggle">
    <UIcon :name="isFavorite ? 'i-lucide-heart-off' : 'i-lucide-heart'" :class="isFavorite ? 'text-red-600' : 'text-gray-600'" />
  </UButton>
</template>
