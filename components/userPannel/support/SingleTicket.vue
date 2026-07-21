<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { getTicket, getTicketComments, addTicketComment } from '~/services/ticketService';
import type { Ticket, TicketComment } from '~/services/ticketService';
import { formatDate, formatTime } from '~/utils/date';

const route = useRoute();
const ticketId = route.params.id as string;

const ticket = ref<Ticket | null>(null);
const comments = ref<TicketComment[]>([]);
const newMessage = ref('');
const isLoading = ref(true);
const isSending = ref(false);
const scrollContainer = ref<HTMLElement | null>(null);

const fetchTicketData = async () => {
  try {
    isLoading.value = true;
    const [ticketRes, commentsRes] = await Promise.all([
      getTicket(ticketId),
      getTicketComments(ticketId)
    ]);
    ticket.value = ticketRes;
    comments.value = commentsRes;
    await scrollToBottom();
  } catch (error) {
    console.error('Failed to load ticket:', error);
  } finally {
    isLoading.value = false;
  }
};

const scrollToBottom = async () => {
  await nextTick();
  if (scrollContainer.value) {
    scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
  }
};

const handleSendMessage = async () => {
  if (!newMessage.value.trim() || isSending.value) return;

  try {
    isSending.value = true;
    await addTicketComment(ticketId, { content: newMessage.value });
    newMessage.value = '';
    // Refresh comments
    comments.value = await getTicketComments(ticketId);
    await scrollToBottom();
  } catch (error) {
    console.error('Failed to send message:', error);
  } finally {
    isSending.value = false;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'open': return 'text-green-500 bg-green-50';
    case 'in_progress': return 'text-blue-500 bg-blue-50';
    case 'resolved': return 'text-gray-500 bg-gray-50';
    case 'escalated': return 'text-red-500 bg-red-50';
    default: return 'text-gray-500 bg-gray-50';
  }
};

onMounted(() => {
  fetchTicketData();
});
</script>

<template>
  <div class="flex flex-col h-[calc(100vh-12rem)] max-h-[800px] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <!-- Header -->
    <div v-if="ticket" class="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center shrink-0">
      <div>
        <h1 class="text-lg font-bold text-gray-900">{{ ticket.title }}</h1>
        <div class="flex items-center gap-3 mt-1 text-sm text-gray-500">
          <span>کد تیکت: #{{ ticketId.slice(-6).toUpperCase() }}</span>
          <span :class="['px-2 py-0.5 rounded-full text-xs font-medium', getStatusColor(ticket.status)]">
            {{ ticket.status }}
          </span>
          <span>{{ formatDate(ticket.createdAt) }}</span>
        </div>
      </div>
      <UButton
        to="/dashboard/support"
        variant="ghost"
        color="neutral"
        icon="i-lucide-arrow-right"
      >
        بازگشت
      </UButton>
    </div>

    <!-- Messages Area -->
    <div ref="scrollContainer" class="flex-1 overflow-y-auto p-4 space-y-6">
      <div v-if="isLoading" class="flex justify-center py-10">
        <UIcon name="i-lucide-loader-circle" class="animate-spin size-8 text-primary-500" />
      </div>

      <template v-else>
        <!-- Initial Description -->
        <div v-if="ticket" class="flex flex-col items-start max-w-[85%]">
          <div class="bg-primary-50 text-primary-900 p-4 rounded-2xl rounded-tr-none shadow-sm ring-1 ring-primary-100">
            <p class="text-sm leading-relaxed whitespace-pre-wrap">{{ ticket.description }}</p>
            <span class="text-[10px] opacity-70 mt-2 block text-left">{{ formatTime(ticket.createdAt) }}</span>
          </div>
        </div>

        <!-- Thread Comments -->
        <div 
          v-for="comment in comments" 
          :key="comment.id"
          class="flex flex-col"
          :class="[comment.createdBy === ticket?.createdBy ? 'items-start max-w-[85%]' : 'items-end ml-auto max-w-[85%] text-right']"
        >
          <div 
            class="p-4 rounded-2xl shadow-sm ring-1"
            :class="[
              comment.createdBy === ticket?.createdBy 
                ? 'bg-primary-50 text-primary-900 rounded-tr-none ring-primary-100' 
                : 'bg-gray-100 text-gray-800 rounded-tl-none ring-gray-200'
            ]"
          >
            <p class="text-sm leading-relaxed whitespace-pre-wrap">{{ comment.content }}</p>
            <div class="flex justify-between items-center mt-2 gap-4">
               <span class="text-[10px] opacity-60">{{ comment.createdBy === ticket?.createdBy ? 'شما' : 'پشتیبانی تجاریس' }}</span>
               <span class="text-[10px] opacity-60">{{ formatTime(comment.createdAt) }}</span>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Input Area -->
    <div class="p-4 border-t border-gray-100 bg-white shrink-0">
      <div class="relative flex items-end gap-2">
        <UTextarea
          v-model="newMessage"
          placeholder="پاسخ خود را اینجا بنویسید..."
          :rows="2"
          class="flex-1"
          :disabled="isSending || ticket?.status === 'closed'"
          autoresize
          @keydown.enter.prevent="handleSendMessage"
        />
        <UButton
          color="primary"
          icon="i-lucide-send-horizontal"
          size="lg"
          class="shrink-0"
          :loading="isSending"
          :disabled="!newMessage.trim() || ticket?.status === 'closed'"
          @click="handleSendMessage"
        >
          ارسال
        </UButton>
      </div>
      <p v-if="ticket?.status === 'closed'" class="text-center text-xs text-red-500 mt-2">
        این تیکت بسته شده است و امکان ارسال پاسخ جدید وجود ندارد.
      </p>
    </div>
  </div>
</template>
