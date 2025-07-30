<template>
  <div class="container">
    <!-- <HeaderDesctop v-if="!isMobile" :isScrolled="isScrolled" />
    <HeaderMobile v-else :isScrolled="isScrolled" /> -->
    <HeaderDesctop class="header-desctop" :isScrolled="isScrolled" />
    <HeaderMobile
      class="header-mobile"
      :isScrolled="isScrolled"
      :Type="menuType" />
    <MobileNavigation />
  </div>
</template>

<script setup lang="ts">
import type { MenuRole } from "~/types/menu";
const props = defineProps({
  isScrolled: {
    type: Boolean,
    default: false,
  },
  menuType: {
    type: String as PropType<MenuRole>,
    default: "default",
    validator: (value: string): boolean =>
      ["default", "adminPanel", "userPanel", "agentPanel"].includes(value),
  },
});
</script>

<style scoped>
.header-desctop {
  opacity: 1;
  visibility: visible;
}
.header-mobile {
  opacity: 0;
  visibility: hidden;
}
@media (max-width: 768px) {
  .header-desctop {
    opacity: 0;
    visibility: hidden;
  }
  .header-mobile {
    opacity: 1;
    visibility: visible;
  }
}
</style>
