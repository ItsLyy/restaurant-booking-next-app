"use client";

import { Badge } from "./badge";

interface PartySizeProps {
  options: number[];
  emptyMessage?: string | null;
  selectedPartySize: number | null;
  onSelect: (size: number) => void;
}

export const PartySize = ({
  options,
  emptyMessage,
  selectedPartySize,
  onSelect,
}: PartySizeProps) => {
  return (
    <div className="flex flex-col gap-4 px-6 py-4">
      <span className="font-playfair-display font-medium text-base text-foreground">
        Number of People
      </span>
      {options.length === 0 ? (
        <span className="text-c-body text-muted">
          {emptyMessage ?? "No tables available for the selected time."}
        </span>
      ) : (
        <div className="grid grid-cols-6 gap-2 *:h-13">
          {options.map((size) => (
            <Badge
              key={size}
              onClick={() => onSelect(size)}
              active={selectedPartySize === size}
            >
              {size}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
