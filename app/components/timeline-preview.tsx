import type { TimelineEvent } from "../lib/posts";

type TimelinePreviewProps = {
  events: TimelineEvent[];
};

export function TimelinePreview({ events }: TimelinePreviewProps) {
  return (
    <section id="timeline" className="border-t-2 border-line">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <p className="text-sm font-medium text-accent">Timeline</p>
        <h2 className="mt-2 text-2xl font-semibold">기술 흐름 연대표</h2>
        <div className="mt-6 grid gap-3 md:grid-cols-4">
          {events.map((event) => (
            <div key={event.year} className="border-l-2 border-line pl-4">
              <span className="font-mono text-sm text-accent">{event.year}</span>
              <h3 className="mt-2 font-semibold">{event.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{event.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
