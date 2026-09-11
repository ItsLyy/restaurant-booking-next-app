import { notFound } from "next/navigation";

import { Avatar, Badge, ProfileEditForm } from "@components";
import { formatDate } from "@utils";
import { getSessionOfficerId } from "@libs/session";

import { Card } from "../../_components/card";
import { InfoCard, InfoRow } from "../../_components/info-card";
import { getOfficerData } from "../../_data/officer";
import { updateOfficerProfileAction } from "../_actions/update-officer-profile-action";

export const OfficerProfile = async () => {
  const data = getOfficerData(await getSessionOfficerId());
  if (!data) notFound();

  const { officer, restaurant, invitedByOwner } = data;
  const fullName = `${officer.firstName} ${officer.lastName}`;
  const allergies =
    officer.allergics.length > 0 ? officer.allergics : null;

  return (
    <section className="px-4 pt-3 pb-6 w-full">
      <Card className="size-full flex flex-col gap-6">
        <header className="flex flex-col gap-1">
          <h2 className="text-d-header-lg text-foreground">Profile</h2>
          <span className="text-d-caption text-muted">
            Manage your account and staff details.
          </span>
        </header>

        <div className="flex items-center gap-4">
          <Avatar
            src={officer.avatar ?? ""}
            alt={fullName}
            className="size-16!"
          />
          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-d-header-md text-foreground truncate">
              {fullName}
            </span>
            <span className="text-d-caption text-muted">
              @{officer.username}
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="capitalize">{officer.position}</Badge>
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <InfoCard title="Account">
            <InfoRow label="Email">{officer.email}</InfoRow>
            <InfoRow label="Email verified">
              <Badge variant={officer.emailVerifyAt ? "positive" : "neutral"}>
                {officer.emailVerifyAt ? "Verified" : "Unverified"}
              </Badge>
            </InfoRow>
            <InfoRow label="Member since">
              {officer.createdAt ? formatDate(officer.createdAt) : "—"}
            </InfoRow>
            <InfoRow label="Food allergies">
              {allergies ? (
                <span className="flex flex-wrap justify-end gap-1">
                  {allergies.map((allergy) => (
                    <Badge
                      key={allergy}
                      variant="neutral"
                      className="capitalize"
                    >
                      {allergy}
                    </Badge>
                  ))}
                </span>
              ) : (
                <span className="text-muted">None</span>
              )}
            </InfoRow>
          </InfoCard>

          <InfoCard title="Employment">
            <InfoRow label="Position">
              <span className="capitalize">{officer.position}</span>
            </InfoRow>
            <InfoRow label="Restaurant">
              {restaurant ? `${restaurant.name}, ${restaurant.city}` : "—"}
            </InfoRow>
            <InfoRow label="Invited by">
              {invitedByOwner
                ? `${invitedByOwner.firstName} ${invitedByOwner.lastName}`
                : "—"}
            </InfoRow>
          </InfoCard>
        </div>

        <div className="border border-muted rounded-lg p-4">
          <h3 className="text-d-header-md text-foreground mb-4">
            Edit profile
          </h3>
          <ProfileEditForm
            action={updateOfficerProfileAction}
            initial={{
              firstName: officer.firstName,
              lastName: officer.lastName,
              email: officer.email,
              avatar: officer.avatar,
              allergics: officer.allergics,
            }}
          />
        </div>
      </Card>
    </section>
  );
};