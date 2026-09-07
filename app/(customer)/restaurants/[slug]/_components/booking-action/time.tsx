"use client";

import { Badge } from "./badge";

interface TimeProps {
  times: string[];
  selectedTime: string | null;
  onSelect: (time: string) => void;
}

export const Time = ({ times, selectedTime, onSelect }: TimeProps) => {
  return (
    <div className="flex flex-col gap-4 px-6 py-4 border-b border-muted">
      <span className="font-playfair-display font-medium text-base text-foreground">
        Choose Your Time
      </span>
      {times.length === 0 ? (
        <span className="text-c-body text-muted">
          No available times for the selected date.
        </span>
      ) : (
        <div className="grid grid-cols-5 gap-2 *:h-13">
          {times.map((time) => (
            <Badge
              key={time}
              onClick={() => onSelect(time)}
              active={selectedTime === time}
            >
              {time}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
