// services/orderService.ts

// ==== Types (طبق Swagger) ====
export type OrderStatus =
  | "pending"
  | "paid"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export interface OrderItemDto {
  productId: string;
  quantity: number;
  price: number;
  priceAtAdd?: number;
  variantId?: string;
  selectedVariant?: Record<string, string>;
}

export interface CreateOrderDto {
  items: OrderItemDto[];
  shippingAddress?: string;
  shippingCost?: number;
  notes?: string;
}

export interface Order {
  id: string;
  _id?: string;
  userId: string;
  companyId?: string;
  items: OrderItemDto[];
  status: OrderStatus;
  totalPrice: number;
  shippingAddress?: string;
  shippingCost?: number;
  notes?: string;
  trackingCode?: string;
  createdAt?: string;
  updatedAt?: string;
  paidAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
}

export interface OrdersListResponse {
  items: Order[];
  total: number;
  page: number;
  limit: number;
}

export interface OrderStatusUpdateDto {
  status: OrderStatus;
  refund?: boolean;
}

// ==== API calls ====

/**
 * ایجاد سفارش جدید
 */
export async function createOrder(body: CreateOrderDto): Promise<Order> {
  const { $axios } = useNuxtApp();
  const { data } = await $axios.post("/orders", body);
  return data;
}

/**
 * دریافت لیست سفارش‌های کاربر یا شرکت
 * Regular users see only their own orders. Admins see all.
 */
export async function listOrders(params?: {
  userId?: string;
  companyId?: string;
  page?: number;
  limit?: number;
}): Promise<Order[] | OrdersListResponse> {
  const { $axios } = useNuxtApp();
  const { data } = await $axios.get("/orders", { params });
  return data;
}

/**
 * دریافت جزئیات سفارش
 * Regular users can only access their own orders.
 */
export async function getOrder(id: string): Promise<Order> {
  const { $axios } = useNuxtApp();
  const { data } = await $axios.get(`/orders/${id}`);
  return data;
}

/**
 * علامت‌گذاری سفارش به‌عنوان پرداخت‌شده
 */
export async function markOrderAsPaid(id: string): Promise<Order> {
  const { $axios } = useNuxtApp();
  const { data } = await $axios.patch(`/orders/${id}/mark-paid`);
  return data;
}

/**
 * علامت‌گذاری سفارش به‌عنوان ارسال‌شده
 */
export async function markOrderAsShipped(
  id: string,
  body?: { trackingCode?: string }
): Promise<Order> {
  const { $axios } = useNuxtApp();
  const { data } = await $axios.patch(`/orders/${id}/mark-shipped`, body || {});
  return data;
}

/**
 * علامت‌گذاری سفارش به‌عنوان تحویل‌داده‌شده
 */
export async function markOrderAsDelivered(id: string): Promise<Order> {
  const { $axios } = useNuxtApp();
  const { data } = await $axios.patch(`/orders/${id}/mark-delivered`);
  return data;
}

/**
 * بازپرداخت سفارش
 */
export async function refundOrder(id: string): Promise<Order> {
  const { $axios } = useNuxtApp();
  const { data } = await $axios.patch(`/orders/${id}/refund`);
  return data;
}

/**
 * تایید تحویل سفارش توسط کاربر
 */
export async function confirmDelivery(
  id: string,
  body?: { confirmation?: boolean }
): Promise<Order> {
  const { $axios } = useNuxtApp();
  const { data } = await $axios.patch(
    `/orders/${id}/confirm-delivery`,
    body || {}
  );
  return data;
}
