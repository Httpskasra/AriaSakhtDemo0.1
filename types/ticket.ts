export type TicketPriority = "کم" | "متوسط" | "زیاد";
export type TicketStatus = "درحال بررسی" | "پاسخ داده شده" | "بسته" | "باز";

// export interface Ticket {
//   id: number;
//   title: string;
//   status: TicketStatus;
//   date: string;
//   time: string;
//   description: string;
//   priority: TicketPriority;
// }
export interface TicketReply {
  id: number;
  message: string;
  date: string;
  time: string;
  sender: "کاربر" | "پشتیبان";
}

export interface Ticket {
  id: number;
  title: string;
  status: TicketStatus;
  date: string;
  time: string;
  description: string;
  priority: TicketPriority;
  images?: string[];
  reply?: TicketReply; // 👈 حالا فقط یک پاسخ داریم
}
