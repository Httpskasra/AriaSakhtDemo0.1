<template>
  <div>
    <Header class="header" :isScrolled="true" />

    <AdminSideBar class="sidebar" />
    <main class="main-container"><slot></slot></main>
    <p class="spacer"></p>
  </div>
</template>

<script></script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  z-index: 9999;
}
.main-container {
  width: 80%;
  box-sizing: border-box;
  position: relative;
  right: 300px;
  bottom: 80px;
}
</style>
