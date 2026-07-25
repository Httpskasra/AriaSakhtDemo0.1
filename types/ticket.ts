export enum TicketPriority {
  Low = "low",
  Medium = "medium",
  High = "high",
  Urgent = "urgent",
}

export enum TicketStatus {
  Open = "open",
  InProgress = "in_progress",
  Resolved = "resolved",
  Closed = "closed",
  Reopened = "reopened",
  Escalated = "escalated",
}

export interface Ticket {
  id: string;
  title: string;
  status: TicketStatus;
  description: string;
  priority: TicketPriority;
  createdBy?: string;
  assignedTo?: string;
  orderId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TicketComment {
  id: string;
  content: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTicketCommentDto {
  content: string;
}
