export interface Company {
  id?: string;
  _id?: string;
  name: string;
  sellerType?: "legal" | "individual";
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

export type VendorRequestStatus = "pending" | "approved" | "rejected";

export interface VendorRequest {
  _id: string;
  userId?: string;
  companyName: string;
  sellerType?: "legal" | "individual";
  email: string;
  phone?: string;
  registrationNumber?: string;
  nationalId?: string;
  address?: string;
  imageUrl?: string;
  status: VendorRequestStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  companyId?: string;
  createdAt?: string;
}
