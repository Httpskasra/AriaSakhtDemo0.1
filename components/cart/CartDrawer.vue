<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import { navigateTo } from "#app";
import { getActiveCart, getPopulatedCart, removeFromCart as removeCartItem } from "~/services/cartService";
import { toUserFacingError } from "~/services/apiClient";
import type { Cart, ProductVariantSelection } from "~/types/product";
import { useCartStore } from "~/stores/cart";
import { useUser } from "~/composables/useUser";

const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{ "update:modelValue": [value: boolean] }>();

interface DrawerItem {
  productId: string;
  productName: string;
  sku: string;
  imageUrl: string;
  price: number;
  quantity: number;
  currency: string;
  companyName?: string;
  variant?: ProductVariantSelection;
  variants?: ProductVariantSelection[];
}

const fallbackImage = "/products/building-material.jpg";
const { isAuthenticated, fetchUser } = useUser();
const cartStore = useCartStore();
const items = ref<DrawerItem[]>([]);
const loading = ref(false);
const loadError = ref<string | null>(null);
const removingKey = ref<string | null>(null);
const previouslyFocused = ref<HTMLElement | null>(null);
const previousBodyOverflow = ref<string | null>(null);
let cartRequest: Promise<void> | null = null;

const itemCount = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0));
const totalPrice = computed(() => items.value.reduce((sum, item) => sum + item.price * item.quantity, 0));
const firstCurrency = computed(() => items.value[0]?.currency || "IRR");
const isOpen = computed(() => props.modelValue);

function numberFormat(value: number) {
  return Number(value || 0).toLocaleString("fa-IR");
}

function currencyLabel(currency?: string) {
  const code = String(currency || "IRR").toUpperCase();
  return ({ IRR: "ریال", IRT: "تومان", USD: "دلار", EUR: "یورو" } as Record<string, string>)[code] || code;
}

function selections(item: DrawerItem): ProductVariantSelection[] {
  return item.variants?.length ? item.variants : item.variant ? [item.variant] : [];
}

function itemKey(item: DrawerItem) {
  return `${item.productId}::${JSON.stringify(selections(item))}`;
}

function normalizeCartItem(item: any): DrawerItem | null {
  if (!item?.productId) return null;
  const product = typeof item.productId === "object" ? item.productId : null;
  const company = typeof item.companyId === "object" ? item.companyId : null;
  const productId = String(product?._id || product?.id || item.productId);
  const images = Array.isArray(product?.images) ? product.images : [];
  return {
    productId,
    productName: product?.name || "محصول نامشخص",
    sku: product?.sku || "—",
    imageUrl: images[0]?.url || fallbackImage,
    price: Number(item.priceAtAdd || product?.finalPrice || product?.basePrice || 0),
    quantity: Math.max(1, Number(item.quantity) || 1),
    currency: product?.currency || "IRR",
    companyName: company?.name,
    variant: item.variant,
    variants: Array.isArray(item.variants) ? item.variants : undefined,
  };
}

function selectedCart(data: Cart | Cart[] | null, activeCart: Cart) {
  if (!Array.isArray(data)) return data || activeCart;
  return data.find((candidate) => candidate?.id === activeCart?.id || candidate?.status === "active") || activeCart;
}

async function loadCart() {
  if (cartRequest) return cartRequest;
  const request = (async () => {
    if (!isAuthenticated.value) {
      items.value = [];
      return;
    }
    loading.value = true;
    loadError.value = null;
    try {
      const { data: activeCart } = await getActiveCart();
      let populated: Cart | Cart[] | null = null;
      try { populated = (await getPopulatedCart()).data; } catch { /* active cart can still render legacy entries */ }
      const data = selectedCart(populated, activeCart);
      items.value = Array.isArray(data?.items)
        ? data.items.map(normalizeCartItem).filter(Boolean) as DrawerItem[]
        : [];
      cartStore.setCart(data || activeCart || null);
    } catch (error) {
      items.value = [];
      loadError.value = toUserFacingError(error, "دریافت سبد خرید انجام نشد.").message;
    } finally {
      loading.value = false;
    }
  })();
  cartRequest = request;
  try {
    await request;
  } finally {
    if (cartRequest === request) cartRequest = null;
  }
}

