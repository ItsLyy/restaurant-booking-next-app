import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RES.BOOK",
    short_name: "RES.BOOK",
    description: "Restaurant reservations with table booking, payments, and management.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f3ef",
    theme_color: "#f7f3ef",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}