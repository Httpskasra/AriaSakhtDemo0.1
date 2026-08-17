<script setup lang="ts">
import { onMounted } from "vue";
import { Resource } from "~/types/permissions";
import { useAccess } from "~/composables/useAccess";
import { useOrders } from "~/composables/useOrders";

useHead({ title: "داشبورد | سفارش‌ها" });
definePageMeta({ middleware: ["auth", "permission"], permission: { resource: "orders", action: "r" } });

const { canRead } = useAccess(Resource.ORDERS);
const { orders, loading, errorMsg, fetchOrders } = useOrders();
const statusLabels: Record<string, string> = {
  pending: "در انتظار پرداخت", paid: "پرداخت‌شده", shipped: "ارسال‌شده",
  delivered: "تحویل‌شده", cancelled: "لغوشده", refunded: "مرجوع‌شده",
};
const formatDate = (value?: string) => value
  ? new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(new Date(value)) : "—";
const formatPrice = (value?: number) => `${new Intl.NumberFormat("fa-IR").format(value || 0)} ریال`;

onMounted(() => { if (canRead.value) void fetchOrders(); });
</script>

<template>
  <NuxtLayout name="dashboard">
    <section class="orders-page container" dir="rtl">
      <DashboardPageHeader title="سفارش‌ها" icon="/icons/orders.png" />
      <SharedAsyncState v-if="loading" state="loading" />
      <SharedAsyncState v-else-if="errorMsg" state="error" :message="errorMsg" @retry="fetchOrders" />
      <SharedAsyncState v-else-if="!orders.length" state="empty" title="هنوز سفارشی ثبت نشده است" message="سفارش‌های شما پس از ثبت در این بخش نمایش داده می‌شوند." />
      <div v-else class="orders-table-wrapper">
        <table class="orders-table">
          <thead><tr><th>شناسه سفارش</th><th>تعداد اقلام</th><th>مبلغ</th><th>وضعیت</th><th>تاریخ ثبت</th></tr></thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id || order._id">
              <td class="ltr">{{ order.id || order._id || "—" }}</td>
              <td>{{ order.items?.length || 0 }}</td>
              <td>{{ formatPrice(order.totalPrice ?? order.totalAmount) }}</td>
              <td><StatusPill :label="statusLabels[order.status] || order.status" size="compact" /></td>
              <td>{{ formatDate(order.createdAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="!canRead" class="no-access">شما به این بخش دسترسی ندارید.</div>
    </section>
  </NuxtLayout>
</template>

<style scoped>
.orders-page { display: grid; gap: 1rem; }
.orders-table-wrapper { overflow-x: auto; background: var(--color-bg-surface); border: 1px solid var(--color-border); border-radius: var(--radius-card); }
.orders-table { width: 100%; min-width: 42rem; border-collapse: collapse; }
.orders-table th, .orders-table td { padding: .9rem 1rem; text-align: right; border-bottom: 1px solid var(--color-border); }
.orders-table th { color: var(--color-text-muted); font-size: .85rem; background: var(--color-bg-light); }
.orders-table td { color: var(--color-text-body); }
.orders-table tbody tr:last-child td { border-bottom: 0; }
.ltr { direction: ltr; text-align: left !important; }
.no-access { padding: 2rem; text-align: center; color: var(--color-text-muted); background: var(--color-bg-surface); border-radius: var(--radius-card); }
</style>
