<template>
  <div class="container">
    <div v-if="orders.length === 0" class="empty-state">
      <p>سفارشی مرجوع نشده است.</p>
    </div>
    <div v-for="order in orders" :key="order.id || order._id" class="item">
      <div class="status-header">
        <span class="status-badge status-refunded">{{
          getStatusLabel(order.status)
        }}</span>
      </div>
      <div class="infos">
        <div class="info-group">
          <p class="label">شناسه سفارش:</p>
          <p class="value">{{ truncateId(order.id || order._id) }}</p>
        </div>
        <div class="info-group">
          <p class="label">مبلغ کل:</p>
          <p class="value">{{ numberFormat(order.totalPrice) }} ریال</p>
        </div>
        <div class="info-group">
          <p class="label">وضعیت:</p>
          <p class="value">{{ getStatusLabel(order.status) }}</p>
        </div>
      </div>
      <div class="products">
        <div v-for="(item, idx) in order.items" :key="idx" class="product">
          <img src="/products/ajor.jpg" alt="محصول" />
          <p class="product-name">محصول</p>
          <span class="quantity">تعداد: {{ item.quantity }}</span>
          <span class="price">{{ numberFormat(item.price) }} ریال</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Order, OrderStatus } from "@/services/orderService";

defineProps<{
  orders: Order[];
}>();

function truncateId(id: string) {
  return id ? id.slice(-6) : "-";
}

function numberFormat(n?: number) {
  if (typeof n !== "number") return "-";
  return n.toLocaleString("fa-IR");
}

function getStatusLabel(status: OrderStatus) {
  const labels: Record<OrderStatus, string> = {
    pending: "درانتظار",
    paid: "پرداخت‌شده",
    shipped: "ارسال‌شده",
    delivered: "تحویل‌داده‌شده",
    cancelled: "لغو‌شده",
    refunded: "بازپرداخت‌شده",
  };
  return labels[status] || status;
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #9ca3af;
  font-size: 16px;
}

.item {
  border: 1px solid #a4d4ff;
  border-radius: 8px;
  padding: 12px;
  background: #fff;
  transition: all 0.2s;
}

.item:hover {
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
}

.status-header {
  margin-bottom: 10px;
}

.status-badge {
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  display: inline-block;
}

.status-badge.status-refunded {
  background-color: #fecaca;
  color: #7f1d1d;
}

.infos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #a4d4ff;
}

.info-group {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.info-group .label {
  font-size: 11px;
  color: #6b7280;
  font-weight: 600;
  margin: 0;
}

.info-group .value {
  font-size: 13px;
  color: #1f2937;
  margin: 0;
  font-weight: 500;
}

.products {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.product {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px;
  background: #f9fafb;
  border-radius: 6px;
  border: 1px solid #f3f4f6;
  min-width: 90px;
  text-align: center;
}

.product img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 4px;
}

.product-name {
  font-size: 12px;
  font-weight: 600;
  color: var(--blue-dark);
  margin: 0 0 3px 0;
}

.quantity {
  font-size: 11px;
  color: #6b7280;
  margin: 0;
}

.price {
  font-size: 11px;
  font-weight: 600;
  color: #7f1d1d;
  margin-top: 3px;
}

@media (max-width: 767px) {
  .item {
    padding: 10px;
  }

  .infos {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .product {
    min-width: 80px;
    padding: 5px;
  }

  .product img {
    width: 50px;
    height: 50px;
  }

  .product-name {
    font-size: 11px;
  }
}
</style>
