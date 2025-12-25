<template>
  <div class="status-container">
    <div class="status-badge" :class="`status-${status}`">
      {{ getStatusLabel(status) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { OrderStatus } from "@/services/orderService";

defineProps<{
  status: OrderStatus;
}>();

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
.status-container {
  display: inline-block;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
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

.status-badge.status-delivered {
  background-color: #dcfce7;
  color: #166534;
}

.status-badge.status-cancelled {
  background-color: #f3f4f6;
  color: #374151;
}

.status-badge.status-refunded {
  background-color: #fecaca;
  color: #7f1d1d;
}

@media (max-width: 767px) {
  .status-badge {
    padding: 4px 8px;
    font-size: 11px;
  }
}
</style>
