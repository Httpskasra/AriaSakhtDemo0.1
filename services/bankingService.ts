import { useApiClient } from '~/services/apiClient';

export type BankAccountStatus = 'pending' | 'approved' | 'rejected';
export type WithdrawalStatus = 'pending' | 'approved' | 'rejected' | 'paid';

export interface BankAccount {
  id: string;
  userId?: string;
  accountHolderName: string;
  cardNumber: string;
  cardNumberMasked: string;
  iban: string;
  ibanMasked: string;
  bankName?: string;
  status: BankAccountStatus;
  rejectionReason?: string;
  reviewedAt?: string;
  createdAt?: string;
}

export interface WithdrawalRequest {
  id: string;
  userId?: string;
  bankAccountId: string;
  amount: number;
  currency: string;
  description?: string;
  status: WithdrawalStatus;
  rejectionReason?: string;
  reviewedAt?: string;
  paidAt?: string;
  createdAt?: string;
  bankAccount?: BankAccount;
}

export interface RegisterBankAccountPayload {
  accountHolderName: string;
  cardNumber: string;
  iban: string;
  bankName?: string;
}

export async function listMyBankAccounts(): Promise<BankAccount[]> {
  const { data } = await useApiClient().get<BankAccount[]>('/bank-accounts');
  return Array.isArray(data) ? data : [];
}

export async function registerBankAccount(payload: RegisterBankAccountPayload): Promise<BankAccount> {
  const { data } = await useApiClient().post<BankAccount>('/bank-accounts', payload);
  return data;
}

export async function removeBankAccount(id: string): Promise<void> {
  await useApiClient().delete(`/bank-accounts/${encodeURIComponent(id)}`);
}

export async function listMyWithdrawals(): Promise<WithdrawalRequest[]> {
  const { data } = await useApiClient().get<WithdrawalRequest[]>('/withdrawals');
  return Array.isArray(data) ? data : [];
}

export async function createWithdrawal(payload: { bankAccountId: string; amount: number; description?: string }): Promise<WithdrawalRequest> {
  const { data } = await useApiClient().post<WithdrawalRequest>('/withdrawals', payload);
  return data;
}

export async function listBankAccountsForAdmin(status?: BankAccountStatus | ''): Promise<BankAccount[]> {
  const { data } = await useApiClient().get<BankAccount[]>('/admin/bank-accounts', { params: status ? { status } : undefined });
  return Array.isArray(data) ? data : [];
}

export async function reviewBankAccount(id: string, status: Exclude<BankAccountStatus, 'pending'>, rejectionReason?: string): Promise<BankAccount> {
  const { data } = await useApiClient().patch<BankAccount>(`/admin/bank-accounts/${encodeURIComponent(id)}/review`, {
    status,
    ...(rejectionReason?.trim() ? { rejectionReason: rejectionReason.trim() } : {}),
  });
  return data;
}

export async function listWithdrawalsForAdmin(status?: WithdrawalStatus | ''): Promise<WithdrawalRequest[]> {
  const { data } = await useApiClient().get<WithdrawalRequest[]>('/admin/withdrawals', { params: status ? { status } : undefined });
  return Array.isArray(data) ? data : [];
}

export async function reviewWithdrawal(id: string, status: Exclude<WithdrawalStatus, 'pending'>, rejectionReason?: string): Promise<WithdrawalRequest> {
  const { data } = await useApiClient().patch<WithdrawalRequest>(`/admin/withdrawals/${encodeURIComponent(id)}/status`, {
    status,
    ...(rejectionReason?.trim() ? { rejectionReason: rejectionReason.trim() } : {}),
  });
  return data;
}
