import { getAuthUser } from "@libs/session";
import { PROFILES_FILES, readProfiles } from "@data/profiles/update-profile";
import type { IOfficer, IRestaurant } from "@types";

const DEFAULT_RESTAURANT_ID = "rest-001";

export async function getCurrentRestaurantId(): Promise<string> {
  const user = await getAuthUser();
  if (!user) return DEFAULT_RESTAURANT_ID;

  if (user.role === "owner") {
    const restaurants = readProfiles<IRestaurant>(PROFILES_FILES.restaurants);
    const found = restaurants.find((r) => r.ownerId === user.userId);
    if (found) return found.id;
  } else if (user.role === "manager" || user.role === "staff") {
    const officers = readProfiles<IOfficer>(PROFILES_FILES.officers);
    const found = officers.find((o) => o.id === user.userId);
    if (found) return found.restaurantId;
  }

  return DEFAULT_RESTAURANT_ID;
}
