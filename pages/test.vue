<template>
  <NuxtLayout name="dashboard"></NuxtLayout>
</template>

<script setup lang="ts">
const { $axios } = useNuxtApp();
const data = [{
  userId: "507f1f77bcf86cd799439011",
  items: [
    {
      productId: "507f1f77bcf86cd799439011",
      quantity: 2,
    },
  ],
  totalPrice: 1500000,
  status: "pending",
  shippingAddress: "123 Street, Tehran, Iran",
  paymentMethod: "",
  companyId: "",
  transportId: "",
  ticketId: "",
}];
const fetchOrders = async () => {
  const res = await $axios.post("/orders", data);
};
onMounted(fetchOrders);
</script>