function close() {
  emit("update:modelValue", false);
}

function handleImageError(event: Event) {
  const image = event.target as HTMLImageElement;
  if (image.src.endsWith(fallbackImage)) return;
  image.src = fallbackImage;
}

async function removeItem(item: DrawerItem) {
  if (removingKey.value) return;
  removingKey.value = itemKey(item);
  try {
    await removeCartItem(item.productId, selections(item));
    items.value = items.value.filter((candidate) => itemKey(candidate) !== itemKey(item));
    await loadCart();
  } catch (error) {
    loadError.value = toUserFacingError(error, "حذف محصول از سبد انجام نشد.").message;
  } finally {
    removingKey.value = null;
  }
}

async function openFullCart() {
  close();
  await navigateTo("/dashboard/account/cart");
}

function handleKeydown(event: KeyboardEvent) {
  if (!isOpen.value) return;
  if (event.key === "Escape") {
    event.preventDefault();
    close();
  }
}

function updateBodyLock(open: boolean) {
  if (typeof document === "undefined") return;
  if (open) {
    if (previousBodyOverflow.value === null) previousBodyOverflow.value = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeydown);
  } else {
    if (previousBodyOverflow.value !== null) {
      document.body.style.overflow = previousBodyOverflow.value;
      previousBodyOverflow.value = null;
    }
    document.removeEventListener("keydown", handleKeydown);
  }
}

watch(isOpen, async (open) => {
  updateBodyLock(open);
  if (open) {
    previouslyFocused.value = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    await fetchUser();
    await loadCart();
    await nextTick();
    document.querySelector<HTMLElement>(".cart-drawer__close")?.focus();
  } else {
    await nextTick();
    previouslyFocused.value?.focus();
    previouslyFocused.value = null;
  }
});

onBeforeUnmount(() => updateBodyLock(false));
</script>

<template>
  <Teleport to="body">
    <div class="cart-drawer" :class="{ 'cart-drawer--open': isOpen }" aria-live="polite">
      <button v-if="isOpen" class="cart-drawer__backdrop" type="button" aria-label="بستن سبد خرید" @click="close" />
      <aside
        class="cart-drawer__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        :aria-hidden="!isOpen"
        :inert="!isOpen"
      >
        <header class="cart-drawer__header">
          <div class="cart-drawer__heading">
            <span class="cart-drawer__icon" aria-hidden="true"><UIcon name="i-lucide-shopping-cart" /></span>
            <div>
              <h2 id="cart-drawer-title">سبد خرید</h2>
              <p>{{ itemCount ? `${numberFormat(itemCount)} قلم محصول` : "محصولات انتخاب‌شده شما" }}</p>
            </div>
          </div>
          <button class="cart-drawer__close" type="button" aria-label="بستن سبد خرید" @click="close">
            <UIcon name="i-lucide-x" aria-hidden="true" />
          </button>
        </header>

        <div class="cart-drawer__body">
          <div v-if="loading" class="cart-drawer__state" role="status">
            <UIcon name="i-lucide-loader-circle" class="cart-drawer__spinner" aria-hidden="true" />
            <span>در حال دریافت سبد خرید…</span>
          </div>
          <div v-else-if="loadError" class="cart-drawer__state cart-drawer__state--error" role="alert">
            <UIcon name="i-lucide-circle-alert" aria-hidden="true" />
            <p>{{ loadError }}</p>
            <UButton size="sm" variant="soft" @click="loadCart">تلاش دوباره</UButton>
          </div>
          <div v-else-if="!items.length" class="cart-drawer__state">
            <span class="cart-drawer__empty-icon" aria-hidden="true"><UIcon name="i-lucide-shopping-bag" /></span>
            <strong>سبد خرید شما خالی است</strong>
            <p>محصولات موردنیازتان را از فروشگاه انتخاب کنید.</p>
            <UButton size="sm" icon="i-lucide-store" to="/products" @click="close">مشاهده فروشگاه</UButton>
          </div>
          <ul v-else class="cart-drawer__items" aria-label="اقلام سبد خرید">
            <li v-for="item in items" :key="itemKey(item)" class="cart-drawer__item">
              <NuxtLink class="cart-drawer__image" :to="`/products/${encodeURIComponent(item.productId)}`" :aria-label="`مشاهده ${item.productName}`" @click="close">
                <img :src="item.imageUrl" :alt="item.productName" loading="lazy" @error="handleImageError" />
              </NuxtLink>
              <div class="cart-drawer__item-content">
                <div class="cart-drawer__item-topline">
                  <NuxtLink class="cart-drawer__item-name" :to="`/products/${encodeURIComponent(item.productId)}`" @click="close">{{ item.productName }}</NuxtLink>
                  <button type="button" class="cart-drawer__remove" :disabled="Boolean(removingKey)" :aria-label="`حذف ${item.productName}`" @click="removeItem(item)">
                    <UIcon name="i-lucide-trash-2" aria-hidden="true" />
                  </button>
                </div>
                <p v-if="item.companyName" class="cart-drawer__meta">{{ item.companyName }}</p>
                <p v-if="item.sku !== '—'" class="cart-drawer__meta font-num" dir="ltr">{{ item.sku }}</p>
                <div v-if="selections(item).length" class="cart-drawer__variants">
                  <span v-for="selection in selections(item)" :key="`${selection.name}-${selection.value}`">{{ selection.name }}: {{ selection.value }}</span>
                </div>
                <div class="cart-drawer__item-footer">
                  <span class="cart-drawer__quantity">تعداد: {{ numberFormat(item.quantity) }}</span>
                  <strong class="font-num">{{ numberFormat(item.price * item.quantity) }} <small>{{ currencyLabel(item.currency) }}</small></strong>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <footer v-if="!loading && !loadError && items.length" class="cart-drawer__footer">
          <div class="cart-drawer__total"><span>جمع کالاها</span><strong class="font-num">{{ numberFormat(totalPrice) }} <small>{{ currencyLabel(firstCurrency) }}</small></strong></div>
          <UButton block size="lg" icon="i-lucide-arrow-left" @click="openFullCart">مشاهده سبد خرید</UButton>
          <p>هزینه ارسال و جزئیات ثبت سفارش در مرحله بعد محاسبه می‌شود.</p>
        </footer>
      </aside>
    </div>
  </Teleport>
