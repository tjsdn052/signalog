"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
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
  const flatEvents = events.map((event) => ({
    ...event,
    position: 1,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
      <LineChart data={flatEvents} margin={{ top: 24, right: 20, bottom: 8, left: 20 }}>
        <XAxis
          dataKey="month"
          axisLine={{ stroke: "var(--line)", strokeWidth: 2 }}
          tick={{ fill: "var(--muted)", fontSize: 12 }}
          tickLine={{ stroke: "var(--line)", strokeWidth: 2 }}
          interval={0}
          padding={{ left: 20, right: 20 }}
        />
        <Tooltip content={<TimelineTooltip />} cursor={false} />
        <Line
          type="linear"
          dataKey="position"
          stroke="var(--foreground)"
          strokeWidth={2}
          isAnimationActive={false}
          dot={{ r: 5, fill: "var(--background)", stroke: "var(--foreground)", strokeWidth: 2 }}
          activeDot={{ r: 7, fill: "var(--foreground)", stroke: "var(--foreground)", strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
