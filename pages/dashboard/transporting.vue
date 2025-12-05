<template>
  <NuxtLayout name="dashboard">
    <div class="container" dir="rtl">
      <div class="title">
        <h1>حمل و نقل</h1>
        <img src="/icons/orders.png" alt="transporting" />
      </div>
    </div>

    <div class="space-y-4" dir="rtl">
      <div
        class="actions flex justify-between items-center mb-4 bg-white rounded-lg py-2">
        <SearchBar v-model="search" :dark="true" />
        <button
          v-if="canCreate"
          @click="openModal()"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm">
          + افزودن
        </button>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100">
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
                v-for="(transporting, idx) in filteredTransportings"
                :key="transporting._id || idx"
                class="hover:bg-gray-50 border-b border-gray-100">
                <td class="px-4 py-3 font-medium text-gray-800 ltr">
                  {{ transporting.orderId?.substring(0, 8) || "—" }}
                </td>
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
                  <select
                    v-if="canUpdate"
                    :value="transporting.status"
                    @change="(e) => updateStatus(transporting, (e.target as HTMLSelectElement).value as any)"
                    class="px-2 py-1 rounded text-xs border border-gray-300"
                    :class="statusClass(transporting.status)"
                    :disabled="statusLoading[transporting._id || '']">
                    <option value="pending">درحال‌انتظار</option>
                    <option value="in_transit">درحال‌حمل</option>
                    <option value="delivered">تحویل‌شده</option>
                    <option value="cancelled">لغو‌شده</option>
                  </select>
                  <span
                    v-else
                    class="px-2 py-1 rounded text-xs"
                    :class="statusClass(transporting.status)">
                    {{ statusText(transporting.status) }}
                  </span>
                </td>
                <td class="px-4 py-3 flex gap-2">
                  <button
                    v-if="canUpdate && statusLoading[transporting._id || '']"
                    disabled
                    class="px-2 py-1 rounded text-xs bg-gray-300 text-gray-600 cursor-not-allowed">
                    درحال‌بروزرسانی...
                  </button>
                  <button
                    v-if="canUpdate && !statusLoading[transporting._id || '']"
                    @click="openModal(transporting)"
                    class="px-2 py-1 rounded text-xs bg-yellow-400 text-gray-800 hover:bg-yellow-500 transition">
                    ویرایش
                  </button>
                  <button
                    v-if="canDelete"
                    @click="deleteTransporting(transporting)"
                    class="px-2 py-1 rounded text-xs bg-red-500 text-white hover:bg-red-600 transition">
                    حذف
                  </button>
                </td>
              </tr>
              <tr v-if="filteredTransportings.length === 0">
                <td colspan="6" class="text-center px-4 py-6 text-gray-500">
                  رکوردی یافت نشد
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal -->
      <BaseModal v-if="showModal" @close="closeModal">
        <h2 class="text-xl font-bold mb-6 text-gray-800">
          {{ editMode ? "ویرایش حمل‌ونقل" : "افزودن حمل‌ونقل جدید" }}
        </h2>

        <form class="space-y-5" @submit.prevent="saveTransporting">
          <!-- Order ID -->
          <div>
            <label class="block text-sm font-medium mb-1">شناسه سفارش</label>
            <input
              v-model="form.orderId"
              type="text"
              :disabled="editMode"
              placeholder="شناسه سفارش"
              class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              required />
          </div>

          <!-- Delivery Address -->
          <div>
            <label class="block text-sm font-medium mb-1">آدرس تحویل</label>
            <textarea
              v-model="form.deliveryAddress"
              placeholder="آدرس تحویل کامل"
              class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              required></textarea>
          </div>

          <!-- Cost -->
          <div>
            <label class="block text-sm font-medium mb-1">مبلغ</label>
            <input
              v-model.number="form.cost"
              type="number"
              placeholder="0"
              class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required />
          </div>

          <!-- Status -->
          <div>
            <label class="block text-sm font-medium mb-1">وضعیت</label>
            <select
              v-model="form.status"
              class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="pending">درحال‌انتظار</option>
              <option value="in_transit">درحال‌حمل</option>
              <option value="delivered">تحویل‌شده</option>
              <option value="cancelled">لغو‌شده</option>
            </select>
          </div>

          <!-- Buttons -->
          <div class="flex justify-end gap-2 pt-4">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 rounded border border-gray-200 bg-white hover:bg-gray-100 text-sm">
              انصراف
            </button>
            <button
              type="submit"
              class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm">
              ذخیره
            </button>
          </div>
        </form>
      </BaseModal>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useAccess } from "~/composables/useAccess";
import { Resource } from "~/types/permissions";
import dashboardAuth from "~/middleware/dashboard-auth";

