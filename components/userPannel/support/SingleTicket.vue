<template>
  <div v-if="ticket" class="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[75vh]">
    <!-- Ticket Header -->
    <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
      <div class="flex items-center gap-4">
        <UButton
          color="gray"
          variant="ghost"
          icon="i-lucide-arrow-right"
          @click="$emit('back')"
        />
        <div>
          <h2 class="text-xl font-bold text-gray-800">{{ ticket.title }}</h2>
          <div class="flex items-center gap-3 mt-1 text-xs text-muted">
            <span>شناسه: #{{ ticket.id.slice(-6).toUpperCase() }}</span>
            <span>•</span>
            <span class="font-num">{{ formatFullDateTime(ticket.createdAt) }}</span>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <UBadge :color="statusColors[ticket.status]" variant="soft">{{ statusLabels[ticket.status] }}</UBadge>
        <UBadge :color="priorityColors[ticket.priority]" variant="soft">{{ priorityLabels[ticket.priority] }}</UBadge>
      </div>
    </div>

    <!-- Messages List -->
    <div class="flex-1 overflow-y-auto p-6 space-y-6 bg-[url('/assets/img/chat-bg.png')] bg-repeat">
      <!-- Original Description -->
      <div class="flex justify-start">
        <div class="max-w-[80%] bg-white rounded-2xl rounded-tr-none p-4 shadow-sm border border-gray-100">
          <p class="text-sm text-gray-700 leading-relaxed">{{ ticket.description }}</p>
          <div class="text-[10px] text-muted mt-2 text-right font-num">{{ formatTime(ticket.createdAt) }}</div>
        </div>
      </div>

      <!-- Comments/Replies -->
      <div v-for="comment in ticket.comments" :key="comment.id" 
           :class="['flex', comment.userId === currentUserId ? 'justify-end' : 'justify-start']">
        <div :class="['max-w-[80%] p-4 shadow-sm rounded-2xl relative', 
                     comment.userId === currentUserId ? 'bg-primary text-white rounded-tl-none' : 'bg-white text-gray-700 border border-gray-100 rounded-tr-none']">
          <p class="text-sm leading-relaxed">{{ comment.content }}</p>
          
          <!-- Attachments -->
          <div v-if="comment.attachments?.length" class="mt-3 grid grid-cols-2 gap-2">
            <div v-for="(img, idx) in comment.attachments" :key="idx" 
                 class="aspect-square rounded-lg overflow-hidden bg-black/10 cursor-pointer"
                 @click="openImage(img)">
              <img :src="img" class="size-full object-cover" />
            </div>
          </div>

          <div :class="['text-[10px] mt-2 font-num', comment.userId === currentUserId ? 'text-white/70' : 'text-muted']">
            {{ formatTime(comment.createdAt) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Reply Input -->
    <div class="p-4 border-t border-gray-100 bg-white">
      <div class="flex flex-col gap-3">
        <div v-if="attachments.length" class="flex gap-2 overflow-x-auto pb-2">
          <div v-for="(file, idx) in attachments" :key="idx" class="relative size-16 shrink-0 border rounded-lg overflow-hidden">
            <img :src="file.preview" class="size-full object-cover" />
            <UButton
              color="red"
              variant="solid"
              icon="i-lucide-x"
              size="2xs"
              class="absolute top-0 right-0 rounded-full scale-75"
              @click="removeAttachment(idx)"
            />
          </div>
        </div>

        <div class="flex gap-2">
          <UTextarea
            v-model="replyContent"
            placeholder="پاسخ خود را بنویسید..."
            class="flex-1"
            :rows="1"
            autoresize
            :disabled="sending"
          />
          <div class="flex gap-1 items-end">
            <UButton
              color="gray"
              variant="ghost"
              icon="i-lucide-paperclip"
              @click="triggerFile"
              :disabled="sending"
            />
            <UButton
              color="primary"
              icon="i-lucide-send-horizontal"
              class="rtl:rotate-180"
              :loading="sending"
              @click="sendReply"
            />
          </div>
        </div>
        <input type="file" ref="fileInput" class="hidden" multiple accept="image/*" @change="handleFiles" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  ticket: Object,
  currentUserId: String
})

const emit = defineEmits(['back', 'add-comment'])

const replyContent = ref('')
const sending = ref(false)
const attachments = ref([])
const fileInput = ref(null)

const statusLabels = { open: 'باز', in_progress: 'در حال بررسی', resolved: 'حل شده', closed: 'بسته شده' }
const statusColors = { open: 'blue', in_progress: 'orange', resolved: 'green', closed: 'gray' }
const priorityLabels = { low: 'کم', medium: 'متوسط', high: 'زیاد', urgent: 'فوری' }
const priorityColors = { low: 'gray', medium: 'blue', high: 'orange', urgent: 'red' }

const triggerFile = () => fileInput.value.click()

const handleFiles = (e) => {
  const files = Array.from(e.target.files)
  files.forEach(file => {
    const reader = new FileReader()
    reader.onload = (ev) => {
      attachments.value.push({ file, preview: ev.target.result })
    }
    reader.readAsDataURL(file)
  })
}

const removeAttachment = (idx) => attachments.value.splice(idx, 1)

const sendReply = async () => {
  if (!replyContent.value.trim() && !attachments.value.length) return
  
  sending.value = true
  try {
    const payload = {
      content: replyContent.value,
      attachments: attachments.value.map(a => a.preview) // Simplified for prototype
    }
    emit('add-comment', payload)
    replyContent.value = ''
    attachments.value = []
  } finally {
    sending.value = false
  }
}

const openImage = (url) => window.open(url, '_blank')
</script>
