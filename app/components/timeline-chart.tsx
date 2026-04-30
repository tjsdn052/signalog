"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TimelineEvent } from "../lib/posts";

type TimelineChartProps = {
  events: TimelineEvent[];
};

type TimelineTooltipProps = {
  active?: boolean;
  payload?: Array<{
    payload: TimelineEvent;
  }>;
};

function TimelineTooltip({ active, payload }: TimelineTooltipProps) {
  if (!active || !payload?.[0]) {
    return null;
  }

  const event = payload[0].payload;

  return (
    <div className="border-2 border-line bg-background p-3 text-sm shadow-none">
      <p className="font-mono text-foreground">{event.month}</p>
      <p className="mt-1 text-muted">{event.signalCount} signals</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {event.keywords.map((keyword) => (
          <span key={keyword} className="rounded-md border-2 border-line px-2 py-1 text-xs text-muted">
            {keyword}
          </span>
        ))}
      </div>
    </div>
  );
}

export function TimelineChart({ events }: TimelineChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={events} margin={{ top: 12, right: 8, bottom: 4, left: -24 }}>
        <CartesianGrid stroke="var(--line)" strokeDasharray="0" vertical={false} />
        <XAxis
          dataKey="month"
          axisLine={{ stroke: "var(--line)", strokeWidth: 2 }}
          tick={{ fill: "var(--muted)", fontSize: 12 }}
          tickLine={{ stroke: "var(--line)", strokeWidth: 2 }}
        />
        <YAxis
          axisLine={{ stroke: "var(--line)", strokeWidth: 2 }}
          tick={{ fill: "var(--muted)", fontSize: 12 }}
          tickLine={false}
          width={42}
        />
        <Tooltip content={<TimelineTooltip />} cursor={{ stroke: "var(--foreground)", strokeWidth: 2 }} />
        <Line
          type="monotone"
          dataKey="signalCount"
          stroke="var(--foreground)"
          strokeWidth={3}
          dot={{ r: 5, fill: "var(--background)", stroke: "var(--foreground)", strokeWidth: 3 }}
          activeDot={{ r: 7, fill: "var(--foreground)", stroke: "var(--foreground)", strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
