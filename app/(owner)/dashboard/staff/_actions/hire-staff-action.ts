"use server";

import z from "zod";

import { revalidatePath } from "next/cache";

import type { FormState, IOfficer } from "@types";
import {
  readProfiles,
  writeProfiles,
  PROFILES_FILES,
} from "@data/profiles/update-profile";
import { getDashboardRole } from "@libs/session";

const OWNER_ID = "owner-001";
const RESTAURANT_ID = "rest-001";

const hireSchema = z.object({
  "first-name": z
    .string()
    .min(1, "First name is required")
    .max(50, "Must be 50 characters or fewer"),
  "last-name": z
    .string()
    .min(1, "Last name is required")
    .max(50, "Must be 50 characters or fewer"),
  email: z.email("Please enter a valid email address"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be 30 characters or fewer"),
  position: z.enum(["manager", "staff"]),
});

export async function hireStaffAction(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  const validated = hireSchema.safeParse({
    "first-name": formData.get("first-name"),
    "last-name": formData.get("last-name"),
    email: formData.get("email"),
    username: formData.get("username"),
    position: formData.get("position"),
  });

  if (!validated.success) {
    return {
      errors: z.flattenError(validated.error as z.ZodError).fieldErrors,
    };
  }

  if (
    (await getDashboardRole()) === "manager" &&
    validated.data.position === "manager"
  ) {
    return {
      success: false,
      message: "Only the owner can hire managers.",
    };
  }

  const officers = readProfiles<IOfficer>(PROFILES_FILES.officers);
  const exists = officers.some(
    (o) =>
      o.email.toLowerCase() === validated.data.email.toLowerCase() ||
      o.username.toLowerCase() === validated.data.username.toLowerCase(),
  );

  if (exists) {
    return {
      success: false,
      message: "An officer with that email or username already exists.",
    };
  }

  const maxNum = officers.reduce((max, o) => {
    const n = Number.parseInt(o.id.replace(/^officer-/, ""), 10);
    return Number.isFinite(n) ? Math.max(max, n) : max;
  }, 0);

  const now = new Date().toISOString();
  const newOfficer: IOfficer = {
    id: `officer-${String(maxNum + 1).padStart(3, "0")}`,
    username: validated.data.username,
    firstName: validated.data["first-name"],
    lastName: validated.data["last-name"],
    email: validated.data.email,
    password: "",
    role: "officer",
    emailVerifyAt: "",
    allergics: [],
    position: validated.data.position,
    invitedBy: OWNER_ID,
    restaurantId: RESTAURANT_ID,
    createdAt: now,
    updatedAt: now,
  };

  writeProfiles(PROFILES_FILES.officers, [...officers, newOfficer]);
  revalidatePath("/dashboard/staff", "page");
  return { success: true, message: "Staff member added." };
}