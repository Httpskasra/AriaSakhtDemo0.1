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
          </button>
        </div>
        <div class="search">
          <SearchBar :dark="true" />
        </div>
      </div>

      <!-- پنل فیلتر ساده -->
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
        <p>تیکتی پیدا نشد.</p>
        <small>فیلترها یا جستجو را تغییر دهید.</small>
      </div>

      <!-- Content Area: لیست تیکت‌ها + جزئیات -->
      <div v-else class="tickets-container">
        <!-- لیست تیکت‌ها -->
        <div class="tickets-list">
          <div
            v-for="ticket in filteredTickets"
            :key="ticket.id"
            class="ticket-card"
            :class="{ active: selectedTicketId === ticket.id }"
            @click="selectTicket(ticket)">
            <div class="ticket-header">
              <h3>{{ ticket.title }}</h3>
              <span class="status-badge" :class="`status-${ticket.status}`">
                {{ getStatusLabel(ticket.status) }}
              </span>
            </div>
            <p class="ticket-description">
              {{ truncate(ticket.description, 50) }}
            </p>
            <div class="ticket-meta">
              <span class="priority" :class="`priority-${ticket.priority}`">
                {{ getPriorityLabel(ticket.priority) }}
              </span>
              <span class="date">
                {{ formatDate(ticket.createdAt) }}
              </span>
            </div>
          </div>
        </div>

        <!-- جزئیات تیکت -->
        <div class="ticket-details">
          <div v-if="selectedTicket" class="details-content">
            <!-- Header تیکت -->
            <div class="details-header">
              <h2>{{ selectedTicket.title }}</h2>
              <div class="ticket-badges">
                <span
                  class="status-badge"
                  :class="`status-${selectedTicket.status}`">
                  {{ getStatusLabel(selectedTicket.status) }}
                </span>
                <span
                  class="priority"
                  :class="`priority-${selectedTicket.priority}`">
                  {{ getPriorityLabel(selectedTicket.priority) }}
                </span>
              </div>
            </div>

            <!-- توضیحات تیکت -->
            <div class="details-section">
              <h4>توضیحات</h4>
              <p>{{ selectedTicket.description }}</p>
            </div>

            <!-- اطلاعات تیکت -->
            <div class="details-section">
              <h4>اطلاعات</h4>
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">تاریخ ایجاد:</span>
                  <span class="value">{{
                    formatDate(selectedTicket.createdAt)
                  }}</span>
                </div>
                <div class="info-item">
                  <span class="label">آخرین به‌روزرسانی:</span>
                  <span class="value">{{
                    formatDate(selectedTicket.updatedAt)
                  }}</span>
                </div>
                <div class="info-item" v-if="selectedTicket.orderId">
                  <span class="label">شناسه سفارش:</span>
                  <span class="value">{{ selectedTicket.orderId }}</span>
                </div>
              </div>
            </div>

            <!-- کامنت‌ها -->
            <div class="details-section comments-section">
              <h4>کامنت‌ها ({{ comments.length }})</h4>

              <!-- لیست کامنت‌ها -->
              <div v-if="loadingComments" class="loading-comments">
                درحال بارگذاری کامنت‌ها...
              </div>
              <div v-else-if="comments.length === 0" class="no-comments">
                هیچ کامنتی وجود ندارد.
              </div>
              <div v-else class="comments-list">
                <div
                  v-for="comment in comments"
                  :key="comment.id"
                  class="comment">
                  <div class="comment-header">
                    <!-- <span class="author">{{
                      comment.createdBy || "بدون نام"
                    }}</span> -->
                    <span class="time">{{
                      formatDate(comment.createdAt)
                    }}</span>
                  </div>
                  <p class="comment-text">{{ comment.content }}</p>
                </div>
              </div>

              <!-- اضافه کردن کامنت جدید -->
              <div class="add-comment">
                <textarea
                  v-model="newComment"
                  placeholder="کامنت خود را بنویسید..."
                  rows="4"
                  class="comment-input"></textarea>
                <button
                  @click="addComment"
                  :disabled="!newComment.trim() || submittingComment"
                  class="btn-submit-comment">
                  {{ submittingComment ? "درحال ارسال..." : "ارسال کامنت" }}
                </button>
              </div>
            </div>
          </div>
          <div v-else class="empty-details">
            <p>تیکتی را انتخاب کنید تا جزئیات را ببینید</p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="no-access">شما به این بخش دسترسی ندارید.</div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import dashboardAuth from "~/middleware/dashboard-auth";
