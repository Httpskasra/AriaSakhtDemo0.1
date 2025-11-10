<script setup lang="ts">
import { defineProps, defineEmits, ref } from "vue";
import {
  patchTicketStatus,
  resolveTicket,
  escalateTicket,
  type TicketStatus,
} from "@/services/ticketService";

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
    <button :disabled="busy" @click="setStatus('in_progress')">Start</button>
    <button :disabled="busy" @click="setStatus('reopened')">Reopen</button>
    <button :disabled="busy" @click="setStatus('closed')">Close</button>
    <button :disabled="busy" @click="doResolve(true)">Resolve + Refund</button>
    <button :disabled="busy" @click="doResolve(false)">
      Resolve + Release
    </button>
    <button :disabled="busy" @click="doEscalate()">Escalate</button>
    <button @click="$emit('closed')">Close</button>
  </div>
</template>
