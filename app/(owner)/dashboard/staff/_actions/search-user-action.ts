"use server";

import { z } from "zod";

import type { FormState } from "@types";
import {
  searchStaffCandidates,
  type StaffCandidate,
} from "@data/users/search-staff-candidates";

const searchUserSchema = z.object({
  username: z.string(),
});

export interface SearchUserFormState extends FormState {
  users?: StaffCandidate[];
}

export async function searchUserAction(
  _: SearchUserFormState,
  formData: FormData,
): Promise<SearchUserFormState> {
  const validated = searchUserSchema.safeParse({
    username: formData.get("username"),
  });

  if (!validated.success) {
    return {
      errors: z.flattenError(validated.error as z.ZodError).fieldErrors,
    };
  }

  const users = await searchStaffCandidates(validated.data.username);

  return {
    users,
  };
}
