export const todayString = (): string => {
  const now = new Date();
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
};

export const normalizeDate = (
  value: string | string[] | undefined,
): string => {
  if (typeof value !== "string") return todayString();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return todayString();
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return todayString();
  return value;
};

export const shiftDate = (date: string, offsetDays: number): string => {
  const dateObj = new Date(`${date}T00:00:00`);
  dateObj.setDate(dateObj.getDate() + offsetDays);
  return [
    dateObj.getFullYear(),
    String(dateObj.getMonth() + 1).padStart(2, "0"),
    String(dateObj.getDate()).padStart(2, "0"),
  ].join("-");
};