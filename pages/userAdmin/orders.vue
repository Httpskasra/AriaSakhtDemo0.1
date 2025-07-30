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
