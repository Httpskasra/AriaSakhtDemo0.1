import { useNuxtApp } from '#app';

export interface PaymentTransaction {
  trackId?: string;
  localId: string;
  orderId?: string;
  userId: string;
  amount: number;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  verifiedAt?: string;
  ref_id?: string;
}

export async function getTransactionStatus(trackId: string): Promise<PaymentTransaction> {
  const { $axios } = useNuxtApp();
  const { data } = await $axios.get(`/transaction/${encodeURIComponent(trackId)}`);
  return data;
}
