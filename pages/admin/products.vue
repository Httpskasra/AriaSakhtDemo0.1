<template>
  <NuxtLayout name="admin">
    <div class="title">
      <h1>محصولات</h1>
      <img src="/adminIcon/products.png" alt="" />
    </div>

    <div class="container">
      <AdminFavHeader />
      <AdminFavItems />
    </div>
  </NuxtLayout>
</template>

<script setup></script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 90%;
}
.title {
  color: var(--blue-dark);
  font-family: "iran-yekan-Bold";
  width: 280px;
  display: flex;
  justify-content: space-evenly;
}
.title img {
  width: 66px;
  height: 66px;
}
</style>
