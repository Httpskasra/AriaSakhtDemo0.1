<template>
  <div>
    <div class="container">
      <div class="header">
        <div class="user">
          <UIcon name="i-lucide-user" class="size-icon-action text-muted" />
          <div class="user-info">
            <!-- <span class="username">{{
              data.userName || data.sender || "کاربر"
            }}</span> -->
            <span class="rating-stars">{{
              "⭐".repeat(('rating' in data ? data.rating : 0) || 0)
            }}</span>
          </div>
        </div>
        <!-- <span class="date">{{ formatDate(data.createdAt) }}</span> -->
      </div>
      <!-- <div class="title" v-if="data.title">
        <strong>{{ data.title }}</strong>
      </div> -->
      <div class="comment">
        <p>
          {{ data.comment }}
        </p>
      </div>
      <!-- <div class="status" v-if="data.status">
        <span :class="`status-badge status-${data.status}`">
          {{ getStatusLabel(data.status) }}
        </span>
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Rating } from "@/services/ratingService";

const props = defineProps<{
  data: Rating | { sender: string; comment: string };
}>();

const formatDate = (date: string | Date | undefined): string => {
  if (!date) return "";
  try {
    const d = new Date(date);
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return "";
  }
};

const getStatusLabel = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    pending: "در انتظار تایید",
    approved: "تایید شده",
    rejected: "رد شده",
  };
  return statusMap[status] || status;
};
</script>

<style scoped>
.container {
  width: 100%;
  margin: auto;
  padding: 20px;
  background-color: #fff;
  border-radius: var(--radius-field);
  border: 1px solid rgba(0, 0, 0, 0.1);
  margin-top: 16px;
  transition: all 0.3s ease;
}

.container:hover {
  border-color: rgba(0, 0, 0, 0.2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.user {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user svg {
  width: 24px;
  height: 24px;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.username {
  font-weight: 600;
  color: var(--color-text-heading);
  font-size: 14px;
}

.rating-stars {
  font-size: 12px;
  letter-spacing: 2px;
}

.date {
  font-size: 12px;
  color: var(--color-text-muted);
}

.title {
  margin: 12px 0;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.title strong {
  font-size: 15px;
  color: var(--color-text-heading);
}

.comment {
  margin: 12px 0;
}

.comment p {
  line-height: var(--line-height-body);
  color: var(--color-text-body);
  font-size: 14px;
  word-break: break-word;
}

.status {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
}

.status-pending {
  background-color: #fff3cd;
  color: #856404;
}

.status-approved {
  background-color: #d4edda;
  color: #155724;
}

.status-rejected {
  background-color: #f8d7da;
  color: #721c24;
}

@media (min-width: 768px) and (max-width: 1024px) {
  .container {
    padding: 16px;
  }

  .username {
    font-size: 13px;
  }

  .comment p {
    font-size: 13px;
  }
}

@media (max-width: 767px) {
  .container {
    padding: 12px;
    margin-top: 12px;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .user svg {
    width: 18px;
    height: 18px;
  }

  .username {
    font-size: 12px;
  }

  .rating-stars {
    font-size: 10px;
  }

  .date {
    font-size: 10px;
  }

  .title strong {
    font-size: 13px;
  }

  .comment p {
    font-size: 12px;
    line-height: 20px;
  }
}
</style>
