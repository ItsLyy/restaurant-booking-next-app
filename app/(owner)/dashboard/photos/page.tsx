import { notFound } from "next/navigation";

import { Card } from "../_components/card";

import { getPhotosData } from "./_data/photos";

import { PhotoTabs } from "./_components/photo-tabs";

export default async function DashboardPhotosPage() {
  const { cover, posts, menus } = getPhotosData();
  if (!cover) notFound();

  return (
    <section className="px-4 pt-3 pb-6 w-full">
      <Card className="size-full flex flex-col gap-6">
        <header className="flex flex-col gap-1">
          <h2 className="text-d-header-lg text-foreground">Photos</h2>
          <span className="text-d-caption text-muted">
            Manage your restaurant cover, gallery, and menu images. Changes are
            saved instantly and visible to diners on your page.
          </span>
        </header>

        <PhotoTabs cover={cover} posts={posts} menus={menus} />
      </Card>
    </section>
  );
}