</template>

<style scoped>
.cart-drawer { position: fixed; inset: 0; z-index: 1200; visibility: hidden; pointer-events: none; direction: rtl; }
.cart-drawer--open { visibility: visible; pointer-events: auto; }
.cart-drawer__backdrop { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; background: var(--color-overlay); cursor: pointer; opacity: 0; transition: opacity .2s ease; }
.cart-drawer--open .cart-drawer__backdrop { opacity: 1; }
.cart-drawer__panel { position: absolute; inset-block: 0; inset-inline-end: 0; display: flex; width: min(28rem, 100%); flex-direction: column; background: var(--color-bg-surface); box-shadow: var(--shadow-overlay); transform: translateX(100%); transition: transform .24s ease; }
.cart-drawer--open .cart-drawer__panel { transform: translateX(0); }
.cart-drawer__header { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 1.1rem 1.15rem; border-bottom: 1px solid var(--color-border); }
.cart-drawer__heading { display: flex; min-width: 0; align-items: center; gap: .75rem; }
.cart-drawer__icon { display: grid; width: 2.7rem; height: 2.7rem; flex: 0 0 auto; place-items: center; border-radius: var(--radius-compact-list-item); color: var(--color-brand-blue); background: var(--color-info-bg); font-size: 1.25rem; }
.cart-drawer__heading h2 { margin: 0; color: var(--color-text-heading); font-size: 1.05rem; font-weight: var(--font-weight-extrabold); }
.cart-drawer__heading p { margin: .2rem 0 0; color: var(--color-text-muted); font-size: .75rem; }
.cart-drawer__close { display: grid; width: 2.4rem; height: 2.4rem; flex: 0 0 auto; place-items: center; border: 1px solid var(--color-border); border-radius: var(--radius-compact-list-item); background: var(--color-bg-light); color: var(--color-text-heading); cursor: pointer; }
.cart-drawer__body { min-height: 0; flex: 1; overflow-y: auto; padding: .9rem 1rem; overscroll-behavior: contain; }
.cart-drawer__items { display: grid; gap: .7rem; margin: 0; padding: 0; list-style: none; }
.cart-drawer__item { display: flex; min-width: 0; gap: .75rem; padding: .7rem; border: 1px solid var(--color-border); border-radius: var(--radius-field); background: var(--color-bg-app); }
.cart-drawer__image { display: grid; width: 5rem; height: 5rem; flex: 0 0 auto; place-items: center; overflow: hidden; border-radius: var(--radius-compact-list-item); background: var(--color-bg-surface); }
.cart-drawer__image img { width: 100%; height: 100%; object-fit: contain; }
.cart-drawer__item-content { display: grid; min-width: 0; flex: 1; gap: .25rem; }
.cart-drawer__item-topline { display: flex; min-width: 0; align-items: flex-start; justify-content: space-between; gap: .4rem; }
.cart-drawer__item-name { min-width: 0; color: var(--color-text-heading); font-size: .83rem; font-weight: var(--font-weight-bold); line-height: 1.65; overflow-wrap: anywhere; }
.cart-drawer__remove { display: grid; width: 1.8rem; height: 1.8rem; flex: 0 0 auto; place-items: center; border: 0; border-radius: var(--radius-compact-list-item); background: transparent; color: var(--color-text-muted); cursor: pointer; }
.cart-drawer__remove:hover, .cart-drawer__remove:focus-visible { color: var(--color-danger-fg); background: var(--color-danger-bg); }
.cart-drawer__remove:disabled { cursor: wait; opacity: .55; }
.cart-drawer__meta { margin: 0; color: var(--color-text-muted); font-size: .7rem; overflow-wrap: anywhere; }
.cart-drawer__variants { display: flex; flex-wrap: wrap; gap: .3rem; margin-top: .15rem; }
.cart-drawer__variants span { padding: .16rem .35rem; border-radius: var(--radius-pill); color: var(--color-info-fg); background: var(--color-info-bg); font-size: .64rem; }
.cart-drawer__item-footer { display: flex; align-items: end; justify-content: space-between; gap: .5rem; margin-top: .2rem; }
.cart-drawer__quantity { color: var(--color-text-muted); font-size: .7rem; }
.cart-drawer__item-footer strong { color: var(--color-text-heading); font-size: .82rem; }
.cart-drawer__item-footer small, .cart-drawer__total small { color: var(--color-text-muted); font-size: .65rem; font-weight: var(--font-weight-semibold); }
.cart-drawer__state { display: grid; min-height: 15rem; place-items: center; align-content: center; gap: .6rem; padding: 2rem 1rem; color: var(--color-text-muted); text-align: center; }
.cart-drawer__state p { max-width: 19rem; margin: 0; line-height: 1.8; }
.cart-drawer__state strong { color: var(--color-text-heading); font-size: .95rem; }
.cart-drawer__state--error { color: var(--color-danger-fg); }
.cart-drawer__state--error p { color: var(--color-text-body); }
.cart-drawer__empty-icon { display: grid; width: 3.5rem; height: 3.5rem; place-items: center; border-radius: var(--radius-card); color: var(--color-brand-blue); background: var(--color-info-bg); font-size: 1.5rem; }
.cart-drawer__spinner { animation: cart-drawer-spin .8s linear infinite; font-size: 1.4rem; }
.cart-drawer__footer { display: grid; gap: .7rem; padding: .95rem 1rem 1.15rem; border-top: 1px solid var(--color-border); background: var(--color-bg-surface); }
.cart-drawer__total { display: flex; align-items: center; justify-content: space-between; gap: 1rem; color: var(--color-text-muted); font-size: .82rem; }
.cart-drawer__total strong { color: var(--color-text-heading); font-size: 1rem; }
.cart-drawer__footer p { margin: 0; color: var(--color-text-disabled); font-size: .68rem; line-height: 1.7; text-align: center; }
@keyframes cart-drawer-spin { to { transform: rotate(360deg); } }
@media (max-width: 480px) { .cart-drawer__panel { width: 100%; } .cart-drawer__header { padding-inline: 1rem; } }
@media (prefers-reduced-motion: reduce) { .cart-drawer__backdrop, .cart-drawer__panel { transition: none; } .cart-drawer__spinner { animation: none; } }
</style>