useHead({
  title: " آریاساخت | داشبورد | حمل و نقل",
});

definePageMeta({
  middleware: dashboardAuth,
});

type Transporting = {
  _id?: string;
  orderId: string;
  deliveryAddress: string;
  cost: number;
  status: "pending" | "in_transit" | "delivered" | "cancelled";
  createdAt?: string;
};

const { canCreate, canRead, canUpdate, canDelete } = useAccess(
  Resource.TRANSPORTING
);

const { $axios } = useNuxtApp();

const transportings = ref<Transporting[]>([]);
const search = ref("");
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

function statusText(status: string) {
  const statusMap: Record<string, string> = {
    pending: "درحال‌انتظار",
    in_transit: "درحال‌حمل",
    delivered: "تحویل‌شده",
    cancelled: "لغو‌شده",
  };
  return statusMap[status] || status;
}

function statusClass(status: string) {
  const classMap: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    in_transit: "bg-blue-100 text-blue-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return classMap[status] || "bg-gray-100 text-gray-800";
}

function formatDate(dateString?: string) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("fa-IR");
}

function numberFormat(n?: number) {
  if (typeof n !== "number") return "-";
  return n.toLocaleString("fa-IR");
}

const filteredTransportings = computed(() =>
  transportings.value.filter(
    (t) =>
      t.orderId.toLowerCase().includes(search.value.toLowerCase()) ||
      t.deliveryAddress.toLowerCase().includes(search.value.toLowerCase())
  )
);

async function fetchTransportings() {
  if (!canRead) return;
  try {
    const { data } = await $axios.get("/transportings");
    transportings.value = Array.isArray(data) ? data : data?.items || [];
  } catch (err) {
    console.error("خطا در دریافت حمل‌ونقل‌ها:", err);
    transportings.value = [];
  }
}

async function updateStatus(
  transporting: Transporting,
  newStatus: "pending" | "in_transit" | "delivered" | "cancelled"
) {
  if (!canUpdate) {
    alert("شما اجازه تغییر وضعیت ندارید!");
    return;
  }

  if (!transporting._id) return;

  if (!confirm("آیا از تغییر وضعیت این حمل‌ونقل مطمئن هستید؟")) return;

  try {
    statusLoading.value[transporting._id] = true;
    // Use the appropriate endpoint based on the status
    if (newStatus === "delivered") {
      await $axios.patch(`/transportings/${transporting._id}/delivered`);
    } else if (newStatus === "cancelled") {
      await $axios.patch(`/transportings/${transporting._id}/cancel`);
    } else {
      // For other statuses, try a generic update endpoint (adjust based on API)
      await $axios.patch(`/transportings/${transporting._id}`, {
        status: newStatus,
      });
    }
    transporting.status = newStatus;
  } catch (err: any) {
    console.error("خطا در تغییر وضعیت:", err);
    alert("خطا در تغییر وضعیت. دوباره تلاش کنید.");
  } finally {
    if (transporting._id) statusLoading.value[transporting._id] = false;
  }
}

function openModal(transporting: Transporting | null = null) {
  if (transporting) {
    if (!canUpdate) return alert("شما اجازه ویرایش ندارید!");
    editMode.value = true;
    selectedId.value = transporting._id || null;
    form.value = { ...transporting };
  } else {
    if (!canCreate) return alert("شما اجازه ایجاد ندارید!");
    editMode.value = false;
    selectedId.value = null;
    form.value = {
      orderId: "",
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
        alert("شناسه حمل‌ونقل معتبر نیست!");
        return;
      }
      await $axios.patch(`/transportings/${selectedId.value}`, form.value);
    } else {
      await $axios.post("/transportings", form.value);
    }
    await fetchTransportings();
    closeModal();
  } catch (err: any) {
    console.error("خطا در ذخیره حمل‌ونقل:", err);
    alert(err?.response?.data?.message || "خطا در ذخیره");
  }
}

async function deleteTransporting(transporting: Transporting) {
  if (!canDelete) return alert("شما اجازه حذف ندارید!");
  if (!confirm("آیا از حذف این حمل‌ونقل مطمئن هستید؟")) return;

  try {
    await $axios.delete(`/transportings/${transporting._id}`);
    await fetchTransportings();
  } catch (err: any) {
    console.error("خطا در حذف حمل‌ونقل:", err);
    alert(err?.response?.data?.message || "خطا در حذف");
  }
}

onMounted(() => {
  fetchTransportings();
});
</script>

<style scoped>
.container {
  width: 90%;
  margin: auto;
}

.title {
  color: var(--blue-dark);
  font-family: "iran-yekan-Bold";
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
