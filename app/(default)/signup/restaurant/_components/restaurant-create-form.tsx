"use client";

import Link from "next/link";

import {
  ArrowLeftIcon,
  StorefrontIcon,
} from "@phosphor-icons/react/dist/ssr";

import { Form } from "@components";

import { createRestaurantAction } from "../_actions/create-restaurant";

const RestaurantCreateForm = () => {
  return (
    <Form action={createRestaurantAction} className="space-y-12">
      <div className="space-y-3">
        <Form.InputField
          id="restaurant-name"
          label="Restaurant Name"
          placeholder="e.g. The Green Garden"
          leftSlot={<StorefrontIcon className="size-4" />}
        />
        <Form.FileField
          id="business-license"
          label="Business license"
          accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
        />
      </div>
      <div className="space-y-3">
        <Form.SubmitButton className="w-full">
          Create restaurant
        </Form.SubmitButton>
        <span className="flex justify-center">
          <Link
            href="/signup/role"
            className="inline-flex items-center gap-1.5 text-c-button text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeftIcon className="size-3.5" />
            Back to role selection
          </Link>
        </span>
      </div>
    </Form>
  );
};

export default RestaurantCreateForm;