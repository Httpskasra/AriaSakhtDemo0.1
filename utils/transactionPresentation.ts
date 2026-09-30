import type { Transaction, TransactionType } from "~/services/walletService";

export type TransactionDirection = "in" | "out" | "neutral";
export type TransactionSemantic = "success" | "warning" | "danger" | "info" | "neutral";

export type TransactionPresentation = {
  label: string;
  semantic: TransactionSemantic;
  icon: string;
  direction: TransactionDirection;
};

const TRANSACTION_TYPE_ALIASES: Record<string, TransactionType> = {
  CREDIT: "CREDIT",
  DEBIT: "DEBIT",
  BLOCK: "BLOCK",
  UNBLOCK: "UNBLOCK",
  TRANSFER: "TRANSFER",
  REFUND: "REFUND",
  CREDITED: "CREDIT",
  DEBITED: "DEBIT",
};

export function normalizeTransactionType(type: unknown): TransactionType {
  const normalized = String(type || "").trim().toUpperCase();
  return TRANSACTION_TYPE_ALIASES[normalized] || "UNKNOWN";
}

function transactionReason(transaction: Pick<Transaction, "metadata">) {
  return String(transaction.metadata?.reason || "").trim().toLowerCase();
}

export function getTransactionPresentation(transaction: Pick<Transaction, "type" | "metadata">): TransactionPresentation {
  const type = normalizeTransactionType(transaction.type);
  const reason = transactionReason(transaction);

  if (type === "CREDIT") return { label: "واریز", semantic: "success", icon: "i-lucide-arrow-down-left", direction: "in" };
  if (type === "DEBIT") return reason === "withdrawal-paid"
    ? { label: "برداشت نهایی", semantic: "danger", icon: "i-lucide-banknote-arrow-up", direction: "out" }
    : { label: "کسر موجودی", semantic: "danger", icon: "i-lucide-arrow-up-right", direction: "out" };
  if (type === "BLOCK") return reason === "withdrawal-pending"
    ? { label: "رزرو مبلغ برداشت", semantic: "warning", icon: "i-lucide-lock-keyhole", direction: "out" }
    : { label: "رزرو مبلغ", semantic: "warning", icon: "i-lucide-lock-keyhole", direction: "out" };
  if (type === "UNBLOCK") return reason.startsWith("withdrawal-")
    ? { label: "آزادسازی مبلغ برداشت", semantic: "info", icon: "i-lucide-lock-open", direction: "in" }
    : { label: "آزادسازی مبلغ", semantic: "info", icon: "i-lucide-lock-open", direction: "in" };
  if (type === "REFUND") return { label: "بازگشت وجه", semantic: "success", icon: "i-lucide-rotate-ccw", direction: "in" };
  if (type === "TRANSFER") return { label: "انتقال", semantic: "info", icon: "i-lucide-arrow-right-left", direction: "out" };
  return { label: "نامشخص", semantic: "neutral", icon: "i-lucide-help-circle", direction: "neutral" };
}

export function getTransactionAmountSign(transaction: Pick<Transaction, "type" | "metadata">) {
  const direction = getTransactionPresentation(transaction).direction;
  return direction === "in" ? "+" : direction === "out" ? "−" : "";
}

export function getTransactionDescription(transaction: Pick<Transaction, "description" | "metadata">) {
  const reason = String(transaction.metadata?.reason || "").trim().toLowerCase();
  const descriptions: Record<string, string> = {
    credit: "شارژ کیف پول",
    debit: "کسر از موجودی کیف پول",
    "withdrawal-pending": "رزرو مبلغ درخواست برداشت",
    "withdrawal-rejected": "آزادسازی مبلغ برداشت ردشده",
    "withdrawal-create-failed": "آزادسازی مبلغ برداشت ثبت‌نشده",
    "withdrawal-paid": "تسویه درخواست برداشت",
    "release-withdrawal-hold": "آزادسازی مبلغ برداشت",
  };
  return descriptions[reason] || transaction.description || "—";
}

export function getTransactionSearchText(transaction: Transaction) {
  const presentation = getTransactionPresentation(transaction);
  return [
    transaction.description,
    transaction.type,
    presentation.label,
    transaction.status,
    transaction.trackId,
    transaction.localId,
    transaction.orderId,
    transaction.metadata?.reason,
  ].filter(Boolean).join(" ").toLocaleLowerCase();
}
