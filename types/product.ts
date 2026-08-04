export interface ProductVariantOption {
  value: string;
  priceModifier?: number;
}

export interface ProductVariant {
  id?: string;
  name: string;
  options: ProductVariantOption[];
}

export interface ProductImage {
  url: string;
}

export interface ProductImageMeta {
  filename: string;
  contentType: string;
  size: number;
}

export interface Product {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
  sku: string;
  basePrice: number;
  discount?: number;
  currency?: string;
  categories: Array<string | { _id?: string; id?: string; name?: string }>;
  description: string;
  companyId?: string | { _id: string; name: string };
  stock: {
    quantity: number;
    reserved?: number;
    total?: number;
  };
  variants: ProductVariant[];
  attributes: Record<string, string | number>;
  tags: string[];
  images: ProductImage[];
  imagesMeta?: ProductImageMeta[];
  status?: "active" | "inactive" | "draft" | "archived" | "deleted";
  
  // Denormalized Rating Fields
  avgRate?: number;
  totalRatings?: number;
  ratingsSummary?: Record<number, number>;
  denormComments?: Array<{
    userId?: string;
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
  productId: string;
  quantity: number;
  variant?: { name: string; value: string };
  companyId?: string;
  priceAtAdd?: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: Array<{
    productId: string | { _id?: string; id?: string; name?: string };
    companyId: string | { _id?: string; id?: string; name?: string };
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
