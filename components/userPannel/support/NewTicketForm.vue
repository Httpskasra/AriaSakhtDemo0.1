<script setup lang="ts">
import { ref } from "vue";
import { createTicket, type TicketPriority } from "@/services/ticketService";

const title = ref("");
const description = ref("");
const priority = ref<TicketPriority>("low");
const orderId = ref<string | undefined>(undefined);

const loading = ref(false);
const errorMsg = ref("");
const successMsg = ref("");

async function submitForm() {
  errorMsg.value = "";
  successMsg.value = "";
  loading.value = true;
  try {
    await createTicket({
      title: title.value,
      description: description.value,
      priority: priority.value,
      orderId: orderId.value,
    });
    successMsg.value = "Ticket created successfully";
    // اگر پاپ‌آپ داری ببند، یا روتر بده به لیست
    // this.$emit('created')  یا  router.push('/support/tickets')
  } catch (e: any) {
    errorMsg.value = e?.response?.data?.message ?? "Failed to create ticket";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <form @submit.prevent="submitForm" class="space-y-4">
    <input v-model="title" required placeholder="Title" class="input" />
    <textarea
      v-model="description"
      required
      placeholder="Describe your issue"
      class="textarea" />
    <select v-model="priority" class="select">
      <option value="low">Low</option>
      <option value="medium">Medium</option>
      <option value="high">High</option>
      <option value="urgent">Urgent</option>
    </select>
    <input v-model="orderId" placeholder="Order ID (optional)" class="input" />

    <button :disabled="loading" class="btn-primary">
      {{ loading ? "Submitting..." : "Create Ticket" }}
    </button>

    <p v-if="errorMsg" class="text-red-500">{{ errorMsg }}</p>
    <p v-if="successMsg" class="text-green-600">{{ successMsg }}</p>
  </form>
</template>

<style scoped>
.input,
.textarea,
.select {
  width: 100%;
  border: 1px solid #ddd;
  padding: 0.6rem;
  border-radius: 0.5rem;
}
.btn-primary {
  padding: 0.6rem 1rem;
  border-radius: 0.5rem;
  background: #2b6cb0;
  color: white;
}
</style>
