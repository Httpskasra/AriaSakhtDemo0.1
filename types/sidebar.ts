export type SidebarNavItem = {
  icon: string;
  label: string;
  route?: string;
  permission?: string;
  /** Kept optional for legacy callers while the panel uses one icon system. */
  iconBase?: string;
  activeIcon?: string;
  action?: () => void | Promise<void>;
  section?: boolean;
};