import { useAccess } from "~/composables/useAccess";
import { Resource } from "~/types/permissions";

import type {
  Ticket,
  TicketPriority,
  TicketStatus,
  TicketComment,
} from "@/services/ticketService";
import {
  listTickets,
  createTicket,
  getTicket,
  getTicketComments,
  addTicketComment,
} from "@/services/ticketService";

useHead({ title: " آریاساخت | داشبورد | تیکتینگ " });
definePageMeta({ middleware: dashboardAuth });

const { canRead, canCreate } = useAccess(Resource.TICKETING);

// وضعیت صفحه
const tickets = ref<Ticket[]>([]);
const loading = ref(false);
const errorMsg = ref("");

// فیلترهای سادهٔ کلاینتی
const showFilters = ref(false);
const statusFilter = ref<string>("");
const priorityFilter = ref<string>("");

// تیکت انتخاب‌شده
const selectedTicketId = ref<string | null>(null);
const selectedTicket = ref<Ticket | null>(null);

// کامنت‌ها
const comments = ref<TicketComment[]>([]);
const loadingComments = ref(false);
const newComment = ref("");
const submittingComment = ref(false);

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

// انتخاب تیکت و دریافت جزئیات
const selectTicket = async (ticket: Ticket) => {
  selectedTicketId.value = ticket.id;
  selectedTicket.value = ticket;
  newComment.value = "";
  await fetchComments();
};

// دریافت کامنت‌های تیکت
const fetchComments = async () => {
  if (!selectedTicket.value) return;
  loadingComments.value = true;
  try {
    comments.value = await getTicketComments(selectedTicket.value.id);
  } catch (err: any) {
    console.error("خطا در دریافت کامنت‌ها:", err);
    comments.value = [];
  } finally {
    loadingComments.value = false;
  }
};

// اضافه کردن کامنت جدید
const addComment = async () => {
  if (!selectedTicket.value || !newComment.value.trim()) return;

  submittingComment.value = true;
  try {
    const comment = await addTicketComment(selectedTicket.value.id, {
      content: newComment.value,
    });
    comments.value.push(comment);
    newComment.value = "";
  } catch (err: any) {
    console.error("خطا در اضافه کردن کامنت:", err);
    alert("خطا در ارسال کامنت");
  } finally {
    submittingComment.value = false;
  }
};

// ساخت تیکت جدید
const handleNewTicket = async (payload: Partial<Ticket>) => {
  if (!canCreate) return alert("شما اجازه ایجاد تیکت را ندارید.");

  try {
    if (!payload.title || !payload.description) {
      throw new Error("عنوان و توضیحات تیکت الزامی است");
    }

    const created = await createTicket({
      title: payload.title,
      description: payload.description,
      priority: (payload.priority as TicketPriority) ?? "low",
    });
    tickets.value.unshift(created || (payload as Ticket));
  } catch (err: any) {
    console.error("خطا در ایجاد تیکت:", err);
    alert("ایجاد تیکت ناموفق بود.");
  }
};

// اعمال فیلتر
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

