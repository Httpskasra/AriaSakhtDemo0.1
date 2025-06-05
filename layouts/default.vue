<template>
  <div>
    <Banner class="banner" :isScrolled="isScrolled" />
    <Header
      :isScrolled="isScrolled"
      class="header"
      :menuType="menueType.role"
    />
    <div
      class="w-full mx-auto h-full"
      :class="isScrolled ? 'relative bottom-15' : 'p-0'"
    >
      <slot />
    </div>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import type { MenuType } from "~/types/menu";
import { useRoute } from "vue-router"; // یا در Nuxt از useRoute استفاده کنید

const route = useRoute();
const menueType = ref<MenuType>({
  role: "default",
});
const isScrolled = ref(false);

// بررسی اینکه آیا صفحه فعلی صفحه اصلی است
const isHomePage = computed(() => route.path === "/");

onMounted(() => {
  // اگر صفحه اصلی باشد، رفتار پویا برای اسکرول اعمال شود
  if (isHomePage.value) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        isScrolled.value = true;
      } else {
        isScrolled.value = false;
      }
    });
  } else {
    // در صفحات دیگر، isScrolled همیشه true باشد
    isScrolled.value = true;
  }
});
</script>
