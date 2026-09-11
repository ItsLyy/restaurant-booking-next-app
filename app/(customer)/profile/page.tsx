import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { getCustomerProfileData } from "./_data/profile";
import { updateProfileAction } from "./_actions/update-profile-action";
import { ProfileViewContainer } from "./_components/profile-view-container";

export const metadata: Metadata = {
  title: "My Profile",
  description: "View and manage your dining profile, dietary preferences, and reservations.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function CustomerProfilePage() {
  const data = getCustomerProfileData();
  if (!data) notFound();

  return (
    <section className="w-full max-w-4xl mx-auto py-2">
      <ProfileViewContainer
        data={data}
        action={updateProfileAction}
      />
    </section>
  );
}