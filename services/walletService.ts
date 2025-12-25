import { useNuxtApp } from "#app";

export interface Wallet {
  _id?: string;
  userId: string;
  balance: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Transaction {
  _id?: string;
  walletId?: string;
  type: "credit" | "debit";
  amount: number;
  description?: string;
  balanceAfter?: number;
  localId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreditWalletDto {
  amount: number;
  description?: string;
}

export interface DebitWalletDto {
  amount: number;
  description?: string;
}

// Generate unique localId
const generateLocalId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Get wallet info
export async function getWallet(): Promise<Wallet | null> {
  const { $axios } = useNuxtApp();
  try {
    const { data } = await $axios.get("/wallets");
    return data;
  } catch (err: any) {
    console.error("خطا در دریافت کیف پول:", err);
    return null;
  }
}

// Get transaction history
export async function getTransactions(): Promise<Transaction[]> {
  const { $axios } = useNuxtApp();
  try {
    const { data } = await $axios.get("/transaction");
    return Array.isArray(data) ? data : [];
  } catch (err: any) {
    console.error("خطا در دریافت تاریخچه تراکنش:", err);
    return [];
  }
}

// Credit wallet
export async function creditWallet(
  payload: CreditWalletDto
): Promise<Transaction> {
  const { $axios } = useNuxtApp();
  try {
    const { data } = await $axios.post("/wallets/credit", {
      amount: payload.amount,
      description: payload.description || "",
      localId: generateLocalId(),
    });
    return data;
  } catch (err: any) {
    if (err?.response?.status === 401) {
      throw new Error("لطفا وارد سایت شوید");
    }
    throw new Error(err?.response?.data?.message || "خطا در شارژ کیف پول");
  }
}

// Debit wallet
export async function debitWallet(
  payload: DebitWalletDto
): Promise<Transaction> {
  const { $axios } = useNuxtApp();
  try {
    const { data } = await $axios.post("/wallets/debit", {
      amount: payload.amount,
      description: payload.description || "",
      localId: generateLocalId(),
    });
    return data;
  } catch (err: any) {
    if (err?.response?.status === 401) {
      throw new Error("لطفا وارد سایت شوید");
    }
    throw new Error(err?.response?.data?.message || "خطا در برداشت از کیف پول");
  }
}
