import type { CSSProperties } from "vue";
import { OrderStatus, type OrderStatus as OrderStatusValue } from "~/types/order";
import { TicketStatus } from "~/types/ticket";
import type { TicketStatus as TicketStatusValue } from "~/types/ticket";

export type TransactionStatus = string;
export type StatusValue = OrderStatusValue | TicketStatusValue | TransactionStatus | null | undefined;
export type StatusSemantic = "success" | "warning" | "danger" | "info" | "neutral";
export type StatusPillConfig = {
  label: string;
  semantic: StatusSemantic;
  icon?: string;
};

type StatusTokenPair = {
  fg: string;
  bg: string;
};

const STATUS_TOKENS: Record<StatusSemantic, StatusTokenPair> = {
  success: {
    fg: "var(--color-success-fg)",
    bg: "var(--color-success-bg)",
  },
  warning: {
    fg: "var(--color-warning-fg)",
    bg: "var(--color-warning-bg)",
  },
  danger: {
    fg: "var(--color-danger-fg)",
    bg: "var(--color-danger-bg)",
  },
  info: {
    fg: "var(--color-info-fg)",
    bg: "var(--color-info-bg)",
  },
  neutral: {
    fg: "var(--color-neutral-fg)",
    bg: "var(--color-neutral-bg)",
  },
};

const STATUS_SEMANTICS: Record<string, StatusSemantic> = {
  success: "success",
  active: "success",
  completed: "success",
  resolved: "success",
  delivered: "success",
  pending: "warning",
  draft: "warning",
  in_progress: "warning",
  shipped: "warning",
  failed: "danger",
  error: "danger",
  cancelled: "danger",
  canceled: "danger",
  inactive: "danger",
  archived: "danger",
  deleted: "danger",
  refunded: "danger",
  escalated: "danger",
  open: "info",
  paid: "info",
  transfer: "info",
  closed: "neutral",
  reopened: "neutral",
  unknown: "neutral",
};

function normalizeStatus(status: StatusValue) {
  return String(status || "unknown").trim().toLowerCase();
}

export function getStatusSemantic(status: StatusValue): StatusSemantic {
  return STATUS_SEMANTICS[normalizeStatus(status)] || "neutral";
}

export function useStatusStyle(status: StatusValue): CSSProperties {
  const tokens = STATUS_TOKENS[getStatusSemantic(status)];

  return {
    color: tokens.fg,
    backgroundColor: tokens.bg,
  };
}

export const ORDER_STATUS_MAP: Record<OrderStatusValue, StatusPillConfig> = {
  [OrderStatus.Pending]: {
    label: "در انتظار پرداخت",
    semantic: "warning",
    icon: "i-lucide-clock",
  },
  [OrderStatus.Paid]: {
    label: "پرداخت شده",
    semantic: "info",
    icon: "i-lucide-check-circle-2",
  },
  [OrderStatus.Shipped]: {
    label: "ارسال شده",
    semantic: "warning",
    icon: "i-lucide-truck",
  },
  [OrderStatus.Delivered]: {
    label: "تحویل شده",
    semantic: "success",
    icon: "i-lucide-package-check",
  },
  [OrderStatus.Cancelled]: {
    label: "لغو شده",
    semantic: "danger",
    icon: "i-lucide-circle-x",
  },
  [OrderStatus.Refunded]: {
    label: "مرجوع شده",
    semantic: "danger",
    icon: "i-lucide-rotate-ccw",
  },
};

export const TICKET_STATUS_MAP: Record<TicketStatusValue, StatusPillConfig> = {
  [TicketStatus.Open]: {
    label: "باز",
    semantic: "info",
    icon: "i-lucide-circle-dot",
  },
  [TicketStatus.InProgress]: {
    label: "در حال رسیدگی",
    semantic: "warning",
    icon: "i-lucide-clock",
  },
  [TicketStatus.Resolved]: {
    label: "حل‌شده",
    semantic: "success",
    icon: "i-lucide-check-circle-2",
  },
  [TicketStatus.Closed]: {
    label: "بسته",
    semantic: "neutral",
    icon: "i-lucide-lock",
  },
  [TicketStatus.Reopened]: {
    label: "دوباره بازشده",
    semantic: "neutral",
    icon: "i-lucide-rotate-ccw",
  },
  [TicketStatus.Escalated]: {
    label: "ارجاع‌شده",
    semantic: "danger",
    icon: "i-lucide-alert-triangle",
  },
};

export const TICKET_PRIORITY_MAP: Record<string, StatusPillConfig> = {
  low: { label: "کم", semantic: "neutral", icon: "i-lucide-minus" },
  medium: { label: "متوسط", semantic: "info", icon: "i-lucide-equal" },
  high: { label: "زیاد", semantic: "warning", icon: "i-lucide-arrow-up" },
  urgent: { label: "فوری", semantic: "danger", icon: "i-lucide-alert-triangle" },
};

export const TRANSACTION_STATUS_MAP: Record<string, StatusPillConfig> = {
  pending: {
    label: "در انتظار",
    semantic: "warning",
    icon: "i-lucide-clock",
  },
  success: {
    label: "موفق",
    semantic: "success",
    icon: "i-lucide-check-circle-2",
  },
  completed: {
    label: "موفق",
    semantic: "success",
    icon: "i-lucide-check-circle-2",
  },
  failed: {
    label: "ناموفق",
    semantic: "danger",
    icon: "i-lucide-circle-x",
  },
  error: {
    label: "ناموفق",
    semantic: "danger",
    icon: "i-lucide-circle-x",
  },
};

export const TRANSACTION_TYPE_MAP: Record<string, StatusPillConfig> = {
  credit: {
    label: "واریز",
    semantic: "success",
    icon: "i-lucide-arrow-down-left",
  },
  debit: {
    label: "برداشت",
    semantic: "danger",
    icon: "i-lucide-arrow-up-right",
  },
  transfer: {
    label: "انتقال",
    semantic: "info",
    icon: "i-lucide-arrow-right-left",
  },
};

export function getOrderStatusConfig(status: OrderStatusValue): StatusPillConfig {
  return ORDER_STATUS_MAP[status] || {
    label: String(status || "نامشخص"),
    semantic: getStatusSemantic(status),
    icon: "i-lucide-help-circle",
  };
}

export function getTicketStatusConfig(status: TicketStatusValue): StatusPillConfig {
  return TICKET_STATUS_MAP[status] || {
    label: String(status || "نامشخص"),
    semantic: getStatusSemantic(status),
    icon: "i-lucide-help-circle",
  };
}

export function getTicketPriorityConfig(priority: StatusValue): StatusPillConfig {
  const key = normalizeStatus(priority);
  return TICKET_PRIORITY_MAP[key] || {
    label: String(priority || "نامشخص"),
    semantic: "neutral",
    icon: "i-lucide-help-circle",
  };
}

export function getTransactionStatusConfig(status: StatusValue): StatusPillConfig {
  const key = normalizeStatus(status);
  return TRANSACTION_STATUS_MAP[key] || {
    label: String(status || "نامشخص"),
    semantic: getStatusSemantic(status),
    icon: "i-lucide-help-circle",
  };
}

export function getTransactionTypeConfig(type: StatusValue): StatusPillConfig {
  const key = normalizeStatus(type);
  return TRANSACTION_TYPE_MAP[key] || {
    label: String(type || "نامشخص"),
    semantic: getStatusSemantic(type),
    icon: "i-lucide-help-circle",
  };
}
