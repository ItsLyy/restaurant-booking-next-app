"use client";

import { Form } from "@components";

import type { FormAction } from "@types";

interface AddPhotoFormProps {
  action: FormAction;
  submitLabel: string;
  hint?: string;
}

export const AddPhotoForm = ({ action, submitLabel, hint }: AddPhotoFormProps) => {
  return (
    <Form action={action} className="flex flex-col gap-4">
      <Form.FileField
        id="photo"
        label="New image"
        accept="image/jpeg,image/png,image/webp,image/gif"
        hint={hint ?? "JPG, PNG, WEBP, or GIF · max 5MB"}
      />
      <Form.SubmitButton className="w-fit! px-6!">
        {submitLabel}
      </Form.SubmitButton>
    </Form>
  );
};