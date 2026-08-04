import { useApiClient } from '~/services/apiClient';

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

export async function getTransactionStatus(trackId: string, signal?: AbortSignal): Promise<PaymentTransaction> {
  const $axios = useApiClient();
  const { data } = await $axios.get(`/transaction/${encodeURIComponent(trackId)}`, { signal });
  return data;
}
