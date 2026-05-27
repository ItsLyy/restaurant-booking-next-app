export interface IBooking {
  id: string;
  date: string;
  time: string;
  partySize: number;
  specialRequest?: string;
  status: "pending" | "confirmed" | "cancelled" | "completed" | "no_show";
  customerId: string;
  tableId: string;
  createdAt?: string;
  updatedAt?: string;
}
