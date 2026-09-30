import { useApiClient } from '~/services/apiClient';

export type CustomerRequestType = 'price_quote' | 'wholesale' | 'abuse_report';
export type CustomerRequestStatus = 'pending' | 'in_review' | 'responded' | 'resolved' | 'rejected' | 'closed';

export interface QuoteRequestPayload {
  title: string;
  productName: string;
  productId?: string;
  quantity: number;
  unit: string;
  deliveryLocation: string;
  description?: string;
}

export interface AbuseReportPayload {
  title: string;
  description: string;
  reporterName: string;
  reporterEmail: string;
  targetUrl?: string;
  targetReference?: string;
}

export interface CustomerRequest {
  _id?: string;
  id?: string;
  type: CustomerRequestType;
  userId?: string;
  title: string;
  productName?: string;
  productId?: string;
  quantity?: number;
  unit?: string;
  deliveryLocation?: string;
  description: string;
  reporterName?: string;
  reporterEmail?: string;
  targetUrl?: string;
  targetReference?: string;
  status: CustomerRequestStatus;
  adminResponse?: string;
  quotedAmount?: number;
  currency?: string;
  reviewedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomerRequestPage {
  items: CustomerRequest[];
  total: number;
  page: number;
  limit: number;
}

export interface ReviewCustomerRequestPayload {
  status: CustomerRequestStatus;
  adminResponse?: string;
  quotedAmount?: number;
}

export async function createPriceQuote(payload: QuoteRequestPayload): Promise<CustomerRequest> {
  const { data } = await useApiClient().post<CustomerRequest>('/customer-requests/price-quotes', payload);
  return data;
}

export async function createWholesaleRequest(payload: QuoteRequestPayload): Promise<CustomerRequest> {
  const { data } = await useApiClient().post<CustomerRequest>('/customer-requests/wholesale', payload);
  return data;
}

export async function createAbuseReport(payload: AbuseReportPayload): Promise<CustomerRequest> {
  const { data } = await useApiClient().post<CustomerRequest>('/customer-requests/reports', payload);
  return data;
}

export async function listMyCustomerRequests(type?: Exclude<CustomerRequestType, 'abuse_report'>): Promise<CustomerRequest[]> {
  const { data } = await useApiClient().get<CustomerRequest[]>('/customer-requests/me', type ? { params: { type } } : undefined);
  return data;
}

export async function listCustomerRequests(params?: {
  type?: CustomerRequestType;
  status?: CustomerRequestStatus;
  page?: number;
  limit?: number;
}): Promise<CustomerRequestPage> {
  const { data } = await useApiClient().get<CustomerRequestPage>('/customer-requests', { params });
  return data;
}

export async function getCustomerRequest(id: string): Promise<CustomerRequest> {
  const { data } = await useApiClient().get<CustomerRequest>(`/customer-requests/${id}`);
  return data;
}

export async function reviewCustomerRequest(id: string, payload: ReviewCustomerRequestPayload): Promise<CustomerRequest> {
  const { data } = await useApiClient().patch<CustomerRequest>(`/customer-requests/${id}/review`, payload);
  return data;
}
