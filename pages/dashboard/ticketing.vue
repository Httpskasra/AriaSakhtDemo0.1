<template>
    <div v-if="canRead" class="ticket-page">
      <PanelPageHeader title="پشتیبانی" subtitle="پیگیری درخواست‌ها و گفت‌وگو با تیم پشتیبانی" icon="i-lucide-life-buoy">
        <template #actions>
          <UButton v-if="canCreate" icon="i-lucide-plus" @click="showCreateModal = true">تیکت جدید</UButton>
          <UButton icon="i-lucide-refresh-cw" variant="soft" :loading="loading" aria-label="به‌روزرسانی تیکت‌ها" @click="fetchTickets">به‌روزرسانی</UButton>
        </template>
      </PanelPageHeader>

      <PanelFilterBar>
        <TableFilterInput v-model="searchQuery" placeholder="جستجو در عنوان، توضیحات یا شناسه" aria-label="جستجوی تیکت" />
        <UButton variant="soft" color="neutral" :icon="showFilters ? 'i-lucide-chevron-up' : 'i-lucide-sliders-horizontal'" @click="toggleFilters">فیلترها</UButton>
        <UButton v-if="hasFilters" variant="ghost" color="neutral" icon="i-lucide-x" @click="clearFilters">حذف فیلترها</UButton>
      </PanelFilterBar>

      <!-- پنل فیلتر ساده -->
      <transition name="fade">
      <div v-if="showFilters" class="filter-panel panel-surface">
          <label class="sr-only" for="ticket-status-filter">فیلتر وضعیت تیکت</label>
          <select id="ticket-status-filter" v-model="statusFilter" class="ticket-select" dir="rtl">
            <option value="">همه وضعیت‌ها</option>
            <option value="open">باز</option>
            <option value="in_progress">در حال رسیدگی</option>
            <option value="resolved">حل‌شده</option>
            <option value="closed">بسته</option>
            <option value="reopened">دوباره بازشده</option>
            <option value="escalated">ارجاع‌شده</option>
          </select>

          <label class="sr-only" for="ticket-priority-filter">فیلتر اولویت تیکت</label>
          <select id="ticket-priority-filter" v-model="priorityFilter" class="ticket-select" dir="rtl">
            <option value="">همه اولویت‌ها</option>
            <option value="low">کم</option>
            <option value="medium">متوسط</option>
            <option value="high">زیاد</option>
            <option value="urgent">فوری</option>
          </select>

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
          <button
            v-for="ticket in filteredTickets"
            :key="ticket.id"
            type="button"
            class="ticket-card"
            :class="{ active: selectedTicketId === ticket.id }"
            :aria-pressed="selectedTicketId === ticket.id"
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
          </button>
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

    <BaseModal v-if="showCreateModal" title-id="create-ticket-title" @close="showCreateModal = false">
      <form class="create-ticket-form" @submit.prevent="submitNewTicket">
        <h2 id="create-ticket-title">ایجاد تیکت جدید</h2>
        <div class="form-field">
          <label for="ticket-title">عنوان تیکت</label>
          <UInput id="ticket-title" v-model="newTicketTitle" required placeholder="موضوع درخواست را وارد کنید" />
        </div>
        <div class="form-field">
          <label for="ticket-priority">اولویت</label>
          <select id="ticket-priority" v-model="newTicketPriority" class="ticket-select ticket-priority-select" dir="rtl">
            <option value="low">کم</option>
            <option value="medium">متوسط</option>
            <option value="high">زیاد</option>
            <option value="urgent">فوری</option>
          </select>
        </div>
        <div class="form-field">
          <label for="ticket-description">توضیحات</label>
          <UTextarea id="ticket-description" v-model="newTicketDescription" required :rows="5" placeholder="جزئیات درخواست را بنویسید" />
        </div>
        <div class="create-ticket-actions">
          <UButton type="button" color="neutral" variant="soft" :disabled="creatingTicket" @click="showCreateModal = false">انصراف</UButton>
          <UButton type="submit" :loading="creatingTicket">ثبت تیکت</UButton>
        </div>
      </form>
    </BaseModal>
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
const searchQuery = ref("");
const statusFilter = ref<string>("");
const priorityFilter = ref<string>("");
const showCreateModal = ref(false);
const creatingTicket = ref(false);
const newTicketTitle = ref("");
const newTicketDescription = ref("");
const newTicketPriority = ref<TicketPriority>("low");

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
    return true;
  } catch (err) {
    console.error("خطا در ایجاد تیکت:", err);
    errorMsg.value = toUserFacingError(err, "ایجاد تیکت انجام نشد.").message;
    return false;
  }
};

