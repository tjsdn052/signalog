"use client";

import dynamic from "next/dynamic";
import type { TimelineEvent } from "../lib/posts";

type TimelinePreviewProps = {
  events: TimelineEvent[];
};

const TimelineChart = dynamic(() => import("./timeline-chart").then((mod) => mod.TimelineChart), {
  ssr: false,
});

export function TimelinePreview({ events }: TimelinePreviewProps) {
  return (
    <section id="timeline" className="border-t-2 border-line">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="mb-6">
          <p className="text-sm font-medium text-accent">Timeline</p>
          <h2 className="mt-2 text-2xl font-semibold">기술 흐름 타임라인</h2>
        </div>

        <div className="h-[150px] min-w-0">
          <TimelineChart events={events} />
        </div>
      </div>
    </section>
  );
}
