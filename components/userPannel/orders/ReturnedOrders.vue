<template>
  <div class="container">
    <div v-if="orders.length === 0">سفارشی مرجوع نشده است.</div>
    <div v-for="order in orders" :key="order._id" class="item">
      <div class="infos">
        <p>شناسه سفارش: {{ order._id }}</p>
        <p>مبلغ کل: {{ order.totalPrice }} ریال</p>
        <p>وضعیت: {{ order.status }}</p>
        <p>کمپانی: {{ order.company?.name }}</p>
      </div>
      <div class="products">
        <div
          v-for="product in order.products"
          :key="product._id"
          class="product">
          <img :src="product.image || '/products/ajor.jpg'" alt="" />
          <p>{{ product.name }}</p>
          <span>تعداد: {{ product.quantity }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ orders: Array });
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
}
.item {
  border: 1px solid #99f;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 8px;
}
.products {
  display: flex;
  gap: 10px;
}
.product {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.product img {
  width: 60px;
  height: 60px;
}
</style>
