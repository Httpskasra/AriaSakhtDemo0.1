<template>
  <NuxtLayout name="dashboard">
    <div class="container" dir="rtl">
      <div class="title">
        <h1>حمل و نقل</h1>
        <img src="/icons/orders.png" alt="transporting" />
      </div>
    </div>

    <div class="space-y-4" dir="rtl">
      <!-- Orders List (Step 1) -->
      <div v-if="!selectedOrder" class="space-y-4">
        <div
          class="actions flex justify-between items-center mb-4 bg-white rounded-field py-2">
          <div class="flex items-center gap-2">
            <TableFilterInput
              v-model="searchOrders"
              placeholder="جستجوی سفارش..."
              @submit="applyOrderFilters" />
            <USelect
              v-model="sortOrders"
              :items="[
                { label: 'جدیدترین', value: 'createdAt:desc' },
                { label: 'قدیمی‌ترین', value: 'createdAt:asc' }
              ]" />
            <USelect
              v-model="limitOrders"
              :items="[
                { label: '۱۰', value: 10 },
                { label: '۲۵', value: 25 },
                { label: '۵۰', value: 50 }
              ]" />
          </div>
        </div>

        <div class="premium-card border border-gray-100">
          <div class="overflow-x-auto">
            <table class="min-w-full text-sm">
              <thead>
                <tr class="bg-gray-50 text-gray-600">
                  <th
                    class="text-right font-medium px-4 py-3 border-b border-gray-100">
                    شناسه سفارش
                  </th>
                  <th
                    class="text-right font-medium px-4 py-3 border-b border-gray-100">
                    تاریخ
                  </th>
                  <th
                    class="text-right font-medium px-4 py-3 border-b border-gray-100">
                    مبلغ کل
                  </th>
                  <th
                    class="text-right font-medium px-4 py-3 border-b border-gray-100">
                    وضعیت
                  </th>
                  <th
                    class="text-right font-medium px-4 py-3 border-b border-gray-100">
                    عملیات
                  </th>
                </tr>
              </thead>
              <tbody class="text-gray-800">
                <tr
                v-for="(order, idx) in orders"
                  :key="order._id || idx"
                  class="hover:bg-gray-50 border-b border-gray-100">
                  <td class="px-4 py-3 font-medium text-gray-800 ltr">
                    {{ order._id?.substring(0, 8) || "—" }}
                  </td>
                  <td class="px-4 py-3 text-gray-700">
                    {{ formatDate(order.createdAt) }}
                  </td>
                  <td class="px-4 py-3">
                    {{ numberFormat(order.totalAmount) }}
                  </td>
                  <td class="px-4 py-3">
                    <span
                      class="px-2 py-1 rounded text-xs"
                      :style="useStatusStyle(order.status)">
                      {{ orderStatusText(order.status) }}
                    </span>
                  </td>
                  <td class="px-4 py-3">
                    <UButton
                      @click="selectOrder(order)"
                      size="xs">
                      مشاهده حمل‌ونقل
                    </UButton>
                  </td>
                </tr>
                <tr v-if="orders.length === 0">
                  <td colspan="5" class="text-center px-4 py-6 text-gray-500">
                    سفارشی یافت نشد
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div v-if="totalOrders > limitOrders" class="flex justify-center py-4">
          <UPagination v-model="pageOrders" :total="totalOrders" :page-count="limitOrders" :disabled="loading" />
        </div>
      </div>

      <!-- Transportings for Selected Order (Step 2) -->
      <div v-else class="space-y-4">
        <div class="flex items-center gap-3 mb-4">
          <UButton
            @click="selectedOrder = null"
            color="neutral"
            variant="soft">
            ← بازگشت به سفارش‌ها
          </UButton>
          <span class="text-sm font-medium">
            سفارش: {{ selectedOrder._id?.substring(0, 8) }}
          </span>
        </div>

        <div
          class="actions flex justify-between items-center mb-4 bg-white rounded-field py-2">
          <div class="flex items-center gap-2">
            <TableFilterInput
              v-model="searchTransportings"
              placeholder="جستجوی حمل‌ونقل..."
              @submit="applyTransportFilters" />
            <USelect
              v-model="sortTransportings"
              :items="[
                { label: 'جدیدترین', value: 'createdAt:desc' },
                { label: 'قدیمی‌ترین', value: 'createdAt:asc' }
              ]" />
            <USelect
              v-model="limitTransportings"
              :items="[
                { label: '۱۰', value: 10 },
                { label: '۲۵', value: 25 },
                { label: '۵۰', value: 50 }
              ]" />
          </div>
          <UButton
            v-if="canCreate"
            @click="openModal()">
            + افزودن
          </UButton>
        </div>

        <div class="premium-card border border-gray-100">
          <div class="overflow-x-auto">
            <table class="min-w-full text-sm">
              <thead>
                <tr class="bg-gray-50 text-gray-600">
                  <th
                    class="text-right font-medium px-4 py-3 border-b border-gray-100">
                    تاریخ
                  </th>
                  <th
                    class="text-right font-medium px-4 py-3 border-b border-gray-100">
                    آدرس تحویل
                  </th>
                  <th
                    class="text-right font-medium px-4 py-3 border-b border-gray-100">
                    مبلغ
                  </th>
                  <th
                    class="text-right font-medium px-4 py-3 border-b border-gray-100">
                    وضعیت
                  </th>
                  <th
                    class="text-right font-medium px-4 py-3 border-b border-gray-100 w-40">
                    عملیات
                  </th>
                </tr>
              </thead>
              <tbody class="text-gray-800">
                <tr
                v-for="(transporting, idx) in transportings"
                  :key="transporting._id || idx"
                  class="hover:bg-gray-50 border-b border-gray-100">
                  <td class="px-4 py-3 text-gray-700">
                    {{ formatDate(transporting.createdAt) }}
                  </td>
                  <td class="px-4 py-3 text-gray-700 truncate max-w-[200px]">
                    {{ transporting.deliveryAddress || "—" }}
                  </td>
                  <td class="px-4 py-3">
                    {{ numberFormat(transporting.cost) }}
                  </td>
                  <td class="px-4 py-3">
                    <USelect
                      v-if="canUpdate"
                      :model-value="transporting.status"
                      size="xs"
                      :items="[
                        { label: 'درحال‌انتظار', value: 'pending' },
                        { label: 'درحال‌حمل', value: 'shipped' },
                        { label: 'تحویل‌شده', value: 'delivered' },
                        { label: 'لغو‌شده', value: 'canceled' }
                      ]"
                      :disabled="statusLoading[transporting._id || '']"
                      @update:model-value="(value) => updateStatus(transporting, value as any)" />
                    <span
                      v-else
                      class="px-2 py-1 rounded text-xs"
                      :style="useStatusStyle(transporting.status)">
                      {{ statusText(transporting.status) }}
                    </span>
                  </td>
                  <td class="px-4 py-3 flex gap-2">
                    <UButton
                      v-if="canUpdate && statusLoading[transporting._id || '']"
                      disabled
                      size="xs"
                      color="neutral"
                      variant="soft">
                      درحال‌بروزرسانی...
                    </UButton>
                    <UButton
                      v-if="canUpdate && !statusLoading[transporting._id || '']"
                      @click="openModal(transporting)"
                      size="xs"
                      color="warning"
                      variant="soft">
                      ویرایش
                    </UButton>
                    <UButton
                      v-if="canDelete"
                      @click="deleteTransporting(transporting)"
                      size="xs"
                      color="error">
                      حذف
                    </UButton>
                  </td>
                </tr>
                <tr v-if="transportings.length === 0">
                  <td colspan="5" class="text-center px-4 py-6 text-gray-500">
                    حمل‌ونقلی برای این سفارش یافت نشد
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div v-if="totalTransportings > limitTransportings" class="flex justify-center py-4">
          <UPagination v-model="pageTransportings" :total="totalTransportings" :page-count="limitTransportings" :disabled="loading" />
        </div>
      </div>

      <!-- Modal -->
      <BaseModal v-if="showModal" @close="closeModal">
        <h2 class="text-xl font-bold mb-6 text-gray-800">
          {{ editMode ? "ویرایش حمل‌ونقل" : "افزودن حمل‌ونقل جدید" }}
        </h2>

        <UForm :state="form" class="space-y-5" @submit.prevent="saveTransporting">
          <!-- Delivery Address -->
          <UFormField label="آدرس تحویل" name="deliveryAddress">
            <UTextarea
              v-model="form.deliveryAddress"
              placeholder="آدرس تحویل کامل"
              :rows="3"
              required />
          </UFormField>

          <!-- Cost -->
          <UFormField label="مبلغ" name="cost">
            <UInput v-model.number="form.cost" type="number" placeholder="0" required />
          </UFormField>

          <!-- Status -->
          <UFormField label="وضعیت" name="status">
            <USelect
              v-model="form.status"
              :items="[
                { label: 'درحال‌انتظار', value: 'pending' },
                { label: 'درحال‌حمل', value: 'shipped' },
                { label: 'تحویل‌شده', value: 'delivered' },
                { label: 'لغو‌شده', value: 'canceled' }
              ]" />
          </UFormField>

          <!-- Buttons -->
          <div class="flex justify-end gap-2 pt-4">
            <UButton
              type="button"
              @click="closeModal"
              color="neutral"
              variant="soft">
              انصراف
            </UButton>
            <UButton type="submit">
              ذخیره
            </UButton>
          </div>
        </UForm>
      </BaseModal>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const feedback = useFeedback();
