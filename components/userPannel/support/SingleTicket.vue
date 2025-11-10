<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import {
  getTicket,
  getTicketStatus,
  updateTicket,
  patchTicketStatus,
  escalateTicket,
  resolveTicket,
  type Ticket,
  type TicketStatus,
  type TicketPriority,
} from "@/services/ticketService";

const route = useRoute();
const id = computed(() => String(route.params.id));

const ticket = ref<Ticket | null>(null);
const statusOnly = ref<TicketStatus | undefined>(undefined);
const loading = ref(true);
const errorMsg = ref("");
const saving = ref(false);

// editable
const editTitle = ref("");
const editDescription = ref("");
const editPriority = ref<TicketPriority>("low");

onMounted(async () => {
  await refresh();
});

async function refresh() {
  loading.value = true;
  errorMsg.value = "";
  try {
    ticket.value = await getTicket(id.value);
    const st = await getTicketStatus(id.value);
    statusOnly.value = st.status;

    // init form values
    editTitle.value = ticket.value.title;
    editDescription.value = ticket.value.description;
    editPriority.value = ticket.value.priority;
  } catch (e: any) {
    errorMsg.value = e?.response?.data?.message ?? "Failed to load ticket";
  } finally {
    loading.value = false;
  }
}

async function saveBasic() {
  if (!ticket.value) return;
  saving.value = true;
  errorMsg.value = "";
  try {
    ticket.value = await updateTicket(id.value, {
      title: editTitle.value,
      description: editDescription.value,
      priority: editPriority.value,
    });
  } catch (e: any) {
    errorMsg.value = e?.response?.data?.message ?? "Update failed";
  } finally {
    saving.value = false;
  }
}

async function changeStatus(status: TicketStatus, refund?: boolean) {
  saving.value = true;
  errorMsg.value = "";
  try {
    await patchTicketStatus(id.value, status, refund); // PATCH /status
    await refresh();
  } catch (e: any) {
    errorMsg.value = e?.response?.data?.message ?? "Status change failed";
  } finally {
    saving.value = false;
  }
}

async function escalate() {
  saving.value = true;
  errorMsg.value = "";
  try {
    await escalateTicket(id.value);
    await refresh();
  } catch (e: any) {
    errorMsg.value = e?.response?.data?.message ?? "Escalation failed";
  } finally {
    saving.value = false;
  }
}

async function resolve(refund: boolean) {
  saving.value = true;
  errorMsg.value = "";
  try {
    await resolveTicket(id.value, refund);
    await refresh();
  } catch (e: any) {
    errorMsg.value = e?.response?.data?.message ?? "Resolve failed";
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div>
    <div v-if="loading">Loading...</div>
    <div v-else-if="errorMsg" class="text-red-500">{{ errorMsg }}</div>
    <div v-else-if="ticket">
      <h2 class="mb-2">#{{ ticket.id }} — {{ ticket.title }}</h2>
      <p class="mb-4">{{ ticket.description }}</p>
      <div class="badge">Status: {{ statusOnly }}</div>
      <div class="badge">Priority: {{ ticket.priority }}</div>

      <hr class="my-4" />
      <h3>Edit basics</h3>
      <div class="grid">
        <input v-model="editTitle" class="input" />
        <textarea v-model="editDescription" class="textarea" />
        <select v-model="editPriority" class="select">
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
          <option value="urgent">urgent</option>
        </select>
        <button :disabled="saving" @click="saveBasic" class="btn">Save</button>
      </div>

      <hr class="my-4" />
      <h3>Status actions</h3>
      <div class="actions">
        <button :disabled="saving" @click="changeStatus('open')" class="btn">
          Open
        </button>
        <button
          :disabled="saving"
          @click="changeStatus('in_progress')"
          class="btn">
          In Progress
        </button>
        <button
          :disabled="saving"
          @click="changeStatus('reopened')"
          class="btn">
          Reopen
        </button>
        <button :disabled="saving" @click="changeStatus('closed')" class="btn">
          Close
        </button>

        <!-- Resolve با تصمیم مالی -->
        <button :disabled="saving" @click="resolve(true)" class="btn warn">
          Resolve & Refund User
        </button>
        <button :disabled="saving" @click="resolve(false)" class="btn warn">
          Resolve & Release to Company
        </button>

        <button :disabled="saving" @click="escalate" class="btn danger">
          Escalate
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.badge {
  display: inline-block;
  margin-right: 0.5rem;
  background: #f1f5f9;
  padding: 0.2rem 0.5rem;
  border-radius: 0.4rem;
}
.grid {
  display: grid;
  gap: 0.5rem;
}
.input,
.textarea,
.select {
  border: 1px solid #ddd;
  padding: 0.6rem;
  border-radius: 0.5rem;
  width: 100%;
}
.btn {
  background: #2b6cb0;
  color: white;
  border-radius: 0.5rem;
  padding: 0.5rem 0.8rem;
  margin-right: 0.5rem;
}
.warn {
  background: #6b7280;
}
.danger {
  background: #b91c1c;
}
</style>
