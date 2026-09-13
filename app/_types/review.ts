export interface IReview {
  id: string;
  customerComment: string;
  customerRating: number;
  customerCommentAt: string;
  ownerReply?: string;
  ownerReplyAt?: string;
  bookingId: string;
  createdAt?: string;
  updatedAt?: string;
}
