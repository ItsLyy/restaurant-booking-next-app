"use client";

import { useEffect, useId, useRef, useState } from "react";

import { formatCompact } from "./chart-format";

const GRID_STEPS = 4;

export const AreaChart = ({
  data,
  height = 220,
}: {
  data: { label: string; value: number }[];
  height?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const gradientId = useId().replace(/:/g, "");

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const update = () => setWidth(element.clientWidth);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const padTop = 22;
  const padRight = 8;
  const padBottom = 26;
  const padLeft = 42;

  const plotWidth = Math.max(0, width - padLeft - padRight);
  const plotHeight = height - padTop - padBottom;

  const maxValue = Math.max(...data.map((point) => point.value), 1);
  const yMax = maxValue * 1.15;
  const n = data.length;

  const x = (index: number): number =>
    padLeft +
    (n <= 1 ? plotWidth / 2 : (index * plotWidth) / (n - 1));
  const y = (value: number): number =>
    padTop + plotHeight * (1 - value / yMax);
  const baseY = padTop + plotHeight;

  const points = data.map((point, index) => ({
    ...point,
    x: x(index),
    y: y(point.value),
  }));

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
  const areaPath =
    n === 0
      ? ""
      : `${linePath} L ${points.at(-1)?.x ?? padLeft} ${baseY} L ${points[0].x} ${baseY} Z`;

  const gridLines = Array.from({ length: GRID_STEPS + 1 }, (_, step) => {
    const value = yMax * (1 - step / GRID_STEPS);
    const stepY = padTop + (step / GRID_STEPS) * plotHeight;
    return { value, stepY };
  });

  return (
    <div ref={ref} className="w-full">
      {width > 0 && data.length > 0 && (
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="block"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9e5229" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#9e5229" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {gridLines.map((line) => (
            <g key={line.stepY}>
              <line
                x1={padLeft}
                x2={width - padRight}
                y1={line.stepY}
                y2={line.stepY}
                stroke="#9a7a65"
                strokeOpacity={0.3}
                strokeWidth={1}
              />
              <text
                x={padLeft - 6}
                y={line.stepY + 3}
                textAnchor="end"
                fontSize={10}
                fill="#9a7a65"
              >
                {formatCompact(line.value)}
              </text>
            </g>
          ))}

          {areaPath && <path d={areaPath} fill={`url(#${gradientId})`} />}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke="#7b3f20"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {points.map((point) => (
            <g key={point.label}>
              <circle cx={point.x} cy={point.y} r={3.5} fill="#7b3f20" />
              <text
                x={point.x}
                y={point.y - 9}
                textAnchor="middle"
                fontSize={10}
                fill="#9a7a65"
              >
                {formatCompact(point.value)}
              </text>
              <text
                x={point.x}
                y={height - 8}
                textAnchor="middle"
                fontSize={10}
                fill="#9a7a65"
              >
                {point.label}
              </text>
            </g>
          ))}
        </svg>
      )}
    </div>
  );
};