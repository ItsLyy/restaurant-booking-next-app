"use client";

import { useActionState } from "react";
import { MagnifyingGlassIcon, CircleNotchIcon } from "@phosphor-icons/react/dist/ssr";

import { Button, Form, InputField } from "@components";
import { useFormContext } from "@components/general/form";

import { hireStaffAction } from "../_actions/hire-staff-action";
import { searchUserAction } from "../_actions/search-user-action";
import { UserProfile } from "./user-profile";

const PositionField = ({ canHireManager }: { canHireManager: boolean }) => {
  const { state } = useFormContext();
  const fieldError = state.errors?.position?.[0];

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="position" className="text-c-caption font-medium">
        Position <span className="text-negative">*</span>
      </label>
      <select
        id="position"
        name="position"
        defaultValue="staff"
        aria-invalid={fieldError ? true : undefined}
        className={`px-4 h-10 w-full border bg-base-200 text-foreground rounded-lg text-c-button focus:outline-none focus:ring-2 focus:ring-accent-200/20 focus:border-accent-200 ease-in-out transition-colors duration-300 ${
          fieldError ? "border-negative" : "border-muted"
        }`}
      >
        {canHireManager ? <option value="manager">Manager</option> : null}
        <option value="staff">Staff</option>
      </select>
      {fieldError ? (
        <span className="text-c-caption text-negative">{fieldError}</span>
      ) : null}
    </div>
  );
};

const FormFeedback = () => {
  const { state } = useFormContext();
  const userChoiceError = state.errors?.["user-choice"]?.[0];
  if (userChoiceError) {
    return (
      <p className="text-c-caption text-negative font-medium" role="alert">
        {userChoiceError}
      </p>
    );
  }

  return null;
};

export const HireStaffForm = ({
  canHireManager = true,
}: {
  canHireManager?: boolean;
}) => {
  const [searchState, searchAction, isSearching] = useActionState(
    searchUserAction,
    {},
  );
  const users = searchState.users;
  const hasSearched = users !== undefined;

  return (
    <div className="flex flex-col gap-5">
      <form action={searchAction} className="flex gap-2 items-end">
        <div className="flex-1">
          <InputField
            id="username"
            name="username"
            label="Search Candidate"
            placeholder="Search by username or name…"
            required
          />
        </div>
        <Button
          type="submit"
          variant="outline"
          disabled={isSearching}
          className="h-10! px-4! rounded-md! shrink-0 flex items-center gap-1.5"
        >
          {isSearching ? (
            <CircleNotchIcon className="size-4 animate-spin" />
          ) : (
            <MagnifyingGlassIcon className="size-4" />
          )}
          <span>Search</span>
        </Button>
      </form>

      <Form action={hireStaffAction} className="space-y-5">
        <div className="space-y-3">
          <span className="text-c-caption font-medium block">
            Select User <span className="text-negative">*</span>
          </span>
          <div className="w-full border border-muted rounded-lg p-2 max-h-60 overflow-y-auto space-y-1">
            {!hasSearched ? (
              <p className="text-d-caption text-muted p-3 text-center">
                Search by username or name above to see eligible candidates.
              </p>
            ) : users.length === 0 ? (
              <p className="text-d-caption text-muted p-3 text-center">
                No users found. Try a different search query.
              </p>
            ) : (
              users.map((user) => (
                <UserProfile
                  key={user.id}
                  userId={user.id}
                  userFirstName={user.firstName}
                  userLastName={user.lastName}
                  userName={user.username}
                  avatar={user.avatar}
                  eligible={user.eligible}
                  reason={user.reason}
                />
              ))
            )}
          </div>
          <FormFeedback />
          <PositionField canHireManager={canHireManager} />
        </div>

        <Form.SubmitButton className="w-full h-10! rounded-md!">
          Add Staff Member
        </Form.SubmitButton>
      </Form>
    </div>
  );
};
