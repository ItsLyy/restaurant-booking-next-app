import Link from "next/link";
import {
  CaretUpDownIcon,
  CheckIcon,
  SortAscendingIcon,
  SortDescendingIcon,
} from "@phosphor-icons/react/dist/ssr";

import { Dropdown } from "./dropdown";
import { buildRestaurantsHref } from "@libs";

import type {
  RestaurantOrder,
  RestaurantQuery,
  RestaurantSortKey,
} from "@libs";

interface SortProps {
  query: RestaurantQuery;
  searchParams: Record<string, string | string[] | undefined>;
}

const SORT_OPTIONS: {
  sort: RestaurantSortKey;
  order: RestaurantOrder;
  label: string;
}[] = [
  { sort: "name", order: "asc", label: "Name (A–Z)" },
  { sort: "name", order: "desc", label: "Name (Z–A)" },
  { sort: "rating", order: "desc", label: "Highest rated" },
  { sort: "rating", order: "asc", label: "Lowest rated" },
  { sort: "price", order: "asc", label: "Price (low to high)" },
  { sort: "price", order: "desc", label: "Price (high to low)" },
];

export const Sort = ({ query, searchParams }: SortProps) => {
  const Icon = query.sort
    ? query.order === "desc"
      ? SortDescendingIcon
      : SortAscendingIcon
    : CaretUpDownIcon;

  return (
    <Dropdown
      key={buildRestaurantsHref(searchParams, {})}
      ariaLabel="Sort"
      summaryClassName="w-11 px-0 justify-center"
      panelClassName="right-0 w-56"
      summary={<Icon size={20} weight="duotone" />}
    >
      {SORT_OPTIONS.map((option) => {
        const active =
          query.sort === option.sort && query.order === option.order;
        return (
          <Link
            key={`${option.sort}-${option.order}`}
            href={buildRestaurantsHref(searchParams, {
              sort: option.sort,
              order: option.order,
            })}
            className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-c-body transition-colors ${
              active
                ? "bg-accent-100 text-base-100"
                : "text-foreground hover:bg-base-200"
            }`}
          >
            <span>{option.label}</span>
            {active ? <CheckIcon size={16} weight="bold" /> : null}
          </Link>
        );
      })}
    </Dropdown>
  );
};