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

export function formatDate(date: string): string {
  return dateFormatter.format(new Date(date));
}

export function formatDayDate(date: string): string {
  return dateDayFormatter.format(new Date(date));
}
