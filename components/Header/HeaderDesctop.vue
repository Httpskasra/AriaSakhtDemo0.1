<template>
  <div
    class="w-full h-[100px] flex justify-evenly items-center fixed left-0 right-0 z-[1000] rounded-b-[15px] bg-[var(--blue-light)] py-2.5 transition-all duration-1000"
    :class="{
      'top-0 transition-all duration-500': isScrolled,
      'top-[80px]': !isScrolled,
    }">
    <NuxtLink
      to="/"
      class="transition-all duration-1000 opacity-0 w-0 h-0"
      :class="{
        'w-[100px] h-[70px] opacity-100 transition-all duration-1000':
          isScrolled,
      }">
      <img
        src="assets/logo/logo.webp"
        alt="logo"
        class="w-full h-full object-contain" />
    </NuxtLink>

    <div class="w-1/2">
      <NavigationDesctop :isMobile="isMobile" />
    </div>

    <div class="w-[370px]">
      <SearchBar />
    </div>
    <div class="w-[100px]">
      <LoginBtn @click="isOpen = !isOpen" :isLogin="isLogin" />
      <ModalWrapper v-if="isOpen" @close="isOpen = false" />
    </div>
  </div>
</template>

<script setup>
const isMobile = ref(false);
const isOpen = ref(false);
const isLogin = ref(false);
defineProps({
  isScrolled: {
    type: Boolean,
    default: false,
  },
});
</script>
