<template>
  <div class="admin-layout">
    <AppDrawer v-model="isSidebarOpen" label="منوی مدیریت" width="16rem">
      <AdminSideBar :isMenuOpen="isSidebarOpen" @update:isMenuOpen="isSidebarOpen = $event" />
    </AppDrawer>

    <div class="admin-layout__content">
      <header class="admin-layout__header" aria-label="سربرگ پنل مدیریت">
        <HeaderIconButton icon="i-lucide-menu" label="باز کردن منوی مدیریت" class="drawer-toggle" @click="isSidebarOpen = true" />
        <h1>پنل مدیریت تجاریس</h1>
        <div class="admin-layout__actions">
          <UButton icon="i-lucide-home" variant="ghost" color="neutral" to="/">
            مشاهده سایت
          </UButton>
          <AuthLoginButton />
        </div>
      </header>

      <main class="admin-layout__main">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const isSidebarOpen = ref(false);
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 16rem;
  grid-template-areas: "content drawer";
  background: var(--color-bg-light);
}

.admin-layout__content {
  grid-area: content;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.admin-layout__header {
  height: var(--panel-header-height);
  padding: 0 1.5rem;
  background: #fff;
  border-bottom: 1px solid var(--gray-200);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: none;
}

.admin-layout__header h1 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text-heading);
}

.admin-layout__actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.admin-layout__main {
  flex: 1;
  min-width: 0;
  overflow-y: auto;
  padding: 1.5rem;
  background: #f5f5f5;
}

.drawer-toggle {
  display: none;
}

@media (max-width: 1023px) {
  .admin-layout {
    display: block;
  }

  .admin-layout__header {
    padding: 0 1rem;
    gap: 1rem;
  }

  .admin-layout__main {
    padding: 1rem;
  }

  .drawer-toggle {
    display: grid;
    place-items: center;
    width: 2.5rem;
    height: 2.5rem;
    border: 0;
    border-radius: var(--radius-card);
    background: #fff;
    color: var(--color-text-heading);
    box-shadow: var(--shadow-raised);
  }
}
</style>
