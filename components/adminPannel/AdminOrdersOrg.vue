<template>
  <div class="container">
    <!-- Header with Filters -->
    <div class="header-section">
      <div class="filter-controls">
        <UButton type="button" color="neutral" variant="outline" @click="toggleFilters">
          <span>فیلتر</span>
        </UButton>
        <TableFilterInput
          v-model="searchQuery"
          placeholder="جستجو بر اساس شناسه یا محصول..." />
      </div>

      <!-- Filter Panel -->
      <transition name="fade">
        <div v-if="showFilters" class="filter-panel">
          <select v-model="statusFilter">
            <option value="">همه وضعیت‌ها</option>
            <option value="pending">درانتظار</option>
            <option value="paid">پرداخت‌شده</option>
            <option value="shipped">ارسال‌شده</option>
            <option value="delivered">تحویل‌داده‌شده</option>
            <option value="cancelled">لغو‌شده</option>
            <option value="refunded">بازپرداخت‌شده</option>
          </select>

          <UButton color="error" variant="ghost" size="sm" @click="clearFilters">
            حذف فیلترها
          </UButton>
        </div>
      </transition>
    </div>

    <!-- Loading State -->
    <SharedAsyncState v-if="loading" state="loading" :skeleton-rows="4" />

    <!-- Error State -->
    <SharedAsyncState v-else-if="errorMsg" state="error" :message="errorMsg" @retry="fetchOrders" />

    <!-- Empty State -->
    <SharedAsyncState v-else-if="filteredOrders.length === 0" state="empty" title="سفارشی پیدا نشد" message="فیلترها یا جستجو را تغییر دهید." />

    <!-- Orders List -->
    <div v-else class="orders-container">
      <!-- Orders List -->
      <div class="orders-list">
        <div
          v-for="order in filteredOrders"
          :key="order.id || order._id"
          class="order-card"
          :class="{ active: selectedOrderId === (order.id || order._id) }"
          @click="selectOrder(order)">
          <div class="order-header">
            <h3>سفارش #{{ truncateId(order.id || order._id) }}</h3>
            <OrderStatus :status="order.status" />
          </div>
          <p class="order-description">{{ order.items?.length || 0 }} محصول</p>
          <div class="order-meta">
            <span class="price"
              >{{ numberFormat(order.totalPrice) }} تومان</span
            >
            <span class="date">{{ formatDate(order.createdAt) }}</span>
          </div>
        </div>
      </div>

      <!-- Order Details -->
      <div class="order-details">
        <div v-if="selectedOrder" class="details-content">
          <!-- Header -->
          <div class="details-header">
            <h2>
              سفارش #{{ truncateId(selectedOrder.id || selectedOrder._id) }}
            </h2>
            <div class="order-badges">
              <OrderStatus :status="selectedOrder.status" />
            </div>
          </div>

          <!-- Order Items -->
          <div class="details-section">
            <h4>محصولات</h4>
            <div
              v-if="selectedOrder.items && selectedOrder.items.length"
              class="items-list">
              <div
                v-for="(item, idx) in selectedOrder.items"
                :key="idx"
                class="item-card">
                <span class="item-name">{{ item.productId }}</span>
                <span class="item-quantity">تعداد: {{ item.quantity }}</span>
                <span class="item-price"
                  >{{ numberFormat(item.price) }} تومان</span
                >
              </div>
            </div>
            <p v-else class="no-items">محصولی وجود ندارد</p>
          </div>

          <!-- Order Information -->
          <div class="details-section">
            <h4>اطلاعات سفارش</h4>
            <div class="info-grid">
              <div class="info-item">
                <span class="label">شناسه سفارش:</span>
                <span class="value">{{
                  selectedOrder.id || selectedOrder._id
                }}</span>
              </div>
              <div class="info-item">
                <span class="label">وضعیت:</span>
                <span class="value">{{
                  getOrderStatusConfig(selectedOrder.status).label
                }}</span>
              </div>
              <div class="info-item">
                <span class="label">قیمت کل:</span>
                <span class="value"
                  >{{ numberFormat(selectedOrder.totalPrice) }} تومان</span
                >
              </div>
              <div class="info-item">
                <span class="label">هزینه ارسال:</span>
                <span class="value"
                  >{{
                    numberFormat(selectedOrder.shippingCost || 0)
                  }}
                  تومان</span
                >
              </div>
              <div class="info-item">
                <span class="label">تاریخ ایجاد:</span>
                <span class="value">{{
                  formatDate(selectedOrder.createdAt)
                }}</span>
              </div>
              <div class="info-item" v-if="selectedOrder.transportId">
                <span class="label">شناسه حمل‌ونقل:</span>
                <span class="value">{{ selectedOrder.transportId }}</span>
              </div>
            </div>

            <!-- Address -->
            <div v-if="selectedOrder.shippingAddress" class="address-section">
              <span class="label">آدرس ارسال:</span>
              <p class="address-text">{{ selectedOrder.shippingAddress }}</p>
            </div>

            <!-- Notes -->
            <div v-if="selectedOrder.notes" class="notes-section">
              <span class="label">یادداشت‌ها:</span>
              <p class="notes-text">{{ selectedOrder.notes }}</p>
            </div>
          </div>

          <!-- Status Actions -->
          <div class="details-section actions-section">
            <h4>اقدامات</h4>
            <div class="actions-buttons">
              <UButton
                v-if="selectedOrder.status === 'pending'"
                @click="handleStatusChange('paid')"
                :disabled="updatingStatus"
                size="sm"
                color="success">
                {{
                  updatingStatus ? "درحال انجام..." : "علامت‌گذاری پرداخت شده"
                }}
              </UButton>

              <UButton
                v-if="selectedOrder.status === 'paid'"
                @click="handleStatusChange('shipped')"
                :disabled="updatingStatus"
                size="sm"
                color="warning"
                variant="soft">
                {{
                  updatingStatus ? "درحال انجام..." : "علامت‌گذاری ارسال شده"
                }}
              </UButton>

              <UButton
                v-if="selectedOrder.status === 'shipped'"
                @click="handleStatusChange('delivered')"
                :disabled="updatingStatus"
                size="sm"
                color="success">
                {{
                  updatingStatus ? "درحال انجام..." : "علامت‌گذاری تحویل شده"
                }}
              </UButton>

              <UButton
                v-if="['pending', 'paid'].includes(selectedOrder.status)"
                @click="handleStatusChange('cancelled')"
                :disabled="updatingStatus"
                size="sm"
                color="error">
                {{ updatingStatus ? "درحال انجام..." : "لغو سفارش" }}
              </UButton>

              <UButton
                v-if="['paid', 'shipped'].includes(selectedOrder.status)"
                @click="handleRefund"
                :disabled="updatingStatus"
                size="sm"
                color="error"
                variant="soft">
                {{ updatingStatus ? "درحال انجام..." : "بازپرداخت" }}
              </UButton>
            </div>
          </div>
        </div>
        <div v-else class="empty-details">
          <p>سفارشی را انتخاب کنید تا جزئیات را ببینید</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const feedback = useFeedback();
