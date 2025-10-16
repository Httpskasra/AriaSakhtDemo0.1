<!-- src/components/CategoryMenu.vue -->
<template>
  <div
    class="category-menu-wrapper"
    @mouseenter="openWithDelay"
    @mouseleave="closeWithDelay">
    <button class="menu-button" @focus="openWithDelay" @blur="closeWithDelay">
      دسته‌بندی‌ها
    </button>

    <!-- پنل فقط زمانی که isOpen === true نمایش داده می‌شود -->
    <transition name="fade">
      <div
        v-if="isOpen && !loading"
        class="panel-absolute"
        ref="panelRef"
        @mouseenter="clearCloseTimer"
        @mouseleave="closeWithDelay">
        <CategoryPanel :categories="categories" />
      </div>
    </transition>

    <div v-if="loading" class="loading-indicator">درحال بارگذاری...</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import CategoryPanel from "./CategoryPanel.vue";
import { useCategories } from "@/composables/useCategories";

const { categories, loading, load } = useCategories();
const isOpen = ref(false);

let openTimer: ReturnType<typeof setTimeout> | null = null;
let closeTimer: ReturnType<typeof setTimeout> | null = null;

function openWithDelay() {
  if (closeTimer) {
    clearTimeout(closeTimer);
    closeTimer = null;
  }
  openTimer = setTimeout(() => {
    isOpen.value = true;
  }, 80);
}
function closeWithDelay() {
  if (openTimer) {
    clearTimeout(openTimer);
    openTimer = null;
  }
  closeTimer = setTimeout(() => {
    isOpen.value = false;
  }, 160);
}
function clearCloseTimer() {
  if (closeTimer) {
    clearTimeout(closeTimer);
    closeTimer = null;
  }
}

onMounted(() => {
  // لود اولیه فقط یکبار انجام می‌شود (composable خودش cache دارد)
  load().catch((e) => {
    console.error("failed to load categories", e);
  });
});
</script>

<style scoped>
.category-menu-wrapper {
  position: relative;
  display: inline-block;
}
.menu-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px 12px;
  font-family: "iran-yekan-Bold";
  font-size: 14px;
}
.menu-button:hover {
  transform: scale(1.2);
  transition: 0.5s;
}
.panel-absolute {
  position: absolute;
  top: calc(100% + 8px);
  left: 0; /* در صورت نیاز تغییر ده */
  z-index: 50;
}

/* انیمیشن ساده */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.loading-indicator {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  background: white;
  opacity: 0;
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.06);
}

/* پنل روی موبایل نمایش داده نشود */
@media (max-width: 1024px) {
  .menu-button {
    /* می‌توانید رفتار موبایل را متفاوت پیاده کنید */
  }
  .panel-absolute {
    display: none;
  }
}
</style>
