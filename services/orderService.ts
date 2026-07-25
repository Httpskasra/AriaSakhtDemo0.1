// services/orderService.ts

import { getPopulatedCart } from '~/services/cartService';
import { useUser } from '~/composables/useUser';
import type {
  Order,
  OrderItemDto,
  OrderStatus,
  OrdersListResponse,
  OrderStatusUpdateDto,
} from '~/types/order';

// ==== Types (طبق CreateOrderDto بک‌اند) ====
export interface CreateOrderDto {
  userId: string;
  items: OrderItemDto[];
  totalPrice: number;
  status: 'pending';
  companyId: string;
  shippingAddress?: string;
  paymentMethod?: string;
  transportId?: string;
}

export interface CreateOrderOptions {
  shippingAddress?: string;
  paymentMethod?: string;
  transportId?: string;
}

// ==== API calls ====

/**
 * ساخت payload کامل سفارش از cart/session و ایجاد سفارش.
 * بک‌اند cart فعال را دوباره validate و سفارش‌ها را بر اساس شرکت گروه‌بندی می‌کند.
 */
export async function createOrder(options: CreateOrderOptions = {}): Promise<Order[]> {
  const { $axios } = useNuxtApp();
  const { user, fetchUser } = useUser();

  if (!user.value?.userId) await fetchUser();
  const userId = user.value?.userId;
  if (!userId) throw new Error('برای ایجاد سفارش باید وارد حساب کاربری شوید.');

  const { data: cart } = await getPopulatedCart();
  const items = (cart.items || []).map((item: any): OrderItemDto => {
    const productId = typeof item.productId === 'string'
      ? item.productId
      : item.productId?._id || item.productId?.id;
    const companyId = typeof item.companyId === 'string'
      ? item.companyId
      : item.companyId?._id || item.companyId?.id;

    if (!productId || !companyId || !Number.isFinite(Number(item.priceAtAdd))) {
      throw new Error('اطلاعات یکی از اقلام سبد خرید برای ایجاد سفارش کامل نیست.');
    }

    return {
      productId: String(productId),
      companyId: String(companyId),
      quantity: Number(item.quantity),
      priceAtAdd: Number(item.priceAtAdd),
      ...(item.variant ? { variant: item.variant } : {}),
    };
  });

  if (items.length === 0) throw new Error('سبد خرید خالی است.');

  const payload: CreateOrderDto = {
    userId,
    items,
    totalPrice: items.reduce((sum, item) => sum + item.priceAtAdd * item.quantity, 0),
    status: 'pending',
    companyId: items[0].companyId,
    ...(options.shippingAddress ? { shippingAddress: options.shippingAddress } : {}),
    ...(options.paymentMethod ? { paymentMethod: options.paymentMethod } : {}),
    ...(options.transportId ? { transportId: options.transportId } : {}),
  };

  const { data } = await $axios.post<Order | Order[]>('/orders', payload);
  return Array.isArray(data) ? data : [data];
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
  body?: { transportId?: string }
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
