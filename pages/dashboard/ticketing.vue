<template>
  <NuxtLayout name="dashboard">
    <div v-if="canRead" class="container">
      <!-- Title -->
      <DashboardPageHeader title="پشتیبانی" icon="/userPannleIcons/support.png" alt="support" />

      <!-- Header: ساخت تیکت جدید از داخل مودال SupportHeader -->
      <!-- <SupportHeader :canCreate="canCreate" @submitted="handleNewTicket" /> -->

      <!-- Filter + Search UI (همون استایل قبلی حفظ شده) -->
      <div class="fillter">
        <div class="fillter-btn">
          <ActionButton tone="ghost" type="button" @click="toggleFilters">
            <span>فیلتر</span>
          </ActionButton>
        </div>
      </div>

      <!-- پنل فیلتر ساده -->
      <transition name="fade">
        <div v-if="showFilters" class="filter-panel">
          <USelect
            v-model="statusFilter"
            :items="[
              { label: 'همه وضعیت‌ها', value: '' },
              { label: 'باز', value: 'open' },
              { label: 'در حال رسیدگی', value: 'in_progress' },
              { label: 'حل‌شده', value: 'resolved' },
              { label: 'بسته', value: 'closed' },
              { label: 'دوباره بازشده', value: 'reopened' },
              { label: 'ارجاع‌شده', value: 'escalated' }
            ]" />

          <USelect
            v-model="priorityFilter"
            :items="[
              { label: 'همه اولویت‌ها', value: '' },
              { label: 'کم', value: 'low' },
              { label: 'متوسط', value: 'medium' },
              { label: 'زیاد', value: 'high' },
              { label: 'فوری', value: 'urgent' }
            ]" />

          <ActionButton tone="ghost" class="filter-clear" @click="clearFilters">
            حذف فیلترها
          </ActionButton>
        </div>
      </transition>

      <!-- States -->
      <SharedAsyncState v-if="loading" state="loading" />
      <SharedAsyncState v-else-if="errorMsg" state="error" :message="errorMsg" @retry="fetchTickets" />
      <SharedAsyncState v-else-if="filteredTickets.length === 0" state="empty" title="تیکتی پیدا نشد" message="فیلترها یا جستجو را تغییر دهید." />

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
              <StatusPill
                v-bind="getTicketStatusConfig(ticket.status)"
                size="compact" />
            </div>
            <p class="ticket-description">
              {{ truncate(ticket.description, 50) }}
            </p>
            <div class="ticket-meta">
              <StatusPill
                v-bind="getTicketPriorityConfig(ticket.priority)"
                size="compact" />
              <span class="date">
                {{ formatDate(ticket.createdAt) }}
              </span>
            </div>
          </div>
          <UPagination
            v-if="totalTickets > limitTickets"
            v-model="pageTickets"
            :total="totalTickets"
            :page-count="limitTickets"
            :disabled="loading" />
        </div>

        <!-- جزئیات تیکت -->
        <div class="ticket-details">
          <div v-if="selectedTicket" class="details-content">
            <!-- Header تیکت -->
            <div class="details-header">
              <h2>{{ selectedTicket.title }}</h2>
              <div class="ticket-badges">
                <StatusPill
                  v-bind="getTicketStatusConfig(selectedTicket.status)"
                  size="compact" />
                <StatusPill
                  v-bind="getTicketPriorityConfig(selectedTicket.priority)"
                  size="compact" />
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
              <SharedAsyncState v-if="loadingComments" state="loading" :skeleton-rows="2" />
              <SharedAsyncState v-else-if="commentsErrorMsg" state="error" :message="commentsErrorMsg" @retry="fetchComments" />
              <SharedAsyncState v-else-if="comments.length === 0" state="empty" title="کامنتی وجود ندارد" message="هنوز کامنتی برای این تیکت ثبت نشده است." />
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
                <UTextarea
                  v-model="newComment"
                  placeholder="کامنت خود را بنویسید..."
                  :rows="4"
                  class="comment-input" />
                <ActionButton
                  tone="primary"
                  @click="addComment"
                  :disabled="!newComment.trim() || submittingComment"
                  class="btn-submit-comment">
                  {{ submittingComment ? "درحال ارسال..." : "ارسال کامنت" }}
                </ActionButton>
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
import { useAccess } from "~/composables/useAccess";
import { Resource } from "~/types/permissions";

import type {
  Ticket,
  TicketPriority,
  TicketStatus,
  TicketComment,
} from "~/types/ticket";
import {
  listTickets,
  createTicket,
  getTicket,
  getTicketComments,
  addTicketComment,
} from "@/services/ticketService";
import { toUserFacingError } from "~/services/apiClient";

useHead({ title: "داشبورد | تیکتینگ" });
definePageMeta({
  middleware: ["auth", "permission"],
  permission: { resource: "ticketing", action: "r" },
});

