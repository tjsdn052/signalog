import type { TimelineEvent } from "../lib/posts";

type TimelineChartProps = {
  events: TimelineEvent[];
};

export function TimelineChart({ events }: TimelineChartProps) {
  return (
    <div className="min-h-80 overflow-x-auto pb-4">
      <div className="relative flex min-h-76 min-w-180 items-start justify-between gap-6 px-2 pt-48">
        <div className="absolute top-50 right-2 left-2 h-0.5 bg-foreground" aria-hidden="true" />

        {events.map((event) => (
          <div key={event.month} className="group relative flex min-w-20 flex-1 flex-col items-center">
            <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-5 hidden w-52 -translate-x-1/2 border-2 border-line bg-background p-3 text-left shadow-none group-hover:block group-focus-within:block">
              <p className="font-mono text-sm text-foreground">{event.month}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {event.keywords.map((keyword) => (
                  <span key={keyword} className="rounded-md border-2 border-line px-2 py-1 text-xs text-muted">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            <button
              type="button"
              aria-label={`${event.month} 키워드: ${event.keywords.join(", ")}`}
              className="relative z-1 flex size-5 items-center justify-center rounded-full border-2 border-foreground bg-background outline-none transition-colors hover:bg-foreground focus:bg-foreground"
            >
              <span className="size-1.5 rounded-full bg-foreground group-hover:bg-background group-focus-within:bg-background" />
            </button>
            <span className="mt-3 font-mono text-xs text-muted">{event.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