import { ref, computed } from "vue";
import type { Order, OrderStatus } from "@/types/order";
import {
  listOrders,
  getOrder,
  markOrderAsPaid,
  markOrderAsShipped,
  markOrderAsDelivered,
  refundOrder,
} from "@/services/orderService";

// State
const orders = ref<Order[]>([]);
const loading = ref(false);
const errorMsg = ref("");
const showFilters = ref(false);
const statusFilter = ref<string>("");
const searchQuery = ref("");

// Selected Order
const selectedOrderId = ref<string | null>(null);
const selectedOrder = ref<Order | null>(null);
const updatingStatus = ref(false);

// Fetch Orders
const fetchOrders = async () => {
  loading.value = true;
  errorMsg.value = "";
  try {
    const result = await listOrders();
    orders.value = Array.isArray(result) ? result : result.items || [];
  } catch (err: any) {
    errorMsg.value =
      err?.response?.data?.message || err?.message || "خطای نامشخص";
    orders.value = [];
  } finally {
    loading.value = false;
  }
};

// Select Order
const selectOrder = async (order: Order) => {
  selectedOrderId.value = order.id || order._id || "";
  selectedOrder.value = order;
};

// Filtered Orders
const filteredOrders = computed(() => {
  return orders.value.filter((order) => {
    const okStatus =
      !statusFilter.value ||
      String(order.status || "").toLowerCase() === statusFilter.value;
    const okSearch =
      !searchQuery.value ||
      String(order.id || order._id || "").includes(searchQuery.value) ||
      (order.items || []).some((item) =>
        String(item.productId || "").includes(searchQuery.value)
      );
    return okStatus && okSearch;
  });
});

// Handle Status Change
const handleStatusChange = async (newStatus: OrderStatus) => {
  if (!selectedOrder.value) return;

  updatingStatus.value = true;
  try {
    let updatedOrder: Order;

    if (newStatus === "paid") {
      updatedOrder = await markOrderAsPaid(
        selectedOrder.value.id || selectedOrder.value._id || ""
      );
    } else if (newStatus === "shipped") {
      updatedOrder = await markOrderAsShipped(
        selectedOrder.value.id || selectedOrder.value._id || ""
      );
    } else if (newStatus === "delivered") {
      updatedOrder = await markOrderAsDelivered(
        selectedOrder.value.id || selectedOrder.value._id || ""
      );
    } else {
      throw new Error("وضعیت نامعتبر");
    }

    selectedOrder.value = updatedOrder;
    const idx = orders.value.findIndex(
      (o) => (o.id || o._id) === (updatedOrder.id || updatedOrder._id)
    );
    if (idx >= 0) orders.value[idx] = updatedOrder;
  } catch (err: any) {
    console.error("خطا در تغییر وضعیت:", err);
    feedback.error("تغییر وضعیت انجام نشد", "وضعیت سفارش با مشکل مواجه شد.");
  } finally {
    updatingStatus.value = false;
  }
};

