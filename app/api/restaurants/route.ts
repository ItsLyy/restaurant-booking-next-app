import { NextRequest } from "next/server";

import { getRestaurantPage } from "@data/restaurants/get-restaurant-page";
import { parseRestaurantsQuery } from "@libs";

const PAGE_SIZE_DEFAULT = 8;
const PAGE_SIZE_MAX = 20;

export async function GET(request: NextRequest) {
  const rawSearchParams = request.nextUrl.searchParams;

  const queryParams: Record<string, string> = {};
  rawSearchParams.forEach((value, key) => {
    queryParams[key] = value;
  });
  const query = parseRestaurantsQuery(queryParams);

  const pageRaw = Number(rawSearchParams.get("page") ?? "1");
  const page = Number.isFinite(pageRaw) && pageRaw >= 1 ? Math.floor(pageRaw) : 1;

  const sizeRaw = Number(rawSearchParams.get("size") ?? String(PAGE_SIZE_DEFAULT));
  const pageSize =
    Number.isFinite(sizeRaw) && sizeRaw >= 1
      ? Math.min(Math.floor(sizeRaw), PAGE_SIZE_MAX)
      : PAGE_SIZE_DEFAULT;

  const result = await getRestaurantPage(query, page, pageSize);

  return Response.json(result);
}