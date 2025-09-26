<template>
  <NuxtLayout name="dashboard">
    <div class="container">
      <div class="title">
        <h1>سفارش ها</h1>
        <img src="/icons/orders.png" alt="" />
      </div>
      <OrdersOrg />
    </div>
  </NuxtLayout>
</template>
<script setup lang="ts">
// import dashboardAuth from "~/middleware/dashboard-auth";
// definePageMeta({
//   middleware: dashboardAuth,
// });
</script>
<style scoped>
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
