// // services/ticketService.ts
// import type { Ticket } from "@/types/ticket";

// const { $axios } = useNuxtApp();

// // دریافت همه تیکت‌ها
// export const getTickets = async (): Promise<Ticket[]> => {
//   const res = await $axios.get("/tickets");
//   return res.data;
// };

// // ارسال تیکت جدید
// export const createTicket = async (ticket: Ticket): Promise<Ticket> => {
//   const res = await $axios.post("/tickets", ticket);
//   return res.data;
// };

// // حذف تیکت
// export const deleteTicket = async (id: number): Promise<void> => {
//   await $axios.delete(`/tickets/${id}`);
// };

// // ویرایش تیکت
// export const updateTicket = async (ticket: Ticket): Promise<Ticket> => {
//   const res = await $axios.put(`/tickets/${ticket.id}`, ticket);
//   return res.data;
// };

// services/ticketService.ts
// import type { Ticket } from "@/types/ticket";
// import { useNuxtApp } from "#app";

// const { $axios } = useNuxtApp(); // استفاده صحیح از axios داخل setup

// export const getTickets = async (): Promise<Ticket[]> => {
//   const res = await $axios.get("/tickets");
//   return res.data;
// };

// export const createTicket = async (ticket: Ticket): Promise<Ticket> => {
//   const res = await $axios.post("/tickets", ticket);
//   return res.data;
// };

// export const deleteTicket = async (id: number): Promise<void> => {
//   await $axios.delete(`/tickets/${id}`);
// };

// export const updateTicket = async (ticket: Ticket): Promise<Ticket> => {
//   const res = await $axios.put(`/tickets/${ticket.id}`, ticket);
//   return res.data;
// };
import type { Ticket } from "@/types/ticket";

export const getTickets = async ($axios: any): Promise<Ticket[]> => {
  return await $axios.get("/tickets").then((res: any) => res.data);
};

export const createTicket = async (
  $axios: any,
  ticket: Ticket
): Promise<Ticket> => {
  return await $axios.post("/tickets", ticket).then((res: any) => res.data);
};

export const deleteTicket = async (
  $axios: any,
  ticketId: number
): Promise<void> => {
  await $axios.delete(`/tickets/${ticketId}`);
};
