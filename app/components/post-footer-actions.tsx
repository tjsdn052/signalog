import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { SignalPost } from "../lib/posts";

type PostFooterActionsProps = {
  post: SignalPost;
};

export function PostFooterActions({ post }: PostFooterActionsProps) {
  return (
    <footer className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium">
        <ArrowLeft size={16} aria-hidden="true" />
        홈으로
      </Link>
      <a
        href={post.sourceUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2.5 text-sm font-medium text-background"
      >
        원문 열기
        <ArrowUpRight size={16} aria-hidden="true" />
      </a>
    </footer>
  );
}
