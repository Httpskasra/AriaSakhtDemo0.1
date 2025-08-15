<template>
  <NuxtLayout name="dashboard">
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

<script setup lang="ts">
import dashboardAuth from "~/middleware/dashboard-auth";
definePageMeta({
  middleware: dashboardAuth,
});
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
}
.title {
  color: var(--blue-dark);
  font-family: "iran-yekan-Bold";
  width: 230px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin: 15px;
}
.title h1 {
  font-size: 36px;
}
.title img {
  width: 66px;
  height: 66px;
}
@media (max-width: 767px) {
  .title {
    width: 40%;
  }
  .title h1 {
    font-size: 20px;
  }
  .title img {
    width: 40px;
    height: 40px;
  }
}
</style>
