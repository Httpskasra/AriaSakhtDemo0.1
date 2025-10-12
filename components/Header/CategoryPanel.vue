<!-- src/components/CategoryPanel.vue -->
<template>
  <div
    class="category-panel"
    role="menu"
    @mouseenter="keepOpen"
    @mouseleave="startCloseTimer">
    <div class="panel-inner">
      <!-- left column: subcategories of hovered parent -->
      <div class="col col-left" v-if="activeChildren.length">
        <div class="child-list">
          <div
            v-for="child in activeChildren"
            :key="child._id"
            class="child-item">
            {{ child.name }}
          </div>
        </div>
      </div>

      <!-- right column: parent categories stacked vertically -->
      <div class="col col-right">
        <div
          v-for="parent in parents"
          :key="parent._id"
          class="parent-item"
          :class="{ active: parent._id === hoveredParentId }"
          @mouseenter="onHoverParent(parent._id)">
          {{ parent.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from "vue";
import type { Category } from "~/services/categories";

const props = defineProps<{ categories: Category[] }>();

const hoveredParentId = ref<string | null>(null);

// parents: دسته‌هایی که parentId ندارند (والدها)
const parents = computed(() => props.categories.filter((c) => !c.parentId));

// build map parentId -> children
const childrenMap = computed(() => {
  const m = new Map<string, Category[]>();
  for (const c of props.categories) {
    if (c.parentId) {
      const arr = m.get(c.parentId) ?? [];
      arr.push(c);
      m.set(c.parentId, arr);
    }
  }
  return m;
});

const activeChildren = computed(() => {
  if (!hoveredParentId.value && parents.value.length) {
    // پیش‌فرض: اولین والد
    const id = parents.value[0]._id ?? null;
    hoveredParentId.value = id;
    return childrenMap.value.get(id ?? "") ?? [];
  }
  return childrenMap.value.get(hoveredParentId.value ?? "") ?? [];
});

// مدیریت تاخیری برای ناپدید شدن (از parent کنترل شده توسط هدر)
let closeTimer: ReturnType<typeof setTimeout> | null = null;
function startCloseTimer() {
  if (closeTimer) clearTimeout(closeTimer);
  closeTimer = setTimeout(() => {
    // ارسال رویداد به بالا (در صورت نیاز)
    // emit('close') - در صورتی که بخواهید
  }, 150);
}
function keepOpen() {
  if (closeTimer) {
    clearTimeout(closeTimer);
    closeTimer = null;
  }
}

function onHoverParent(id: string | undefined) {
  hoveredParentId.value = id ?? null;
}

onMounted(() => {
  if (!hoveredParentId.value && parents.value.length)
    hoveredParentId.value = parents.value[0]._id ?? null;
});
</script>

<style scoped>
.category-panel {
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  padding: 12px;
  display: inline-block;
  min-width: 420px;
  z-index: 60;
}

/* layout two columns: left=children, right=parents */
.panel-inner {
  display: flex;
  gap: 12px;
}

/* left (children) */
.col-left {
  width: 60%;
  border-right: 1px solid rgba(0, 0, 0, 0.04);
  padding-right: 12px;
}
.child-item {
  padding: 8px 6px;
  white-space: nowrap;
}

/* right (parents) stacked vertically */
.col-right {
  width: 40%;
  display: flex;
  flex-direction: column;
}
.parent-item {
  padding: 8px 6px;
  cursor: pointer;
}
.parent-item.active {
  font-weight: 600;
  background: rgba(0, 0, 0, 0.03);
}

@media (max-width: 1024px) {
  /* در موبایل پنل نباید نمایش داده شود؛ اما کنترل نمایش در پدر هم انجام می‌شود */
  .category-panel {
    display: none;
  }
}
</style>
