"use client";

import { Form } from "@components";

import { updateCoverAction } from "../_actions/photo-actions";

export const CoverForm = () => {
  return (
    <Form action={updateCoverAction} className="flex flex-col gap-4">
      <Form.FileField
        id="photo"
        label="New cover image"
        accept="image/jpeg,image/png,image/webp,image/gif"
        hint="JPG, PNG, WEBP, or GIF · max 5MB"
      />
      <Form.SubmitButton className="w-fit! px-4!">
        Update cover image
      </Form.SubmitButton>
    </Form>
  );
};