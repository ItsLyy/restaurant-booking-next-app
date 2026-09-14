"use client";

import { useState } from "react";

import {
  CardsThreeIcon,
  ImageSquareIcon,
  ReceiptIcon,
} from "@phosphor-icons/react/dist/ssr";

import type { IRestaurantPhoto } from "@types";

import { SafeImage } from "@components";

import { addMenuPhotoAction, addPostPhotoAction } from "../_actions/photo-actions";

import { MAX_GALLERY_PHOTOS } from "../_constants";

import { AddPhotoForm } from "./add-photo-form";
import { CoverForm } from "./cover-form";
import { PhotoList } from "./photo-list";

type TabId = "cover" | "gallery" | "menu";

interface PhotoTabsProps {
  cover: IRestaurantPhoto;
  posts: IRestaurantPhoto[];
  menus: IRestaurantPhoto[];
}

export const PhotoTabs = ({ cover, posts, menus }: PhotoTabsProps) => {
  const [activeTab, setActiveTab] = useState<TabId>("cover");
  const galleryFull = posts.length >= MAX_GALLERY_PHOTOS;

  const tabs: {
    id: TabId;
    label: string;
    icon: typeof ImageSquareIcon;
    count: number;
  }[] = [
    { id: "cover", label: "Cover", icon: ImageSquareIcon, count: 1 },
    { id: "gallery", label: "Gallery", icon: CardsThreeIcon, count: posts.length },
    { id: "menu", label: "Menu", icon: ReceiptIcon, count: menus.length },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div
        role="tablist"
        aria-label="Photo categories"
        className="inline-flex w-fit max-w-full items-center gap-1 rounded-xl border border-muted bg-base-100 p-1.5"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const selected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              type="button"
              aria-selected={selected}
              onClick={() => setActiveTab(tab.id)}
              className={`flex cursor-pointer items-center gap-2 rounded-lg px-3.5 py-2 text-d-caption transition-colors ${
                selected
                  ? "bg-accent-200/15 text-accent-100"
                  : "text-muted hover:bg-base-200 hover:text-foreground"
              }`}
            >
              <Icon className="size-4" />
              <span>{tab.label}</span>
              <span
                className={`inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums ${
                  selected ? "bg-accent-100 text-base-100" : "bg-base-200 text-muted"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {activeTab === "cover" ? (
        <section aria-labelledby="cover-tab-title" className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h3 id="cover-tab-title" className="text-d-header-md text-foreground">
              Cover image
            </h3>
            <span className="text-d-caption text-muted">
              The hero image shown at the top of your restaurant page.
            </span>
          </div>
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-muted bg-base-100">
            <SafeImage
              src={cover.url}
              alt="Current cover image"
              fill
              sizes="(min-width: 1024px) 1024px, 100vw"
              className="object-cover"
            />
          </div>
          <CoverForm />
        </section>
      ) : null}

      {activeTab === "gallery" ? (
        <section aria-labelledby="gallery-tab-title" className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h3 id="gallery-tab-title" className="text-d-header-md text-foreground">
              Gallery photos
            </h3>
            <span className="text-d-caption text-muted">
              {posts.length} photo{posts.length !== 1 ? "s" : ""} shown in the
              gallery of your restaurant page.
            </span>
          </div>
          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-muted py-10 text-center">
              <CardsThreeIcon className="size-8 text-muted" />
              <p className="text-d-caption text-muted">
                No gallery photos yet. Add your first one below.
              </p>
            </div>
          ) : (
            <PhotoList photos={posts} />
          )}
          {galleryFull ? (
            <div className="flex items-center gap-2 rounded-lg border border-dashed border-muted py-5 px-4 text-d-caption text-muted">
              <CardsThreeIcon className="size-5 shrink-0" />
              <span>
                Gallery full — up to {MAX_GALLERY_PHOTOS} photos are shown on
                your page. Delete one before adding another.
              </span>
            </div>
          ) : (
            <AddPhotoForm
              action={addPostPhotoAction}
              submitLabel="Add gallery photo"
              hint={`Shown in the gallery of your restaurant page · ${posts.length}/${MAX_GALLERY_PHOTOS} used`}
            />
          )}
        </section>
      ) : null}

      {activeTab === "menu" ? (
        <section aria-labelledby="menu-tab-title" className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h3 id="menu-tab-title" className="text-d-header-md text-foreground">
              Menu images
            </h3>
            <span className="text-d-caption text-muted">
              {menus.length} image{menus.length !== 1 ? "s" : ""} shown in the
              menu gallery of your restaurant page.
            </span>
          </div>
          {menus.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-muted py-10 text-center">
              <ReceiptIcon className="size-8 text-muted" />
              <p className="text-d-caption text-muted">
                No menu images yet. Add your first one below.
              </p>
            </div>
          ) : (
            <PhotoList photos={menus} />
          )}
          <AddPhotoForm
            action={addMenuPhotoAction}
            submitLabel="Add menu image"
            hint="Shown in the menu gallery of your restaurant page."
          />
        </section>
      ) : null}
    </div>
  );
};