import { ref, computed, onMounted } from "vue";
import { useAccess } from "~/composables/useAccess";
import { Resource } from "~/types/permissions";
import type { Order } from "~/types/order";
import {
  listTransportOrders,
  listTransportings,
  type Transporting,
} from "~/services/transportService";
import { toUserFacingError } from "~/services/apiClient";

useHead({
  title: "داشبورد | حمل‌ونقل",
});

definePageMeta({
  middleware: ["auth", "permission"],
  permission: { resource: "transporting", action: "r" },
});

// Permissions
const { canCreate, canRead, canUpdate, canDelete } = useAccess(
  Resource.TRANSPORTING
);

const { $axios } = useNuxtApp();

// Orders and Transportings
const orders = ref<Order[]>([]);
const transportings = ref<Transporting[]>([]);
const selectedOrder = ref<Order | null>(null);
const searchOrders = ref("");
const searchTransportings = ref("");
const sortOrders = ref("createdAt:desc");
const sortTransportings = ref("createdAt:desc");
const pageOrders = ref(1);
const pageTransportings = ref(1);
const limitOrders = ref(25);
const limitTransportings = ref(25);
const totalOrders = ref(0);
const totalTransportings = ref(0);
const loading = ref(false);
const showModal = ref(false);
const editMode = ref(false);
const selectedId = ref<string | null>(null);

