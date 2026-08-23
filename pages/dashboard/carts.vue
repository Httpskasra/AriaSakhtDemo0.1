<template>
  <section class="cart-page" dir="rtl">
    <PanelPageHeader title="سبد خرید" subtitle="محصولات انتخاب‌شده و خلاصه مبلغ سفارش" icon="i-lucide-shopping-cart">
      <template #actions>
        <UButton icon="i-lucide-refresh-cw" variant="soft" :loading="loading" aria-label="به‌روزرسانی سبد خرید" @click="fetchCart">به‌روزرسانی</UButton>
      </template>
    </PanelPageHeader>

    <SharedAsyncState v-if="loading" state="loading" />
    <SharedAsyncState v-else-if="loadError" state="error" :message="loadError" @retry="fetchCart" />
    <SharedAsyncState v-else-if="cartItems.length === 0" state="empty" title="سبد خرید خالی است" message="هنوز محصولی به سبد خرید اضافه نشده است.">
      <template #actions><UButton to="/products" icon="i-lucide-arrow-left">مشاهده محصولات</UButton></template>
    </SharedAsyncState>

    <div v-else class="cart-layout">
      <div class="cart-items-panel panel-surface">
        <div class="panel-section-heading">
          <div>
            <h2>اقلام سبد</h2>
            <p>{{ numberFormat(totalItems) }} قلم محصول</p>
          </div>
          <UButton v-if="canDelete" color="error" variant="soft" icon="i-lucide-trash-2" @click="showClearConfirm = true">خالی کردن سبد</UButton>
        </div>

        <div class="cart-items">
          <article v-for="item in cartItems" :key="item.productId" class="cart-item">
            <div class="item-info">
              <h3>{{ item.productName }}</h3>
              <p class="item-meta ltr">SKU: {{ item.sku }}</p>
              <p v-if="item.variant" class="item-meta">{{ item.variant.name }}: {{ item.variant.value }}</p>
              <p v-if="item.companyName" class="item-meta">شرکت: {{ item.companyName }}</p>
            </div>

            <div class="item-price">
              <span>قیمت واحد</span>
              <strong>{{ numberFormat(item.price) }} ریال</strong>
              <small>جمع: {{ numberFormat((item.price || 0) * item.quantity) }} ریال</small>
            </div>

            <div class="item-actions">
              <label :for="`quantity-${item.productId}`">تعداد</label>
              <UInput :id="`quantity-${item.productId}`" v-model.number="item.quantity" type="number" min="1" inputmode="numeric" class="quantity-input" :disabled="!canUpdate" @change="updateQuantity(item)" />
              <UButton v-if="canDelete" color="error" variant="ghost" size="sm" icon="i-lucide-trash-2" :loading="removingId === item.productId" :disabled="Boolean(updatingId || removingId)" :aria-label="`حذف ${item.productName}`" @click="removeFromCart(item.productId)">حذف</UButton>
            </div>
          </article>
        </div>
      </div>

      <aside class="summary-panel panel-surface" aria-labelledby="cart-summary-title">
        <h2 id="cart-summary-title">خلاصه سبد</h2>
        <dl class="summary-list">
          <div><dt>تعداد اقلام</dt><dd>{{ numberFormat(totalItems) }}</dd></div>
          <div><dt>قیمت کل</dt><dd>{{ numberFormat(totalPrice) }} ریال</dd></div>
          <div><dt>هزینه ارسال</dt><dd>{{ numberFormat(shippingCost) }} ریال</dd></div>
          <div class="summary-total"><dt>جمع نهایی</dt><dd>{{ numberFormat(totalPrice + shippingCost) }} ریال</dd></div>
        </dl>
        <div class="summary-actions">
          <UButton v-if="canUpdate" block size="lg" icon="i-lucide-credit-card" :loading="isCheckingOut" :disabled="Boolean(updatingId || removingId)" @click="checkout">تسویه حساب</UButton>
          <p v-else class="permission-note">مجوز تغییر یا ثبت سفارش برای این حساب فعال نیست.</p>
          <UButton block color="neutral" variant="soft" icon="i-lucide-arrow-left" to="/products">ادامه خرید</UButton>
        </div>
      </aside>
    </div>
  </section>

  <BaseModal v-if="showClearConfirm" title-id="clear-cart-title" @close="showClearConfirm = false">
    <div class="confirm-content">
      <h2 id="clear-cart-title">خالی کردن سبد خرید</h2>
      <p>همه‌ی اقلام سبد حذف می‌شوند. آیا ادامه می‌دهید؟</p>
      <div class="confirm-actions">
        <UButton color="neutral" variant="soft" :disabled="clearing" @click="showClearConfirm = false">انصراف</UButton>
        <UButton color="error" :loading="clearing" @click="clearCart">خالی کردن سبد</UButton>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { getActiveCart, getPopulatedCart, addToCart as addCartItem, clearCart as clearCartRequest, checkoutCart, removeFromCart as removeCartItem } from "~/services/cartService";
