// tickets.ts

// ==== Types (طبق Swagger) ====
export type TicketPriority = "low" | "medium" | "high" | "urgent";
export type TicketStatus =
  | "open"
  | "in_progress"
  | "resolved"
  | "closed"
  | "reopened"
  | "escalated";

export interface CreateTicketDto {
  title: string;
  description: string;
  priority?: TicketPriority; // default: low
  orderId?: string;
}

export interface UpdateTicketDto {
  title?: string;
  description?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  assignedTo?: string;
  orderId?: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdBy?: string;
  assignedTo?: string;
  orderId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TicketStatusResponseDto {
  status: TicketStatus;
}

// ==== API calls ====
export async function createTicket(body: CreateTicketDto): Promise<Ticket> {
  const { $axios } = useNuxtApp();
  const { data } = await $axios.post("/tickets", body);
  return data;
}

export async function listTickets(): Promise<Ticket[]> {
  const { $axios } = useNuxtApp();
  const { data } = await $axios.get("/tickets");
  return data;
}

export async function getTicket(id: string): Promise<Ticket> {
  const { $axios } = useNuxtApp();
  const { data } = await $axios.get(`/tickets/${id}`);
  return data;
}

export async function updateTicket(
  id: string,
  body: UpdateTicketDto
): Promise<Ticket> {
  const { $axios } = useNuxtApp();
  const { data } = await $axios.patch(`/tickets/${id}`, body);
  return data;
}

export async function getTicketStatus(
  id: string
): Promise<TicketStatusResponseDto> {
  const { $axios } = useNuxtApp();
  const { data } = await $axios.get(`/tickets/${id}/status`);
  return data;
}

export async function patchTicketStatus(
  id: string,
  status: TicketStatus,
  refund?: boolean
): Promise<Ticket> {
  const { $axios } = useNuxtApp();
  const { data } = await $axios.patch(`/tickets/${id}/status`, {
    status,
    refund,
  });
  return data;
}

export async function escalateTicket(id: string): Promise<void> {
  const { $axios } = useNuxtApp();
  await $axios.post(`/api/tickets/${id}/escalate`);
}

export async function resolveTicket(
  id: string,
  refund: boolean
): Promise<void> {
  const { $axios } = useNuxtApp();
  await $axios.patch(`/api/tickets/${id}/resolve`, { refund });
}
