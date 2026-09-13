import { redirect } from "next/navigation";

import AuthCard from "@components/auth/auth-card";
import { getAuthUser } from "@libs/session";
import RestaurantCreateForm from "./_components/restaurant-create-form";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Restaurant Registration",
  description: "Register your restaurant",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function RestaurantSignupPage() {
  const user = await getAuthUser();
  if (!user) redirect("/signup");

  return (
    <AuthCard
      step={4}
      title="Restaurant Registration"
      subtitle="Finish your restaurant details to activate your Owner role."
    >
      <RestaurantCreateForm />
    </AuthCard>
  );
}