const { canRead, canCreate } = useAccess(Resource.TICKETING);

// وضعیت صفحه
const tickets = ref<Ticket[]>([]);
const pageTickets = ref(1);
const limitTickets = ref(25);
const totalTickets = ref(0);
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
const commentsErrorMsg = ref("");
const newComment = ref("");
const submittingComment = ref(false);

// گرفتن لیست تیکت‌ها
const fetchTickets = async () => {
  if (!canRead.value) return;
  loading.value = true;
  errorMsg.value = "";
  try {
    const result = await listTickets({ page: pageTickets.value, limit: limitTickets.value });
    if (Array.isArray(result)) {
      tickets.value = result;
      totalTickets.value = result.length;
    } else {
      tickets.value = result.items;
      totalTickets.value = result.total;
    }
  } catch (err) {
    errorMsg.value = toUserFacingError(err, "دریافت تیکت‌ها انجام نشد.").message;
    tickets.value = [];
    totalTickets.value = 0;
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
  commentsErrorMsg.value = "";
  try {
    comments.value = await getTicketComments(selectedTicket.value.id);
  } catch (err) {
    console.error("خطا در دریافت کامنت‌ها:", err);
    comments.value = [];
    commentsErrorMsg.value = toUserFacingError(err, "دریافت کامنت‌ها انجام نشد.").message;
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
  } catch (err) {
    console.error("خطا در اضافه کردن کامنت:", err);
    errorMsg.value = toUserFacingError(err, "ارسال کامنت انجام نشد.").message;
  } finally {
    submittingComment.value = false;
  }
};

// ساخت تیکت جدید
const handleNewTicket = async (payload: Partial<Ticket>) => {
  if (!canCreate.value) {
    errorMsg.value = "شما اجازه ایجاد تیکت را ندارید.";
    return;
  }

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
  } catch (err) {
    console.error("خطا در ایجاد تیکت:", err);
    errorMsg.value = toUserFacingError(err, "ایجاد تیکت انجام نشد.").message;
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

watch([pageTickets, limitTickets], fetchTickets);

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

/* filter bar */
.fillter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 95%;
  margin: 0 auto;
  margin-top: 10px;
  background-color: #fff;
  border-radius: var(--radius-field);
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
  border-radius: var(--radius-field);
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
  border-radius: var(--radius-field);
  padding: 10px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
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
  border-radius: var(--radius-card);
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
  border-radius: var(--radius-field);
  padding: 8px 12px;
  border: 0;
  cursor: pointer;
}
.state.empty small {
  color: var(--color-text-muted);
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
  border-radius: var(--radius-field);
  padding: 16px;
  box-shadow: var(--shadow-raised);
  max-height: 600px;
  overflow-y: auto;
}

.ticket-card {
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: var(--radius-compact-list-item);
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

.ticket-description {
  margin: 0 0 8px 0;
  font-size: 13px;
  color: var(--color-text-muted);
  line-height: var(--line-height-metadata);
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

/* Ticket Details */
.ticket-details {
  flex: 1;
  background: white;
  border-radius: var(--radius-field);
  padding: 20px;
  box-shadow: var(--shadow-raised);
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
  padding-bottom: 16px;
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
  color: var(--color-text-body);
  line-height: var(--line-height-body);
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
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
}

/* Comments Section */
.comments-section {
  border-top: 2px solid #e5e7eb;
  padding-top: 20px;
}

.loading-comments,
.no-comments {
  text-align: center;
  padding: 16px;
  color: #9ca3af;
  font-size: 13px;
}

.comments-list {
  margin-bottom: 16px;
  max-height: 250px;
  overflow-y: auto;
}

.comment {
  padding: 12px;
  background-color: #f9fafb;
  border-radius: var(--radius-compact-list-item);
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
  color: var(--color-text-body);
  line-height: var(--line-height-body);
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
  border-radius: var(--radius-compact-list-item);
  font-family: inherit;
  font-size: 13px;
  resize: vertical;
  direction: rtl;
  text-align: right;
}

.comment-input:focus {
  outline: none;
  border-color: var(--blue-dark);
  /* Focus ring, not elevation. */
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-brand-blue) 10%, transparent);
}

.btn-submit-comment {
  padding: 10px 16px;
  background-color: var(--blue-dark);
  color: white;
  border: none;
  border-radius: var(--radius-compact-list-item);
  cursor: pointer;
  font-size: 13px;
  font-family: var(--font-yekan);
  font-weight: 600;
  transition: background-color 0.2s;
}

.btn-submit-comment:hover:not(:disabled) {
  background-color: var(--color-brand-blue-hover);
}

.btn-submit-comment:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 1023px) {
  .tickets-container {
    gap: 16px;
  }

  .tickets-list {
    flex: 0 0 min(30vw, 280px);
  }
}

@media (max-width: 767px) {
  .fillter {
    padding: 16px 24px;
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
