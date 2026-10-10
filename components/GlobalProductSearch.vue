<template>
  <div ref="searchRoot" :class="['global-product-search', variant]">
    <div class="search-control">
      <UInput
        :model-value="searchInput"
        type="search"
        :placeholder="variant === 'header' ? 'جستجوی کالا، برند یا دسته‌بندی…' : 'نام کالا، برند یا دسته‌بندی را جستجو کنید'"
        :aria-label="variant === 'header' ? 'جستجو در کل فروشگاه' : 'جستجوی کالا، برند یا دسته‌بندی'"
        :aria-controls="variant === 'header' ? suggestionsId : undefined"
        :aria-expanded="variant === 'header' && isFocused"
        :aria-activedescendant="activeSuggestionId"
        :aria-autocomplete="variant === 'header' ? 'list' : 'none'"
        :role="variant === 'header' ? 'combobox' : undefined"
        autocomplete="off"
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
const { variant = "default" } = defineProps<{ variant?: "default" | "header" }>();
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
  else if (event.key === "Enter") {
    event.preventDefault();
    if (activeSuggestionIndex.value >= 0) selectSuggestion(filteredSuggestions.value[activeSuggestionIndex.value]);
    else handleSearch();
  }
  else if (event.key === "Escape") { event.preventDefault(); isFocused.value = false; activeSuggestionIndex.value = -1; }
}
watch(() => [route.path, route.query.query] as const, ([, value]) => {
  searchInput.value = typeof value === "string" ? value : "";
  activeSuggestionIndex.value = -1;
});
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
.global-product-search.header { width:100%; max-width:none; }
.global-product-search.default { width:100%; max-width:42rem; }
.search-control { position:relative; width:100%; }
:deep(.search-input),:deep(.search-input input) { width:100%; }
:deep(.search-input input) { min-height:3.15rem; padding-block:.7rem; padding-inline-start:1rem; padding-inline-end:3.25rem; border:1.5px solid var(--color-border-strong); border-radius:var(--radius-control); background:var(--color-bg-surface); color:var(--color-text-heading); font-size:.85rem; transition:border-color .16s ease, box-shadow .16s ease, background-color .16s ease; }
:deep(.search-input input:hover) { border-color:var(--color-brand-blue); background:var(--color-bg-light); }
:deep(.search-input input:focus-visible) { border-color:var(--color-brand-blue); outline:none; box-shadow:var(--focus-ring); background:var(--color-bg-surface); }
:deep(.search-input > span:last-of-type) { inset-inline-end:.5rem; padding-inline:0; }
:deep(.search-submit) { width:2.75rem; min-width:2.75rem; min-height:2.75rem; padding:0; border-radius:var(--radius-compact-list-item); }
.global-product-search.header :deep(.search-input input) { min-height:2.65rem; padding-block:.5rem; border-width:1px; font-size:.78rem; }
.global-product-search.header :deep(.search-submit) { width:2.35rem; min-width:2.35rem; min-height:2.35rem; }
.suggestions { position:absolute; inset-block-start:calc(100% + .5rem); inset-inline:0; z-index:70; max-height:min(22rem,calc(100dvh - 8rem)); overflow-y:auto; padding:.9rem; border:1px solid var(--color-border); border-radius:var(--radius-card); background:var(--color-bg-surface); box-shadow:var(--shadow-overlay); }
.suggestions__heading { display:flex; align-items:center; gap:.4rem; margin-bottom:.7rem; color:var(--color-text-body); font-size:.72rem; font-weight: var(--font-weight-extrabold); }
.suggestions__heading :deep(svg) { width:1rem; color:var(--color-brand-blue); }
.suggestion-tags { display:flex; flex-wrap:wrap; gap:.5rem; }
.suggestion-tags button { min-height:2.75rem; padding-inline:.8rem; border:1px solid var(--color-info-border); border-radius:var(--radius-pill); background:var(--color-bg-light); color:var(--color-info-fg); font-size:.72rem; font-weight: var(--font-weight-bold); }
.suggestion-tags button:hover,.suggestion-tags button:focus-visible,.suggestion-tags button.suggestion--active { border-color:var(--color-brand-blue); background:var(--color-info-bg); outline:3px solid color-mix(in srgb, var(--color-brand-blue) 15%, transparent); }
.suggestions__empty { margin:0; color:var(--color-text-muted); font-size:.75rem; line-height:1.8; }
@media (max-width:767px) { :deep(.search-input input) { min-height:3rem; font-size:.8rem; } .global-product-search.header :deep(.search-input input) { min-height:2.8rem; font-size:.76rem; } .global-product-search.header :deep(.search-submit) { min-height:2.5rem; } .suggestions { inset-inline:.25rem; max-height:min(18rem,calc(100dvh - 13rem)); padding:.75rem; border-radius:var(--radius-card); } }
@media (prefers-reduced-motion:reduce) { .suggestion-tags button { transition:none; } }
</style>
