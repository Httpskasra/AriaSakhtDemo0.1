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
  width: 280px;
  display: flex;
  justify-content: space-evenly;
}
.title img {
  width: 66px;
  height: 66px;
}
</style>
