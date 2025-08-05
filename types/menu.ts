// تعریف یک نوع (Type) برای نقش‌های مختلف منو
export type MenuRole = "default" | "dashboard" ;

// تعریف اینترفیس برای نوع منو
export interface MenuType {
  role: MenuRole;
}
