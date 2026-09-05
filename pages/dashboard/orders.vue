<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { Resource } from "~/types/permissions";
import { useAccess } from "~/composables/useAccess";
import { useOrders } from "~/composables/useOrders";
import { initiatePayment } from "~/services/paymentService";
import { toUserFacingError } from "~/services/apiClient";
import { getValidatedPaymentUrl } from "~/utils/paymentRedirect";

useHead({ title: "داشبورد | سفارش‌ها" });

const { canRead } = useAccess(Resource.ORDERS);
const { canCreate: canPay } = useAccess(Resource.PAYMENT);
const { orders, loading, errorMsg, fetchOrders } = useOrders();
const search = ref("");
const statusFilter = ref("all");
const selectedOrder = ref<import("~/types/order").Order | null>(null);
const payingOrderId = ref<string | null>(null);
const feedback = useFeedback();
const statusLabels: Record<string, string> = {
  pending: "در انتظار پرداخت", paid: "پرداخت‌شده", shipped: "ارسال‌شده",
  delivered: "تحویل‌شده", cancelled: "لغوشده", refunded: "مرجوع‌شده",
};
const statusOptions = [
  { label: "همه وضعیت‌ها", value: "all" },
  { label: "در انتظار پرداخت", value: "pending" },
  { label: "پرداخت‌شده", value: "paid" },
  { label: "ارسال‌شده", value: "shipped" },
  { label: "تحویل‌شده", value: "delivered" },
  { label: "لغوشده", value: "cancelled" },
  { label: "مرجوع‌شده", value: "refunded" },
];
const filteredOrders = computed(() => {
  const query = search.value.trim().toLocaleLowerCase();
  return orders.value.filter((order) => {
    const id = String(order.id || order._id || "").toLocaleLowerCase();
    const matchesQuery = !query || id.includes(query);
    const matchesStatus = statusFilter.value === "all" || order.status === statusFilter.value;
    return matchesQuery && matchesStatus;
  });
});
const hasFilters = computed(() => Boolean(search.value.trim()) || statusFilter.value !== "all");
const formatDate = (value?: string) => value
  ? new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(new Date(value)) : "—";
const formatPrice = (value?: number) => `${new Intl.NumberFormat("fa-IR").format(value || 0)} ریال`;
const clearFilters = () => { search.value = ""; statusFilter.value = "all"; };
const openOrder = (order: import("~/types/order").Order) => { selectedOrder.value = order; };

async function payOrder(order: import("~/types/order").Order) {
  if (!canPay.value || order.status !== "pending" || payingOrderId.value) return;
  const orderId = String(order.id || order._id || "");
  const amount = Number(order.totalPrice ?? order.totalAmount);
  if (!orderId || !Number.isInteger(amount)) {
    feedback.error("اطلاعات سفارش برای پرداخت کامل نیست.");
    return;
  }

  payingOrderId.value = orderId;
  try {
    const response = await initiatePayment({ orderId, amount });
    const paymentUrl = getValidatedPaymentUrl(response.paymentUrl || response.url);
    if (!paymentUrl) throw new Error("آدرس درگاه پرداخت از سرور دریافت نشد.");
    window.location.assign(paymentUrl);
  } catch (error) {
    feedback.error(toUserFacingError(error, "شروع پرداخت انجام نشد.").message);
  } finally {
    payingOrderId.value = null;
  }
}

onMounted(() => { if (canRead.value) void fetchOrders(); });
</script>

