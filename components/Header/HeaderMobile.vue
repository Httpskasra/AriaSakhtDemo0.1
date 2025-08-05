<template>
  <div class="haeader" :class="{ scrolled: isScrolled }">
    <button class="menu-btn" @click="isMenuOpen = !isMenuOpen">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M5 7H19"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round" />
        <path
          d="M5 12H19"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round" />
        <path
          d="M5 17H19"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round" />
      </svg>
    </button>
    <div class="search"><SearchBar /></div>
    <NuxtLink to="/" class="logo" :class="{ scrolled: isScrolled }">
      <img src="/logo/logo.png" alt="logo" />
    </NuxtLink>

    <MenueMobile
      v-if="Type === 'default'"
      :isMenuOpen="isMenuOpen"
      @update:isMenuOpen="isMenuOpen = $event"
      :isScrolled="isScrolled" />
    <SideBarT
      v-if="Type === 'dashboard'"
      :isMenuOpen="isMenuOpen"
      @update:isMenuOpen="isMenuOpen = $event"
      :isScrolled="isScrolled" />
  </div>
</template>

<script setup lang="ts">
import type { MenuRole } from "~/types/menu";

defineProps({
  isScrolled: {
    type: Boolean,
    default: false,
  },
  Type: {
    type: String as PropType<MenuRole>,
    default: "default",
    validator: (value: string): boolean =>
      ["default", "adminPanel", "userPanel"].includes(value),
  },
});
const isMenuOpen = ref(false);
</script>

<style scoped>
.haeader {
  width: 100%;
  height: 70px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  background-color: var(--blue-light);
  padding: 10px 0;
  position: fixed;
  top: 75px;
  left: 0;
  right: 0;
  z-index: 999;
  border-radius: 0 0 15px 15px;
  /* transition: 0.5s; */
  transition: 1s;
}
.haeader.scrolled {
  transition: 1s;
  top: 0;
}
.navigation {
  width: 50%;
}
.search {
  width: 176px;
}
.login {
  width: 100px;
}

.logo {
  width: 0;
  height: 0;
  transition: 1s;
  opacity: 0;
}
.logo.scrolled {
  width: 43px;
  height: 37px;
  object-fit: contain;
  opacity: 1;
  transition: 1s;
}
.logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
