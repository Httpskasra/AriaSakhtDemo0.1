<script setup lang="ts">
import { defineProps, defineEmits, ref } from "vue";
import {
  patchTicketStatus,
  resolveTicket,
  escalateTicket,
} from "@/services/ticketService";
import type { TicketStatus } from "@/types/ticket";

const props = defineProps<{ id: string }>();
const emit = defineEmits(["changed", "closed"]);
const busy = ref(false);

async function setStatus(s: TicketStatus, refund?: boolean) {
  busy.value = true;
  try {
    await patchTicketStatus(props.id, s, refund);
    emit("changed");
  } finally {
    busy.value = false;
  }
}
async function doResolve(refund: boolean) {
  busy.value = true;
  try {
    await resolveTicket(props.id, refund);
    emit("changed");
  } finally {
    busy.value = false;
  }
}
async function doEscalate() {
  busy.value = true;
  try {
    await escalateTicket(props.id);
    emit("changed");
  } finally {
    busy.value = false;
  }
}
</script>

<template>
  <div class="modal">
    <h4>Ticket actions</h4>
    <UButton :disabled="busy" size="sm" @click="setStatus('in_progress')">Start</UButton>
    <UButton :disabled="busy" size="sm" color="neutral" variant="soft" @click="setStatus('reopened')">Reopen</UButton>
    <UButton :disabled="busy" size="sm" color="neutral" variant="soft" @click="setStatus('closed')">Close</UButton>
    <UButton :disabled="busy" size="sm" color="error" variant="soft" @click="doResolve(true)">Resolve + Refund</UButton>
    <UButton :disabled="busy" size="sm" color="success" variant="soft" @click="doResolve(false)">
      Resolve + Release
    </UButton>
    <UButton :disabled="busy" size="sm" color="warning" variant="soft" @click="doEscalate()">Escalate</UButton>
    <UButton size="sm" color="neutral" variant="ghost" @click="$emit('closed')">Close</UButton>
  </div>
</template>
