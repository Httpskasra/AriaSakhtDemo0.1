<template>
  <div class="layout-shell">
  <AppHeader :isScrolled="true" class="header" :menuType="menueType.role" />
    <ActionButton class="drawer-toggle" icon-only icon="i-lucide-menu" tone="ghost" aria-label="باز کردن منوی کناری" @click="isSidebarOpen = true" />
    <SharedAppDrawer v-model="isSidebarOpen" label="منوی کاربری">
      <UserPannel :isMenuOpen="isSidebarOpen" @update:isMenuOpen="isSidebarOpen = $event" />
    </SharedAppDrawer>
    <main class="main-container">
      <slot />
      <div class="spacer"></div>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { MenuType } from "~/types/menu";

const menueType = ref<MenuType>({
  role: "dashboard",
});
const isScrolled = ref(false);
const isSidebarOpen = ref(false);
</script>

<style scoped>
/* .header {
  position: fixed;
  top: 0;
  z-index: 9999;
} */
.layout-shell { min-height: 100vh; display: grid; grid-template-columns: minmax(0, 1fr) 18rem; grid-template-rows: auto 1fr; grid-template-areas: "header header" "main drawer"; }
.header { grid-area: header; }
.main-container { grid-area: main; min-width: 0; padding: 2rem; box-sizing: border-box; }
.drawer-toggle { display: none; }
.spacer {
  bottom: 0;
  height: 280px;
  width: 100%;
}
@media (max-width: 1023px) { .layout-shell { display: block; } .main-container { padding: 1rem; } .drawer-toggle { display: grid; place-items: center; position: fixed; top: 5.5rem; inset-inline-end: 1rem; z-index: 55; width: 2.5rem; height: 2.5rem; border: 0; border-radius: var(--radius-card); background: #fff; color: var(--blue-dark); box-shadow: var(--shadow-raised); } }
</style>
