import { useApiClient } from '~/services/apiClient';

export interface InitiatePaymentRequest { orderId: string; amount: number; }
export interface InitiatePaymentResponse { trackId?: string; paymentUrl?: string; url?: string; }

export async function initiatePayment(payload: InitiatePaymentRequest): Promise<InitiatePaymentResponse> {
  const { data } = await useApiClient().post<InitiatePaymentResponse>('/payment/initiate', payload);
  return data;
}

export async function verifyPayment(trackId: string): Promise<unknown> {
  const { data } = await useApiClient().get<unknown>(`/transaction/${encodeURIComponent(trackId)}`);
  return data;
}
