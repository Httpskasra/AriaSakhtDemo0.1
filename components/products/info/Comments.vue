<template>
  <div>
    <div class="container">
      <div class="header">
        <div class="user">
          <svg
            width="24"
            height="24"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M8.00033 8.49998C5.88699 8.49998 4.16699 6.77998 4.16699 4.66665C4.16699 2.55331 5.88699 0.833313 8.00033 0.833313C10.1137 0.833313 11.8337 2.55331 11.8337 4.66665C11.8337 6.77998 10.1137 8.49998 8.00033 8.49998ZM8.00033 1.83331C6.44033 1.83331 5.16699 3.10665 5.16699 4.66665C5.16699 6.22665 6.44033 7.49998 8.00033 7.49998C9.56033 7.49998 10.8337 6.22665 10.8337 4.66665C10.8337 3.10665 9.56033 1.83331 8.00033 1.83331Z"
              fill="#57626D" />
            <path
              d="M13.7268 15.1667C13.4534 15.1667 13.2268 14.94 13.2268 14.6667C13.2268 12.3667 10.8801 10.5 8.0001 10.5C5.1201 10.5 2.77344 12.3667 2.77344 14.6667C2.77344 14.94 2.54677 15.1667 2.27344 15.1667C2.0001 15.1667 1.77344 14.94 1.77344 14.6667C1.77344 11.82 4.56677 9.5 8.0001 9.5C11.4334 9.5 14.2268 11.82 14.2268 14.6667C14.2268 14.94 14.0001 15.1667 13.7268 15.1667Z"
              fill="#57626D" />
          </svg>
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
  border-radius: 15px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  margin-top: 15px;
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
  color: #333;
  font-size: 14px;
}

.rating-stars {
  font-size: 12px;
  letter-spacing: 2px;
}

.date {
  font-size: 12px;
  color: #999;
}

.title {
  margin: 12px 0;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.title strong {
  font-size: 15px;
  color: #333;
}

.comment {
  margin: 12px 0;
}

.comment p {
  line-height: 22px;
  color: #555;
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
    padding: 15px;
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
