import { Card } from "../_components/card";
import { KpiCards } from "./_components/kpi-cards";
import { PaymentBreakdown } from "./_components/payment-breakdown";
import { TopTables } from "./_components/top-tables";
import { AreaChart } from "./_components/charts/area-chart";
import { BarChart } from "./_components/charts/bar-chart";
import { DonutChart } from "./_components/charts/donut-chart";
import { getAnalyticsData } from "./_data/analytics";
import { formatDate } from "@utils";
import { requireOwner } from "@libs/session";

export default async function AnalyticsPage() {
  await requireOwner();
  const data = getAnalyticsData();

  const revenueSeries = data.monthly.map((month) => ({
    label: month.label,
    value: month.revenue,
  }));
  const daySeries = data.byDayOfWeek.map((day) => ({
    label: day.day,
    value: day.bookings,
  }));
  const hourSeries = data.byHour.map((hour) => ({
    label: hour.label,
    value: hour.bookings,
  }));
  const statusBreakdown = data.statusBreakdown.map((point) => ({
    label: point.label,
    value: point.count,
    color: point.color,
  }));

  const period = `${formatDate(data.period.from)} \u2013 ${formatDate(data.period.to)}`;

  return (
    <section className="px-4 pb-6 pt-3  flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-d-header-lg">Reservation performance</h2>
        <p className="text-d-caption">
          {data.restaurantName} · {period} · {data.monthsCount} month
          {data.monthsCount === 1 ? "" : "s"} of data
        </p>
      </div>

      <KpiCards kpis={data.kpis} period={period} />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-baseline justify-between">
            <h3 className="text-d-header-md">Revenue trend</h3>
            <span className="text-d-caption">paid deposits by month</span>
          </div>
          <AreaChart data={revenueSeries} />
        </Card>
        <Card className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between">
            <h3 className="text-d-header-md">Booking status</h3>
            <span className="text-d-caption">hover to inspect</span>
          </div>
          <DonutChart data={statusBreakdown} />
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card className="flex flex-col gap-4">
          <h3 className="text-d-header-md">Bookings by day</h3>
          <BarChart data={daySeries} highlightIndex={data.peakDayIndex} />
        </Card>
        <Card className="flex flex-col gap-4">
          <h3 className="text-d-header-md">Peak reservation hours</h3>
          <BarChart data={hourSeries} highlightIndex={data.peakHourIndex} />
        </Card>
        <Card className="flex flex-col gap-4">
          <h3 className="text-d-header-md">Payment status</h3>
          <PaymentBreakdown data={data.paymentBreakdown} />
        </Card>
      </div>

      <Card className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between">
          <h3 className="text-d-header-md">Top tables by revenue</h3>
          <span className="text-d-caption">table utilisation overview</span>
        </div>
        <TopTables data={data.topTables} />
      </Card>
    </section>
  );
}
