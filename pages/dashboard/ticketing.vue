<template>
  <NuxtLayout name="dashboard">
    <div v-if="canRead" class="container">
      <!-- Title -->
      <div class="title">
        <h1>پشتیبانی</h1>
        <img src="/userPannleIcons/support.png" alt="support" />
      </div>

      <!-- Header: ساخت تیکت جدید از داخل مودال SupportHeader -->
      <SupportHeader :canCreate="canCreate" @submitted="handleNewTicket" />

      <!-- Filter + Search UI (همون استایل قبلی حفظ شده) -->
      <div class="fillter">
        <div class="fillter-btn">
          <button type="button" @click="toggleFilters">
            <span>فیلتر</span>
            <!-- <img src="/userPannleIcons/filter-alt.png" alt="filter" /> -->
          </button>
        </div>
        <div class="search">
          <!-- اگر SearchBar شما v-model ندارد، همینطور بگذارید -->
          <SearchBar :dark="true" />
        </div>
      </div>

      <!-- پنل فیلتر ساده (اختیاری؛ اگر نمی‌خواهی، حذفش کن) -->
      <transition name="fade">
        <div v-if="showFilters" class="filter-panel">
          <select v-model="statusFilter">
            <option value="">همه وضعیت‌ها</option>
            <option value="open">باز</option>
            <option value="in_progress">در حال رسیدگی</option>
            <option value="resolved">حل‌شده</option>
            <option value="closed">بسته</option>
            <option value="reopened">دوباره بازشده</option>
            <option value="escalated">ارجاع‌شده</option>
          </select>

          <select v-model="priorityFilter">
            <option value="">همه اولویت‌ها</option>
            <option value="low">کم</option>
            <option value="medium">متوسط</option>
            <option value="high">زیاد</option>
            <option value="urgent">فوری</option>
          </select>

          <button class="filter-clear" @click="clearFilters">
            حذف فیلترها
          </button>
        </div>
      </transition>

      <!-- States -->
      <div v-if="loading" class="state loading">
        <div class="skeleton" v-for="i in 4" :key="i"></div>
      </div>

      <div v-else-if="errorMsg" class="state error">
        <p>خطا در دریافت تیکت‌ها</p>
        <small>{{ errorMsg }}</small>
        <button class="retry" @click="fetchTickets">تلاش مجدد</button>
      </div>

      <div v-else-if="filteredTickets.length === 0" class="state empty">
        <!-- <img src="/userPannleIcons/empty.png" alt="empty" /> -->
        <p>تیکتی پیدا نشد.</p>
        <small>فیلترها یا جستجو را تغییر دهید.</small>
      </div>

      <!-- لیست تیکت‌ها -->
      <SupportTickets
        v-else
        :tickets="filteredTickets"
        @refresh="fetchTickets" />
    </div>

    <div v-else class="no-access">شما به این بخش دسترسی ندارید.</div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import dashboardAuth from "~/middleware/dashboard-auth";
import { useAccess } from "~/composables/useAccess";
import { Resource } from "~/types/permissions";

// از سرویس خودت استفاده کنیم؛ طبق فایل ارسالی تو، این‌ها بدون پارامتر $axios هستند
import type {
  Ticket,
  TicketPriority,
  TicketStatus,
} from "@/services/ticketService";
import { listTickets, createTicket } from "@/services/ticketService";

useHead({ title: " آریاساخت | داشبورد | تیکتینگ " });
definePageMeta({ middleware: dashboardAuth });

// const { canRead, canCreate } = useAccess(Resource.TICKETING);
const { canRead, canCreate } = { canCreate: true, canRead: true };

// وضعیت صفحه
const tickets = ref<Ticket[]>([]);
const loading = ref(false);
const errorMsg = ref("");

// فیلترهای سادهٔ کلاینتی (در صورتی که سرورت کوئری نمی‌گیرد)
const showFilters = ref(false);
const statusFilter = ref<string>("");
const priorityFilter = ref<string>("");

