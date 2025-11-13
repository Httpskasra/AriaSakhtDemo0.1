<template>
  <NuxtLayout name="dashboard">
    <div class="container">
      <!-- عنوان صفحه -->
      <div class="title">
        <div class="title-left">
          <h1>تراکنش‌ها</h1>
          <p class="subtitle">لیست تراکنش‌های کیف پول شما</p>
        </div>
        <div class="title-right">
          <!-- <button class="refresh-btn" @click="refresh">بروزرسانی لیست</button> -->
        </div>
      </div>

      <!-- فیلتر و سرچ شبیه users -->
      <div class="filter-bar">
        <div class="filter-left">
          <select v-model="typeFilter" class="select">
            <option value="">نوع تراکنش (همه)</option>
            <option value="credit">واریز</option>
            <option value="debit">برداشت</option>
            <option value="transfer">انتقال</option>
          </select>

          <select v-model="statusFilter" class="select">
            <option value="">وضعیت (همه)</option>
            <option value="pending">در انتظار</option>
            <option value="success">موفق</option>
            <option value="failed">ناموفق</option>
          </select>
        </div>

        <div class="filter-right">
          <input
            v-model="search"
            type="text"
            class="search-input"
            placeholder="جستجو در توضیحات، مرجع، شناسه تراکنش ..." />
        </div>
      </div>

      <!-- وضعیت لودینگ / خطا -->
      <div v-if="pending" class="card info-card">
        در حال بارگذاری تراکنش‌ها...
      </div>

      <div v-else-if="error" class="card error-card">
        خطا در دریافت تراکنش‌ها. لطفاً دوباره تلاش کنید.
      </div>

      <!-- جدول تراکنش‌ها -->
      <div v-else class="card table-card" v-if="canRead">
        <table v-if="filteredTransactions.length" class="table">
          <thead>
            <tr>
              <th>#</th>
              <th>نوع</th>
              <th>مبلغ</th>
              <th>تاریخ</th>
              <th>وضعیت</th>
              <th>شناسه مرجع</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(tx, index) in filteredTransactions"
              :key="tx.id || tx._id || tx.transactionId || index">
              <td>{{ index + 1 }}</td>

              <!-- نوع تراکنش -->
              <td>
                <span
                  class="pill"
                  :class="`pill-type-${(tx.type || '').toLowerCase()}`">
                  {{ humanType(tx.type) }}
                </span>
              </td>

              <!-- مبلغ -->
              <td class="amount">
                {{ formatAmount(tx.amount) }}
              </td>

              <!-- تاریخ -->
              <td>
                {{ formatDate(tx.createdAt || tx.date || tx.timestamp) }}
              </td>

              <!-- وضعیت -->
              <td>
                <span
                  class="pill"
                  :class="`pill-status-${(
                    tx.status || 'unknown'
                  ).toLowerCase()}`">
                  {{ humanStatus(tx.status) }}
                </span>
              </td>

              <!-- مرجع -->
              <td class="ref">
                {{ tx.reference || tx.orderId || tx.trackId || "-" }}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- وقتی لیست خالی است -->
        <div v-else class="empty-state">
          <p>هیچ تراکنشی برای نمایش وجود ندارد.</p>
        </div>
      </div>
      <div v-else>شما اجازه دسترسی ندارید</div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { Resource } from "~/types/permissions";
const { canRead } = useAccess(Resource.TRANSACTION);
/**
 * گرفتن دیتای تراکنش‌ها از API طبق Swagger:
 * GET /api/transaction  →  array of Transaction
 */
const data = ref<any[]>([]);
const pending = ref(false);
const error = ref<any>(null);

const search = ref("");
const typeFilter = ref("");
const statusFilter = ref("");

// تابع برای دریافت تراکنش‌ها
const fetchTransactions = async () => {
  pending.value = true;
  error.value = null;
  try {
    const { $axios } = useNuxtApp();
    const response = await $axios.get("/api/transaction");
    data.value = response.data || [];
  } catch (err) {
    error.value = err;
    console.error("Error fetching transactions:", err);
  } finally {
    pending.value = false;
  }
};

// تابع بروزرسانی


// در هنگام mount، داده‌ها را دریافت کن
onMounted(() => {
  fetchTransactions();
});

const transactions = computed(() => data.value || []);

// فیلتر نهایی (سرچ + نوع + وضعیت)
const filteredTransactions = computed(() => {
  return transactions.value.filter((tx: any) => {
    if (!tx) return false;

    // فیلتر نوع
    if (
      typeFilter.value &&
      (tx.type || "").toLowerCase() !== typeFilter.value.toLowerCase()
    ) {
      return false;
    }

    // فیلتر وضعیت
    if (
      statusFilter.value &&
      (tx.status || "").toLowerCase() !== statusFilter.value.toLowerCase()
    ) {
      return false;
    }

    // فیلتر سرچ
    if (!search.value) return true;

    const haystack = [
      tx.type,
      tx.status,
      tx.reference,
      tx.orderId,
      tx.description,
      tx.transactionId,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(search.value.toLowerCase());
  });
});

// نمایش قشنگ نوع تراکنش
const humanType = (value: any) => {
  const v = String(value || "").toLowerCase();
  if (v === "credit") return "واریز";
  if (v === "debit") return "برداشت";
  if (v === "transfer") return "انتقال";
  return value || "نامشخص";
};

// نمایش قشنگ وضعیت
const humanStatus = (value: any) => {
  const v = String(value || "").toLowerCase();
  if (v === "pending") return "در انتظار";
  if (v === "success" || v === "completed") return "موفق";
  if (v === "failed" || v === "error") return "ناموفق";
  return value || "نامشخص";
};

// فرمت مبلغ
const formatAmount = (amount: any) => {
  if (amount == null) return "-";
  const num = Number(amount);
  if (Number.isNaN(num)) return amount;
  try {
    return new Intl.NumberFormat("fa-IR", {
      style: "currency",
      currency: "IRR",
      maximumFractionDigits: 0,
    }).format(num);
  } catch {
    return num.toLocaleString("fa-IR") + " ریال";
  }
};

// فرمت تاریخ
const formatDate = (value: any) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("fa-IR");
};
</script>

<style scoped>
.container {
  padding: 1.5rem;
}

/* عنوان صفحه (مثل users / tickets) */
.title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.title-left h1 {
  font-size: 1.4rem;
  font-weight: 700;
}

.subtitle {
  margin-top: 0.25rem;
  font-size: 0.85rem;
  color: #6b7280;
}

.title-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* نوار فیلتر و سرچ */
.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.filter-left {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

/* کارت‌ها */
.card {
  background: white;
  border-radius: 0.75rem;
  padding: 1rem 1.25rem;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
  font-size: 0.9rem;
}

.info-card {
  color: #4b5563;
}

.error-card {
  color: #b91c1c;
  border: 1px solid #fecaca;
}

.table-card {
  padding: 0;
  overflow: hidden;
}

/* جدول */
.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 0.75rem 1rem;
  text-align: right;
  font-size: 0.85rem;
}

.table thead {
  background: #f9fafb;
}

.table tbody tr:nth-child(even) {
  background: #f9fafb;
}

.table tbody tr:hover {
  background: #eff6ff;
}

/* ورودی‌ها */
.search-input {
  width: 100%;
  max-width: 260px;
  border-radius: 999px;
  border: 1px solid #d1d5db;
  padding: 0.45rem 0.9rem;
  font-size: 0.85rem;
}

.select {
  border-radius: 999px;
  border: 1px solid #d1d5db;
  padding: 0.35rem 0.9rem;
  font-size: 0.8rem;
  background: #ffffff;
}

/* دکمه بروزرسانی */
.refresh-btn {
  border-radius: 999px;
  border: none;
  padding: 0.45rem 1rem;
  font-size: 0.85rem;
  cursor: pointer;
  background: #2563eb;
  color: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.refresh-btn:hover {
  background: #1d4ed8;
}

/* چپس وضعیت/نوع */
.pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.15rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
}

/* نوع‌ها */
.pill-type-credit {
  background: #dcfce7;
  color: #166534;
}

.pill-type-debit {
  background: #fee2e2;
  color: #b91c1c;
}

.pill-type-transfer {
  background: #e0f2fe;
  color: #075985;
}

/* وضعیت‌ها */
.pill-status-success {
  background: #dcfce7;
  color: #15803d;
}

.pill-status-completed {
  background: #dcfce7;
  color: #15803d;
}

.pill-status-pending {
  background: #fef9c3;
  color: #854d0e;
}

.pill-status-failed,
.pill-status-error {
  background: #fee2e2;
  color: #b91c1c;
}

.pill-status-unknown {
  background: #e5e7eb;
  color: #374151;
}

/* مبلغ و مرجع */
.amount {
  direction: ltr;
  font-family: inherit;
}

.ref {
  font-family: monospace;
  font-size: 0.8rem;
}

/* خالی بودن لیست */
.empty-state {
  padding: 1.25rem;
  text-align: center;
  font-size: 0.9rem;
  color: #6b7280;
}

/* ریسپانسیو */
@media (max-width: 768px) {
  .title {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .filter-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-right {
    justify-content: stretch;
  }

  .search-input {
    max-width: 100%;
  }

  .table th,
  .table td {
    padding-inline: 0.5rem;
  }
}
</style>
