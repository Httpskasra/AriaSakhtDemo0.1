<template>
  <div>
    <article class="product-comment-card">
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
    </article>
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
.product-comment-card {
  width: 100%;
  margin: auto;
  padding: 1.25rem;
  background-color: var(--color-bg-surface);
  border-radius: var(--radius-field);
  border: 1px solid var(--color-border);
  margin-top: 16px;
  transition: border-color .16s ease, box-shadow .16s ease;
}

.product-comment-card:hover {
  border-color: var(--color-info-border);
  box-shadow: var(--shadow-raised);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: .75rem;
}

.user {
  display: flex;
  align-items: center;
  gap: .65rem;
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
  padding: .5rem 0;
  border-bottom: 1px solid var(--color-border);
}

.title strong {
  font-size: 15px;
  color: var(--color-text-heading);
}

.comment {
  margin: .75rem 0;
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
  border-radius: var(--radius-card);
  font-size: 11px;
  font-weight: 600;
}

.status-pending {
  background-color: var(--color-warning-bg);
  color: var(--color-warning-fg);
}

.status-approved {
  background-color: var(--color-success-bg);
  color: var(--color-success-fg);
}

.status-rejected {
  background-color: var(--color-danger-bg);
  color: var(--color-danger-fg);
}

@media (min-width: 768px) and (max-width: 1024px) {
  .product-comment-card {
    padding: 1rem;
  }

  .username {
    font-size: 13px;
  }

  .comment p {
    font-size: 13px;
  }
}

@media (max-width: 767px) {
  .product-comment-card {
    padding: .75rem;
    margin-top: .75rem;
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
