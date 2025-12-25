<template>
  <div class="container">
    <div v-if="orders.length === 0" class="empty-state">
      <p>سفارشی تکمیل نشده است.</p>
    </div>
    <div v-for="order in orders" :key="order.id || order._id" class="item">
      <div class="status-header">
        <div class="status-badge">
          <img src="/icons/check.png" alt="✓" />
          <span>تکمیل شده</span>
        </div>
      </div>
      <div class="infos">
        <div class="info">
          <p class="name">شناسه تراکنش</p>
          <p class="val">{{ truncateId(order.id || order._id) }}</p>
        </div>
        <div class="info">
          <p class="name">تاریخ ثبت</p>
          <p class="val">{{ formatDateOnly(order.createdAt) }}</p>
        </div>
        <div class="info">
          <p class="name">زمان ثبت</p>
          <p class="val">{{ formatTimeOnly(order.createdAt) }}</p>
        </div>
        <div class="info">
          <p class="name">مبلغ کل</p>
          <p class="val">{{ numberFormat(order.totalPrice) }} ریال</p>
        </div>
      </div>
      <div class="products">
        <div
          class="product"
          v-for="(item, idx) in limitedProducts(order.items)"
          :key="idx">
          <img src="/products/ajor.jpg" alt="محصول" />
          <p>محصول</p>
          <div class="rate">
            <Raiting :size="'16px'" />
          </div>
          <div class="price">
            <span>{{ numberFormat(item.price) }} ریال</span>
            <span>تعداد: {{ item.quantity }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import type { Order } from "@/services/orderService";
import Raiting from "./Raiting.vue";

defineProps<{
  orders: Order[];
}>();

const isMobile = ref(false);

onMounted(() => {
  checkScreenSize();
  window.addEventListener("resize", checkScreenSize);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkScreenSize);
});

const checkScreenSize = () => {
  isMobile.value = window.innerWidth <= 767;
};

const limitedProducts = (items: any[]) => {
  const limit = isMobile.value ? 2 : 3;
  return items.slice(0, limit);
};

function truncateId(id: string | undefined) {
  return id ? id.slice(-6) : "-";
}

function formatDateOnly(date?: string) {
  if (!date) return "-";
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(date));
}

function formatTimeOnly(date?: string) {
  if (!date) return "-";
  return new Intl.DateTimeFormat("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(date));
}

function numberFormat(n?: number) {
  if (typeof n !== "number") return "-";
  return n.toLocaleString("fa-IR");
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #9ca3af;
  font-size: 16px;
}

.item {
  border: 1px solid rgba(0, 0, 0, 0.1);
  width: 90%;
  border-radius: 10px;
  padding: 15px;
  position: relative;
  margin: 15px auto;
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
  display: flex;
  align-items: center;
  gap: 8px;
  color: #059669;
  font-weight: 600;
  font-size: 16px;
}

.status-badge img {
  width: 24px;
  height: 24px;
}

.infos {
  display: flex;
  justify-content: space-between;
  padding-bottom: 15px;
  border-bottom: 1px solid #f3f4f6;
  margin-bottom: 15px;
  flex-wrap: wrap;
  gap: 12px;
}

.info {
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info .name {
  font-size: 12px;
  color: #6b7280;
  font-weight: 600;
  margin: 0;
}

.info .val {
  font-size: 14px;
  color: var(--blue-dark);
  font-weight: 500;
  margin: 0;
}

.products {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 15px;
  flex-wrap: wrap;
}

.product {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  padding: 10px;
  border: 1px solid #f3f4f6;
  border-radius: 6px;
  background: #f9fafb;
  min-width: 120px;
}

.product * {
  margin: 4px 0;
}

.product img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
}

.product p {
  font-weight: 600;
  color: var(--blue-dark);
  font-size: 14px;
  margin: 8px 0;
}

.rate {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 6px 0;
}

.price {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  color: var(--blue-dark);
  margin-top: 8px;
}

.price span {
  margin: 0;
}

@media (max-width: 767px) {
  .container {
    width: 100%;
  }

  .item {
    width: 95%;
  }

  .status-badge {
    font-size: 14px;
  }

  .status-badge img {
    width: 20px;
    height: 20px;
  }

  .infos {
    gap: 8px;
  }

  .info .name {
    font-size: 11px;
  }

  .info .val {
    font-size: 12px;
  }

  .product {
    min-width: 100px;
    padding: 8px;
  }

  .product img {
    width: 80px;
    height: 80px;
  }

  .product p {
    font-size: 12px;
  }

  .price {
    font-size: 11px;
  }
}
</style>
