import { Breadcrumb } from "./_components/breadcrumb";
import { Photos } from "./_components/photos";
import { Menus } from "./_components/menus";
import { RestaurantInformationHeader } from "./_components/header";
import { Reviews } from "./_components/reviews";

export default async function RestaurantDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const photos = [
    {
      url: "/",
      alt: "",
    },
    {
      url: "/",
      alt: "",
    },
    {
      url: "/",
      alt: "",
    },
  ];

  return (
    <section className="size-full space-y-4">
      <Breadcrumb name={slug} />
      <div className="flex gap-4 h-full w-full">
        <div className="w-104 shrink-0 space-y-6">
          <Photos slug={slug} banner={{ url: "/", alt: "" }} photos={photos} />
        </div>
        <div className="w-full flex flex-col grow-0 p-2 gap-4 overflow-hidden">
          <RestaurantInformationHeader
            name={slug}
            address="C/ del Bisbe Sivilla, 42"
            city="08022"
            country="Barcelona"
            shortDescription="FusionAverage price €20"
          />
          <p className="text-c-body">
            Get inspired by our restaurant description examples and learn how to
            write your own to use across your branded website, social media, and
            other digital channels.
          </p>
          <h2 className="text-c-header-md text-foreground">Menus</h2>
          <Menus />
          <h2 className="text-c-header-md text-foreground">Reviews</h2>
          <Reviews />
        </div>
      </div>
    </section>
  );
}
