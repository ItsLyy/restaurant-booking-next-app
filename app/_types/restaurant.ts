export interface IRestaurant {
  id: string;
  name: string;
  slug: string;
  country: string;
  city: string;
  address: string;
  tags: string[];
  ownerId: string;
  categoryId?: string;
  discount?: number;
  description: string;
  shortDescription?: string;
  lat?: number;
  lng?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IRestaurantPhoto {
  id: string;
  url: string;
  type: "cover" | "post" | "menu";
  restaurantId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ITable {
  id: string;
  name: string;
  price: number;
  category: string;
  floor: number;
  capacity: number;
  restaurantId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IRestaurantListItem extends Omit<
  IRestaurant,
  "ownerId" | "createdAt" | "updatedAt"
> {
  image: string;
  rating: number;
  minPrice: number;
  maxPrice?: number;
}
