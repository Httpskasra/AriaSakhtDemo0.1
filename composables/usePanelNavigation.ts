import type { SidebarNavItem } from "~/types/sidebar";
import { Action, Resource } from "~/types/permissions";
import { useAuthStore } from "~/stores/auth";

type PanelNavDefinition = SidebarNavItem & {
  permission?: Resource;
  requiredAction?: Action;
};

const icon = (name: string) => `i-lucide-${name}`;

const sections: Array<{ label: string; items: PanelNavDefinition[] }> = [
  {
    label: "نمای کلی",
    items: [{ icon: icon("layout-dashboard"), label: "داشبورد", route: "/dashboard" }],
  },
  {
    label: "حساب کاربری",
    items: [
      { icon: icon("user-round"), label: "پروفایل", route: "/dashboard/account/profile", permission: Resource.PROFILE },
      { icon: icon("receipt-text"), label: "سفارش‌ها", route: "/dashboard/account/orders", permission: Resource.ORDERS },
      { icon: icon("shopping-cart"), label: "سبد خرید", route: "/dashboard/account/cart", permission: Resource.CARTS },
      { icon: icon("heart"), label: "علاقه‌مندی‌ها", route: "/dashboard/account/favorites", permission: Resource.PRODUCTS },
      { icon: icon("life-buoy"), label: "پشتیبانی", route: "/dashboard/account/tickets", permission: Resource.TICKETING },
      { icon: icon("wallet"), label: "کیف پول", route: "/dashboard/account/wallet", permission: Resource.WALLETS },
      { icon: icon("arrow-left-right"), label: "تراکنش‌ها", route: "/dashboard/account/transactions", permission: Resource.TRANSACTION },
    ],
  },
  {
    label: "فروشندگی",
    items: [
      { icon: icon("building-2"), label: "شرکت من", route: "/dashboard/seller/company", permission: Resource.COMPANIES },
      { icon: icon("boxes"), label: "محصولات", route: "/dashboard/seller/products", permission: Resource.PRODUCTS },
      { icon: icon("badge-check"), label: "وضعیت محصولات", route: "/dashboard/seller/products/status", permission: Resource.PRODUCT_STATUS },
      { icon: icon("truck"), label: "حمل‌ونقل", route: "/dashboard/seller/transport", permission: Resource.TRANSPORTING },
    ],
  },
  {
    label: "مدیریت",
    items: [
      { icon: icon("tags"), label: "دسته‌بندی‌ها", route: "/dashboard/admin/categories", permission: Resource.CATEGORIES },
      { icon: icon("building"), label: "شرکت‌ها", route: "/dashboard/companies", permission: Resource.COMPANIES },
      { icon: icon("users"), label: "کاربران", route: "/dashboard/admin/users", permission: Resource.ALL, requiredAction: Action.MANAGE },
      { icon: icon("shield-check"), label: "نقش‌ها و دسترسی‌ها", route: "/dashboard/admin/roles", permission: Resource.ALL, requiredAction: Action.MANAGE },
    ],
  },
];

export function usePanelNavigation() {
  const { user, clearUser } = useUser();
  const { hasPermission } = usePermissions();
  const authStore = useAuthStore();
  const router = useRouter();
  const { $axios } = useNuxtApp();

  const identity = computed(() => {
    const current = user.value as (typeof user.value & {
      firstName?: string;
      lastName?: string;
      phoneNumber?: string;
      profile?: { firstName?: string; lastName?: string; phoneNumber?: string };
    }) | null;
    const firstName = current?.firstName || current?.profile?.firstName || "";
    const lastName = current?.lastName || current?.profile?.lastName || "";
    return {
      name: `${firstName} ${lastName}`.trim() || "حساب کاربری",
      subtitle: current?.phoneNumber || current?.profile?.phoneNumber || "اطلاعات حساب کاربری",
    };
  });

  const isAllowed = (item: PanelNavDefinition) => (
    !item.permission || hasPermission(item.permission, item.requiredAction || Action.READ)
  );

  const navItems = computed<SidebarNavItem[]>(() => {
    const visible: SidebarNavItem[] = [];
    for (const section of sections) {
      const items = section.items.filter(isAllowed).map(({ requiredAction: _requiredAction, ...item }) => item);
      if (!items.length) continue;
      visible.push({ icon: `section-${section.label}`, label: section.label, section: true });
      visible.push(...items);
    }
    visible.push({ icon: icon("log-out"), label: "خروج", action: handleLogOut });
    return visible;
  });

  const isManagement = computed(() => (
    hasPermission(Resource.ALL, Action.MANAGE) ||
    hasPermission(Resource.CATEGORIES, Action.CREATE) ||
    hasPermission(Resource.CATEGORIES, Action.UPDATE) ||
    hasPermission(Resource.CATEGORIES, Action.DELETE)
  ));

  const isSeller = computed(() => (
    hasPermission(Resource.COMPANIES, Action.CREATE) ||
    hasPermission(Resource.COMPANIES, Action.UPDATE) ||
    hasPermission(Resource.PRODUCTS, Action.CREATE) ||
    hasPermission(Resource.PRODUCTS, Action.UPDATE) ||
    hasPermission(Resource.PRODUCT_STATUS, Action.READ) ||
    hasPermission(Resource.TRANSPORTING, Action.READ)
  ));

  const panelTitle = computed(() => {
    if (isManagement.value) return "پنل مدیریت";
    if (isSeller.value) return "پنل فروشنده";
    return "حساب کاربری";
  });

  async function handleLogOut() {
    try {
      await $axios.post("/auth/signout");
    } catch (error) {
      // Session cleanup must complete even if the API is unavailable.
      console.warn("Sign out request failed", error);
    } finally {
      authStore.clearTokens();
      clearUser();
      await router.push("/");
    }
  }

  return { identity, navItems, panelTitle, handleLogOut };
}
