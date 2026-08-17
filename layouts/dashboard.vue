<template>
  <div class="layout-shell">
    <header class="dashboard-header">
      <div class="dashboard-header__brand">
        <HeaderBrand compact />
        <span class="dashboard-header__label">پنل مدیریت</span>
      </div>
      <ActionButton class="drawer-toggle" icon-only icon="i-lucide-menu" tone="ghost" aria-label="باز کردن منوی داشبورد" @click="isSidebarOpen = true" />
      <NuxtLink class="dashboard-header__back" to="/" aria-label="بازگشت به سایت">
        <UIcon name="i-lucide-arrow-right" aria-hidden="true" />
        <span>بازگشت به سایت</span>
      </NuxtLink>
    </header>
    <AppDrawer v-model="isSidebarOpen" label="منوی داشبورد">
      <SideBarT :isMenuOpen="isSidebarOpen" @update:isMenuOpen="isSidebarOpen = $event" />
    </AppDrawer>
    <main class="main-container">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const isSidebarOpen = ref(false);
</script>

<style scoped>
.layout-shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(0, 1fr) var(--panel-sidebar-width);
  grid-template-rows: auto 1fr;
  grid-template-areas: "header header" "main drawer";
  direction: ltr;
  background: var(--color-bg-app);
}
.dashboard-header {
  grid-area: header;
  min-height: 4.5rem;
  padding: 0.75rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg-surface);
  direction: rtl;
}
.dashboard-header__brand,
.dashboard-header__back {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
}
.dashboard-header__label {
  padding-inline-start: 0.75rem;
  border-inline-start: 1px solid var(--color-border);
  color: var(--color-text-muted);
  font-size: 0.875rem;
  font-weight: 600;
}
.dashboard-header__back {
  color: var(--color-text-muted);
  font-size: 0.875rem;
  text-decoration: none;
}
.dashboard-header__back:hover { color: var(--blue-dark); }
.main-container { grid-area: main; min-width: 0; padding: 2rem; box-sizing: border-box; width: 100%; direction: rtl; }
.app-drawer { direction: rtl; }
.drawer-toggle { display: none; }

@media (max-width: 1024px) {
  .layout-shell { display: block; }
  .dashboard-header { min-height: 4rem; padding: 0.75rem 1rem; }
  .dashboard-header__back span { display: none; }
  .main-container { padding: 1rem; }
  .drawer-toggle { display: grid; place-items: center; width: 2.5rem; height: 2.5rem; border: 0; border-radius: var(--radius-card); background: var(--color-bg-light); color: var(--blue-dark); }
}
</style>
