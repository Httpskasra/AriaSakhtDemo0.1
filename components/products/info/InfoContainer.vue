<template>
  <div class="product-info-tabs">
    <div class="product-info-tabs__header">
      <ul role="tablist" aria-label="اطلاعات محصول">
        <li id="info-tab" role="tab" :aria-selected="show === 'info'" :tabindex="show === 'info' ? 0 : -1" @click="selectTab('info')" @keydown="onTabKeydown($event, 'info')" :class="{ active: show == 'info' }">
          مشخصات
        </li>
        <li id="rules-tab" role="tab" :aria-selected="show === 'rules'" :tabindex="show === 'rules' ? 0 : -1" @click="selectTab('rules')" @keydown="onTabKeydown($event, 'rules')" :class="{ active: show == 'rules' }">
          قوانین و مقررات
        </li>
        <li id="comments-tab" role="tab" :aria-selected="show === 'comments'" :tabindex="show === 'comments' ? 0 : -1" @click="selectTab('comments')" @keydown="onTabKeydown($event, 'comments')" :class="{ active: show == 'comments' }">
          نظرات کاربران
        </li>
      </ul>
    </div>
    <div class="product-info-tabs__content" role="tabpanel" :aria-labelledby="`${show}-tab`" tabindex="0">
      <InfoProduct class="info-content" v-if="show === 'info'" :data="data" />
      <RulsProduct v-else-if="show === 'rules'" :data="data" />
      <CommentProduct v-else-if="show === 'comments'" :data="data" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import type { Product } from "~/types/product";

type content = "info" | "rules" | "comments";
const show = ref<content>("info");

const props = defineProps<{
  data: Product;
}>();
const tabOrder: content[] = ["info", "rules", "comments"];
function selectTab(tab: content) { show.value = tab; }
function onTabKeydown(event: KeyboardEvent, tab: content) {
  if (event.key === "Enter" || event.key === " ") { event.preventDefault(); selectTab(tab); return; }
  if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
  event.preventDefault();
  const direction = event.key === "ArrowLeft" ? 1 : -1;
  const next = tabOrder[(tabOrder.indexOf(tab) + direction + tabOrder.length) % tabOrder.length];
  selectTab(next);
  requestAnimationFrame(() => document.getElementById(`${next}-tab`)?.focus());
}
</script>
<style scoped>
.product-info-tabs {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  width: min(100%, 90rem);
  min-height: 32rem;
  margin-inline: auto;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
}

.product-info-tabs__header {
  width: 100%;
  padding: .75rem 1rem 0;
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

li {
  min-height: 2.75rem;
  padding: .65rem .85rem;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-size: .85rem;
  font-weight: 700;
  white-space: nowrap;
}

li:hover { color: var(--color-brand-blue); }
li.active { color: var(--color-brand-blue); border-bottom-color: var(--color-brand-blue); }
li:focus-visible { outline: 2px solid var(--color-brand-blue); outline-offset: 3px; }

.product-info-tabs__content {
  min-height: 0;
  overflow-y: auto;
  padding: 1rem;
}

@media (max-width: 767px) {
  .product-info-tabs { min-height: 0; }
  ul { overflow-x: auto; }
  li { flex: 0 0 auto; font-size: .75rem; }
  .product-info-tabs__content { padding: .75rem; overflow: visible; }
}
</style>
