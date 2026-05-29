import { MapPinIcon, MartiniIcon } from "@phosphor-icons/react/dist/ssr";

import type { IRestaurant } from "@types";
type RestaurantInformationHeaderProps = Pick<
  IRestaurant,
  "name" | "address" | "city" | "country" | "shortDescription"
>;

export const RestaurantInformationHeader = ({
  name,
  address,
  city,
  country,
  shortDescription,
}: RestaurantInformationHeaderProps) => {
  return (
    <header className=" space-y-4">
      <h1 className="text-c-header-lg text-foreground">{name}</h1>
      <ul className="space-y-1">
        <li className="flex items-center gap-2">
          <MapPinIcon weight="duotone" className="size-5 shrink-0" />
          <span className="text-c-button font-normal leading-tight">
            {address}, {city}, {country}
          </span>
        </li>
        <li className="flex items-center gap-2">
          <MartiniIcon weight="duotone" className="size-5 shrink-0" />
          <span className="text-c-button font-normal leading-tight">
            {shortDescription}
          </span>
        </li>
      </ul>
    </header>
  );
};