import { toUserFacingError } from "~/services/apiClient";
import type { Cart, CartItemDto } from "~/types/product";
import { useAccess } from "~/composables/useAccess";
import { Resource } from "~/types/permissions";


useHead({ title: "داشبورد | سبد خرید" });

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
}

const feedback = useFeedback();
const { canCreate, canUpdate, canDelete } = useAccess(Resource.CARTS);
const cartItems = ref<CartItem[]>([]);
const loading = ref(false);
const loadError = ref<string | null>(null);
const isCheckingOut = ref(false);
const clearing = ref(false);
const showClearConfirm = ref(false);
const updatingId = ref<string | null>(null);
const removingId = ref<string | null>(null);
const shippingCost = ref(0);

const totalItems = computed(() => cartItems.value.reduce((sum, item) => sum + item.quantity, 0));
const totalPrice = computed(() => cartItems.value.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0));

function numberFormat(value?: number) {
  return typeof value === "number" ? value.toLocaleString("fa-IR") : "—";
}

function normalizeCartItem(item: any): CartItem | null {
  if (!item?.productId) return null;
  const product = typeof item.productId === "object" ? item.productId : null;
  const company = typeof item.companyId === "object" ? item.companyId : null;
  return {
    productId: String(product?._id || product?.id || item.productId),
    productName: product?.name || "محصول نامشخص",
    sku: product?.sku || "—",
    price: Number(item.priceAtAdd || product?.finalPrice || product?.basePrice || 0),
    quantity: Math.max(1, Number(item.quantity) || 1),
    variant: item.variant,
    companyId: company?._id || company?.id || item.companyId,
    companyName: company?.name,
    priceAtAdd: item.priceAtAdd,
  };
}

async function fetchCart() {
  loading.value = true;
  loadError.value = null;
  try {
    const { data: activeCart } = await getActiveCart();
    let populatedCarts: Cart | Cart[] | null = null;
    try { populatedCarts = (await getPopulatedCart()).data; } catch { /* The active-cart response is enough for an empty or legacy cart. */ }
    const populatedCart = Array.isArray(populatedCarts)
      ? populatedCarts.find((candidate) => candidate?._id === activeCart?._id || candidate?.status === "active")
      : populatedCarts;
    const data = populatedCart || activeCart;
    cartItems.value = Array.isArray(data?.items) ? data.items.map(normalizeCartItem).filter(Boolean) as CartItem[] : [];
  } catch (error) {
    cartItems.value = [];
    loadError.value = toUserFacingError(error, "دریافت سبد خرید انجام نشد.").message;
  } finally {
    loading.value = false;
  }
}

async function addToCart(productId: string, quantity: number, variant?: CartItemDto["variant"], companyId?: string, priceAtAdd?: number) {
  if (!canCreate.value) return feedback.error("دسترسی کافی ندارید", "شما اجازه افزودن محصول به سبد را ندارید.");
  try {
    await addCartItem({ productId, quantity, variant, companyId, priceAtAdd });
    await fetchCart();
    feedback.success("محصول به سبد افزوده شد");
  } catch (error) {
    feedback.error(toUserFacingError(error, "افزودن محصول به سبد انجام نشد.").message);
  }
}

async function updateQuantity(item: CartItem) {
  if (!canUpdate.value) return;
  const quantity = Math.max(1, Math.floor(Number(item.quantity) || 1));
  item.quantity = quantity;
  updatingId.value = item.productId;
  try {
    await addCartItem({ productId: item.productId, quantity, variant: item.variant, companyId: item.companyId, priceAtAdd: item.priceAtAdd });
    await fetchCart();
    feedback.success("تعداد محصول به‌روزرسانی شد");
  } catch (error) {
    feedback.error(toUserFacingError(error, "به‌روزرسانی سبد انجام نشد.").message);
    await fetchCart();
  } finally {
    updatingId.value = null;
  }
}

async function removeFromCart(productId: string) {
  if (!canDelete.value) return;
  removingId.value = productId;
  try {
    await removeCartItem(productId);
    cartItems.value = cartItems.value.filter((item) => item.productId !== productId);
    feedback.success("محصول از سبد حذف شد");
  } catch (error) {
    feedback.error(toUserFacingError(error, "حذف محصول از سبد انجام نشد.").message);
  } finally {
    removingId.value = null;
  }
}

