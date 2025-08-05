<template>
  <div>
    <Header :isScrolled="true" class="header" :menuType="menueType.role" />
    <SideBarT class="sidebar" />
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

// فرضی: پرمیشن‌ها و اطلاعات کاربر را از استور یا API بگیرید
</script>

<style scoped>
/* .header {
  position: fixed;
  top: 0;
  z-index: 9999;
} */
.main-container {
  width: 80%;
  box-sizing: border-box;
  position: absolute;
  right: 300px;
  bottom: 80px;
  top: 110px;
}
.spacer {
  bottom: 0;
  height: 280px;
  width: 100%;
}
@media (max-width: 767px) {
  .main-container {
    width: 100%;
    top: 70px;
    right: 0;
    bottom: 0;
  }
}
</style>
