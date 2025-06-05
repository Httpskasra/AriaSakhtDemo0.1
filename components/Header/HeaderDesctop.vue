<template>
  <div class="haeader" :class="{ scrolled: isScrolled }">
    <NuxtLink to="/" class="logo" :class="{ scrolled: isScrolled }">
      <img src="assets/logo/logo.webp" alt="logo" />
    </NuxtLink>

    <div class="navigation"><NavigationDesctop :isMobile="isMobile" /></div>

    <div class="search"><SearchBar /></div>
    <div class="login">
      <LoginBtn @click="isOpen = !isOpen" :isLogin="isLogin" />
      <SingUp v-if="isOpen" @close="isOpen = false" />
    </div>
  </div>
</template>

<script setup>
const isMobile = ref(false);
const isOpen = ref(false);
defineProps({
  isScrolled: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.haeader {
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  background-color: var(--blue-light);
  padding: 10px 0;
  position: fixed;
  top: 80px;
  left: 0;
  right: 0;
  z-index: 1000;
  border-radius: 0 0 15px 15px;
  /* transition: 0.5s; */
  transition: 1s;
}
.haeader.scrolled {
  transition: 0.5s;
  top: 0;
}
.navigation {
  width: 50%;
}
.search {
  width: 370px;
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
  width: 100px;
  height: 70px;
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
