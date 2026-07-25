<script setup lang="ts">
import { onMounted, ref } from "vue";
import { listTickets } from "@/services/ticketService";
import type { Ticket } from "@/types/ticket";
import { useRouter } from "vue-router";

const router = useRouter();
const items = ref<Ticket[]>([]);
const loading = ref(true);
const errorMsg = ref("");

async function loadTickets() {
  loading.value = true;
  errorMsg.value = "";
  try {
    items.value = await listTickets();
  } catch (e: any) {
    errorMsg.value = e?.response?.data?.message ?? "دریافت تیکت‌ها با مشکل مواجه شد.";
  } finally {
    loading.value = false;
  }
}

onMounted(loadTickets);

function openTicket(t: Ticket) {
  router.push({ name: "single-ticket", params: { id: t.id } });
}
</script>

<template>
  <div>
    <SharedAsyncState v-if="loading" state="loading" />
    <SharedAsyncState v-else-if="errorMsg" state="error" :message="errorMsg" @retry="loadTickets" />
    <SharedAsyncState v-else-if="items.length === 0" state="empty" title="تیکتی وجود ندارد" message="هنوز تیکتی برای نمایش ثبت نشده است." />
    <ul v-else class="space-y-3">
      <li v-for="t in items" :key="t.id">
        <button type="button" class="card" @click="openTicket(t)">
          <div class="title">{{ t.title }}</div>
          <div class="meta">#{{ t.id }} · {{ t.status }} · {{ t.priority }}</div>
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.card {
  display: block;
  width: 100%;
  text-align: right;
  border: 1px solid #eee;
  padding: 12px;
  border-radius: var(--radius-card);
  cursor: pointer;
}
.card:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 3px; }
.title {
  font-weight: 600;
  margin-bottom: 0.25rem;
}
.meta {
  color: var(--color-text-muted);
  font-size: 0.85rem;
}
</style>
