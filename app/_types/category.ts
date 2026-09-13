export interface ICategory {
  id: string;
  name: string;
  slug: string;
  image: string;
  restaurantIds: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ICategoryListItem extends ICategory {
  restaurantCount: number;
}