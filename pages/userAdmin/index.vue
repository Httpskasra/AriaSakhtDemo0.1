<template>
  <NuxtLayout name="admin">
    <!-- <UserPannel /> -->

    <div class="w-[90%] mx-auto">
      <div
        class="flex justify-evenly text-blue-900 font-bold font-['iran-yekan-Bold'] w-[200px]"
      >
        <h1>داشبورد</h1>
        <img src="/icons/dashboard.png" alt="" class="w-[66px] h-[66px]" />
      </div>

      <AdminLastOrders />

      <div class="mt-5 flex justify-between">
        <AdminOrdersDemo class="basis-[56%]" />
        <Wallet class="basis-[40%]" />
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup></script>