<template>
    <section class="orders-page" dir="rtl">
      <PanelPageHeader title="سفارش‌ها" subtitle="سوابق سفارش‌های ثبت‌شده و وضعیت آن‌ها" icon="i-lucide-receipt-text">
        <template #actions><UButton icon="i-lucide-refresh-cw" variant="soft" :loading="loading" aria-label="به‌روزرسانی سفارش‌ها" @click="fetchOrders">به‌روزرسانی</UButton></template>
      </PanelPageHeader>
      <SharedAsyncState v-if="loading" state="loading" />
      <SharedAsyncState v-else-if="errorMsg" state="error" :message="errorMsg" @retry="fetchOrders" />
      <SharedAsyncState v-else-if="!orders.length" state="empty" title="هنوز سفارشی ثبت نشده است" message="سفارش‌های شما پس از ثبت در این بخش نمایش داده می‌شوند." />
      <template v-else>
        <PanelFilterBar>
          <TableFilterInput v-model="search" placeholder="جستجو با شناسه سفارش" aria-label="جستجوی سفارش" />
          <USelect v-model="statusFilter" :items="statusOptions" value-key="value" label-key="label" aria-label="فیلتر وضعیت سفارش" class="status-filter" />
          <UButton v-if="hasFilters" variant="ghost" color="neutral" icon="i-lucide-x" @click="clearFilters">حذف فیلترها</UButton>
        </PanelFilterBar>
        <SharedAsyncState v-if="!filteredOrders.length" state="empty" title="سفارشی با این فیلتر پیدا نشد" message="فیلترها را تغییر دهید یا همه فیلترها را پاک کنید." />
        <PanelDataTable v-else :rows="filteredOrders" :columns="[
          { key: 'id', label: 'شناسه سفارش', class: 'ltr' },
          { key: 'items', label: 'تعداد اقلام' },
          { key: 'amount', label: 'مبلغ' },
          { key: 'status', label: 'وضعیت' },
          { key: 'createdAt', label: 'تاریخ ثبت' },
          { key: 'actions', label: 'عملیات' }
        ]">
          <template #id-data="{ row }">{{ row.id || row._id || "—" }}</template>
          <template #items-data="{ row }">{{ row.items?.length || 0 }}</template>
          <template #amount-data="{ row }">{{ formatPrice(row.totalPrice ?? row.totalAmount) }}</template>
          <template #status-data="{ row }"><StatusPill :label="statusLabels[row.status] || row.status" size="compact" /></template>
          <template #createdAt-data="{ row }">{{ formatDate(row.createdAt) }}</template>
          <template #actions-data="{ row }">
            <div class="order-actions">
              <UButton size="xs" variant="soft" @click="openOrder(row)">جزئیات</UButton>
              <UButton
                v-if="row.status === 'pending' && canPay"
                size="xs"
                :loading="payingOrderId === String(row.id || row._id || '')"
                :disabled="Boolean(payingOrderId)"
                @click="payOrder(row)"
              >پرداخت</UButton>
            </div>
          </template>
        </PanelDataTable>
      </template>
      <div v-if="!canRead" class="no-access">شما به این بخش دسترسی ندارید.</div>
    </section>
    <BaseModal v-if="selectedOrder" title-id="order-details-title" @close="selectedOrder = null">
      <div class="order-details">
        <h2 id="order-details-title">جزئیات سفارش</h2>
        <dl>
          <div><dt>شناسه</dt><dd class="ltr">{{ selectedOrder.id || selectedOrder._id || "—" }}</dd></div>
          <div><dt>وضعیت</dt><dd><StatusPill :label="statusLabels[selectedOrder.status] || selectedOrder.status" size="compact" /></dd></div>
          <div><dt>مبلغ نهایی</dt><dd>{{ formatPrice(selectedOrder.totalPrice ?? selectedOrder.totalAmount) }}</dd></div>
          <div><dt>تعداد اقلام</dt><dd>{{ selectedOrder.items?.length || 0 }}</dd></div>
          <div><dt>تاریخ ثبت</dt><dd>{{ formatDate(selectedOrder.createdAt) }}</dd></div>
        </dl>
      </div>
    </BaseModal>
</template>

<style scoped>
.orders-page { display: grid; gap: 1rem; }
.ltr { direction: ltr; text-align: left; }
.status-filter { min-width: 12rem; }
.order-details { display:grid; gap:1rem; }
.order-details h2 { margin:0; color:var(--color-text-heading); font-size:1.1rem; }
.order-details dl { display:grid; gap:.75rem; margin:0; }
.order-details dl > div { display:flex; justify-content:space-between; gap:1rem; padding:.65rem 0; border-bottom:1px solid var(--color-border); }
.order-details dt { color:var(--color-text-muted); }
.order-details dd { margin:0; color:var(--color-text-heading); font-weight:700; }
.no-access { padding: 2rem; text-align: center; color: var(--color-text-muted); background: var(--color-bg-surface); border-radius: var(--radius-card); }
.order-actions { display: flex; flex-wrap: wrap; gap: .4rem; }
</style>
