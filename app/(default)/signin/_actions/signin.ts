"use server";

import { redirect } from "next/navigation";

import z from "zod";

import {
  findAccountByEmail,
  findAccountByUsername,
  type AuthAccount,
} from "@data/auth/users";
import { verifyPassword } from "@libs/password";
import { safeNextPath } from "@libs/safe-next";
import { createSession } from "@libs/session";
import type { FormState } from "@types";

const findByIdentity = async (
  identity: string,
): Promise<AuthAccount | undefined> => {
  const byEmail = await findAccountByEmail(identity);
  if (byEmail) return byEmail;
  return findAccountByUsername(identity);
};

export async function SigninAction(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  const identity = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const validated = z
    .object({
      identity: z.string().min(1, "Username or email is required"),
      password: z.string().min(1, "Password is required"),
    })
    .safeParse({ identity, password });

  if (!validated.success) {
    return {
      errors: z.flattenError(validated.error as z.ZodError).fieldErrors,
    };
  }

  const account = await findByIdentity(validated.data.identity);
  const passwordMatches =
    account && (await verifyPassword(validated.data.password, account.password));

  if (!account || !passwordMatches) {
    return {
      success: false,
      message: "Invalid username/email or password.",
    };
  }

  await createSession(account);
  if (account.role === "customer") {
    redirect(safeNextPath(String(formData.get("next") ?? "")));
  }
  redirect("/dashboard");
}