async function clearCart() {
  if (!canDelete.value) return;
  clearing.value = true;
  try {
    await clearCartRequest();
    cartItems.value = [];
    showClearConfirm.value = false;
    feedback.success("سبد خرید خالی شد");
  } catch (error) {
    feedback.error(toUserFacingError(error, "خالی کردن سبد انجام نشد.").message);
  } finally {
    clearing.value = false;
  }
}

async function checkout() {
  if (!canUpdate.value) return;
  if (!cartItems.value.length || isCheckingOut.value) return;
  isCheckingOut.value = true;
  try {
    await checkoutCart({});
    cartItems.value = [];
    feedback.success("سفارش با موفقیت ثبت شد");
    await navigateTo({ path: "/dashboard/account/orders", query: { checkout: "success" } });
  } catch (error) {
    feedback.error(toUserFacingError(error, "ثبت سفارش انجام نشد.").message);
  } finally {
    isCheckingOut.value = false;
  }
}

onMounted(fetchCart);

defineExpose({ addToCart });
</script>

<style scoped>
.cart-page { display: grid; gap: 1rem; }
.cart-layout { display: grid; grid-template-columns: minmax(0, 1fr) minmax(18rem, 22rem); gap: 1rem; align-items: start; }
.panel-surface { background: var(--color-bg-surface); border: 1px solid var(--color-border); border-radius: var(--radius-card); box-shadow: var(--shadow-raised); }
.cart-items-panel, .summary-panel { padding: 1.25rem; }
.summary-panel { position: sticky; top: 1rem; }
.panel-section-heading { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1rem; }
.panel-section-heading h2, .summary-panel h2, .confirm-content h2 { margin: 0; color: var(--color-text-heading); font-size: 1.05rem; }
.panel-section-heading p { margin: .35rem 0 0; color: var(--color-text-muted); font-size: .85rem; }
.cart-items { display: grid; gap: .75rem; }
.cart-item { display: grid; grid-template-columns: minmax(0, 1fr) 10rem auto; gap: 1rem; align-items: center; padding: 1rem; border: 1px solid var(--color-border); border-radius: var(--radius-field); background: var(--color-bg-app); }
.item-info h3 { margin: 0 0 .45rem; color: var(--color-text-heading); font-size: .98rem; }
.item-meta { margin: .25rem 0 0; color: var(--color-text-muted); font-size: .8rem; }
.item-price { display: grid; gap: .2rem; text-align: center; color: var(--color-text-muted); font-size: .76rem; }
.item-price strong { color: var(--color-text-heading); font-size: .9rem; }
.item-price small { font-size: .75rem; }
.item-actions { display: flex; align-items: center; gap: .5rem; }
.item-actions label { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
.quantity-input { width: 5rem; }
.summary-panel h2 { padding-bottom: .85rem; border-bottom: 1px solid var(--color-border); }
.summary-list { display: grid; gap: .25rem; margin: 1rem 0; }
.summary-list > div { display: flex; justify-content: space-between; gap: 1rem; padding: .7rem 0; color: var(--color-text-muted); font-size: .88rem; border-bottom: 1px solid var(--color-border); }
.summary-list dt, .summary-list dd { margin: 0; }
.summary-list dd { color: var(--color-text-heading); font-weight: 600; }
.summary-list .summary-total { border-bottom: 0; color: var(--color-text-heading); font-size: 1rem; font-weight: 700; }
.summary-actions { display: grid; gap: .65rem; }
.permission-note { margin:0; color:var(--color-text-muted); font-size:.8rem; line-height:1.7; }
.confirm-content { display: grid; gap: 1rem; }
.confirm-content p { margin: 0; color: var(--color-text-body); line-height: 1.8; }
.confirm-actions { display: flex; justify-content: flex-end; gap: .65rem; }
.ltr { direction: ltr; text-align: right; }
@media (max-width: 900px) { .cart-layout { grid-template-columns: 1fr; } .summary-panel { position: static; } }
@media (max-width: 640px) { .cart-items-panel, .summary-panel { padding: 1rem; } .panel-section-heading { align-items: flex-start; flex-direction: column; } .cart-item { grid-template-columns: 1fr; gap: .75rem; } .item-price { text-align: right; justify-items: start; } .item-actions { justify-content: space-between; } .confirm-actions { flex-direction: column-reverse; } }
</style>
