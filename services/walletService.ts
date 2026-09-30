import { useApiClient } from '~/services/apiClient';

export interface Wallet {
  _id?: string;
  userId: string;
  balance: number;
  blockedBalance: number;
  currency: string;
  createdAt?: string;
  updatedAt?: string;
}

export type TransactionType = "CREDIT" | "DEBIT" | "BLOCK" | "UNBLOCK" | "TRANSFER" | "REFUND" | "UNKNOWN";

export interface Transaction {
  _id?: string;
  walletId?: string;
  type: TransactionType;
  amount: number;
  description?: string;
  balanceAfter?: number;
  resultingBalance?: number;
  localId: string;
  status: string;
  currency?: string;
  trackId?: string;
  orderId?: string;
  reference?: string;
  transactionId?: string;
  date?: string;
  timestamp?: string;
  metadata?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreditWalletDto {
  amount: number;
  correlationId?: string;
}

export interface DebitWalletDto {
  amount: number;
  correlationId?: string;
}

export interface WalletTopUpRequest {
  amount: number;
}

export interface WalletTopUpResponse {
  transactionId?: string;
  localId?: string;
  trackId?: string;
  paymentUrl?: string;
}

/**
 * Wallet API Service
 * F4: Removed repetitive error logging and 401 checks. Interceptor handles these.
 */

export async function getWallet(): Promise<Wallet | null> {
  const $axios = useApiClient();
  const { data } = await $axios.get<Wallet | { wallet?: Wallet }>("/wallets");
  if (data && typeof data === "object" && "wallet" in data) {
    return (data as { wallet?: Wallet }).wallet || null;
  }
  return data as Wallet | null;
}

export async function getTransactions(): Promise<Transaction[]> {
  const $axios = useApiClient();
  const { data } = await $axios.get<Transaction[] | { items?: Transaction[] }>("/transaction");
  const items = Array.isArray(data) ? data : data?.items;
  if (!Array.isArray(items)) {
    throw new Error("ساختار پاسخ تراکنش‌ها نامعتبر است.");
  }
  return items.map((item) => normalizeTransaction(item));
}

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

export function normalizeTransaction(item: Partial<Transaction>): Transaction {
  const rawType = String(item.type || "").trim().toUpperCase();
  const resultingBalance = typeof item.resultingBalance === "number" ? item.resultingBalance : item.balanceAfter;

  return {
    ...item,
    type: TRANSACTION_TYPE_ALIASES[rawType] || "UNKNOWN",
    amount: Number(item.amount) || 0,
    localId: item.localId || item.trackId || item._id || "",
    status: String(item.status || "unknown").toLowerCase(),
    resultingBalance,
    balanceAfter: resultingBalance,
  } as Transaction;
}

export async function creditWallet(
  payload: CreditWalletDto
): Promise<Transaction> {
  const $axios = useApiClient();
  const { data } = await $axios.post<Transaction>("/wallets/credit", {
    amount: payload.amount,
    ...(payload.correlationId ? { correlationId: payload.correlationId } : {}),
  });
  return data;
}

export async function debitWallet(
  payload: DebitWalletDto
): Promise<Transaction> {
  const $axios = useApiClient();
  const { data } = await $axios.post<Transaction>("/wallets/debit", {
    amount: payload.amount,
    ...(payload.correlationId ? { correlationId: payload.correlationId } : {}),
  });
  return data;
}

/**
 * Starts an online wallet top-up. The wallet is credited only by the server
 * after the Zibal callback is verified.
 */
export async function initiateWalletTopUp(
  payload: WalletTopUpRequest,
): Promise<WalletTopUpResponse> {
  const $axios = useApiClient();
  const { data } = await $axios.post<WalletTopUpResponse>(
    "/payment/wallet/initiate",
    { amount: payload.amount },
  );
  return data;
}
