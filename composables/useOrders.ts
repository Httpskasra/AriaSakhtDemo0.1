// composables/useOrders.ts

import { ref, computed } from "vue";
import type { Order, OrderStatus } from "@/services/orderService";
import {
  listOrders,
  getOrder,
  markOrderAsPaid,
  markOrderAsShipped,
  markOrderAsDelivered,
  refundOrder,
} from "@/services/orderService";

export function useOrders() {
  const orders = ref<Order[]>([]);
  const selectedOrder = ref<Order | null>(null);
  const loading = ref(false);
  const updating = ref(false);
  const errorMsg = ref("");

  const fetchOrders = async () => {
    loading.value = true;
    errorMsg.value = "";
    try {
      const result = await listOrders();
      orders.value = Array.isArray(result) ? result : result.items || [];
    } catch (err: any) {
      errorMsg.value =
        err?.response?.data?.message || err?.message || "خطای نامشخص";
      orders.value = [];
    } finally {
      loading.value = false;
    }
  };

  const fetchOrderById = async (id: string) => {
    try {
      selectedOrder.value = await getOrder(id);
      return selectedOrder.value;
    } catch (err: any) {
      console.error("خطا در دریافت سفارش:", err);
      throw err;
    }
  };

  const updateOrderStatus = async (id: string, newStatus: OrderStatus) => {
    updating.value = true;
    try {
      let updatedOrder: Order;

      switch (newStatus) {
        case "paid":
          updatedOrder = await markOrderAsPaid(id);
          break;
        case "shipped":
          updatedOrder = await markOrderAsShipped(id);
          break;
        case "delivered":
          updatedOrder = await markOrderAsDelivered(id);
          break;
        default:
          throw new Error("وضعیت نامعتبر");
      }

      selectedOrder.value = updatedOrder;
      const idx = orders.value.findIndex(
        (o) => (o.id || o._id) === (updatedOrder.id || updatedOrder._id)
      );
      if (idx >= 0) orders.value[idx] = updatedOrder;

      return updatedOrder;
    } finally {
      updating.value = false;
    }
  };

  const refundOrderById = async (id: string) => {
    updating.value = true;
    try {
      const refundedOrder = await refundOrder(id);
      selectedOrder.value = refundedOrder;
      const idx = orders.value.findIndex(
        (o) => (o.id || o._id) === (refundedOrder.id || refundedOrder._id)
      );
      if (idx >= 0) orders.value[idx] = refundedOrder;
      return refundedOrder;
    } finally {
      updating.value = false;
    }
  };

  return {
    orders,
    selectedOrder,
    loading,
    updating,
    errorMsg,
    fetchOrders,
    fetchOrderById,
    updateOrderStatus,
    refundOrderById,
  };
}