const form = ref<Transporting>({
  orderId: "",
  deliveryAddress: "",
  cost: 0,
              status: "pending",
});

const statusLoading = ref<Record<string, boolean>>({});

// Helper functions
function statusText(status: string) {
  const statusMap: Record<string, string> = {
    pending: "درحال‌انتظار",
    shipped: "درحال‌حمل",
    delivered: "تحویل‌شده",
    canceled: "لغو‌شده",
  };
  return statusMap[status] || status;
}

function orderStatusText(status: string) {
  const statusMap: Record<string, string> = {
    pending: "درحال‌انتظار",
    paid: "پرداخت‌شده",
    shipped: "ارسال‌شده",
    delivered: "تحویل‌شده",
    cancelled: "لغو‌شده",
  };
  return statusMap[status] || status;
}

function formatDate(dateString?: string) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("fa-IR");
}

function numberFormat(n?: number) {
  if (typeof n !== "number") return "-";
  return n.toLocaleString("fa-IR");
}

// API calls
async function fetchOrders() {
  if (!canRead.value) return;
  loading.value = true;
  try {
    const result = await listTransportOrders({
      page: pageOrders.value,
      limit: limitOrders.value,
      sort: sortOrders.value,
      filter: searchOrders.value.trim() || undefined,
    });
    orders.value = result.items as Order[];
    totalOrders.value = result.total;
  } catch (err) {
    console.error("خطا در دریافت سفارش‌ها:", err);
    feedback.error("دریافت سفارش‌ها انجام نشد", toUserFacingError(err).message);
    orders.value = [];
    totalOrders.value = 0;
  } finally {
    loading.value = false;
  }
}

async function fetchTransportings() {
  if (!canRead.value || !selectedOrder.value) return;
  loading.value = true;
  try {
    const result = await listTransportings({
      page: pageTransportings.value,
      limit: limitTransportings.value,
      sort: sortTransportings.value,
      filter: searchTransportings.value.trim() || undefined,
      orderId: selectedOrder.value._id,
    });
    transportings.value = result.items;
    totalTransportings.value = result.total;
  } catch (err) {
    console.error("خطا در دریافت حمل‌ونقل‌ها:", err);
    feedback.error("دریافت حمل‌ونقل‌ها انجام نشد", toUserFacingError(err).message);
    transportings.value = [];
    totalTransportings.value = 0;
  } finally {
    loading.value = false;
  }
}

function selectOrder(order: Order) {
  selectedOrder.value = order;
  searchTransportings.value = "";
  pageTransportings.value = 1;
  fetchTransportings();
}

