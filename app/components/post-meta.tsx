import { CalendarDays, Clock3, Languages, TrendingUp } from "lucide-react";
import type { SignalPost } from "../lib/posts";

type PostMetaProps = {
  post: SignalPost;
  showDate?: boolean;
  showSignal?: boolean;
};

export function PostMeta({ post, showDate = false, showSignal = false }: PostMetaProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
      {showSignal ? (
        <span className="inline-flex items-center gap-1.5 rounded-md border border-line bg-panel px-2.5 py-1">
          <TrendingUp size={14} aria-hidden="true" />
          Signal {post.signalScore}
        </span>
      ) : (
        <span>{post.category}</span>
      )}
      {showDate ? (
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays size={14} aria-hidden="true" />
          {post.publishedAt}
        </span>
      ) : null}
      <span className="inline-flex items-center gap-1.5">
        <Clock3 size={14} aria-hidden="true" />
        {post.readingMinutes}분{showDate ? " 읽기" : ""}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Languages size={14} aria-hidden="true" />
        {showDate ? "한국어 번역" : "번역됨"}
      </span>
    </div>
  );
}
