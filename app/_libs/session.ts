import { cookies } from "next/headers";
import { notFound } from "next/navigation";

export type RegisteredRole = "customer" | "owner" | "officer";
export type DashboardRole = "owner" | "officer";

export interface RegisteredUser {
  email: string;
  role: RegisteredRole;
  registeredAt: string;
}

const SESSION_COOKIE = "resbook_user";

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 24 * 60 * 60,
} as const;

const parseUser = (raw: string): RegisteredUser | null => {
  try {
    const user = JSON.parse(raw) as RegisteredUser;
    if (
      typeof user.email === "string" &&
      (user.role === "customer" ||
        user.role === "owner" ||
        user.role === "officer")
    ) {
      return user;
    }
    return null;
  } catch {
    return null;
  }
};

export const getRegisteredUser = async (): Promise<RegisteredUser | null> => {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  return raw ? parseUser(raw) : null;
};

export const getDashboardRole = async (): Promise<DashboardRole> => {
  const user = await getRegisteredUser();
  return user?.role === "officer" ? "officer" : "owner";
};

export const requireOwner = async (): Promise<void> => {
  if ((await getDashboardRole()) !== "owner") notFound();
};

export const registerUser = async ({
  email,
}: {
  email: string;
}): Promise<void> => {
  const cookieStore = await cookies();
  const user: RegisteredUser = {
    email,
    role: "customer",
    registeredAt: new Date().toISOString(),
  };
  cookieStore.set(SESSION_COOKIE, JSON.stringify(user), COOKIE_OPTIONS);
};

export const setRegisteredRole = async (
  role: RegisteredRole,
): Promise<void> => {
  const user = await getRegisteredUser();
  const cookieStore = await cookies();
  const nextUser: RegisteredUser = user
    ? { ...user, role }
    : {
        email: "",
        role,
        registeredAt: new Date().toISOString(),
      };
  cookieStore.set(SESSION_COOKIE, JSON.stringify(nextUser), COOKIE_OPTIONS);
};