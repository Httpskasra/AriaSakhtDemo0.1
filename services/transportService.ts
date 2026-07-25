import type { Order } from "~/types/order";

export interface Transporting {
  _id?: string;
  orderId: string;
  deliveryAddress: string;
  cost: number;
  status: "pending" | "shipped" | "delivered" | "canceled";
  createdAt?: string;
}

export interface TransportListParams {
  page?: number;
  limit?: number;
  sort?: string;
  filter?: string;
  orderId?: string;
}

export interface TransportListResponse {
  items: Transporting[];
  total: number;
  page: number;
  limit: number;
}

export interface OrderListItem extends Pick<Order, "_id" | "createdAt" | "status"> {
  totalAmount?: number;
}

export async function listTransportings(
  params: TransportListParams = {},
): Promise<TransportListResponse> {
  const { $axios } = useNuxtApp();
  const { data } = await $axios.get<TransportListResponse | Transporting[]>(
    "/transport",
    { params },
  );

  if (Array.isArray(data)) {
    return {
      items: data,
      total: data.length,
      page: params.page || 1,
      limit: params.limit || data.length,
    };
  }

  return data;
}

export async function listTransportOrders(
  params: { page?: number; limit?: number; sort?: string; filter?: string } = {},
) {
  const { $axios } = useNuxtApp();
  const { data } = await $axios.get<{
    items: OrderListItem[];
    total: number;
    page: number;
    limit: number;
  } | OrderListItem[]>("/orders", { params });

  if (Array.isArray(data)) {
    return {
      items: data,
      total: data.length,
      page: params.page || 1,
      limit: params.limit || data.length,
    };
  }

  return data;
}