const submitNewTicket = async () => {
  if (!newTicketTitle.value.trim() || !newTicketDescription.value.trim() || creatingTicket.value) return;
  creatingTicket.value = true;
  const created = await handleNewTicket({
    title: newTicketTitle.value.trim(),
    description: newTicketDescription.value.trim(),
    priority: newTicketPriority.value,
  });
  creatingTicket.value = false;
  if (!created) return;
  newTicketTitle.value = "";
  newTicketDescription.value = "";
  newTicketPriority.value = "low";
  showCreateModal.value = false;
};

// اعمال فیلتر
const filteredTickets = computed(() => {
  const query = searchQuery.value.trim().toLocaleLowerCase();
  return tickets.value.filter((t) => {
    const searchable = `${t.id} ${t.title} ${t.description}`.toLocaleLowerCase();
    const okQuery = !query || searchable.includes(query);
    const okStatus =
      !statusFilter.value ||
      String(t.status || "").toLowerCase() === statusFilter.value;
    const okPriority =
      !priorityFilter.value ||
      String(t.priority || "").toLowerCase() === priorityFilter.value;
    return okQuery && okStatus && okPriority;
  });
});
const hasFilters = computed(() => Boolean(searchQuery.value.trim() || statusFilter.value || priorityFilter.value));

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
  searchQuery.value = "";
  statusFilter.value = "";
  priorityFilter.value = "";
}

onMounted(fetchTickets);
</script>

<style scoped>
.ticket-page {
  display: grid;
  gap: 1rem;
  width: min(100%, 90rem);
  margin-inline: auto;
}

.filter-panel {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: end;
  gap: .75rem;
  width: 100%;
  margin: 0;
  padding: 1rem;
  background: var(--color-bg-surface);
  border-color: var(--color-border);
}

.filter-panel :deep(button),
.filter-panel :deep(input),
.filter-panel :deep(select) {
  min-height: var(--control-height-md);
}

.filter-panel :deep(input),
.filter-panel :deep(select),
.filter-panel :deep(button) {
  max-width: 100%;
  min-width: 0;
}

.ticket-select {
  width: 100%;
  min-height: var(--control-height-md);
  padding: .55rem .75rem;
  color: var(--color-text-body);
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-field);
  font: inherit;
  line-height: 1.4;
  text-align: right;
  cursor: pointer;
}

.ticket-select:hover {
  border-color: var(--color-brand-blue);
}

.ticket-select:focus-visible {
  outline: none;
  border-color: var(--color-brand-blue);
  box-shadow: var(--focus-ring);
}

.ticket-select:disabled {
  color: var(--color-text-disabled);
  background: var(--color-bg-light);
  cursor: not-allowed;
}

.ticket-priority-select {
  min-height: var(--control-height-md);
}

.tickets-container {
  display: grid;
  grid-template-columns: minmax(18rem, 24rem) minmax(0, 1fr);
  gap: 1rem;
  align-items: stretch;
  width: 100%;
  margin: 0;
}

.tickets-list,
.ticket-details {
  min-width: 0;
  max-height: 42rem;
  padding: 1rem;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-raised);
}

.tickets-list {
  overflow-y: auto;
}

.ticket-details {
  overflow-y: auto;
}

.ticket-card {
  display: block;
  width: 100%;
  margin-bottom: .65rem;
  padding: .85rem;
  color: inherit;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-compact-list-item);
  cursor: pointer;
  text-align: right;
  transition: background-color .16s ease, border-color .16s ease;
}

.ticket-card:last-child {
  margin-bottom: 0;
}

.ticket-card:hover {
  background: var(--color-bg-light);
  border-color: var(--color-brand-blue);
}

.ticket-card:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}

.ticket-card.active {
  background: var(--color-info-bg);
  border-color: var(--color-brand-blue);
}

.ticket-header,
.ticket-meta,
.ticket-badges {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: .5rem;
}

.ticket-header,
.ticket-meta {
  justify-content: space-between;
}

.ticket-header {
  align-items: flex-start;
  margin-bottom: .55rem;
}

