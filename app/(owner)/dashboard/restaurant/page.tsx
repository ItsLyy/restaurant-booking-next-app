import { notFound } from "next/navigation";

import { StorefrontIcon } from "@phosphor-icons/react/dist/ssr";

import { Badge } from "@components";
import { formatDate } from "@utils";

import { Card } from "../_components/card";
import { InfoCard, InfoRow } from "../_components/info-card";

import { getRestaurantProfile } from "./_data/restaurant";
import { updateRestaurantAction } from "./_actions/update-restaurant-action";
import { requireOwner } from "@libs/session";

import { RestaurantEditForm } from "./_components/restaurant-edit-form";

export default async function OwnerRestaurantPage() {
  await requireOwner();
  const data = getRestaurantProfile();
  if (!data) notFound();

  const { restaurant, tablesCount } = data;

  return (
    <section className="px-4 pt-3 pb-6 w-full">
      <Card className="size-full flex flex-col gap-6">
        <header className="flex flex-col gap-1">
          <h2 className="text-d-header-lg text-foreground">Restaurant</h2>
          <span className="text-d-caption text-muted">
            Manage your restaurant profile. Only the owner can edit this.
          </span>
        </header>

        <div className="flex items-center gap-4">
          <div className="size-14 shrink-0 rounded-2xl border border-accent-200/25 bg-accent-100/10 flex items-center justify-center">
            <StorefrontIcon
              weight="fill"
              className="size-7 text-accent-100"
            />
          </div>
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-d-header-md text-foreground truncate">
                {restaurant.name}
              </span>
              {restaurant.discount ? (
                <Badge variant="positive">
                  Member · {restaurant.discount}% off
                </Badge>
              ) : null}
            </div>
            <span className="text-d-caption text-muted truncate">
              /{restaurant.slug} · {restaurant.country}, {restaurant.city}
            </span>
            <div className="flex flex-wrap gap-1">
              {restaurant.tags.map((tag) => (
                <Badge key={tag} variant="neutral" className="capitalize">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <InfoCard title="Location">
            <InfoRow label="Address">{restaurant.address}</InfoRow>
            <InfoRow label="Country">{restaurant.country}</InfoRow>
            <InfoRow label="City">{restaurant.city}</InfoRow>
          </InfoCard>

          <InfoCard title="Details">
            <InfoRow label="Member discount">
              {restaurant.discount ? `${restaurant.discount}%` : "None"}
            </InfoRow>
            <InfoRow label="Tables">{tablesCount} tables</InfoRow>
            <InfoRow label="Created at">
              {restaurant.createdAt ? formatDate(restaurant.createdAt) : "—"}
            </InfoRow>
            <InfoRow label="Last updated">
              {restaurant.updatedAt ? formatDate(restaurant.updatedAt) : "—"}
            </InfoRow>
          </InfoCard>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {restaurant.shortDescription ? (
            <InfoCard title="Short description">
              <p className="text-d-body text-foreground whitespace-pre-line">
                {restaurant.shortDescription}
              </p>
            </InfoCard>
          ) : null}
          <InfoCard title="About">
            <p className="text-d-body text-foreground whitespace-pre-line">
              {restaurant.description}
            </p>
          </InfoCard>
        </div>

        <div className="border border-muted rounded-lg p-4">
          <div className="flex flex-col gap-1 mb-5">
            <h3 className="text-d-header-md text-foreground">
              Edit restaurant
            </h3>
            <span className="text-d-caption text-muted">
              Changes are saved instantly and visible to diners on your page.
            </span>
          </div>
          <RestaurantEditForm
            action={updateRestaurantAction}
            initial={{
              name: restaurant.name,
              country: restaurant.country,
              city: restaurant.city,
              address: restaurant.address,
              description: restaurant.description,
              shortDescription: restaurant.shortDescription,
              discount: restaurant.discount,
              tags: restaurant.tags,
            }}
          />
        </div>
      </Card>
    </section>
  );
}