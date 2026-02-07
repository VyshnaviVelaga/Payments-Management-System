export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED";

export interface Payment {
  id: number;
  amount: number;
  status: PaymentStatus;
  category: string;
  userId: number;
  reference: string;
  createdAt: string;
  updatedAt: string;
}
