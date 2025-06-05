export interface Product {
  id: string;
  name: string;
  price: number;
  companiesId: string[];
  categories: string[];
  description: string;
  // userAgent: string;
  // ip: string;
  image: string;
  subcategory: string;
  comments: {
    sender: string;
    comment: string;
  }[];
  rating: number;
}
