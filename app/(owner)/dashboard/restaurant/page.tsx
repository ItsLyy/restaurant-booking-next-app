import { notFound } from "next/navigation";

import { Badge } from "@components";
import { formatDate } from "@utils";

import { Card } from "../_components/card";
import { InfoCard, InfoRow } from "../_components/info-card";

import { getRestaurantProfile } from "./_data/restaurant";
import { updateRestaurantAction } from "./_actions/update-restaurant-action";

import { RestaurantEditForm } from "./_components/restaurant-edit-form";

export default async function OwnerRestaurantPage() {
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

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-d-header-md text-foreground truncate">
              {restaurant.name}
            </span>
            <span className="text-d-caption text-muted">
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

        <p className="text-d-body text-foreground">{restaurant.description}</p>

        <div className="border border-muted rounded-lg p-4">
          <h3 className="text-d-header-md text-foreground mb-4">
            Edit restaurant
          </h3>
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
