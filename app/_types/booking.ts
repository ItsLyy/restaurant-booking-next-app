export interface IBooking {
  id: string;
  date: string;
  time: string;
  partySize: number;
  specialRequest?: string;
  status: "pending" | "confirmed" | "cancelled" | "completed" | "no_show";
  customerId: string;
  tableId: string;
  cancelled?: IBookingCancelled;
  createdAt?: string;
  updatedAt?: string;
}

export interface IBookingCancelled {
  date: string;
  by: "user" | "restaurant";
  reason: string;
}
