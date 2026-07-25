<script setup lang="ts">
import type { SidebarNavItem } from "~/types/sidebar";

const props = defineProps<{
  items: SidebarNavItem[];
}>();

const emit = defineEmits<{ navigate: [] }>();
const route = useRoute();

function isActive(item: SidebarNavItem) {
  return Boolean(item.route && route.path === item.route);
}

function iconSrc(item: SidebarNavItem) {
  const iconName = isActive(item) ? item.activeIcon || `${item.icon}-active` : item.icon;
  return `${item.iconBase}/${iconName}.svg`;
}

async function handleAction(item: SidebarNavItem) {
  if (item.action) await item.action();
  emit("navigate");
}
</script>

<template>
  <nav class="sidebar-nav" aria-label="ناوبری کناری">
    <template v-for="item in props.items" :key="`${item.route || item.label}-${item.icon}`">
      <NuxtLink
        v-if="item.route"
        :to="item.route"
        class="sidebar-nav__item"
        :class="{ 'sidebar-nav__item--active': isActive(item) }"
        @click="emit('navigate')">
        <span class="sidebar-nav__icon">
          <img :src="iconSrc(item)" alt="" />
        </span>
        <span class="sidebar-nav__label">{{ item.label }}</span>
      </NuxtLink>
      <UButton
        v-else
        type="button"
        variant="ghost"
        color="neutral"
        class="sidebar-nav__item sidebar-nav__item--button"
        @click="handleAction(item)">
        <span class="sidebar-nav__icon">
          <img :src="iconSrc(item)" alt="" />
        </span>
        <span class="sidebar-nav__label">{{ item.label }}</span>
      </UButton>
    </template>
  </nav>
</template>

<style scoped>
.sidebar-nav {
  width: 100%;
  flex: 1;
  overflow-y: auto;
  padding: 1.25rem 0 6.25rem;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.sidebar-nav::-webkit-scrollbar {
  display: none;
}

.sidebar-nav__item {
  width: calc(100% - 2.5rem);
  margin: 0.75rem 1.25rem;
  padding: 0.625rem 0.625rem 0.625rem 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.9375rem;
  border: 0;
  background: transparent;
  color: var(--color-text-muted);
  font-family: var(--font-yekan);
  font-weight: 600;
  font-size: 0.875rem;
  text-align: right;
  text-decoration: none;
  cursor: pointer;
}

.sidebar-nav__item--active {
  background-color: var(--blue-sky);
  border-radius: var(--radius-card);
  color: var(--color-text-heading);
}

.sidebar-nav__item--button {
  color: var(--color-danger-fg);
}

.sidebar-nav__icon {
  width: var(--spacing-icon-action);
  height: var(--spacing-icon-action);
  flex: none;
}

.sidebar-nav__icon img {
  width: 100%;
  height: 100%;
  display: block;
}

.sidebar-nav__label {
  min-width: 0;
}

@media (max-width: 1024px) {
  .sidebar-nav__item {
    width: calc(100% - 2rem);
    margin-left: 1rem;
    margin-right: 1rem;
    font-size: 0.75rem;
  }
}
</style>
