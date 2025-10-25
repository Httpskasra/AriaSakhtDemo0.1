<template>
  <NuxtLayout name="dashboard">
    <div v-if="canRead" class="container">
      <div class="title">
        <h1>پشتیبانی</h1>
        <img src="/userPannleIcons/support.png" alt="" />
      </div>

      <SupportHeader :canCreate="canCreate" @submitted="handleNewTicket" />
      <div class="fillter">
        <div class="fillter-btn">
          <button>
            <span>فیلتر</span>
            <img src="/userPannleIcons/filter-alt.png" />
          </button>
        </div>
        <div class="search">
          <SearchBar :dark="true" />
        </div>
      </div>
      <SupportTickets v-if="tickets.length" :tickets="tickets" />
    </div>
    <div v-else class="no-access">شما به این بخش دسترسی ندارید.</div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { Ticket } from "@/types/ticket";
import {
  getTickets,
  createTicket,
  deleteTicket,
} from "@/services/ticketService";
import dashboardAuth from "~/middleware/dashboard-auth";
definePageMeta({
  middleware: dashboardAuth,
});
const { $axios } = useNuxtApp(); // Access $axios from Nuxt context
const tickets = ref<Ticket[]>([]);
import { useAccess } from "~/composables/useAccess";
import { Resource } from "~/types/permissions";

const { canRead, canCreate, canDelete, canUpdate } = useAccess(
  Resource.TICKETING
);

const fetchTickets = async () => {
  if (!canRead) return;
  try {
    tickets.value = await getTickets($axios);
  } catch (err) {
    console.error("خطا در دریافت تیکت‌ها:", err);
    tickets.value = [];
  }
};

const handleNewTicket = async (ticket: Ticket) => {
  if (!canCreate) return alert("شما اجازه ایجاد تیکت را ندارید.");
  try {
    const created = await createTicket($axios, ticket);
    // If backend returns created ticket, use it; otherwise push the original
    tickets.value.push(created || ticket);
  } catch (err) {
    console.error("خطا در ایجاد تیکت:", err);
    // optimistic fallback
    tickets.value.push(ticket);
  }
};

onMounted(() => {
  fetchTickets();
});
</script>
<style scoped>
* {
  box-sizing: border-box;
}
.title {
  color: var(--blue-dark);
  font-family: "iran-yekan-Bold";
  width: 230px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin: 15px;
}
.title h1 {
  font-size: 36px;
}
.title img {
  width: 66px;
  height: 66px;
}

.fillter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 95%;
  margin: 0 auto;
  margin-top: 10px;
  background-color: #fff;
  border-radius: 8px;
  padding: 20px 100px;
}
.fillter .fillter-btn button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 10px 20px;
}
.fillter .fillter-btn button:hover {
  background-color: rgba(0, 0, 0, 0.1);
  cursor: pointer;
}
.fillter .search {
  flex-basis: 50%;
}
@media (max-width: 767px) {
  .title {
    width: 40%;
  }
  .title h1 {
    font-size: 20px;
  }
  .title img {
    width: 40px;
    height: 40px;
  }
  .fillter {
    align-items: center;
    justify-content: space-between;
    padding: 15px 25px;
  }
  .fillter .search {
    flex-basis: 60%;
    margin-top: 10px;
  }
  .fillter .fillter-btn button {
    padding: 5px 10px;
    font-size: 14px;
  }
  .fillter .fillter-btn button img {
    width: 20px;
    height: 20px;
  }
}
</style>