// Handle Refund
const handleRefund = async () => {
  if (!selectedOrder.value) return;
  if (!confirm("آیا از بازپرداخت این سفارش اطمینان دارید؟")) return;

  updatingStatus.value = true;
  try {
    const refundedOrder = await refundOrder(
      selectedOrder.value.id || selectedOrder.value._id || ""
    );
    selectedOrder.value = refundedOrder;
    const idx = orders.value.findIndex(
      (o) => (o.id || o._id) === (refundedOrder.id || refundedOrder._id)
    );
    if (idx >= 0) orders.value[idx] = refundedOrder;
  } catch (err: any) {
    console.error("خطا در بازپرداخت:", err);
    feedback.error("بازپرداخت انجام نشد", "بازپرداخت سفارش با مشکل مواجه شد.");
  } finally {
    updatingStatus.value = false;
  }
};

// Toggle Filters
function toggleFilters() {
  showFilters.value = !showFilters.value;
}

// Clear Filters
function clearFilters() {
  statusFilter.value = "";
  searchQuery.value = "";
}

// Helper Functions
function truncate(text: string, length: number) {
  return text.length > length ? text.substring(0, length) + "..." : text;
}

function truncateId(id: string | undefined) {
  return id ? id.slice(-6) : "-";
}

function formatDate(date?: string) {
  if (!date) return "-";
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function numberFormat(n?: number) {
  if (typeof n !== "number") return "-";
  return n.toLocaleString("fa-IR");
}

// On Mount
onMounted(fetchOrders);
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  background: white;
  border-radius: var(--radius-field);
  padding: 0;
}

/* Header Section */
.header-section {
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.filter-controls {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 16px;
}

.filter-panel {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  background: #f8fafc;
  padding: 12px;
  border-radius: var(--radius-compact-list-item);
  border: 1px solid #e5e7eb;
}

.filter-panel select {
  border: 1px solid #e5e7eb;
  border-radius: var(--radius-compact-list-item);
  padding: 6px 10px;
  background: #fff;
  font-size: 13px;
  font-family: inherit;
  direction: rtl;
}

/* States */
.state {
  width: 100%;
  padding: 40px 20px;
  text-align: center;
}

.loading .skeleton {
  height: 80px;
  margin: 10px 0;
  border-radius: var(--radius-field);
  background: linear-gradient(90deg, #eee 25%, #f5f5f5 37%, #eee 63%);
  background-size: 400% 100%;
  animation: shimmer 1.2s ease-in-out infinite;
}

@keyframes shimmer {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: 0 0;
  }
}

.state.error {
  color: #ef4444;
}

.state.error small {
  display: block;
  margin: 8px 0 12px;
  color: #9ca3af;
}

.state.empty {
  color: var(--color-text-muted);
}

/* Orders Container */
.orders-container {
  display: flex;
  gap: 20px;
  padding: 20px;
  min-height: 400px;
}

.orders-list {
  flex: 0 0 320px;
  background: #f9fafb;
  border-radius: var(--radius-compact-list-item);
  padding: 12px;
  max-height: 600px;
  overflow-y: auto;
  border: 1px solid #e5e7eb;
}

.order-card {
  padding: 12px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: var(--radius-compact-list-item);
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.order-card:hover {
  border-color: var(--blue-dark);
  background: #f0f4f8;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.order-card.active {
  border-color: var(--blue-dark);
  background: #e8f1ff;
  border-width: 2px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
}

.order-header h3 {
  margin: 0;
  font-size: 14px;
  color: var(--blue-dark);
  flex: 1;
}

.order-description {
  margin: 0 0 6px 0;
  font-size: 13px;
  color: var(--color-text-muted);
}

.order-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #9ca3af;
}

.price {
  font-weight: 600;
  color: var(--blue-dark);
}

/* Order Details */
.order-details {
  flex: 1;
  background: white;
  border-radius: var(--radius-compact-list-item);
  border: 1px solid #e5e7eb;
  padding: 20px;
  max-height: 600px;
  overflow-y: auto;
}

.empty-details {
  text-align: center;
  padding: 60px 20px;
  color: #9ca3af;
}



.details-header {
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 16px;
  margin-bottom: 20px;
}

.details-header h2 {
  margin: 0 0 10px 0;
  font-size: 18px;
  color: var(--blue-dark);
}

.order-badges {
  display: flex;
  gap: 8px;
}

.details-section {
  margin-bottom: 20px;
}

.details-section h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: var(--blue-dark);
  font-weight: 600;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 13px;
}