const totalOrderPages = computed(() => Math.max(1, Math.ceil(totalOrders.value / limitOrders.value)));
const totalTransportPages = computed(() => Math.max(1, Math.ceil(totalTransportings.value / limitTransportings.value)));

function applyOrderFilters() {
  pageOrders.value = 1;
  fetchOrders();
}

function applyTransportFilters() {
  pageTransportings.value = 1;
  fetchTransportings();
}

function goToOrderPage(nextPage: number) {
  pageOrders.value = Math.max(1, Math.min(nextPage, totalOrderPages.value));
  fetchOrders();
}

function goToTransportPage(nextPage: number) {
  pageTransportings.value = Math.max(1, Math.min(nextPage, totalTransportPages.value));
  fetchTransportings();
}

async function updateStatus(
  transporting: Transporting,
  newStatus: "pending" | "shipped" | "delivered" | "canceled"
) {
  if (!canUpdate.value) {
    feedback.error("دسترسی کافی ندارید", "شما اجازه تغییر وضعیت ندارید.");
    return;
  }

  if (!transporting._id) return;

  if (!confirm("آیا از تغییر وضعیت این حمل‌ونقل مطمئن هستید؟")) return;

  try {
    statusLoading.value[transporting._id] = true;
    if (newStatus === "delivered") {
      await $axios.patch(`/transport/${transporting._id}/delivered`);
    } else if (newStatus === "canceled") {
      await $axios.patch(`/transport/${transporting._id}/cancel`);
    } else {
      await $axios.patch("/transport", {
        id: transporting._id,
        status: newStatus,
      });
    }
    transporting.status = newStatus;
  } catch (err: any) {
    console.error("خطا در تغییر وضعیت:", err);
    feedback.error("تغییر وضعیت انجام نشد", toUserFacingError(err).message);
  } finally {
    if (transporting._id) statusLoading.value[transporting._id] = false;
  }
}

function openModal(transporting: Transporting | null = null) {
  if (!selectedOrder.value) return feedback.error("سفارش انتخاب نشده", "لطفاً ابتدا یک سفارش انتخاب کنید.");

  if (transporting) {
    if (!canUpdate.value) return feedback.error("دسترسی کافی ندارید", "شما اجازه ویرایش ندارید.");
    editMode.value = true;
    selectedId.value = transporting._id || null;
    form.value = { ...transporting };
  } else {
    if (!canCreate.value) return feedback.error("دسترسی کافی ندارید", "شما اجازه ایجاد ندارید.");
    editMode.value = false;
    selectedId.value = null;
    form.value = {
      orderId: selectedOrder.value._id || "",
      deliveryAddress: "",
      cost: 0,
      status: "pending",
    };
  }
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

async function saveTransporting() {
  try {
    if (editMode.value) {
      if (!selectedId.value) {
        feedback.error("شناسه نامعتبر", "شناسه حمل‌ونقل معتبر نیست.");
        return;
      }
      await $axios.patch("/transport", { ...form.value, id: selectedId.value });
    } else {
      await $axios.post("/transport", form.value);
    }
    await fetchTransportings();
    closeModal();
  } catch (err: any) {
    console.error("خطا در ذخیره حمل‌ونقل:", err);
    feedback.error("ذخیره انجام نشد", toUserFacingError(err).message);
  }
}

async function deleteTransporting(transporting: Transporting) {
  if (!canDelete.value) return feedback.error("دسترسی کافی ندارید", "شما اجازه حذف ندارید.");
  if (!confirm("آیا از حذف این حمل‌ونقل مطمئن هستید؟")) return;

  try {
    await $axios.patch(`/transport/${transporting._id}/cancel`);
    await fetchTransportings();
  } catch (err: any) {
    console.error("خطا در حذف حمل‌ونقل:", err);
    feedback.error("حذف انجام نشد", toUserFacingError(err).message);
  }
}

onMounted(() => {
  fetchOrders();
});
</script>

<style scoped>
.container {
  width: 90%;
  margin: auto;
}

.title {
  color: var(--blue-dark);
  font-family: var(--font-yekan);
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 15px 0;
}

.title h1 {
  font-size: 28px;
}

.title img {
  width: 50px;
  height: 50px;
}

.ltr {
  direction: ltr;
}

@media (max-width: 767px) {
  .container {
    width: 95%;
  }

  .title h1 {
    font-size: 18px;
  }

  .title img {
    width: 40px;
    height: 40px;
  }
}
</style>
