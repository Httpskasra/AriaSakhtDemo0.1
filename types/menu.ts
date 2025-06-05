// تعریف یک نوع (Type) برای نقش‌های مختلف منو
export type MenuRole = "default" | "userPanel" | "adminPanel";

// تعریف اینترفیس برای نوع منو
export interface MenuType {
  role: MenuRole;
}
