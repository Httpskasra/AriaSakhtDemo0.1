<template>
  <div
    class="ticket"
    :style="{ borderRight: `10px solid ${findColor(ticket.status)}` }"
  >
    <div class="ticket-title">
      <span>{{ ticket.title }}</span>
    </div>
    <div class="description">
      <span>{{ ticket.description }}</span>
    </div>
    <div class="priority">
      <span>اولویت {{ ticket.priority }} </span>
    </div>
    <div class="info">
      <span>{{ ticket.date }}</span>
      <span>{{ ticket.time }}</span>
    </div>
    <div class="status-container">
      <div class="status">
        <span>{{ ticket.status }}</span>
        <div
          class="status-color"
          :style="{ backgroundColor: findColor(ticket.status) }"
        ></div>
      </div>
    </div>

    <div class="see-more">
      <button @click="handleClick">مشاهده تیکت</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Ticket } from "@/types/ticket";
const props = defineProps<{
  ticket: Ticket;
}>();
const findColor = (status: string) => {
  if (status === "پاسخ داده شده") return "#00BA00";
  if (status === "درحال بررسی") return "#6612C1";
  if (status === "بسته") return "#FDC040";
  if (status === "باز") return "#FF0000";
};
const emit = defineEmits<{
  (e: "show-details", ticket: Ticket): void;
}>();
const handleClick = () => {
  emit("show-details", props.ticket);
};
</script>

<style scoped>
.ticket {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}
.tickets .ticket .ticket-title {
  font-family: "iran-yekan-DemiBold";
  font-size: 14px;
}
.tickets .ticket .description {
  font-family: "iran-yekan-Light";
  font-size: 12px;
  overflow: hidden;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}
.tickets .ticket .priority {
  font-family: "iran-yekan-DemiBold";
  font-size: 14px;
}
.tickets .ticket .info {
  font-family: "iran-yekan-Light";
  font-size: 14px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
}
.tickets .ticket .status-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 150px;
}
.tickets .ticket .status {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  border-radius: 2px 12px 12px 12px;
  border: 1px solid rgba(0, 0, 0);
  padding: 5px 12px;
  font-size: 12px;
}
.tickets .ticket .status-color {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 10px;
}
.tickets .ticket .see-more {
  font-family: "iran-yekan-DemiBold";
  font-size: 14px;
}
.tickets .ticket .see-more button {
  border: 1px solid #57626c;
  border-radius: 8px;
  padding: 10px 20px;
  color: #57626c;
  font-size: 14px;
}
.tickets .ticket .see-more button:hover {
  background-color: #57626c;
  color: #fff;
  cursor: pointer;
}

@media (max-width: 767px) {
  .tickets {
    width: 100%;
    padding: 10px;
  }
  .tickets .ticket {
    padding: 10px 5px;
  }
  .tickets .ticket {
    width: 100%;
  }
  .tickets .ticket .ticket-title {
    font-size: 8px;
  }
  .tickets .ticket .description {
    max-width: 50px;
    font-size: 6px;
    margin-right: 2px;
  }
  .tickets .ticket .priority {
    font-size: 6px;
    margin: 0 4px;
  }
  .tickets .ticket .info {
    font-size: 8px;
  }
  .tickets .ticket .status-container {
    width: 75px;

    margin: 0 5px;
  }

  .tickets .ticket .status {
    font-size: 6px;
  }
  .tickets .ticket .status-color {
    width: 6px;
    height: 6px;
    border-radius: 100%;
    margin-right: 5px;
  }
  .tickets .ticket .see-more button {
    padding: 4px 8px;

    font-size: 5px;
  }
}
</style>
