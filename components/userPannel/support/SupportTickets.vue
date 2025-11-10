<script setup lang="ts">
import { onMounted, ref } from "vue";
import { listTickets, type Ticket } from "@/services/ticketService";
import { useRouter } from "vue-router";

const router = useRouter();
const items = ref<Ticket[]>([]);
const loading = ref(true);
const errorMsg = ref("");

onMounted(async () => {
  try {
    items.value = await listTickets();
  } catch (e: any) {
    errorMsg.value = e?.response?.data?.message ?? "Failed to load tickets";
  } finally {
    loading.value = false;
  }
});

function openTicket(t: Ticket) {
  router.push({ name: "single-ticket", params: { id: t.id } });
}
</script>

<template>
  <div>
    <div v-if="loading">Loading tickets...</div>
    <div v-else-if="errorMsg" class="text-red-500">{{ errorMsg }}</div>
    <ul v-else class="space-y-3">
      <li v-for="t in items" :key="t.id" class="card" @click="openTicket(t)">
        <div class="title">{{ t.title }}</div>
        <div class="meta">#{{ t.id }} · {{ t.status }} · {{ t.priority }}</div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.card {
  border: 1px solid #eee;
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;
}
.title {
  font-weight: 600;
  margin-bottom: 0.25rem;
}
.meta {
  color: #666;
  font-size: 0.85rem;
}
</style>