.item-name {
  flex: 1;
  color: var(--blue-dark);
  font-weight: 500;
}

.item-quantity {
  color: var(--color-text-muted);
  margin: 0 10px;
}

.item-price {
  font-weight: 600;
  color: #065f46;
  white-space: nowrap;
}

.no-items {
  color: #9ca3af;
  margin: 0;
  padding: 10px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item .label {
  font-size: 12px;
  color: var(--color-text-muted);
  font-weight: 600;
}

.info-item .value {
  font-size: 13px;
  color: var(--color-text-body);
  word-break: break-all;
}

.address-section,
.notes-section {
  padding: 12px;
  background: #f9fafb;
  border-radius: 4px;
  margin-top: 12px;
}

.address-section .label,
.notes-section .label {
  display: block;
  font-size: 12px;
  color: var(--color-text-muted);
  font-weight: 600;
  margin-bottom: 6px;
}

.address-text,
.notes-text {
  margin: 0;
  font-size: 13px;
  color: var(--color-text-body);
  line-height: var(--line-height-body);
}

/* Actions Section */
.actions-section {
  border-top: 2px solid #e5e7eb;
  padding-top: 16px;
}

.actions-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* Responsive */
@media (max-width: 1023px) {
  .orders-container {
    gap: 16px;
  }

  .orders-list {
    flex: 0 0 min(32vw, 280px);
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 767px) {
  .orders-container {
    flex-direction: column;
  }

  .orders-list {
    flex: 1;
    max-height: 300px;
  }

  .order-details {
    max-height: none;
  }

  .filter-controls {
    flex-direction: column;
    gap: 10px;
  }

  .actions-buttons {
    flex-direction: column;
  }

}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<style scoped>
.container {
  width: 85%;
  margin: 20px auto;
  background-color: #fff;
  border-radius: var(--radius-field);
  padding: 20px;
}
.title h2 {
  font-family: var(--font-yekan);
  font-weight: 700;
  color: var(--blue-dark);
  font-size: 24px;
}
.header {
  margin: 10px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
.header ul {
  padding: 10px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
}
.header ul li {
  font-family: var(--font-num);
  font-weight: 400;
  font-size: 12px;
  flex: 1 1 0;
  text-align: center;
  padding: 0 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.header ul li:first-child {
  flex: 0.5 1 0;
  min-width: 32px;
  max-width: 40px;
  padding: 0 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.transactions {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.transaction {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  text-align: center;
  padding: 20px;
  box-sizing: border-box;
}
.transaction > div {
  flex: 1 1 0;
  text-align: center;
  padding: 0 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.transaction > .num {
  flex: 0.5 1 0;
  min-width: 32px;
  max-width: 40px;
  padding: 0 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.transaction:hover {
  background-color: var(--blue-sky);
  transition: 0.5s;
  cursor: pointer;
}
.transaction * {
  font-family: var(--font-num);
  font-weight: 500;
  color: var(--blue-dark);
  font-size: 12px;
}
.transaction .name {
  font-family: var(--font-yekan);
  font-weight: 700;
  font-size: 12px;
}
.transaction .id {
  font-family: var(--font-num);
  font-weight: 700;
  font-size: 12px;
}

.transaction .status {
  color: var(--green-number);
  background-color: rgba(0, 186, 0, 0.2);
  padding: 4px;
  border-radius: var(--radius-compact-list-item);
  font-family: var(--font-num);
  font-weight: 400;
  font-size: 10px;
}
@media (max-width: 767px) {
  .container {
    width: 100%;
    padding: 10px 10px;
    overflow-x: auto;
  }
  .header {
    min-width: 420px;
    margin: auto;
  }
  .header ul {
    padding: 6px 2px;
    gap: 2px;
  }
  .header ul li {
    font-family: var(--font-num);
    font-weight: 400;
    font-size: 9px;
    padding: 0 1px;
    margin: 0 1px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .transactions {
    width: 100%;
    min-width: 420px;
  }
  .transaction {
    padding: 8px 2px;
    gap: 2px;
  }

  .transaction * {
    font-size: 8px !important;
  }

  .transaction > div {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .transaction > .num {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .see-more {
    font-size: 12px;
    padding: 6px 0;
    display: block;
    margin: 8px auto 0 auto;
    width: max-content;
  }
  .transaction .status {
    font-size: 7px !important;
    padding: 3px !important;
  }
}
</style>