// گرفتن لیست تیکت‌ها
const fetchTickets = async () => {
  if (!canRead) return;
  loading.value = true;
  errorMsg.value = "";
  try {
    tickets.value = await listTickets();
  } catch (err: any) {
    errorMsg.value =
      err?.response?.data?.message || err?.message || "خطای نامشخص";
    tickets.value = [];
  } finally {
    loading.value = false;
  }
};

// ساخت تیکت جدید (ایونت از SupportHeader می‌آید)
const handleNewTicket = async (payload: Partial<Ticket>) => {
  if (!canCreate) return alert("شما اجازه ایجاد تیکت را ندارید.");

  try {
    // اگر title یا description وجود نداشت، خطا نشان بده
    if (!payload.title || !payload.description) {
      throw new Error("عنوان و توضیحات تیکت الزامی است");
    }

    const created = await createTicket({
      title: payload.title,
      description: payload.description,
      priority: (payload.priority as TicketPriority) ?? "low",
      // اگر orderId داری:
      // orderId: payload.orderId as string | undefined,
    });
    // ترجیح: Prepend برای دیده‌شدن فوری
    tickets.value.unshift(created || (payload as Ticket));
  } catch (err: any) {
    console.error("خطا در ایجاد تیکت:", err);
    alert("ایجاد تیکت ناموفق بود.");
  }
};

// اعمال فیلتر (سمت کلاینت)
const filteredTickets = computed(() => {
  return tickets.value.filter((t) => {
    const okStatus =
      !statusFilter.value ||
      String(t.status || "").toLowerCase() === statusFilter.value;
    const okPriority =
      !priorityFilter.value ||
      String(t.priority || "").toLowerCase() === priorityFilter.value;
    return okStatus && okPriority;
  });
});

// اکشن‌های UI
function toggleFilters() {
  showFilters.value = !showFilters.value;
}
function clearFilters() {
  statusFilter.value = "";
  priorityFilter.value = "";
}

onMounted(fetchTickets);
</script>

<style scoped>
* {
  box-sizing: border-box;
}

/* title */
.title {
  color: var(--blue-dark);
  font-family: "iran-yekan-Bold";
  width: 230px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin: 15px;
}
.title h1 {
  font-size: 36px;
}
.title img {
  width: 66px;
  height: 66px;
}

/* filter bar (استایل قبلی شما حفظ شده) */
.fillter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 95%;
  margin: 0 auto;
  margin-top: 10px;
  background-color: #fff;
  border-radius: 8px;
  padding: 20px 100px;
  gap: 12px;
  flex-wrap: wrap;
}
.fillter .fillter-btn button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 10px 20px;
  background: #fff;
  cursor: pointer;
}
.fillter .fillter-btn button:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
.fillter .search {
  flex-basis: 50%;
}

/* پنل فیلتر */
.filter-panel {
  width: 95%;
  margin: 10px auto 0;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.filter-panel select {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 8px 10px;
  background: #fff;
}
.filter-clear {
  background: transparent;
  color: #ef4444;
  border: 0;
  cursor: pointer;
  padding: 8px 10px;
}

/* States */
.state {
  width: 95%;
  margin: 18px auto;
  text-align: center;
}
.loading .skeleton {
  height: 70px;
  margin: 10px 0;
  border-radius: 10px;
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
.state.error small {
  display: block;
  color: #ef4444;
  margin: 6px 0 12px;
}
.state.error .retry {
  background: #1f2937;
  color: #fff;
  border-radius: 8px;
  padding: 8px 12px;
  border: 0;
  cursor: pointer;
}
.state.empty img {
  width: 90px;
  opacity: 0.7;
  margin-bottom: 8px;
}
.state.empty small {
  color: #6b7280;
}

/* Responsive */
@media (max-width: 767px) {
  .title {
    width: 40%;
  }
  .title h1 {
    font-size: 20px;
  }
  .title img {
    width: 40px;
    height: 40px;
  }

  .fillter {
    align-items: center;
    justify-content: space-between;
    padding: 15px 25px;
  }
  .fillter .search {
    flex-basis: 60%;
    margin-top: 10px;
  }
  .fillter .fillter-btn button {
    padding: 5px 10px;
    font-size: 14px;
  }
  .fillter .fillter-btn button img {
    width: 20px;
    height: 20px;
  }
}

/* Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
