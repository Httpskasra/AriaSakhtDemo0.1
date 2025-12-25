<template>
  <div class="container">
    <!-- Header with Filters -->
    <div class="header-section">
      <div class="filter-controls">
        <button type="button" @click="toggleFilters" class="filter-btn">
          <span>فیلتر</span>
        </button>
        <div class="search-box">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="جستجو بر اساس شناسه یا محصول..."
            class="search-input" />
        </div>
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

          <button class="filter-clear" @click="clearFilters">
            حذف فیلترها
          </button>
        </div>
      </transition>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="state loading">
      <div class="skeleton" v-for="i in 4" :key="i"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="errorMsg" class="state error">
      <p>خطا در دریافت سفارش‌ها</p>
      <small>{{ errorMsg }}</small>
      <button class="retry" @click="fetchOrders">تلاش مجدد</button>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredOrders.length === 0" class="state empty">
      <p>سفارشی پیدا نشد.</p>
      <small>فیلترها یا جستجو را تغییر دهید.</small>
    </div>

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
            <span class="status-badge" :class="`status-${order.status}`">
              {{ getStatusLabel(order.status) }}
            </span>
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
              <span
                class="status-badge"
                :class="`status-${selectedOrder.status}`">
                {{ getStatusLabel(selectedOrder.status) }}
              </span>
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
                  getStatusLabel(selectedOrder.status)
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
              <div class="info-item" v-if="selectedOrder.trackingCode">
                <span class="label">کد پیگیری:</span>
                <span class="value">{{ selectedOrder.trackingCode }}</span>
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
              <button
                v-if="selectedOrder.status === 'pending'"
                @click="handleStatusChange('paid')"
                :disabled="updatingStatus"
                class="btn-action btn-paid">
                {{
                  updatingStatus ? "درحال انجام..." : "علامت‌گذاری پرداخت شده"
                }}
              </button>

              <button
                v-if="selectedOrder.status === 'paid'"
                @click="handleStatusChange('shipped')"
                :disabled="updatingStatus"
                class="btn-action btn-shipped">
                {{
                  updatingStatus ? "درحال انجام..." : "علامت‌گذاری ارسال شده"
                }}
              </button>

              <button
                v-if="selectedOrder.status === 'shipped'"
                @click="handleStatusChange('delivered')"
                :disabled="updatingStatus"
                class="btn-action btn-delivered">
                {{
                  updatingStatus ? "درحال انجام..." : "علامت‌گذاری تحویل شده"
                }}
              </button>

              <button
                v-if="['pending', 'paid'].includes(selectedOrder.status)"
                @click="handleStatusChange('cancelled')"
                :disabled="updatingStatus"
                class="btn-action btn-cancel">
                {{ updatingStatus ? "درحال انجام..." : "لغو سفارش" }}
              </button>

              <button
                v-if="['paid', 'shipped'].includes(selectedOrder.status)"
                @click="handleRefund"
                :disabled="updatingStatus"
                class="btn-action btn-refund">
                {{ updatingStatus ? "درحال انجام..." : "بازپرداخت" }}
              </button>
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
import { ref, computed } from "vue";
import type { Order, OrderStatus } from "@/services/orderService";
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
    alert("خطا در تغییر وضعیت سفارش");
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
    alert("خطا در بازپرداخت سفارش");
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
  border-radius: 8px;
  padding: 0;
}

/* Header Section */
.header-section {
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.filter-controls {
  display: flex;
  gap: 15px;
  align-items: center;
  margin-bottom: 15px;
}

.filter-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  padding: 8px 16px;
  background: #fff;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.filter-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
  border-color: var(--blue-dark);
}

.search-box {
  flex: 1;
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 13px;
  font-family: inherit;
  direction: rtl;
}

.search-input:focus {
  outline: none;
  border-color: var(--blue-dark);
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
}

.filter-panel {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  background: #f8fafc;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.filter-panel select {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 6px 10px;
  background: #fff;
  font-size: 13px;
  font-family: inherit;
  direction: rtl;
}

.filter-clear {
  background: transparent;
  color: #ef4444;
  border: 0;
  cursor: pointer;
  padding: 6px 10px;
  font-size: 13px;
  transition: color 0.2s;
}

.filter-clear:hover {
  color: #dc2626;
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
  border-radius: 8px;
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

.state.error .retry {
  background: var(--blue-dark);
  color: #fff;
  border-radius: 6px;
  padding: 8px 16px;
  border: 0;
  cursor: pointer;
  font-size: 13px;
  transition: background-color 0.2s;
}

.state.error .retry:hover {
  background-color: #1565c0;
}

.state.empty {
  color: #6b7280;
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
  border-radius: 6px;
  padding: 12px;
  max-height: 600px;
  overflow-y: auto;
  border: 1px solid #e5e7eb;
}

.order-card {
  padding: 12px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
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

.status-badge {
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: bold;
  white-space: nowrap;
  margin-right: 0;
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

.order-description {
  margin: 0 0 6px 0;
  font-size: 13px;
  color: #6b7280;
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
  border-radius: 6px;
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

.details-content {
}

.details-header {
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 15px;
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
  color: #6b7280;
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
  color: #6b7280;
  font-weight: 600;
}

.info-item .value {
  font-size: 13px;
  color: #374151;
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
  color: #6b7280;
  font-weight: 600;
  margin-bottom: 6px;
}

.address-text,
.notes-text {
  margin: 0;
  font-size: 13px;
  color: #374151;
  line-height: 1.5;
}

/* Actions Section */
.actions-section {
  border-top: 2px solid #e5e7eb;
  padding-top: 15px;
}

.actions-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.btn-action {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  font-family: inherit;
  transition: all 0.2s;
  flex: 1;
  min-width: 150px;
}

.btn-paid {
  background-color: #bfdbfe;
  color: #1e40af;
}

.btn-paid:hover:not(:disabled) {
  background-color: #93c5fd;
}

.btn-shipped {
  background-color: #fed7aa;
  color: #92400e;
}

.btn-shipped:hover:not(:disabled) {
  background-color: #fdba74;
}

.btn-delivered {
  background-color: #dcfce7;
  color: #166534;
}

.btn-delivered:hover:not(:disabled) {
  background-color: #bbf7d0;
}

.btn-cancel {
  background-color: #f3f4f6;
  color: #374151;
}

.btn-cancel:hover:not(:disabled) {
  background-color: #e5e7eb;
}

.btn-refund {
  background-color: #fecaca;
  color: #7f1d1d;
}

.btn-refund:hover:not(:disabled) {
  background-color: #fca5a5;
}

.btn-action:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 1024px) {
  .orders-container {
    gap: 15px;
  }

  .orders-list {
    flex: 0 0 280px;
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

  .search-box {
    width: 100%;
  }

  .actions-buttons {
    flex-direction: column;
  }

  .btn-action {
    min-width: unset;
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
  border-radius: 8px;
  padding: 20px;
}
.title h2 {
  font-family: "iran-yekan-Bold";
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
  font-family: "iran-yekan-num-Regular";
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
  font-family: "iran-yekan-num-Medium";
  color: var(--blue-dark);
  font-size: 12px;
}
.transaction .name {
  font-family: "iran-yekan-Bold";
  font-size: 12px;
}
.transaction .id {
  font-family: "iran-yekan-num-Bold";
  font-size: 12px;
}

.transaction .status {
  color: var(--green-number);
  background-color: rgba(0, 186, 0, 0.2);
  padding: 5px;
  border-radius: 6px;
  font-family: "iran-yekan-num-Regular";
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
    font-family: "iran-yekan-num-Regular";
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
