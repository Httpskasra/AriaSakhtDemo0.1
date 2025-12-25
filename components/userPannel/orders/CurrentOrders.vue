<template>
  <div class="container">
    <div v-if="orders.length === 0" class="empty-state">
      <p>سفارش جاری وجود ندارد.</p>
    </div>
    <div v-for="order in orders" :key="order.id || order._id" class="item">
      <div class="status-header">
        <span class="status-badge" :class="`status-${order.status}`">
          {{ getStatusLabel(order.status) }}
        </span>
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
          <p class="label">تاریخ ثبت:</p>
          <p class="value">{{ formatDate(order.createdAt) }}</p>
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

function formatDate(date?: string) {
  if (!date) return "-";
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(date));
}

function numberFormat(n?: number) {
  if (typeof n !== "number") return "-";
  return n.toLocaleString("fa-IR");
}

function getStatusLabel(status: OrderStatus) {
  const labels: Record<OrderStatus, string> = {
    pending: "درانتظار پرداخت",
    paid: "پرداخت‌شده",
    shipped: "در حال ارسال",
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
  gap: 15px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #9ca3af;
  font-size: 16px;
}

.item {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 15px;
  background: white;
  transition: all 0.2s;
}

.item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.status-header {
  margin-bottom: 12px;
}

.status-badge {
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  display: inline-block;
}

.status-badge.status-pending {
  background-color: #fef08a;
  color: #713f12;
}

.status-badge.status-paid {
  background-color: #bfdbfe;
  color: #1e40af;
}

.status-badge.status-shipped {
  background-color: #fed7aa;
  color: #92400e;
}

.infos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f3f4f6;
}

.info-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-group .label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 600;
  margin: 0;
}

.info-group .value {
  font-size: 14px;
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
  padding: 8px;
  background: #f9fafb;
  border-radius: 6px;
  border: 1px solid #f3f4f6;
  min-width: 100px;
  text-align: center;
}

.product img {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 6px;
}

.product-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--blue-dark);
  margin: 0 0 4px 0;
}

.quantity {
  font-size: 12px;
  color: #6b7280;
}

.price {
  font-size: 12px;
  font-weight: 600;
  color: #059669;
  margin-top: 4px;
}

@media (max-width: 767px) {
  .item {
    padding: 12px;
  }

  .infos {
    grid-template-columns: 1fr 1fr;
  }

  .product {
    min-width: 80px;
    padding: 6px;
  }

  .product img {
    width: 60px;
    height: 60px;
  }

  .product-name {
    font-size: 12px;
  }
}
</style>
