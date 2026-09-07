import { Card } from "./card";

export const BookingInformation = ({
  totalToday,
  totalPending,
  totalConfirmed,
  totalGuest,
}: {
  totalToday: number;
  totalPending: number;
  totalConfirmed: number;
  totalGuest: number;
}) => {
  const stats = [
    { label: "Total Today", value: totalToday },
    { label: "Pending", value: totalPending },
    { label: "Confirmed", value: totalConfirmed },
    { label: "Total Guest", value: totalGuest },
  ];

  return (
    <div className="grid grid-cols-4 *:h-fit *:bg-base-100 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="px-6! flex flex-col gap-1">
          <span className="text-d-card">{stat.label}</span>
          <span className="text-d-stat">{stat.value}</span>
        </Card>
      ))}
    </div>
  );
};