// services/companyService.ts
import type { AxiosResponse } from 'axios';

export interface Company {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  registrationNumber: string;
  address?: string;
  nationalId?: string;
  image?: string;
  status: 'pending' | 'active' | 'suspended' | 'rejected';
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

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

export const createCompany = async (payload: CreateCompanyDto): Promise<Company> => {
  const { $axios } = useNuxtApp();
  const { data } = await $axios.post<Company>('/companies', payload);
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
