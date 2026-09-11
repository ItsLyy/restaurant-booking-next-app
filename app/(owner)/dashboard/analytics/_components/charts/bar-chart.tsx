"use client";

import { useEffect, useRef, useState } from "react";

import { formatCompact } from "./chart-format";

const MAX_X_LABELS = 12;

export const BarChart = ({
  data,
  height = 200,
  highlightIndex,
}: {
  data: { label: string; value: number }[];
  height?: number;
  highlightIndex?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const update = () => setWidth(element.clientWidth);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const padTop = 20;
  const padRight = 8;
  const padBottom = 26;
  const padLeft = 8;

  const plotWidth = Math.max(0, width - padLeft - padRight);
  const plotHeight = height - padTop - padBottom;

  const maxValue = Math.max(...data.map((point) => point.value), 1);
  const yMax = maxValue * 1.15;
  const n = data.length;

  const slotWidth = n > 0 ? plotWidth / n : 0;
  const barWidth = Math.min(44, slotWidth * 0.6);

  const labelStep = n > MAX_X_LABELS ? Math.ceil(n / MAX_X_LABELS) : 1;

  return (
    <div ref={ref} className="w-full">
      {width > 0 && n > 0 && (
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="block"
        >
          <line
            x1={padLeft}
            x2={width - padRight}
            y1={padTop + plotHeight}
            y2={padTop + plotHeight}
            stroke="#9a7a65"
            strokeOpacity={0.4}
            strokeWidth={1}
          />

          {data.map((point, index) => {
            const centerX = padLeft + slotWidth * index + slotWidth / 2;
            const barX = centerX - barWidth / 2;
            const barY = padTop + plotHeight * (1 - point.value / yMax);
            const barHeight = padTop + plotHeight - barY;
            const highlighted = index === highlightIndex;

            return (
              <g key={point.label}>
                <rect
                  x={barX}
                  y={barY}
                  width={barWidth}
                  height={barHeight}
                  rx={4}
                  fill={highlighted ? "#7b3f20" : "#9e5229"}
                  fillOpacity={highlighted ? 1 : 0.7}
                />
                <text
                  x={centerX}
                  y={barY - 5}
                  textAnchor="middle"
                  fontSize={10}
                  fill="#9a7a65"
                >
                  {formatCompact(point.value)}
                </text>
                {index % labelStep === 0 && (
                  <text
                    x={centerX}
                    y={height - 8}
                    textAnchor="middle"
                    fontSize={10}
                    fill="#9a7a65"
                  >
                    {point.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
};