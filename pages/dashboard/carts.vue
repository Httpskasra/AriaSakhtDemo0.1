<template>
  <NuxtLayout name="dashboard">
    <div class="title">
      <h1>سبد خرید</h1>
      <img src="/icons/cart.png" alt="" />
    </div>

    <div class="container">
      <CartProducts />
      <Factor />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'dashboard-auth'
});</script>

<style scoped>
.container {
  display: flex;
  justify-content: space-between;
  width: 90%;
}
.title {
  color: var(--blue-dark);
  font-family: "iran-yekan-Bold";
  width: 230px;
  display: flex;
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
  .container {
    width: 95%;
    margin: auto;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
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
