export function formatTime(time: string): string {
  const [hours, minutes] = time.split(":");
  if (hours === undefined || minutes === undefined) return time;

  const numericHours = Number(hours);
  const numericMinutes = Number(minutes);
  if (Number.isNaN(numericHours) || Number.isNaN(numericMinutes)) return time;

  const period = numericHours >= 12 ? "PM" : "AM";
  const hour12 = numericHours % 12 || 12;

  return `${String(hour12).padStart(2, "0")}:${String(numericMinutes).padStart(2, "0")} ${period}`;
}
