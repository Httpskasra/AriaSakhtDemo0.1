export interface Product {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
  sku: string;
  basePrice: number;
  discount?: number;
  currency?: string;
  categories: any[];
  description: string;
  companyId: string | { _id: string; name: string };
  stock: {
    quantity: number;
    reserved?: number;
    total?: number;
  };
  variants?: Array<{
    id?: string;
    name: string;
    options: Array<{ value: string; priceModifier?: number }>;
  }>;
  attributes?: Record<string, string | number>;
  tags?: string[];
  images?: Array<{ url: string }>;
  status?: "active" | "inactive" | "draft" | "archived" | "deleted";
  
  // Denormalized Rating Fields
  avgRate?: number;
  totalRatings?: number;
  ratingsSummary?: Record<number, number>;
  denormComments?: Array<{
    userId?: any;
    rating?: number;
    comment?: string;
    createdAt?: string;
  }>;
  
  finalPrice?: number;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type productImage = {
  url: string;
};

export interface CartItemDto {
  userId: string;
  productId: string;
  quantity: number;
  variantId?: string;
  selectedOptions?: Record<string, string>;
  companyId?: string;
  priceAtAdd?: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: Array<{
    productId: any;
    companyId: any;
    quantity: number;
    priceAtAdd: number;
    variant?: { name: string; value: string };
    discount?: { type: string; value: number };
  }>;
  totalAmount: number;
  currency: string;
  status: "active" | "abandoned" | "checked_out";
  createdAt: string;
  updatedAt: string;
}

export interface Discount {
  code: string;
  percentage?: number;
  amount?: number;
  expiresAt?: string;
}
