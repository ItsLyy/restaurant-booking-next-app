import { Card } from "../../_components/card";
import { CountUpValue } from "./count-up-value";

import type { KpiData } from "../_data/analytics";

const DeltaBadge = ({
  value,
  caption,
}: {
  value: number | null;
  caption: string | null;
}) => {
  if (value === null || caption === null) {
    return <span className="text-d-caption text-muted">Not enough data</span>;
  }
  const up = value >= 0;
  return (
    <span
      className={`text-xs font-semibold ${up ? "text-positive" : "text-negative"}`}
    >
      {up ? "\u00b7 \u25b2 " : "\u00b7 \u25bc "}
      {Math.abs(value)}%{" "}
      <span className="text-muted font-normal">vs {caption}</span>
    </span>
  );
};

export const KpiCards = ({
  kpis,
  period,
}: {
  kpis: KpiData;
  period: string;
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
      <Card className="flex flex-col gap-1 py-3">
        <span className="text-d-caption text-muted">Total revenue</span>
        <CountUpValue
          value={kpis.revenue}
          className="text-d-stat text-foreground"
        />
        <DeltaBadge value={kpis.revenueDelta} caption={kpis.deltaCaption} />
      </Card>
      <Card className="flex flex-col gap-1 py-3">
        <span className="text-d-caption text-muted">Total bookings</span>
        <span className="text-d-stat text-foreground">{kpis.bookings}</span>
        <DeltaBadge value={kpis.bookingsDelta} caption={kpis.deltaCaption} />
      </Card>
      <Card className="flex flex-col gap-1 py-3">
        <span className="text-d-caption text-muted">Total guests</span>
        <span className="text-d-stat text-foreground">{kpis.guests}</span>
        <span className="text-d-caption">{period}</span>
      </Card>
      <Card className="flex flex-col gap-1 py-3">
        <span className="text-d-caption text-muted">Completion rate</span>
        <span className="text-d-stat text-foreground">
          {kpis.completionRate}%
        </span>
        <span className="text-d-caption">of realized bookings</span>
      </Card>
      <Card className="flex flex-col gap-1 py-3">
        <span className="text-d-caption text-muted">Avg party size</span>
        <span className="text-d-stat text-foreground">{kpis.avgParty}</span>
        <span className="text-d-caption">guests per booking</span>
      </Card>
      <Card className="flex flex-col gap-1 py-3">
        <span className="text-d-caption text-muted">Avg deposit</span>
        <CountUpValue
          value={kpis.avgTicket}
          className="text-d-stat text-foreground"
        />
        <span className="text-d-caption">per paid booking</span>
      </Card>
    </div>
  );
};