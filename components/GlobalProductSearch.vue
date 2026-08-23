<template>
  <div ref="searchRoot" :class="['global-product-search', variant]">
    <div class="search-control">
      <UInput
        :model-value="searchInput"
        type="search"
        :placeholder="variant === 'header' ? 'جستجو در کل فروشگاه' : 'جستجو...'"
        :aria-label="variant === 'header' ? 'جستجو در کل فروشگاه' : 'جستجو'"
        :aria-controls="suggestionsId"
        :aria-expanded="variant === 'header' && isFocused"
        :aria-activedescendant="activeSuggestionId"
        class="search-input"
        @focus="openSuggestions"
        @blur="hideSuggestions"
        @update:model-value="updateSearch"
        @keydown="handleKeydown">
        <template #trailing><UButton icon="i-lucide-search" size="sm" color="primary" variant="ghost" square class="search-submit" aria-label="جستجو" @mousedown.prevent @click="handleSearch" /></template>
      </UInput>
    </div>
    <div v-if="variant === 'header' && isFocused" :id="suggestionsId" class="suggestions" role="listbox" aria-label="پیشنهادهای جستجو">
      <div class="suggestions__heading"><UIcon name="i-lucide-sparkles" aria-hidden="true" /><span>{{ searchInput.trim() ? "پیشنهادهای مرتبط" : "جستجوهای محبوب" }}</span></div>
      <div v-if="filteredSuggestions.length" class="suggestion-tags">
        <button v-for="(suggestion, index) in filteredSuggestions" :id="`${suggestionsId}-${index}`" :key="suggestion" type="button" role="option" :aria-selected="activeSuggestionIndex === index" :class="{ 'suggestion--active': activeSuggestionIndex === index }" @mousedown.prevent="selectSuggestion(suggestion)">{{ suggestion }}</button>
      </div>
      <p v-else class="suggestions__empty">پیشنهاد مستقیمی پیدا نشد؛ با زدن Enter همین عبارت را جستجو کنید.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ variant?: "default" | "header" }>(), { variant: "default" });
const router = useRouter();
const route = useRoute();
const searchRoot = ref<HTMLElement | null>(null);
const searchInput = ref((route.query.query as string) || "");
const isFocused = ref(false);
const activeSuggestionIndex = ref(-1);
const suggestions = ["سیمان", "میلگرد", "آجر", "کاشی", "سنگ ساختمانی", "لوله و اتصالات"];
const suggestionsId = `product-search-suggestions-${Math.random().toString(36).slice(2, 8)}`;
const filteredSuggestions = computed(() => {
  const query = searchInput.value.trim().toLocaleLowerCase();
  return query ? suggestions.filter(item => item.toLocaleLowerCase().includes(query)) : suggestions;
});
const activeSuggestionId = computed(() => activeSuggestionIndex.value >= 0 ? `${suggestionsId}-${activeSuggestionIndex.value}` : undefined);

function openSuggestions() { isFocused.value = true; }
function hideSuggestions() { window.setTimeout(() => { isFocused.value = false; activeSuggestionIndex.value = -1; }, 140); }
function updateSearch(value: string | number | null | undefined) { searchInput.value = String(value ?? ""); isFocused.value = true; activeSuggestionIndex.value = -1; }
function handleOutsidePointer(event: PointerEvent) { if (!searchRoot.value?.contains(event.target as Node)) { isFocused.value = false; activeSuggestionIndex.value = -1; } }
function handleKeydown(event: KeyboardEvent) {
  if (event.key === "ArrowDown" && filteredSuggestions.value.length) { event.preventDefault(); activeSuggestionIndex.value = (activeSuggestionIndex.value + 1) % filteredSuggestions.value.length; }
  else if (event.key === "ArrowUp" && filteredSuggestions.value.length) { event.preventDefault(); activeSuggestionIndex.value = activeSuggestionIndex.value <= 0 ? filteredSuggestions.value.length - 1 : activeSuggestionIndex.value - 1; }
  else if (event.key === "Enter") { event.preventDefault(); activeSuggestionIndex.value >= 0 ? selectSuggestion(filteredSuggestions.value[activeSuggestionIndex.value]) : handleSearch(); }
  else if (event.key === "Escape") { event.preventDefault(); isFocused.value = false; activeSuggestionIndex.value = -1; }
}
watch(() => route.query.query, value => { if (!isFocused.value) searchInput.value = typeof value === "string" ? value : ""; });
async function handleSearch() {
  const searchQuery = searchInput.value.trim();
  if (!searchQuery) return;
  const query = { ...(route.path.startsWith("/products") ? route.query : {}), query: searchQuery, page: 1, limit: 12 };
  await router[route.path.startsWith("/products") ? "replace" : "push"]({ path: "/products", query });
  isFocused.value = false; activeSuggestionIndex.value = -1;
  if (!route.path.startsWith("/products")) searchInput.value = "";
}
async function selectSuggestion(suggestion: string) { searchInput.value = suggestion; await handleSearch(); }
onMounted(() => document.addEventListener("pointerdown", handleOutsidePointer));
onBeforeUnmount(() => document.removeEventListener("pointerdown", handleOutsidePointer));
</script>

<style scoped>
.global-product-search { position:relative; width:100%; }
.global-product-search.header { width:100%; max-width:40rem; }
.search-control { position:relative; width:100%; }
:deep(.search-input),:deep(.search-input input) { width:100%; }
:deep(.search-input input) { min-height:2.75rem; padding-block:.625rem; padding-inline-start:.875rem; padding-inline-end:3rem; border:1px solid var(--gray-200); border-radius:var(--radius-field); background:#fff; }
:deep(.search-input input:focus-visible) { border-color:var(--color-brand-blue); outline:none; box-shadow:0 0 0 3px rgb(22 115 255 / 15%); }
:deep(.search-input > span:last-of-type) { inset-inline-end:.5rem; padding-inline:0; }
:deep(.search-submit) { width:2.75rem; min-width:2.75rem; min-height:2.75rem; padding:0; }
.suggestions { position:absolute; inset-block-start:calc(100% + .5rem); inset-inline:0; z-index:70; max-height:min(22rem,calc(100dvh - 8rem)); overflow-y:auto; padding:.9rem; border:1px solid #dbe5f0; border-radius:1rem; background:#fff; box-shadow:0 1rem 2.5rem rgb(15 23 42 / 14%),0 .25rem .75rem rgb(15 23 42 / 6%); }
.suggestions__heading { display:flex; align-items:center; gap:.4rem; margin-bottom:.7rem; color:#475569; font-size:.72rem; font-weight:800; }
.suggestions__heading :deep(svg) { width:1rem; color:#2563eb; }
.suggestion-tags { display:flex; flex-wrap:wrap; gap:.5rem; }
.suggestion-tags button { min-height:2.75rem; padding-inline:.8rem; border:1px solid #dbeafe; border-radius:999px; background:#f8fbff; color:#1d4ed8; font-size:.72rem; font-weight:700; }
.suggestion-tags button:hover,.suggestion-tags button:focus-visible,.suggestion-tags button.suggestion--active { border-color:#93c5fd; background:#eff6ff; outline:3px solid rgb(37 99 235 / 15%); }
.suggestions__empty { margin:0; color:#64748b; font-size:.75rem; line-height:1.8; }
@media (max-width:1024px) { .suggestions { inset-inline:.25rem; max-height:min(18rem,calc(100dvh - 13rem)); padding:.75rem; border-radius:.9rem; } }
@media (prefers-reduced-motion:reduce) { .suggestion-tags button { transition:none; } }
</style>
