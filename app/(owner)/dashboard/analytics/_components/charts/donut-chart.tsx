"use client";

import { useState } from "react";

export interface DonutDatum {
  label: string;
  value: number;
  color: string;
}

export const DonutChart = ({
  data,
  size = 176,
  strokeWidth = 22,
}: {
  data: DonutDatum[];
  size?: number;
  strokeWidth?: number;
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const segments = data.map((item, index) => {
    const previousTotal = data.slice(0, index).reduce((sum, prev) => sum + prev.value, 0);
    const previousLength = (total === 0 ? 0 : previousTotal / total) * circumference;
    const fraction = total === 0 ? 0 : item.value / total;
    const length = fraction * circumference;
    return {
      ...item,
      index,
      fraction,
      startOffset: previousLength,
      dashOffset: -previousLength,
      dash: `${length} ${circumference - length}`,
    };
  });

  const active = activeIndex !== null ? data[activeIndex] : null;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
        >
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#9a7a65"
            strokeOpacity={0.2}
            strokeWidth={strokeWidth}
          />
          {segments.map((segment) => (
            <circle
              key={segment.label}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth={strokeWidth}
              strokeDasharray={segment.dash}
              strokeDashoffset={segment.dashOffset}
              strokeLinecap="butt"
              className="transition-opacity"
              opacity={
                activeIndex === null || activeIndex === segment.index ? 1 : 0.35
              }
              onMouseEnter={() => setActiveIndex(segment.index)}
              onMouseLeave={() => setActiveIndex(null)}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-d-stat text-foreground leading-none">
            {formatDonutValue(active?.value ?? total)}
          </span>
          <span className="text-d-caption mt-1">{active?.label ?? "Total"}</span>
        </div>
      </div>

      <ul className="flex flex-col gap-1.5 w-full">
        {segments.map((segment) => (
          <li
            key={segment.label}
            className="flex items-center gap-2 text-sm cursor-default"
            onMouseEnter={() => setActiveIndex(segment.index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <span
              className="size-2.5 rounded-sm shrink-0"
              style={{ backgroundColor: segment.color }}
            />
            <span className="text-foreground">{segment.label}</span>
            <span className="text-d-caption ml-auto">
              {segment.value} · {Math.round(segment.fraction * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const formatDonutValue = (value: number): string => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return String(value);
};