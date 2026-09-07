export interface IUser {
  id: string;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "owner" | "officer" | "customer";
  emailVerifyAt: string;
  allergics: string[];
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IOwner extends IUser {
  businessLicense?: string;
  verifyAt?: string;
}
