<template>
  <NuxtLayout name="pannels">
    <div>
      <div class="title">
        <h1>کیف پول</h1>
        <img src="/icons/wallet.png" alt="" />
      </div>
      <Inventory />
      <WalletOrg />
    </div>
  </NuxtLayout>
</template>

<script setup></script>

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
