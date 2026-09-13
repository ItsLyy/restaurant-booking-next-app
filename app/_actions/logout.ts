"use server";

import { redirect } from "next/navigation";

import { deleteSession } from "@libs/session";

export async function logoutAction(): Promise<void> {
  await deleteSession();
  redirect("/");
}