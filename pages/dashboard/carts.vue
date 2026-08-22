<template>
    <DashboardPageHeader title="سبد خرید" icon="/icons/cart.png" />

    <div class="container" dir="rtl">
      <!-- Loading State -->
      <div v-if="loading" class="col-products">
        <SharedAsyncState state="loading" />
      </div>

      <div v-else-if="loadError" class="col-products">
        <SharedAsyncState state="error" :message="loadError" @retry="fetchCart" />
      </div>

      <!-- Empty Cart -->
      <div v-else-if="cartItems.length === 0" class="col-products">
        <SharedAsyncState state="empty" title="سبد خرید خالی است" message="هنوز محصولی به سبد خرید اضافه نشده است." />
      </div>

      <!-- Cart Items -->
      <div v-else class="col-products">
        <div class="cart-items">
          <div
            v-for="item in cartItems"
            :key="item.productId"
            class="cart-item">
            <div class="item-info">
              <h3>{{ item.productName }}</h3>
              <p class="sku">SKU: {{ item.sku }}</p>
              <p v-if="item.variant" class="variant">
                {{ item.variant.name }}:
                {{ item.variant.value }}
              </p>
              <p v-if="item.companyName" class="company">
                شرکت: {{ item.companyName }}
              </p>
              <p class="quantity">تعداد: {{ item.quantity }}</p>
            </div>
            <div class="item-price">
              <p class="price">{{ numberFormat(item.price) }} تومان</p>
              <p class="total">
                جمع: {{ numberFormat((item.price || 0) * item.quantity) }} تومان
              </p>
            </div>
            <div class="item-actions">
              <UInput
                v-model.number="item.quantity"
                type="number"
                min="1"
                @change="updateQuantity(item)"
                class="quantity-input" />
              <UButton
                @click="removeFromCart(item.productId)"
                size="xs"
                color="error">
                حذف
              </UButton>
            </div>
          </div>
        </div>

        <UButton @click="clearCart" color="error" variant="soft" block>
          خالی کردن سبد
        </UButton>
      </div>

      <!-- Cart Summary (Factor) -->
      <div class="col-summary" v-if="cartItems.length > 0">
        <div class="summary-box">
          <h2>خلاصه سبد</h2>

          <div class="summary-row">
            <span>تعداد اقلام:</span>
            <span>{{ totalItems }}</span>
          </div>

          <div class="summary-row">
            <span>قیمت کل:</span>
            <span>{{ numberFormat(totalPrice) }} تومان</span>
          </div>

          <div class="summary-row">
            <span>هزینه ارسال:</span>
            <span>{{ numberFormat(shippingCost) }} تومان</span>
          </div>

          <div class="summary-row total">
            <span>جمع نهایی:</span>
            <span>{{ numberFormat(totalPrice + shippingCost) }} تومان</span>
          </div>

          <UButton
            @click="checkout"
            :disabled="isCheckingOut"
            size="lg"
            block>
            {{ isCheckingOut ? "درحال پردازش..." : "تسویه حساب" }}
          </UButton>

          <UButton @click="continueShopping" color="neutral" variant="soft" block>
            ادامه خرید
          </UButton>
        </div>
      </div>
    </div>

</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useUser } from "~/composables/useUser";
import { toUserFacingError } from "~/services/apiClient";

definePageMeta({
  layout: "dashboard",
  middleware: ["auth", "permission"],
  permission: { resource: "carts", action: "r" },
});

useHead({
  title: "داشبورد | سبد خرید",
});

// Get user data
const { user } = useUser();

// Types
interface CartItem {
  productId: string;
  productName: string;
  sku: string;
  price: number;
  quantity: number;
  variant?: { name: string; value: string };
  companyId?: string;
  companyName?: string;
  priceAtAdd?: number;
  discount?: {
    type: string;
    value: number;
  };
}

// State
const { $axios } = useNuxtApp();
const toast = useToast();
const cartItems = ref<CartItem[]>([]);
const loading = ref(false);
const loadError = ref<string | null>(null);
const isCheckingOut = ref(false);
const shippingCost = ref(0);

// Computed
const totalItems = computed(() =>
  cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
);

const totalPrice = computed(() =>
  cartItems.value.reduce(
    (sum, item) => sum + (item.price || 0) * item.quantity,
    0
  )
);

