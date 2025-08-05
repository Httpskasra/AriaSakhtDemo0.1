export enum Action {
  READ = "r",
  UPDATE = "u",
  CREATE = "c",
  DELETE = "d",
  MANAGE = "m",
  deposit_company = "dc",
  deposit_intermediary = "di",
  deposit_user = "du",
}

export enum Resource {
  CARTS = "carts",
  CATEGORIES = "categories",
  COMPANIES = "companies",
  ORDERS = "orders",
  PAYMENT = "payment",
  PRODUCTS = "products",
  ROLES = "roles",
  TICKETING = "ticketing",
  TRANSACTION = "transaction",
  TRANSPORTING = "transporting",
  USERS = "users",
  WALLETS = "wallets",
  PROFILE = "profile",
  ALL = "all",
}

export type Permission = {
  resource: Resource;
  actions: Action[];
};

export type User = {
  id: number | string;
  permissions: Permission[];
};
