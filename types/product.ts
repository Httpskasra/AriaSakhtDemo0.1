export interface Product {
  id?: string;
  name: string;
  slug: string;
  sku: string;
  basePrice: number;
  discount?: number;
  categories: string[];
  description: string;
  stock: {
    available: number;
    reserved?: number;
    total?: number;
  };
  variants?: Array<{
    id?: string;
    name: string;
    options: Record<string, string>;
    price?: number;
    stock?: number;
  }>;
  attributes?: Record<string, string | number>;
  tags?: string[];
  images: string[];
  imagesMeta?: Array<{
    url: string;
    alt?: string;
    order?: number;
  }>;
  status?: "active" | "inactive" | "draft" | "archived";
  companiesId?: string[];
  subcategory?: string;
  comments?: Array<{
    sender: string;
    comment: string;
  }>;
  rating?: number;
}
