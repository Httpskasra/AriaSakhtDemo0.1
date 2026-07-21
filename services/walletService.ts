import { useNuxtApp } from "#app";

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
  const { $axios } = useNuxtApp();
  const { data } = await $axios.get("/wallets");
  return data;
}

export async function getTransactions(): Promise<Transaction[]> {
  const { $axios } = useNuxtApp();
  const { data } = await $axios.get("/transaction");
  return Array.isArray(data) ? data : [];
}

export async function creditWallet(
  payload: CreditWalletDto
): Promise<Transaction> {
  const { $axios } = useNuxtApp();
  const { data } = await $axios.post("/wallets/credit", {
    amount: payload.amount,
  });
  return data;
}

export async function debitWallet(
  payload: DebitWalletDto
): Promise<Transaction> {
  const { $axios } = useNuxtApp();
  const { data } = await $axios.post("/wallets/debit", {
    amount: payload.amount,
  });
  return data;
}
