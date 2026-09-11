import {
  PROFILES_FILES,
  readProfiles,
  writeProfiles,
} from "@data/profiles/update-profile";

import type { IOwner, IOfficer, IUser } from "@types";

export type AuthRole = "customer" | "owner" | "manager" | "staff";

export interface AuthAccount {
  id: string;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "customer" | "owner" | "officer";
  position?: "manager" | "staff";
  restaurantId?: string;
  emailVerifyAt: string;
  allergics: string[];
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const getAccessRole = (account: AuthAccount): AuthRole => {
  if (account.role === "owner") return "owner";
  if (account.role === "officer") {
    return account.position === "manager" ? "manager" : "staff";
  }
  return "customer";
};

const toAccount = (row: IUser, extras?: Partial<AuthAccount>): AuthAccount => ({
  id: row.id,
  username: row.username,
  email: row.email,
  password: row.password,
  firstName: row.firstName,
  lastName: row.lastName,
  role: row.role,
  emailVerifyAt: row.emailVerifyAt,
  allergics: row.allergics,
  avatar: row.avatar,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
  ...extras,
});

export const findAccountByEmail = (email: string): AuthAccount | undefined => {
  const normalized = email.trim().toLowerCase();

  const officers = readProfiles<IOfficer>(PROFILES_FILES.officers);
  const officer = officers.find(
    (row) => row.email.toLowerCase() === normalized,
  );
  if (officer) {
    return toAccount(officer, {
      role: officer.role,
      position: officer.position,
      restaurantId: officer.restaurantId,
    });
  }

  const owners = readProfiles<IOwner>(PROFILES_FILES.owners);
  const owner = owners.find((row) => row.email.toLowerCase() === normalized);
  if (owner) {
    return toAccount(owner, { role: owner.role });
  }

  const customers = readProfiles<IUser>(PROFILES_FILES.customers);
  const customer = customers.find(
    (row) => row.email.toLowerCase() === normalized,
  );
  if (customer) {
    return toAccount(customer, { role: customer.role });
  }

  return undefined;
};

export const findAccountByUsername = (
  username: string,
): AuthAccount | undefined => {
  const normalized = username.trim().toLowerCase();

  const officers = readProfiles<IOfficer>(PROFILES_FILES.officers);
  const officer = officers.find(
    (row) => row.username.toLowerCase() === normalized,
  );
  if (officer) return toAccount(officer, { role: officer.role });

  const owners = readProfiles<IOwner>(PROFILES_FILES.owners);
  const owner = owners.find(
    (row) => row.username.toLowerCase() === normalized,
  );
  if (owner) return toAccount(owner, { role: "owner" });

  const customers = readProfiles<IUser>(PROFILES_FILES.customers);
  const customer = customers.find(
    (row) => row.username.toLowerCase() === normalized,
  );
  if (customer) return toAccount(customer, { role: "customer" });

  return undefined;
};

export const findAccountById = (id: string): AuthAccount | undefined => {
  const officers = readProfiles<IOfficer>(PROFILES_FILES.officers);
  const officer = officers.find((row) => row.id === id);
  if (officer) {
    return toAccount(officer, {
      role: officer.role,
      position: officer.position,
      restaurantId: officer.restaurantId,
    });
  }

  const owners = readProfiles<IOwner>(PROFILES_FILES.owners);
  const owner = owners.find((row) => row.id === id);
  if (owner) return toAccount(owner, { role: "owner" });

  const customers = readProfiles<IUser>(PROFILES_FILES.customers);
  const customer = customers.find((row) => row.id === id);
  if (customer) return toAccount(customer, { role: "customer" });

  return undefined;
};

export const createCustomerAccount = (input: {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  emailVerifyAt?: string;
}): AuthAccount => {
  const customers = readProfiles<IUser>(PROFILES_FILES.customers);
  const maxNum = customers.reduce((max, c) => {
    const n = Number.parseInt(c.id.replace(/^user-/, ""), 10);
    return Number.isFinite(n) ? Math.max(max, n) : max;
  }, 0);

  const now = new Date().toISOString();
  const account: AuthAccount = {
    id: `user-${String(maxNum + 1).padStart(3, "0")}`,
    username: input.username,
    email: input.email,
    password: input.password,
    firstName: input.firstName,
    lastName: input.lastName,
    role: "customer",
    emailVerifyAt: input.emailVerifyAt ?? now,
    allergics: [],
    avatar: input.avatar,
    createdAt: now,
    updatedAt: now,
  };

  writeProfiles(PROFILES_FILES.customers, [
    ...customers,
    account as IUser,
  ]);
  return account;
};

export const promoteToOwner = (accountId: string): AuthAccount | undefined => {
  const customers = readProfiles<IUser>(PROFILES_FILES.customers);
  const customer = customers.find((c) => c.id === accountId);
  if (!customer) return undefined;

  const owners = readProfiles<IOwner>(PROFILES_FILES.owners);
  const maxNum = owners.reduce((max, o) => {
    const n = Number.parseInt(o.id.replace(/^owner-/, ""), 10);
    return Number.isFinite(n) ? Math.max(max, n) : max;
  }, 0);

  const now = new Date().toISOString();
  const owner: IOwner = {
    ...customer,
    id: `owner-${String(maxNum + 1).padStart(3, "0")}`,
    role: "owner",
    businessLicense: undefined,
    verifyAt: "",
    updatedAt: now,
  };

  writeProfiles(PROFILES_FILES.owners, [...owners, owner]);
  writeProfiles(PROFILES_FILES.customers, customers);
  return toAccount(owner, { role: "owner" });
};