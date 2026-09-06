export interface IPayment {
  id: string;
  price: number;
  status: "unpaid" | "paid" | "refunded" | "unrefunded" | "failed";
  deadline: string;
  gatewayToken: string;
  bookingId: string;
  createdAt?: string;
  updatedAt?: string;
}
