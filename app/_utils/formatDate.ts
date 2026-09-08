const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

const dateDayFormatter = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "2-digit",
  month: "long",
  year: "numeric",
});

const dateShortFormatter = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
});

export function formatDate(date: string): string {
  return dateFormatter.format(new Date(date));
}

export function formatDayDate(date: string): string {
  return dateDayFormatter.format(new Date(date));
}

export function formatShortDate(date: string): string {
  return dateShortFormatter.format(new Date(date));
}
