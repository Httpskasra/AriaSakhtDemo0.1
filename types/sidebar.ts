export type SidebarNavItem = {
  icon: string;
  label: string;
  route?: string;
  permission?: string;
  iconBase: string;
  activeIcon?: string;
  action?: () => void | Promise<void>;
};
