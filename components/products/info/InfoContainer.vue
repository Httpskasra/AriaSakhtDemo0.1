<template>
  <section class="product-info-tabs" :class="{ 'product-info-tabs--embedded': embedded }" aria-label="اطلاعات تکمیلی محصول">
    <div class="product-info-tabs__header">
      <ul role="tablist" aria-label="اطلاعات محصول">
        <li v-for="tab in tabs" :key="tab.id">
          <button
            :id="`product-tab-${tab.id}`"
            type="button"
            role="tab"
            :aria-selected="show === tab.id"
            aria-controls="product-info-tabpanel"
            :tabindex="show === tab.id ? 0 : -1"
            :class="{ active: show === tab.id }"
            @click="selectTab(tab.id)"
            @keydown="onTabKeydown($event, tab.id)">
            {{ tab.label }}
          </button>
        </li>
      </ul>
    </div>
    <div id="product-info-tabpanel" class="product-info-tabs__content" role="tabpanel" :aria-labelledby="`product-tab-${show}`" tabindex="0">
      <InfoProduct class="info-content" v-if="show === 'info'" :data="data" />
      <RulsProduct v-else-if="show === 'rules'" :data="data" />
      <CommentProduct v-else-if="show === 'comments'" :product-id="String(data.id || data._id || '')" />
    </div>
  </section>
</template>
<script setup lang="ts">
import { ref } from "vue";
import type { Product } from "~/types/product";

type Content = "info" | "rules" | "comments";
const show = ref<Content>("info");
const tabs: Array<{ id: Content; label: string }> = [
  { id: "info", label: "مشخصات فنی" },
  { id: "rules", label: "قوانین و مقررات" },
  { id: "comments", label: "نظرات کاربران" },
];

withDefaults(defineProps<{
  data: Product;
  embedded?: boolean;
}>(), {
  embedded: false,
});
const tabOrder: Content[] = tabs.map((tab) => tab.id);
function selectTab(tab: Content) { show.value = tab; }
function onTabKeydown(event: KeyboardEvent, tab: Content) {
  if (event.key === "Enter" || event.key === " ") { event.preventDefault(); selectTab(tab); return; }
  if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
  event.preventDefault();
  const currentIndex = tabOrder.indexOf(tab);
  const nextIndex = event.key === "Home"
    ? 0
    : event.key === "End"
      ? tabOrder.length - 1
      : (currentIndex + (event.key === "ArrowLeft" ? 1 : -1) + tabOrder.length) % tabOrder.length;
  const next = tabOrder[nextIndex];
  selectTab(next);
  requestAnimationFrame(() => document.getElementById(`product-tab-${next}`)?.focus());
}
</script>
<style scoped>
.product-info-tabs {
  display: grid;
  width: 100%;
  margin-inline: auto;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
}

.product-info-tabs--embedded {
  background: transparent;
  border-color: transparent;
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-none);
}

.product-info-tabs__header {
  width: 100%;
  padding: .15rem 0 0;
  border-bottom: 1px solid var(--color-border);
}

ul {
  display: flex;
  align-items: center;
  gap: .35rem;
  margin: 0;
  padding: 0;
  color: var(--color-text-muted);
  font-family: var(--font-body);
  list-style: none;
}

li { display: flex; }

li button {
  min-height: 2.75rem;
  padding: .65rem .75rem;
  border-bottom: 2px solid transparent;
  color: inherit;
  background: transparent;
  font: inherit;
  cursor: pointer;
  font-size: .85rem;
  font-weight: 700;
  white-space: nowrap;
}

li button:hover { color: var(--color-brand-blue); }
li button.active { color: var(--color-brand-blue); border-bottom-color: var(--color-brand-blue); }
li button:focus-visible { outline: 2px solid var(--color-brand-blue); outline-offset: 3px; }

.product-info-tabs__content {
  padding: 1.1rem 0 0;
}

.product-info-tabs--embedded .product-info-tabs__content {
  padding-inline: 0;
  padding-bottom: 0;
}

@media (max-width: 767px) {
  ul { overflow-x: auto; }
  li { flex: 0 0 auto; }
  li button { font-size: .75rem; }
  .product-info-tabs__content { padding-top: .9rem; }
  .product-info-tabs--embedded .product-info-tabs__content { padding-inline: 0; }
}
</style>
