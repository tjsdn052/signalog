import { Rss } from "lucide-react";
import Link from "next/link";
import type { SignalPost } from "../lib/posts";

type SiteFooterProps = {
  posts: SignalPost[];
};

export function SiteFooter({ posts }: SiteFooterProps) {
  return (
    <footer className="border-t-2 border-line">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-8 sm:grid-cols-[1.2fr_1fr] sm:items-end">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-md bg-foreground text-background">
              <Rss size={18} aria-hidden="true" />
            </span>
            <span>
              <span className="block text-base font-semibold">SIG</span>
              <span className="block text-xs text-muted">Signalog</span>
            </span>
          </Link>
          <p className="mt-4 max-w-xl leading-7 text-muted">
            AI가 수집하고 번역한 기술 신호를 기록하는 블로그입니다.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:items-end">
          <nav aria-label="푸터 링크" className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted">
            <Link href="/posts" className="hover:text-foreground">
              전체 글
            </Link>
            <Link href="/#signals" className="hover:text-foreground">
              최신 글
            </Link>
            <Link href="/#timeline" className="hover:text-foreground">
              연대표
            </Link>
          </nav>
          <p className="text-sm text-muted">
            {posts.length} signals collected
          </p>
        </div>
      </div>
    </footer>
  );
}
