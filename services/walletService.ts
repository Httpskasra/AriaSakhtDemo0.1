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

export interface Transaction {
  _id?: string;
  walletId?: string;
  type: string;
  amount: number;
  description?: string;
  balanceAfter?: number;
  localId: string;
  status: string;
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
  return data && "wallet" in data ? data.wallet || null : data;
}

export async function getTransactions(): Promise<Transaction[]> {
  const $axios = useApiClient();
  const { data } = await $axios.get<Transaction[] | { items?: Transaction[] }>("/transaction");
  const items = Array.isArray(data) ? data : data?.items;
  if (!Array.isArray(items)) {
    throw new Error("ساختار پاسخ تراکنش‌ها نامعتبر است.");
  }
  return items;
}

export async function creditWallet(
  payload: CreditWalletDto
): Promise<Transaction> {
  const $axios = useApiClient();
  const { data } = await $axios.post("/wallets/credit", {
    amount: payload.amount,
    ...(payload.correlationId ? { correlationId: payload.correlationId } : {}),
  });
  return data;
}

export async function debitWallet(
  payload: DebitWalletDto
): Promise<Transaction> {
  const $axios = useApiClient();
  const { data } = await $axios.post("/wallets/debit", {
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
