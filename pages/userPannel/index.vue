<template>
  <NuxtLayout name="pannels">
    <!-- <UserPannel /> -->

    <div class="container">
      <div class="title">
        <h1>داشبورد</h1>
        <img src="/icons/dashboard.png" alt="" />
      </div>

      <LastOrder />
      <div class="sec-part">
        <OrdersDemo class="orders" />
        <Wallet class="wallet" />
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup></script>
<style scoped>
.container {
  width: 90%;
}
.title {
  color: var(--blue-dark);
  font-family: "iran-yekan-Bold";
  width: 230px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin: 15px;
}
.title h1 {
  font-size: 36px;
}
.title img {
  width: 66px;
  height: 66px;
}
.sec-part {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}
.sec-part .wallet {
  flex-basis: 40%;
}
.sec-part .orders {
  flex-basis: 56%;
}
@media (max-width: 767px) {
  .container {
    flex-direction: column;
    width: 100%;
    padding: 0 8px;
  }
  .sec-part {
    flex-direction: column-reverse;
    align-items: stretch;
    gap: 0;
  }
  .sec-part .wallet {
    flex-basis: 100%;
    margin: 16px 0 0 0;
  }
  .sec-part .orders {
    flex-basis: 100%;
    margin-bottom: 16px;
  }
  .title {
    width: 100%;
    margin: 10px 0 18px 0;
    justify-content: flex-start;
    gap: 10px;
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
