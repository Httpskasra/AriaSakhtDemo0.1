export interface UserListPermission {
  resource: string;
  actions: string[];
  companyId?: string;
}

export interface UserListItem {
  id: string;
  phoneNumber?: string;
  nationalId?: string;
  permissions: UserListPermission[];
  profile?: {
    phoneNumber?: string;
    nationalId?: string;
    firstName?: string;
    lastName?: string;
    address?: string;
    walletId?: string;
  };
}

export interface UserListParams {
  page?: number;
  limit?: number;
  sort?: string;
  filter?: string;
}

export interface UserListResponse {
  items: UserListItem[];
  total: number;
  page: number;
  limit: number;
}

export async function listUsers(
  params: UserListParams = {},
): Promise<UserListResponse> {
  const { $axios } = useNuxtApp();
  const page = params.page || 1;
  const limit = params.limit || 50;
  const { data } = await $axios.get<UserListResponse | UserListItem[]>("/users", {
    params: {
      ...params,
      // Keep compatibility with the current backend while the canonical
      // contract is page/limit/sort/filter.
      page,
      limit,
      skip: (page - 1) * limit,
      q: params.filter || undefined,
    },
  });

  if (Array.isArray(data)) {
    return {
      items: data,
      total: data.length,
      page,
      limit,
    };
  }

  return data;
}
