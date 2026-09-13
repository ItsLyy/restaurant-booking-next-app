"use client";

import { useState } from "react";
import {
  CheckIcon,
  CookieIcon,
  EggIcon,
  FishIcon,
  GrainsIcon,
  PlantIcon,
  ShrimpIcon,
} from "@phosphor-icons/react/dist/ssr";
import { ALLERGY_OPTIONS } from "@data/profiles/profile-schema";

interface AllergySelectorProps {
  initialAllergies: string[];
}

const ALLERGY_META = {
  dairy: {
    label: "Dairy",
    description: "Milk, cheese, butter",
    icon: EggIcon,
  },
  gluten: {
    label: "Gluten",
    description: "Wheat, flour, bread",
    icon: GrainsIcon,
  },
  nuts: {
    label: "Tree Nuts",
    description: "Almonds, walnuts, pecans",
    icon: CookieIcon,
  },
  peanuts: {
    label: "Peanuts",
    description: "Groundnuts, peanut butter",
    icon: PlantIcon,
  },
  seafood: {
    label: "Seafood",
    description: "Finfish, salmon, tuna",
    icon: FishIcon,
  },
  shellfish: {
    label: "Shellfish",
    description: "Shrimp, lobster, crab",
    icon: ShrimpIcon,
  },
} as const;

export const AllergySelector = ({ initialAllergies }: AllergySelectorProps) => {
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>(
    initialAllergies,
  );

  const toggleAllergy = (option: string) => {
    setSelectedAllergies((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option],
    );
  };

  const clearAll = () => {
    setSelectedAllergies([]);
  };

  return (
    <fieldset className="flex flex-col gap-3 pt-2 border-t border-muted/40">
      <div className="flex items-center justify-between">
        <div>
          <legend className="text-sm font-semibold text-foreground">
            Food Allergies & Dietary Restrictions
          </legend>
          <p className="text-xs text-muted">
            Select any ingredients you cannot consume. Restaurants are notified automatically.
          </p>
        </div>
        {selectedAllergies.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs text-accent-100 hover:text-accent-200 font-medium transition-colors cursor-pointer"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {ALLERGY_OPTIONS.map((option) => {
          const meta = ALLERGY_META[option];
          const Icon = meta.icon;
          const isSelected = selectedAllergies.includes(option);

          return (
            <button
              key={option}
              type="button"
              onClick={() => toggleAllergy(option)}
              aria-pressed={isSelected}
              className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                isSelected
                  ? "bg-accent-100/10 border-accent-100 text-foreground ring-1 ring-accent-100/30"
                  : "bg-base-100 border-muted/50 text-foreground/80 hover:border-muted hover:bg-base-200/40"
              }`}
            >
              <div
                className={`size-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                  isSelected
                    ? "bg-accent-100 text-base-100"
                    : "bg-base-200 text-muted"
                }`}
              >
                <Icon weight="bold" className="size-4" />
              </div>
              <div className="flex flex-col min-w-0 grow">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-semibold text-foreground truncate">
                    {meta.label}
                  </span>
                  {isSelected && (
                    <CheckIcon
                      weight="bold"
                      className="size-3 text-accent-100 shrink-0"
                    />
                  )}
                </div>
                <span className="text-[11px] text-muted truncate">
                  {meta.description}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {selectedAllergies.map((allergy) => (
        <input
          key={allergy}
          type="hidden"
          name="allergics"
          value={allergy}
        />
      ))}
    </fieldset>
  );
};
