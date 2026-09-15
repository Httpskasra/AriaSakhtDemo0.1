// services/companyService.ts
import type { AxiosResponse } from 'axios';
import type { Company, VendorRequest, VendorRequestStatus } from '~/types/company';
import { useApiClient } from '~/services/apiClient';

export interface CreateCompanyDto {
  name: string;
  email: string;
  phone?: string;
  registrationNumber: string;
  address?: string;
  nationalId?: string;
  imageMeta?: {
    filename: string;
    contentType: string;
    size: number;
  };
  image?: string;
}

export interface CompanyListParams {
  page?: number;
  limit?: number;
  sort?: string;
  filter?: string;
  managed?: boolean;
}

export interface CompanyListResponse {
  items: Company[];
  total: number;
  page: number;
  limit: number;
}

export const listCompanies = async (
  params: CompanyListParams = {},
): Promise<CompanyListResponse> => {
  const { $axios } = useNuxtApp();
  const { managed, ...query } = params;
  const { data } = await $axios.get<CompanyListResponse | Company[]>(managed ? "/companies/manage" : "/companies", {
    params: query,
  });

  if (Array.isArray(data)) {
    return {
      items: data,
      total: data.length,
      page: params.page || 1,
      limit: params.limit || data.length,
    };
  }

  return data;
};

export const createCompany = async (payload: CreateCompanyDto): Promise<Company> => {
  const { data } = await useApiClient().post<Company>('/companies', payload);
  return data;
};

export const uploadCompanyImage = async (file: File): Promise<string> => {
  const { $axios } = useNuxtApp();
  const formData = new FormData();
  formData.append('type', 'company');
  formData.append('files', file);
  const { data } = await $axios.post<{ items: Array<{ publicUrl: string }> }>(
    '/images/upload',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  const publicUrl = data?.items?.[0]?.publicUrl;
  if (!publicUrl) throw new Error('آدرس عمومی لوگو از سرور دریافت نشد.');
  return publicUrl;
};

export async function updateCompany(id: string, payload: Partial<CreateCompanyDto> & { image?: string }): Promise<Company> {
  const { data } = await useApiClient().patch<Company>(`/companies/${encodeURIComponent(id)}`, payload);
  return data;
}

export async function changeCompanyStatus(id: string, status: string): Promise<Company> {
  const { data } = await useApiClient().patch<Company>(`/companies/${encodeURIComponent(id)}/status`, { status });
  return data;
}

export async function deleteCompany(id: string): Promise<void> {
  await useApiClient().delete(`/companies/${encodeURIComponent(id)}`);
}

export interface CreateVendorRequestDto {
  companyName: string;
  sellerType?: 'legal' | 'individual';
  email: string;
  phone?: string;
  registrationNumber?: string;
  nationalId?: string;
  address?: string;
  imageUrl?: string;
}

export const createVendorRequest = async (payload: CreateVendorRequestDto) => {
  const { $axios } = useNuxtApp();
  const { data } = await $axios.post('/vendor-requests', payload);
  return data;
};

export const createAuthenticatedVendorRequest = async (payload: CreateVendorRequestDto): Promise<VendorRequest> => {
  const { data } = await useApiClient().post<VendorRequest>('/vendor-requests/me', payload);
  return data;
};

export const listMyVendorRequests = async (): Promise<VendorRequest[]> => {
  const { data } = await useApiClient().get<VendorRequest[]>('/vendor-requests/me');
  return data;
};

export interface VendorRequestListParams {
  status?: VendorRequestStatus;
  page?: number;
  limit?: number;
}

export interface VendorRequestListResponse {
  items: VendorRequest[];
  total: number;
  page: number;
  limit: number;
}

export const listVendorRequests = async (
  params: VendorRequestListParams = {},
): Promise<VendorRequestListResponse> => {
  const { data } = await useApiClient().get<VendorRequestListResponse>('/vendor-requests', { params });
  return data;
};

export const reviewVendorRequest = async (
  id: string,
  status: Exclude<VendorRequestStatus, 'pending'>,
  rejectionReason?: string,
): Promise<VendorRequest> => {
  const { data } = await useApiClient().patch<VendorRequest>(`/vendor-requests/${encodeURIComponent(id)}/review`, {
    status,
    ...(rejectionReason?.trim() ? { rejectionReason: rejectionReason.trim() } : {}),
  });
  return data;
};

export const uploadPublicCompanyImage = async (file: File): Promise<string> => {
  const { $axios } = useNuxtApp();
  const formData = new FormData();
  formData.append('files', file);
  const { data } = await $axios.post<{ items: Array<{ publicUrl: string }> }>(
    '/images/public-company-upload',
    formData,
  );
  const publicUrl = data?.items?.[0]?.publicUrl;
  if (!publicUrl) throw new Error('آدرس عمومی لوگو از سرور دریافت نشد.');
  return publicUrl;
};

export const getMyCompany = async (): Promise<Company | null> => {
  const { data } = await useApiClient().get<Company | null>('/companies/mine');
  return data;
};

export const listAllCompanies = async (params?: { limit?: number; page?: number }): Promise<Company[]> => {
  const { $axios } = useNuxtApp();
  const { data } = await $axios.get<Company[]>('/companies', { params });
  return data;
};
