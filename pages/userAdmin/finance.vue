<template>
  <NuxtLayout name="admin">
    <div class="title">
      <h1>گزارش مالی</h1>
      <img src="/adminIcon/finance.png" alt="" />
    </div>
    <AdminInventory />
    <AdminWalletOrg />
  </NuxtLayout>
</template>

<script>
export default {};
</script>

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
  font-size: 32px;
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
