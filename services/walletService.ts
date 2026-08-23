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
}

export interface DebitWalletDto {
  amount: number;
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
  });
  return data;
}

export async function debitWallet(
  payload: DebitWalletDto
): Promise<Transaction> {
  const $axios = useApiClient();
  const { data } = await $axios.post("/wallets/debit", {
    amount: payload.amount,
  });
  return data;
}
