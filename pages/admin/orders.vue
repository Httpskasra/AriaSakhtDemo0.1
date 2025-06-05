<template>
  <NuxtLayout name="admin">
    <div class="container">
      <div class="title">
        <h1>سفارش ها</h1>
        <img src="/icons/orders.png" alt="" />
      </div>
      <AdminOrdersOrg />
    </div>
  </NuxtLayout>
</template>

<style scoped>
.title {
  color: var(--blue-dark);
  font-family: "iran-yekan-Bold";
  width: 230px;
  display: flex;
  justify-content: space-evenly;
}
.title img {
  width: 66px;
  height: 66px;
}
</style>
