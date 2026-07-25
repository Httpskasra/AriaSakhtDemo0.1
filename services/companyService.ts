// services/companyService.ts
import type { AxiosResponse } from 'axios';
import type { Company } from '~/types/company';

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
}

export interface CompanyListParams {
  page?: number;
  limit?: number;
  sort?: string;
  filter?: string;
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
  const { data } = await $axios.get<CompanyListResponse | Company[]>("/companies", {
    params,
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
  const { $axios } = useNuxtApp();
  const { data } = await $axios.post<Company>('/companies', payload);
  return data;
};

export interface CreateVendorRequestDto {
  companyName: string;
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

export const getMyCompany = async (id: string): Promise<Company> => {
  const { $axios } = useNuxtApp();
  const { data } = await $axios.get<Company>(`/companies/${id}`);
  return data;
};

export const listAllCompanies = async (params?: { limit?: number; page?: number }): Promise<Company[]> => {
  const { $axios } = useNuxtApp();
  const { data } = await $axios.get<Company[]>('/companies', { params });
  return data;
};
