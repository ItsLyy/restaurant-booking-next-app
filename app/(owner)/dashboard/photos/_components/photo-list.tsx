import type { IRestaurantPhoto } from "@types";

import { PhotoItem } from "./photo-item";

export const PhotoList = ({ photos }: { photos: IRestaurantPhoto[] }) => {
  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
      {photos.map((photo) => (
        <PhotoItem key={photo.id} photo={photo} />
      ))}
    </div>
  );
};