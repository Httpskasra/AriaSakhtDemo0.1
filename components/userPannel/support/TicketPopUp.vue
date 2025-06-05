<!-- <template>
  <div class="container">
    <div class="content"></div>
  </div>
</template> -->
<template>
  <div class="container">
    <div class="request field">
      <h2 class="">جزئیات تیکت</h2>
      <p><strong>عنوان:</strong> {{ ticket.title }}</p>
      <p><strong>توضیحات:</strong> {{ ticket.description }}</p>
      <p><strong>وضعیت:</strong> {{ ticket.status }}</p>
      <p><strong>تاریخ:</strong> {{ ticket.date }}</p>
      <p><strong>ساعت:</strong> {{ ticket.time }}</p>
      <p><strong>اولویت:</strong> {{ ticket.priority }}</p>
      <div v-if="ticket.images" class="imgs">
        <img
          v-for="(image, index) in ticket.images"
          :key="index"
          :src="image"
          alt="تصیور ارسالی"
          @click="openImage(image)"
        />
      </div>
    </div>

    <!-- نمایش پاسخ -->
    <div v-if="ticket.reply" class="field respond">
      <h3>پاسخ پشتیبان</h3>
      <div class="detail">
        {{ ticket.reply.sender }} | {{ ticket.reply.date }} -
        {{ ticket.reply.time }}
      </div>
      <p>{{ ticket.reply.message }}</p>
    </div>
    <BaseModal v-if="openedImage" @close="closeImageModal">
      <img :src="openedImage" alt="پیش‌نمایش" class="preview-image" />
    </BaseModal>
    <button @click="$emit('close')" class="close">بستن x</button>
  </div>
</template>
<!-- <button @click="$emit('close')" class="mt-4 text-red-500">بستن</button> -->
<script setup lang="ts">
import type { Ticket } from "@/types/ticket";

const props = defineProps<{
  ticket: Ticket;
}>();

defineEmits<{
  (e: "close"): void;
}>();
const openedImage = ref<string | null>(null);

const openImage = (src: string) => {
  openedImage.value = src;
};

const closeImageModal = () => {
  openedImage.value = null;
};
</script>
<style scoped>
.container {
  color: var(--blue-dark);
}
.field.request {
  background: rgba(22, 115, 255, 0.2);
  margin-bottom: 20px;
}
h3 {
  font-family: "iran-yekan-DemiBold";
  font-size: 14px;
  margin: 5px;
}
h2 {
  font-family: "iran-yekan-DemiBold";
  font-size: 16px;
  color: #253d4e;
  margin: 5px;
}
.field.respond {
  background: rgba(173, 173, 173, 0.4);
}
.field {
  border-radius: 15px;
  padding: 15px;
}
.field p {
  font-family: "iran-yekan-num-Medium";
  font-size: 14px;
  color: #253d4e;
  line-height: 171%;
  margin: 5px;
}
.field p strong {
  font-family: "iran-yekan-DemiBold";
  font-size: 16px;
}
.field .imgs {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-wrap: wrap;
}
.field .imgs img {
  max-width: 150px;
  max-height: 112px;
  border-radius: 10px;
  cursor: pointer;
}
.field .imgs img:hover {
  transform: scale(1.05);
}
.preview-image:hover {
  transform: scale(1.5);
  cursor: zoom-out;
}

.preview-image {
  transition: transform 0.3s ease;
  cursor: zoom-in;
}
.close {
  margin-top: 20px;
  color: var(--red-danger);
  cursor: pointer;
  font-size: 16px;
}

@media (max-width: 767px) {
  .field {
    border-radius: 10px;
    padding: 10px;
  }
  .field p {
    font-size: 12px;
    line-height: 196%;
  }
  .field p strong {
    font-size: 14px;
  }
  .field .imgs {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    flex-wrap: wrap;
  }
  .field .imgs img {
    max-width: 70px;
    max-height: 60px;
    border-radius: 6px;
    cursor: pointer;
  }
  .field .imgs img:hover {
    transform: scale(1);
  }
  .field-image:hover {
    transform: scale(1);
    cursor: zoom-out;
  }

  .field-image {
    transition: transform 0.3s ease;
    cursor: zoom-in;
  }
  .close {
    margin-top: 15px;

    font-size: 12px;
  }
  .detail {
    font-size: 12px;
  }
}
</style>
