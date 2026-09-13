import type { PaymentPoint } from "../_data/analytics";

export const PaymentBreakdown = ({
  data,
}: {
  data: PaymentPoint[];
}) => {
  if (data.length === 0) {
    return <p className="text-d-body">No payment data available.</p>;
  }

  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex h-3 w-full overflow-hidden rounded-full">
        {data.map((item) => (
          <div
            key={item.key}
            style={{
              width: `${total === 0 ? 0 : (item.count / total) * 100}%`,
              backgroundColor: item.color,
            }}
            title={`${item.label} · ${item.count}`}
          />
        ))}
      </div>
      <ul className="flex flex-col gap-1.5">
        {data.map((item) => {
          const percent = total === 0 ? 0 : Math.round((item.count / total) * 100);
          return (
            <li key={item.key} className="flex items-center gap-2 text-sm">
              <span
                className="size-2.5 rounded-sm shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-foreground">{item.label}</span>
              <span className="text-d-caption ml-auto">
                {item.count} · {percent}%
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};