<template>
  <div class="cats">
    <div class="item" v-for="cat in cats" :key="cat.id">
      <img :src="`/userPannleIcons/${cat.icon}`" alt="icon" />
      <div class="item-title">
        <span>{{ cat.name }}</span>
        <span class="count" :style="{ color: cat.color }">{{ cat.count }}</span>
      </div>
    </div>
    <div class="create">
      <button @click="isCreateModalOpen = true">ایجاد تیکت جدید</button>
    </div>
    <BaseModal v-if="isCreateModalOpen" @close="isCreateModalOpen = false">
      <NewTicketForm
        @submitted="handleNewTicket"
        @cancel="isCreateModalOpen = false"
      />
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import type { Ticket } from "@/types/ticket";
const isCreateModalOpen = ref(false);
const emit = defineEmits(["submitted"]);
const handleNewTicket = (newTicket: Ticket) => {
  isCreateModalOpen.value = false;
  emit("submitted", newTicket);
};
const cats = [
  {
    id: 1,
    name: "پاسخ داده شده",
    count: 10,
    icon: "ticket-answered.png",
    color: "#00BA00",
  },
  {
    id: 2,
    name: "باز",
    count: 10,
    icon: "ticket-open.png",
    color: "#FF0000",
  },
  {
    id: 3,
    name: "بسته",
    count: 10,
    icon: "ticket-closed.png",
    color: "#FDC040",
  },
  {
    id: 4,
    name: "درحال بررسی",
    count: 10,
    icon: "ticket-pending.png",
    color: "#6612C1",
  },
  {
    id: 5,
    name: "همه",
    count: 10,
    icon: "ticket-all.png",
    color: "#57626C",
  },
];
</script>

<style scoped>
.cats * {
  font-family: "iran-yekan-Light";
  color: var(--blue-dark);
  font-size: 13px;
}
.cats {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 95%;
  height: 180px;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 8px;
  padding: 10px;
  margin-top: 10px;
}
.cats .item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  height: 80%;
  flex-basis: 15%;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}
.cats .item:hover {
  border: 1px solid #57626c;
  cursor: pointer;
}
.cats .item .item-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}

.cats .item .item-title .count {
  font-family: "iran-yekan-DemiBold";
  font-size: 14px;
}
.cats .create button {
  font-family: "iran-yekan-DemiBold";
  flex-basis: 10%;
  background-color: var(--green-number);
  border-radius: 8px;
  padding: 10px;
  color: #fff;
}
.cats .create button:hover {
  opacity: 0.8;
  cursor: pointer;
}
@media (max-width: 767px) {
  .cats {
    height: 370px;
    flex-wrap: wrap;
  }
  .cats * {
    font-size: 10px;
  }
  .cats .item {
    flex-basis: 30%;
    height: 90px;
  }
  .cats .item img {
    width: 40px;
  }
  .cats .item .item-title .count {
    font-size: 10px;
  }

  .cats .create button {
    width: 300px;
  }
}
</style>