// Helper functions
function numberFormat(n?: number) {
  if (typeof n !== "number") return "-";
  return n.toLocaleString("fa-IR");
}

function showNotification(message: string, type: "success" | "error") {
  toast.add({ title: message, color: type === "success" ? "success" : "error" });
}

// API calls
async function fetchCart() {
  loading.value = true;
  loadError.value = null;
  try {
    // دریافت کارت فعال
    const { data } = await $axios.get("/carts/active");

    // Map API response to CartItem format
    if (data.items && Array.isArray(data.items)) {
      cartItems.value = data.items
        .filter((item: any) => item.productId) // فقط items با productId معتبر
        .map((item: any) => {
          // productId می‌تواند رشته یا object باشد
          const productObj =
            typeof item.productId === "object" ? item.productId : null;
          const companyObj =
            typeof item.companyId === "object" ? item.companyId : null;

          return {
            productId: productObj?._id || item.productId,
            productName: productObj?.name || "محصول نامشخص",
            sku: productObj?.sku || "-",
            price:
              item.priceAtAdd ||
              productObj?.finalPrice ||
              productObj?.basePrice ||
              0,
            quantity: item.quantity,
            variant: item.variant,
            companyId: companyObj?._id || item.companyId,
            companyName: companyObj?.name,
            priceAtAdd: item.priceAtAdd,
            discount: item.discount,
          };
        });
    } else {
      cartItems.value = [];
    }
  } catch (err) {
    console.error("خطا در دریافت سبد:", err);
    cartItems.value = [];
    loadError.value = toUserFacingError(err, "دریافت سبد خرید انجام نشد.").message;
    showNotification("خطا در بارگذاری سبد خرید", "error");
  } finally {
    loading.value = false;
  }
}

async function addToCart(
  productId: string,
  quantity: number,
  variant?: { name: string; value: string },
  companyId?: string,
  priceAtAdd?: number
) {
  try {
    if (!user.value?.userId) {
      showNotification("لطفا وارد سایت شوید", "error");
      return;
    }

    // افزودن آیتم به سبد
    await $axios.post("/carts/items", {
      productId,
      quantity,
      variant,
      companyId,
      priceAtAdd,
    });
    await fetchCart();
    showNotification("محصول به سبد افزوده شد", "success");
  } catch (err) {
    console.error("خطا در افزودن به سبد:", err);
    showNotification(toUserFacingError(err, "افزودن محصول به سبد انجام نشد.").message, "error");
  }
}

async function updateQuantity(item: CartItem) {
  try {
    if (!user.value?.userId) {
      showNotification("لطفا وارد سایت شوید", "error");
      return;
    }

    // به‌روزرسانی تعداد محصول
    await $axios.post("/carts/items", {
      productId: item.productId,
      quantity: item.quantity,
      variant: item.variant,
      companyId: item.companyId,
      priceAtAdd: item.priceAtAdd,
    });
    await fetchCart();
    showNotification("سبد به‌روزرسانی شد", "success");
  } catch (err) {
    console.error("خطا در به‌روزرسانی:", err);
    showNotification(toUserFacingError(err, "به‌روزرسانی سبد انجام نشد.").message, "error");
    await fetchCart();
  }
}

async function removeFromCart(productId: string) {
  try {
    await $axios.delete(`/carts/items/${productId}`);
    await fetchCart();
    showNotification("محصول از سبد حذف شد", "success");
  } catch (err) {
    console.error("خطا در حذف:", err);
    showNotification(toUserFacingError(err, "حذف محصول از سبد انجام نشد.").message, "error");
  }
}

async function clearCart() {
  if (!confirm("آیا از خالی کردن تمام سبد اطمینان دارید؟")) return;

  try {
    await $axios.delete("/carts/clear");
    cartItems.value = [];
    showNotification("سبد خالی شد", "success");
  } catch (err) {
    console.error("خطا در خالی کردن سبد:", err);
    showNotification(toUserFacingError(err, "خالی کردن سبد انجام نشد.").message, "error");
  }
}

