<template>
  <div ref="searchRoot" :class="['global-product-search', variant]">
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

    <div v-if="variant === 'header' && isFocused" class="suggestions" role="listbox" aria-label="پیشنهادهای جستجو">
      <div class="suggestions__heading">
        <UIcon name="i-lucide-sparkles" aria-hidden="true" />
        <span>{{ searchInput.trim() ? "پیشنهادهای مرتبط" : "جستجوهای محبوب" }}</span>
      </div>
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
const searchRoot = ref<HTMLElement | null>(null);
const searchInput = ref((route.query.query as string) || "");
const isFocused = ref(false);
const suggestions = ["سیمان", "میلگرد", "آجر", "کاشی"];

const hideSuggestions = () => {
  window.setTimeout(() => { isFocused.value = false; }, 120);
};

const handleOutsidePointer = (event: PointerEvent) => {
  if (!searchRoot.value?.contains(event.target as Node)) isFocused.value = false;
};

const updateSearch = (value: string | number | null | undefined) => {
  searchInput.value = String(value ?? "");
  isFocused.value = true;
};

watch(() => route.query.query, (value) => {
  if (!isFocused.value) searchInput.value = typeof value === "string" ? value : "";
});

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

onMounted(() => document.addEventListener("pointerdown", handleOutsidePointer));
onBeforeUnmount(() => document.removeEventListener("pointerdown", handleOutsidePointer));
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
  inset-block-start: calc(100% + .5rem);
  inset-inline: 0;
  z-index: 70;
  box-sizing: border-box;
  max-height: min(22rem, calc(100dvh - 8rem));
  overflow-y: auto;
  padding: .9rem;
  border: 1px solid #dbe5f0;
  border-radius: 1rem;
  background: #fff;
  box-shadow: 0 1rem 2.5rem rgb(15 23 42 / 14%), 0 .25rem .75rem rgb(15 23 42 / 6%);
}

.suggestions__heading {
  display: flex;
  align-items: center;
  gap: .4rem;
  margin-bottom: .7rem;
  color: #475569;
  font-size: .72rem;
  font-weight: 800;
}

.suggestions__heading :deep(svg) { width: 1rem; color: #2563eb; }

.suggestion-tags {
  display: flex;
  flex-wrap: wrap;
  gap: .5rem;
}

.suggestion-tags :deep(button) {
  min-height: 2.25rem;
  padding-inline: .8rem;
  border: 1px solid #dbeafe;
  border-radius: 999px;
  background: #f8fbff;
  color: #1d4ed8;
  font-size: .72rem;
  font-weight: 700;
  transition: background-color .15s ease, border-color .15s ease, transform .15s ease;
}

.suggestion-tags :deep(button:hover),
.suggestion-tags :deep(button:focus-visible) {
  border-color: #93c5fd;
  background: #eff6ff;
  transform: translateY(-1px);
}

@media (max-width: 1024px) {
  .suggestions {
    inset-inline: .25rem;
    width: auto;
    max-height: min(18rem, calc(100dvh - 13rem));
    padding: .75rem;
    border-radius: .9rem;
  }
}

</style>
