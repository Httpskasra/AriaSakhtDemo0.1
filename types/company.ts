export interface Company {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  registrationNumber: string;
  address?: string;
  nationalId?: string;
  image?: string;
  isActive?: boolean;
  status: "pending" | "active" | "suspended" | "rejected";
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}
