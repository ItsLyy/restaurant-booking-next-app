"use client";

import { useState } from "react";
import {
  AddressBookIcon,
  PencilSimpleIcon,
} from "@phosphor-icons/react/dist/ssr";

import { ProfileEditForm } from "@components";
import type { FormAction } from "@types";

import type { CustomerProfileData } from "../_data/profile";
import { ProfileHero } from "./profile-hero";
import { ProfileOverview } from "./profile-overview";
import { ProfileStats } from "./profile-stats";

interface ProfileViewContainerProps {
  data: CustomerProfileData;
  action: FormAction;
}

export const ProfileViewContainer = ({
  data,
  action,
}: ProfileViewContainerProps) => {
  const [activeTab, setActiveTab] = useState<"overview" | "edit">("overview");

  return (
    <div className="space-y-6">
      {/* 1. Profile Hero Identity Banner */}
      <ProfileHero
        user={data.user}
        onEditClick={() => setActiveTab("edit")}
      />

      {/* 2. Key Metrics Strip */}
      <ProfileStats
        stats={data.stats}
        memberSince={data.user.createdAt}
      />

      {/* 3. Segmented Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-muted/40 pb-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            aria-selected={activeTab === "overview"}
            role="tab"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "overview"
                ? "bg-accent-100 text-base-100 shadow-sm"
                : "text-muted hover:text-foreground hover:bg-base-200/60"
            }`}
          >
            <AddressBookIcon weight="bold" className="size-3.5" />
            <span>Profile Overview</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("edit")}
            aria-selected={activeTab === "edit"}
            role="tab"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "edit"
                ? "bg-accent-100 text-base-100 shadow-sm"
                : "text-muted hover:text-foreground hover:bg-base-200/60"
            }`}
          >
            <PencilSimpleIcon weight="bold" className="size-3.5" />
            <span>Edit Profile</span>
          </button>
        </div>

        <span className="hidden sm:inline-block text-[11px] text-muted">
          {activeTab === "overview"
            ? "Viewing public profile & preferences"
            : "Editing personal information"}
        </span>
      </div>

      {/* 4. Tab Panels */}
      <div className="rise-in">
        {activeTab === "overview" ? (
          <ProfileOverview
            user={data.user}
            recentBookings={data.recentBookings}
            onEditClick={() => setActiveTab("edit")}
          />
        ) : (
          <div className="rounded-3xl border border-muted/50 bg-base-200/90 p-5 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between gap-2 mb-6 pb-4 border-b border-muted/30">
              <div>
                <h2 className="text-xl font-playfair-display font-semibold text-foreground">
                  Edit Profile Details
                </h2>
                <p className="text-xs text-muted">
                  Update your photo, personal details, and food allergies.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab("overview")}
                className="text-xs font-medium text-accent-100 hover:text-accent-200 cursor-pointer"
              >
                ← Back to overview
              </button>
            </div>

            <ProfileEditForm
              action={action}
              initial={{
                firstName: data.user.firstName,
                lastName: data.user.lastName,
                email: data.user.email,
                avatar: data.user.avatar,
                allergics: data.user.allergics,
              }}
              onCancel={() => setActiveTab("overview")}
              onSuccess={() => setActiveTab("overview")}
            />
          </div>
        )}
      </div>
    </div>
  );
};
