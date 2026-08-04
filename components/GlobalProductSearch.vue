<template>
  <div :class="['global-product-search', variant]">
    <div class="search-control">
      <UInput
        :model-value="searchInput"
        type="search"
        :placeholder="variant === 'header' ? 'جستجو در کل فروشگاه' : 'جستجو...'"
        :aria-label="variant === 'header' ? 'جستجو در کل فروشگاه' : 'جستجو'"
        class="search-input"
        @focus="isFocused = true"
        @blur="hideSuggestions"
        @update:model-value="updateSearch"
        @keyup.enter="handleSearch">
        <template #trailing>
          <UButton
            icon="i-lucide-search"
            size="sm"
            color="primary"
            variant="ghost"
            square
            class="search-submit"
            aria-label="جستجو"
            @click="handleSearch" />
        </template>
      </UInput>
    </div>

    <div v-if="variant === 'header' && isFocused" class="suggestions">
      <p>پیشنهادهای جستجو</p>
      <div class="suggestion-tags">
        <ActionButton
          v-for="suggestion in suggestions"
          :key="suggestion"
          tone="ghost"
          size="xs"
          @mousedown.prevent="selectSuggestion(suggestion)">
          {{ suggestion }}
        </ActionButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    variant?: "default" | "header";
  }>(),
  {
    variant: "default",
  }
);

const router = useRouter();
const route = useRoute();
const searchInput = ref("");
const isFocused = ref(false);
const suggestions = ["سیمان", "میلگرد", "آجر", "کاشی"];

const hideSuggestions = () => {
  window.setTimeout(() => {
    isFocused.value = false;
  }, 200);
};

const updateSearch = (value: string | number | null | undefined) => {
  searchInput.value = String(value ?? "");
  isFocused.value = true;
};

const handleSearch = async () => {
  const searchQuery = searchInput.value.trim();
  if (!searchQuery) return;

  if (route.path.startsWith("/products")) {
    await router.replace({
      path: "/products",
      query: { ...route.query, query: searchQuery, page: 1 },
    });
  } else {
    await router.push({
      path: "/products",
      query: { query: searchQuery, page: 1, limit: 12 },
    });
    searchInput.value = "";
  }

  isFocused.value = false;
};

const selectSuggestion = async (suggestion: string) => {
  searchInput.value = suggestion;
  await handleSearch();
};
</script>

<style scoped>
.global-product-search {
  position: relative;
  width: 100%;
}

.global-product-search.header {
  width: 100%;
  max-width: 40rem;
}

.search-control {
  position: relative;
  width: 100%;
}

:deep(.search-input) {
  width: 100%;
}

:deep(.search-input input) {
  min-height: 2.75rem;
  padding-block: 0.625rem;
  padding-inline-start: 0.875rem;
  padding-inline-end: 3rem;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-field);
  background: #fff;
}

:deep(.search-input input:focus-visible) {
  border-color: var(--color-brand-blue);
  outline: none;
  box-shadow: 0 0 0 3px rgb(22 115 255 / 15%);
}

:deep(.search-input > span:last-of-type) {
  inset-inline-end: 0.5rem;
  padding-inline: 0;
}

:deep(.search-submit) {
  min-height: 2rem;
  width: 2rem;
  padding: 0;
}

:deep(.search-submit svg) {
  width: 1rem;
  height: 1rem;
}

.suggestions {
  position: absolute;
  inset-block-start: calc(100% + 8px);
  inset-inline: 0;
  z-index: 20;
  padding: 12px;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-card);
  background: var(--color-surface);
  box-shadow: var(--shadow-overlay);
}

.suggestions p {
  margin: 0 0 8px;
  color: var(--color-text-muted);
  font-size: 12px;
}

.suggestion-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

</style>