.ticket-header h3 {
  min-width: 0;
  margin: 0;
  color: var(--color-text-heading);
  font-size: .9rem;
  font-weight: 800;
  overflow-wrap: anywhere;
}

.ticket-description {
  margin: 0 0 .65rem;
  color: var(--color-text-muted);
  font-size: .8rem;
  line-height: var(--line-height-body);
  overflow-wrap: anywhere;
}

.ticket-meta,
.info-item .label,
.comment-header .time {
  color: var(--color-text-muted);
  font-size: .75rem;
}

.priority {
  padding: .15rem .45rem;
  border-radius: var(--radius-pill);
  font-size: .7rem;
  font-weight: 700;
}

.empty-details {
  display: grid;
  min-height: 14rem;
  place-items: center;
  padding: 2rem;
  color: var(--color-text-muted);
  text-align: center;
}

.details-header {
  display: grid;
  gap: .75rem;
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.details-header h2 {
  margin: 0 0 .65rem;
  color: var(--color-text-heading);
  font-size: 1.15rem;
  font-weight: 800;
  overflow-wrap: anywhere;
}

.details-section {
  margin-bottom: 1.25rem;
}

.details-section h4 {
  margin: 0 0 .55rem;
  color: var(--color-text-heading);
  font-size: .9rem;
  font-weight: 800;
}

.details-section p {
  margin: 0;
  color: var(--color-text-body);
  line-height: var(--line-height-body);
  overflow-wrap: anywhere;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: .75rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: .3rem;
  min-width: 0;
}

.info-item .value {
  color: var(--color-text-body);
  font-size: .82rem;
  overflow-wrap: anywhere;
}

.comments-section {
  padding-top: 1.25rem;
  border-top: 1px solid var(--color-border);
}

.comments-list {
  max-height: 16rem;
  margin-bottom: 1rem;
  overflow-y: auto;
}

.comment {
  margin-bottom: .65rem;
  padding: .75rem;
  background: var(--color-bg-light);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-compact-list-item);
}

.comment:last-child {
  margin-bottom: 0;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  gap: .75rem;
  margin-bottom: .45rem;
}

.comment-text {
  margin: 0;
  color: var(--color-text-body);
  font-size: .82rem;
  line-height: var(--line-height-body);
  overflow-wrap: anywhere;
}

.add-comment {
  display: grid;
  gap: .65rem;
}

.comment-input {
  width: 100%;
  min-height: 7rem;
  padding: .75rem;
  color: var(--color-text-heading);
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-field);
  direction: rtl;
  font-family: var(--font-body);
  font-size: .85rem;
  resize: vertical;
  text-align: right;
}

.comment-input:focus {
  outline: none;
  border-color: var(--color-brand-blue);
  box-shadow: var(--focus-ring);
}

.btn-submit-comment {
  min-height: var(--control-height-md);
  justify-self: start;
}

.create-ticket-form {
  display: grid;
  gap: 1.1rem;
  padding-top: 1.5rem;
}

.create-ticket-form h2 {
  margin: 0 0 .25rem;
  color: var(--color-text-heading);
  font-size: 1.2rem;
  font-weight: 800;
}

.form-field {
  display: grid;
  gap: .4rem;
}

.form-field label {
  color: var(--color-text-heading);
  font-size: .85rem;
  font-weight: 700;
}

.create-ticket-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: .65rem;
  padding-top: .35rem;
}

@media (max-width: 900px) {
  .tickets-container {
    grid-template-columns: minmax(15rem, 18rem) minmax(0, 1fr);
  }

  .tickets-list,
  .ticket-details {
    max-height: 36rem;
  }
}

@media (max-width: 767px) {
  .filter-panel {
    grid-template-columns: 1fr;
  }

  .tickets-container {
    grid-template-columns: 1fr;
  }

  .tickets-list {
    max-height: 25rem;
  }

  .ticket-details {
    max-height: none;
    min-height: 18rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .create-ticket-actions {
    flex-direction: column-reverse;
  }

  .create-ticket-actions :deep(button) {
    width: 100%;
  }

  .btn-submit-comment {
    width: 100%;
  }
}

@media (max-width: 420px) {
  .tickets-list,
  .ticket-details,
  .filter-panel {
    padding: .75rem;
  }

  .ticket-card {
    padding: .75rem;
  }

  .details-header h2 {
    font-size: 1rem;
  }

  .comment-header {
    align-items: flex-start;
    flex-direction: column;
    gap: .25rem;
  }
}
</style>