// توابع کمکی
function truncate(text: string, length: number) {
  return text.length > length ? text.substring(0, length) + "..." : text;
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

function getStatusLabel(status: TicketStatus) {
  const labels: Record<TicketStatus, string> = {
    open: "باز",
    in_progress: "در حال رسیدگی",
    resolved: "حل‌شده",
    closed: "بسته",
    reopened: "دوباره بازشده",
    escalated: "ارجاع‌شده",
  };
  return labels[status] || status;
}

function getPriorityLabel(priority: TicketPriority) {
  const labels: Record<TicketPriority, string> = {
    low: "کم",
    medium: "متوسط",
    high: "زیاد",
    urgent: "فوری",
  };
  return labels[priority] || priority;
}

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

/* filter bar */
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
.state.empty small {
  color: #6b7280;
}

/* Tickets Container */
.tickets-container {
  display: flex;
  gap: 20px;
  width: 95%;
  margin: 20px auto;
}

.tickets-list {
  flex: 0 0 350px;
  background: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-height: 600px;
  overflow-y: auto;
}

.ticket-card {
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.ticket-card:hover {
  border-color: var(--blue-dark);
  background-color: #f0f4f8;
}

.ticket-card.active {
  border-color: var(--blue-dark);
  background-color: #e8f1ff;
  border-width: 2px;
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 8px;
}

.ticket-header h3 {
  margin: 0;
  font-size: 14px;
  color: var(--blue-dark);
  flex: 1;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: bold;
  white-space: nowrap;
  margin-right: 8px;
}

.status-badge.status-open {
  background-color: #dbeafe;
  color: #1e40af;
}

.status-badge.status-in_progress {
  background-color: #fef3c7;
  color: #92400e;
}

.status-badge.status-resolved {
  background-color: #dcfce7;
  color: #166534;
}

.status-badge.status-closed {
  background-color: #f3f4f6;
  color: #374151;
}

.status-badge.status-escalated {
  background-color: #fee2e2;
  color: #991b1b;
}

.status-badge.status-reopened {
  background-color: #f3e8ff;
  color: #6b21a8;
}

.ticket-description {
  margin: 0 0 8px 0;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.4;
}

.ticket-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #9ca3af;
}

.priority {
  padding: 2px 6px;
  border-radius: 3px;
  font-weight: bold;
  font-size: 11px;
}

.priority-low {
  background-color: #e0e7ff;
  color: #3730a3;
}

.priority-medium {
  background-color: #fef08a;
  color: #713f12;
}

.priority-high {
  background-color: #fed7aa;
  color: #92400e;
}

.priority-urgent {
  background-color: #fecaca;
  color: #7f1d1d;
}

/* Ticket Details */
.ticket-details {
  flex: 1;
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-height: 600px;
  overflow-y: auto;
}

.empty-details {
  text-align: center;
  padding: 40px 20px;
  color: #9ca3af;
}

.details-header {
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 15px;
  margin-bottom: 20px;
}

.details-header h2 {
  margin: 0 0 10px 0;
  color: var(--blue-dark);
}

.ticket-badges {
  display: flex;
  gap: 8px;
}

.details-section {
  margin-bottom: 20px;
}

.details-section h4 {
  margin: 0 0 10px 0;
  color: var(--blue-dark);
  font-size: 14px;
}

.details-section p {
  margin: 0;
  color: #374151;
  line-height: 1.6;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
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
}

/* Comments Section */
.comments-section {
  border-top: 2px solid #e5e7eb;
  padding-top: 20px;
}

.loading-comments,
.no-comments {
  text-align: center;
  padding: 15px;
  color: #9ca3af;
  font-size: 13px;
}

.comments-list {
  margin-bottom: 15px;
  max-height: 250px;
  overflow-y: auto;
}

.comment {
  padding: 12px;
  background-color: #f9fafb;
  border-radius: 6px;
  margin-bottom: 10px;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 12px;
}

.comment-header .author {
  font-weight: 600;
  color: var(--blue-dark);
}

.comment-header .time {
  color: #9ca3af;
}

.comment-text {
  margin: 0;
  font-size: 13px;
  color: #374151;
  line-height: 1.5;
}

/* Add Comment */
.add-comment {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.comment-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-family: inherit;
  font-size: 13px;
  resize: vertical;
  direction: rtl;
  text-align: right;
}

.comment-input:focus {
  outline: none;
  border-color: var(--blue-dark);
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
}

.btn-submit-comment {
  padding: 10px 16px;
  background-color: var(--blue-dark);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-family: "iran-yekan-DemiBold";
  transition: background-color 0.2s;
}

.btn-submit-comment:hover:not(:disabled) {
  background-color: #1565c0;
}

.btn-submit-comment:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 1200px) {
  .tickets-container {
    gap: 15px;
  }

  .tickets-list {
    flex: 0 0 280px;
  }
}

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
    padding: 15px 25px;
  }

  .tickets-container {
    flex-direction: column;
  }

  .tickets-list {
    flex: 1;
    max-height: 400px;
  }

  .ticket-details {
    max-height: none;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .notification {
    left: 10px;
    right: 10px;
    top: auto;
    bottom: 20px;
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
