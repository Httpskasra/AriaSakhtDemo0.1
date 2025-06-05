<template>
  <div class="container">
    <form class="ticket-form" @submit.prevent="submitForm">
      <h2>ثبت تیکت جدید</h2>

      <label>
        عنوان:
        <input v-model="form.title" type="text" required />
      </label>

      <label>
        توضیحات:
        <textarea v-model="form.description" required></textarea>
      </label>

      <label>
        اولویت:
        <select v-model="form.priority" required>
          <option value="کم">کم</option>
          <option value="متوسط">متوسط</option>
          <option value="زیاد">زیاد</option>
        </select>
      </label>

      <label>
        افزودن تصویر:
        <input
          type="file"
          @change="handleImageUpload"
          multiple
          accept="image/*"
        />
      </label>

      <div class="actions">
        <button @submit.prevent="submitForm" class="submit">ارسال</button>
        <button type="button" class="close" @click="$emit('cancel')">
          انصراف
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { Ticket, TicketPriority } from "@/types/ticket";
const form = ref({
  title: "",
  description: "",
  priority: "کم",
  images: [] as string[],
});

const emit = defineEmits(["submitted"]);

const handleImageUpload = (event: Event) => {
  const files = (event.target as HTMLInputElement).files;
  if (!files) return;
  // form.value.images = [];

  for (const file of Array.from(files)) {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        form.value.images.push(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }
};

// const submitForm = () => {
//   const newTicket: Ticket = {
//     id: Date.now(), // یا UUID
//     title: form.value.title,
//     description: form.value.description,
//     priority: form.value.priority as TicketPriority,
//     status: "درحال بررسی",
//     date: new Date().toLocaleDateString("fa-IR"),
//     time: new Date().toLocaleTimeString("fa-IR"),
//     images: form.value.images,
//   };
//   emit("submitted", newTicket);
// };
import { createTicket } from "@/services/ticketService";
const { $axios } = useNuxtApp();

const submitForm = async () => {
  const newTicket: Ticket = {
    id: Date.now(),
    title: form.value.title,
    description: form.value.description,
    priority: form.value.priority as TicketPriority,
    status: "درحال بررسی",
    date: new Date().toLocaleDateString("fa-IR"),
    time: new Date().toLocaleTimeString("fa-IR"),
    images: form.value.images,
  };
  await createTicket($axios, newTicket); // Pass $axios here
  emit("submitted", newTicket);
};
</script>

<style scoped>
.ticket-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

input,
textarea,
select {
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.actions {
  display: flex;
  justify-content: space-between;
}

button {
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}
button.submit {
  background-color: #4caf50;
  color: white;
}

button.close {
  color: var(--red-danger);
}
</style>