async function checkout() {
  if (cartItems.value.length === 0) {
    showNotification("سبد خرید خالی است", "error");
    return;
  }

  isCheckingOut.value = true;
  try {
    const response = await $axios.post("/carts/checkout");
    showNotification("سفارش با موفقیت ثبت شد", "success");
    cartItems.value = [];
    // Redirect to order confirmation or payment page
    setTimeout(() => {
      navigateTo(`/orders/${response.data._id}`);
    }, 1500);
  } catch (err) {
    console.error("خطا در تسویه حساب:", err);
    showNotification(toUserFacingError(err, "ثبت سفارش انجام نشد.").message, "error");
  } finally {
    isCheckingOut.value = false;
  }
}

function continueShopping() {
  navigateTo("/products");
}

onMounted(() => {
  fetchCart();
});

// Export addToCart for external use
defineExpose({
  addToCart,
});
</script>

<style scoped>
.container {
  display: flex;
  justify-content: space-between;
  gap: 30px;
  width: 90%;
  margin: 20px auto;
}

.title {
  color: var(--blue-dark);
  font-family: var(--font-yekan);
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 16px;
}

.title h1 {
  font-size: 36px;
}

.title img {
  width: 66px;
  height: 66px;
}

.col-products {
  flex: 1;
  background: white;
  border-radius: var(--radius-field);
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-height: 400px;
}

.col-summary {
  flex: 0 0 300px;
  background: white;
  border-radius: var(--radius-field);
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: fit-content;
  top: 20px;
  position: sticky;
}

.loading-message,
.empty-message {
  text-align: center;
  padding: 40px 20px;
  color: var(--gray-600);
  font-size: 16px;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-compact-list-item);
  background: var(--gray-50);
}

.item-info {
  flex: 1;
}

.item-info h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: var(--blue-dark);
}

.item-info .sku,
.item-info .quantity,
.item-info .variant,
.item-info .company {
  margin: 4px 0;
  font-size: 13px;
  color: var(--gray-600);
}

.item-price {
  flex: 0 0 150px;
  text-align: center;
}

.item-price .price {
  margin: 0 0 8px 0;
  font-weight: bold;
  color: var(--blue-dark);
}

.item-price .total {
  margin: 0;
  font-size: 14px;
  color: var(--gray-600);
}

.item-actions {
  flex: 0 0 180px;
  display: flex;
  gap: 10px;
  align-items: center;
}

.quantity-input {
  width: 60px;
  padding: 6px 8px;
  border: 1px solid var(--gray-300);
  border-radius: 4px;
  text-align: center;
  font-size: 14px;
}

/* Summary Box */
.summary-box h2 {
  color: var(--blue-dark);
  font-family: var(--font-yekan);
  font-weight: 600;
  margin-bottom: 20px;
  font-size: 18px;
  border-bottom: 2px solid var(--gray-200);
  padding-bottom: 10px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  font-size: 14px;
  padding: 10px 0;
  border-bottom: 1px solid var(--gray-200);
}

.summary-row.total {
  font-weight: bold;
  font-size: 16px;
  color: var(--blue-dark);
  border-bottom: 2px solid var(--blue-dark);
  padding-bottom: 10px;
  margin-bottom: 20px;
}

/* Notifications */
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 16px 24px;
  border-radius: 4px;
  font-family: var(--font-yekan);
  font-weight: 600;
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
}

.notification.success {
  background-color: #4caf50;
  color: white;
}

.notification.error {
  background-color: #f44336;
  color: white;
}

@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Responsive */
@media (max-width: 1023px) {
  .container {
    gap: 20px;
  }

  .col-summary {
    flex: 0 0 min(32vw, 280px);
  }
}

@media (max-width: 767px) {
  .container {
    width: 95%;
    margin: 10px auto;
    flex-direction: column;
    gap: 20px;
  }

  .col-products,
  .col-summary {
    flex: 1;
  }

  .col-summary {
    position: static;
    flex: 0 1 auto;
  }

  .title {
    width: 100%;
    justify-content: flex-start;
    margin: 10px;
  }

  .title h1 {
    font-size: 20px;
  }

  .title img {
    width: 40px;
    height: 40px;
  }

  .cart-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .item-price,
  .item-actions {
    width: 100%;
  }

  .item-actions {
    display: flex;
    gap: 10px;
  }

  .quantity-input {
    flex: 1;
  }

  .summary-row {
    font-size: 13px;
  }

  .notification {
    left: 10px;
    right: 10px;
    top: auto;
    bottom: 20px;
  }
}
</style>
