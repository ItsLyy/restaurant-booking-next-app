import { notFound } from "next/navigation";

import { Avatar, Badge, ProfileEditForm } from "@components";
import { formatDate } from "@utils";
import { getDashboardRole } from "@libs/session";

import { Card } from "../_components/card";
import { InfoCard, InfoRow } from "../_components/info-card";

import { OfficerProfile } from "./_components/officer-profile";
import { getOwnerProfile } from "./_data/profile";
import { updateOwnerProfileAction } from "./_actions/update-owner-profile-action";

export default async function DashboardProfilePage() {
  const role = await getDashboardRole();
  if (role !== "owner") return <OfficerProfile />;

  const data = await getOwnerProfile();
  if (!data) notFound();

  const { owner, restaurant } = data;
  const fullName = `${owner.firstName} ${owner.lastName}`;

  return (
    <section className="px-4 pt-3 pb-6 w-full">
      <Card className="size-full flex flex-col gap-6">
        <header className="flex flex-col gap-1">
          <h2 className="text-d-header-lg text-foreground">Profile</h2>
          <span className="text-d-caption text-muted">
            Manage your account and restaurant details.
          </span>
        </header>

        <div className="flex items-center gap-4">
          <Avatar
            src={owner.avatar ?? ""}
            alt={fullName}
            className="size-16!"
          />
          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-d-header-md text-foreground truncate">
              {fullName}
            </span>
            <span className="text-d-caption text-muted">@{owner.username}</span>
            <div className="flex flex-wrap items-center gap-2">
              <Badge>Owner</Badge>
              {restaurant ? (
                <Badge variant="neutral">
                  {restaurant.name} · {restaurant.city}
                </Badge>
              ) : null}
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <InfoCard title="Account">
            <InfoRow label="Email">{owner.email}</InfoRow>
            <InfoRow label="Email verified">
              <Badge variant={owner.emailVerifyAt ? "positive" : "neutral"}>
                {owner.emailVerifyAt ? "Verified" : "Unverified"}
              </Badge>
            </InfoRow>
            <InfoRow label="Member since">
              {owner.createdAt ? formatDate(owner.createdAt) : "—"}
            </InfoRow>
          </InfoCard>

          <InfoCard title="Business">
            <InfoRow label="Restaurant">
              {restaurant ? `${restaurant.name}, ${restaurant.city}` : "—"}
            </InfoRow>
            <InfoRow label="Business license">
              {owner.businessLicense ?? "—"}
            </InfoRow>
            <InfoRow label="Verified on">
              {owner.verifyAt ? formatDate(owner.verifyAt) : "—"}
            </InfoRow>
          </InfoCard>
        </div>

        <div className="border border-muted rounded-lg p-4">
          <h3 className="text-d-header-md text-foreground mb-4">
            Edit profile
          </h3>
          <ProfileEditForm
            action={updateOwnerProfileAction}
            initial={{
              firstName: owner.firstName,
              lastName: owner.lastName,
              email: owner.email,
              avatar: owner.avatar,
              allergics: owner.allergics,
            }}
          />
        </div>
      </Card>
    </section>
  );
}