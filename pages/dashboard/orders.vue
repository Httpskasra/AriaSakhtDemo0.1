<template>
  <NuxtLayout name="dashboard">
    <div class="container">
      <DashboardPageHeader title="سفارش ها" icon="/icons/orders.png" />
      <!-- <AdminOrdersOrg /> -->
       <OrdersOrg/>
    </div>
  </NuxtLayout>
</template>
<script setup lang="ts">

useHead({
  title: "داشبورد | سفارش‌ها",
});

definePageMeta({
  middleware: ["auth", "permission"],
  permission: { resource: "orders", action: "r" },
});
</script>
