<template>
  <div class="mobile-category-item">
    <button
      class="parent-btn"
      @click="toggle"
      :aria-expanded="open"
      :aria-controls="'children-' + id">
      <span>{{ category.name }}</span>
      <UIcon
        v-if="hasChildren"
        :name="open ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
        class="chev size-icon-action" />
    </button>

    <transition name="slide-fade">
      <ul
        v-if="open && children.length"
        :id="'children-' + id"
        class="children-list"
        role="group">
        <li v-for="child in children" :key="getId(child)" class="child-item">
          <NuxtLink class="child-link" :to="categoryPath(child)" @click="onChildClick(child)">{{
            child.name
          }}</NuxtLink>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { Category } from "~/services/categories"; // اصلاح مسیر در صورت نیاز

const props = defineProps<{
  category: Category;
  children: Category[];
}>();

const emits = defineEmits<{
  (e: "child-click", child: Category): void;
}>();

const open = ref(false);

function toggle() {
  open.value = !open.value;
}

function onChildClick(child: Category) {
  emits("child-click", child);
}

function categoryPath(category: Category) {
  return `/products?categoryIds=${encodeURIComponent(getId(category))}`;
}

// helper id provider (پشتیبانی از id یا _id)
function getId(c: any) {
  return c._id ?? c.id ?? String(c.name);
}

const id = getId(props.category);

const hasChildren = computed(
  () => Array.isArray(props.children) && props.children.length > 0
);
</script>

<style scoped>
.mobile-category-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}
.parent-btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background: none;
  border: none;
  padding: 12px 16px;
  font-weight: 600;
  cursor: pointer;
  font-size: 12px;
}
.parent-btn .chev {
  transition: transform 0.18s;
}
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.18s ease;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-6px);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.children-list {
  list-style: none;
  margin: 0;
  padding: 0 0 8px 12px;
}
.child-item {
  padding: 6px 0;
}
.child-link {
  text-decoration: none;
  color: inherit;
  display: block;
  padding: 6px 0;
  font-size: 12px;
}
.child-link:hover {
  text-decoration: underline;
}
</style>
