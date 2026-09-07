"use client";

import { useState } from "react";

import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react/dist/ssr";

import { Badge } from "./badge";

interface CalendarProps {
  selectedDate: string | null;
  onSelect: (date: string | null) => void;
  getAvailableTimes: (date: string) => string[];
}

interface CalendarDay {
  date: string | null;
  day: number;
  key: string;
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const pad = (value: number) => value.toString().padStart(2, "0");

const toDateString = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const getCalendarGrid = (year: number, month: number): CalendarDay[] => {
  const firstOfMonth = new Date(year, month, 1);
  const startIndex = (firstOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: CalendarDay[] = [];
  for (let index = 0; index < startIndex; index++) {
    cells.push({ date: null, day: 0, key: `empty-${index}` });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    cells.push({ date: toDateString(date), day, key: `day-${day}` });
  }
  return cells;
};

export const Calendar = ({
  selectedDate,
  onSelect,
  getAvailableTimes,
}: CalendarProps) => {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const cells = getCalendarGrid(viewYear, viewMonth);
  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  const canGoNext =
    viewYear < today.getFullYear() + 1 ||
    (viewYear === today.getFullYear() + 1 && viewMonth < 11);

  const moveMonth = (direction: number) => {
    const next = new Date(viewYear, viewMonth + direction, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
    onSelect(null);
  };

  const isPast = (cell: CalendarDay) => {
    if (!cell.date) return true;
    const date = new Date(`${cell.date}T00:00:00`);
    return date.getTime() < startOfToday.getTime();
  };

  return (
    <div className="px-6 py-4 flex flex-col gap-4 border-b border-muted h-90">
      <div className="w-full flex justify-between items-center">
        <button
          type="button"
          aria-label="Previous month"
          className="group"
          onClick={() => moveMonth(-1)}
        >
          <CaretLeftIcon className="size-6 text-foreground" />
        </button>
        <span className="text-foreground text-c-normal">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button
          type="button"
          aria-label="Next month"
          className={`group ${canGoNext ? "" : "opacity-40 cursor-not-allowed"}`}
          disabled={!canGoNext}
          onClick={() => moveMonth(1)}
        >
          <CaretRightIcon className="size-6 text-foreground" />
        </button>
      </div>
      <div className="flex flex-col gap-2 h-full">
        <div className="grid grid-cols-7 gap-1.5 *:text-center *:w-full *:text-foreground text-c-caption">
          {DAYS.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
        <div className="w-full grid grid-cols-7 gap-1.5 h-full">
          {cells.map((cell) => {
            if (!cell.date) {
              return <Badge key={cell.key} hidden />;
            }
            const disabled =
              isPast(cell) || getAvailableTimes(cell.date).length === 0;
            const active = selectedDate === cell.date;
            return (
              <Badge
                key={cell.key}
                onClick={() => onSelect(cell.date ?? null)}
                disabled={disabled}
                active={active}
              >
                {cell.day}
              </Badge>
            );
          })}
        </div>
      </div>
    </div>
  );
};
