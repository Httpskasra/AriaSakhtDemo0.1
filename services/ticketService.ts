import type {
  CreateTicketCommentDto,
  Ticket,
  TicketComment,
  TicketPriority,
  TicketStatus,
} from "~/types/ticket";

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

export interface TicketStatusResponseDto {
  status: TicketStatus;
}

// ==== API calls ====
export async function createTicket(body: CreateTicketDto): Promise<Ticket> {
  const { $axios } = useNuxtApp();
  const { data } = await $axios.post("/tickets", body);
  return data;
}

export async function listTickets(params?: { page?: number; limit?: number }): Promise<Ticket[] | { items: Ticket[]; total: number }> {
  const { $axios } = useNuxtApp();
  const { data } = await $axios.get("/tickets", { params });
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
  // Fixed: removed redundant /api/ prefix
  await $axios.post(`/tickets/${id}/escalate`);
}

export async function resolveTicket(
  id: string,
  refund: boolean
): Promise<void> {
  const { $axios } = useNuxtApp();
  // Fixed: removed redundant /api/ prefix
  await $axios.patch(`/tickets/${id}/resolve`, { refund });
}
export async function getTicketComments(id: string): Promise<TicketComment[]> {
  const { $axios } = useNuxtApp();
  const { data } = await $axios.get(`/tickets/${id}/comments`);
  return data;
}

export async function addTicketComment(
  id: string,
  body: CreateTicketCommentDto
): Promise<TicketComment> {
  const { $axios } = useNuxtApp();
  const { data } = await $axios.post(`/tickets/${id}/comments`, body);
  return data;
}
