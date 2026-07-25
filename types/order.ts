export const OrderStatus = {
  Pending: "pending",
  Paid: "paid",
  Shipped: "shipped",
  Delivered: "delivered",
  Cancelled: "cancelled",
  Refunded: "refunded",
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export interface OrderItem {
  productId: string;
  companyId: string;
  quantity: number;
  priceAtAdd: number;
  price?: number;
  variant?: { name?: string; value?: string };
}

export type OrderItemDto = OrderItem;

export interface Order {
  id: string;
  _id?: string;
  userId: string;
  companyId?: string;
  items: OrderItem[];
  status: OrderStatus;
  totalPrice: number;
  totalAmount?: number;
  shippingAddress?: string;
  shippingCost?: number;
  notes?: string;
  transportId?: string;
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
