"use client";

import { useSyncExternalStore } from "react";

import { formatDayDate } from "@utils/formatDate";

const PLACEHOLDER = "\u00A0";

const subscribe = () => () => {};

const getToday = () => formatDayDate(new Date().toDateString());

export const TodayBookingDate = () => {
  const date = useSyncExternalStore(subscribe, getToday, () => PLACEHOLDER);

  return <span className="text-d-caption">{date}</span>;
};