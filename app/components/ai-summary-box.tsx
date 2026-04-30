import { Bot } from "lucide-react";

type AiSummaryBoxProps = {
  summary: string;
};

export function AiSummaryBox({ summary }: AiSummaryBoxProps) {
  return (
    <section className="mt-8 border border-line bg-panel p-5">
      <div className="flex items-center gap-2 text-sm font-medium text-accent">
        <Bot size={16} aria-hidden="true" />
        AI 요약
      </div>
      <p className="mt-3 leading-7 text-muted">{summary}</p>
    </section>
  );
}
