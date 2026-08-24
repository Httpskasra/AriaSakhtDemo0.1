<template>
  <div class="panel-layout" :class="{ 'panel-layout--collapsed': isSidebarCollapsed }">
    <PanelHeader :title="panelTitle" :identity="identity" :collapsed="isSidebarCollapsed" @open-menu="isSidebarOpen = true" @toggle-sidebar="isSidebarCollapsed = !isSidebarCollapsed" />
    <PanelSidebar v-model="isSidebarOpen" :collapsed="isSidebarCollapsed" :items="navItems" :identity="identity" />
    <main class="panel-layout__main">
      <div class="panel-layout__content">
        <Suspense>
          <slot />
          <template #fallback>
            <SharedAsyncState state="loading" :skeleton-rows="3" />
          </template>
        </Suspense>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const isSidebarOpen = ref(false);
const isSidebarCollapsed = ref(false);
const { identity, navItems, panelTitle } = usePanelNavigation();
</script>

<style>
.panel-layout { --panel-sidebar-current-width:var(--panel-sidebar-width); width:100%; height:100dvh; min-height:100dvh; max-width:100%; overflow:hidden; display:grid; grid-template-columns:minmax(0, 1fr) var(--panel-sidebar-current-width); grid-template-rows:auto minmax(0, 1fr); grid-template-areas:"header header" "main drawer"; direction:ltr; background:var(--color-bg-light); }
.panel-layout--collapsed { --panel-sidebar-current-width:4.5rem; }
.panel-layout > .panel-header { grid-area:header; direction:rtl; }
.panel-layout > .panel-sidebar { grid-area:drawer; direction:rtl; min-height:0; }
.panel-layout__main { grid-area:main; min-width:0; max-width:100%; min-height:0; overflow-y:auto; padding:clamp(1rem, 3vw, 2rem); direction:rtl; }
.panel-layout__content { width:min(100%, 90rem); margin-inline:auto; }
@media (max-width:1024px) { .panel-layout, .panel-layout--collapsed { display:block; height:auto; min-height:100dvh; overflow:visible; } .panel-layout__main { min-height:calc(100dvh - var(--panel-header-height)); overflow:visible; } }
</style>
