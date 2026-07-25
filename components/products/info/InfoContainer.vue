<template>
  <div class="container">
    <div class="header">
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
    <div class="content" role="tabpanel" :aria-labelledby="`${show}-tab`" tabindex="0">
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
.container {
  width: 90%;
  height: 500px;
  margin: auto;
  background-color: #fff;
  border-radius: var(--radius-field);
  position: relative;
  bottom: 10px;
}
.header {
  width: 30%;
  padding: 20px;
  border-bottom: 3px solid #186be7;
  margin-right: 20px;
}

ul {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: var(--font-yekan);
  color: var(--color-text-muted);
}
li:hover {
  cursor: pointer;
}
li.active {
  font-weight: bold;
  color: var(--blue-dark);
  font-family: var(--font-yekan);
}
li:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 3px; }
.content {
  /* background-color: red; */
  width: 100%;
  height: 70%;
  margin: auto;
  margin-top: 50px;
  /* height: 90%; */
  overflow-y: scroll;
  position: relative;
  /* background-color: #fff; */
  /* background-color: red; */
}
@media (min-width: 768px) and (max-width: 1024px) {
  .container {
    width: 95%;
    height: 400px;
    bottom: 5px;
  }
  .header {
    width: 40%;
    padding: 15px;
  }
  ul {
    font-size: 13px;
  }
  li {
    font-size: 12px;
  }
  .content {
    height: 65%;
    margin-top: 30px;
  }
}

@media (max-width: 767px) {
  .container {
    width: 100%;
    height: auto;
    bottom: auto;
  }
  .header {
    width: 80%;
    height: auto;
  }
  ul {
    width: 100%;
    padding: 0;
  }
  li {
    font-size: 10px;
  }
  .content {
    padding-top: 1rem;
    height: auto;
    min-height: 0;
    background-color: #fff;
    overflow: visible;
    position: static;
  }
}
</style>
