import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { SignalPost } from "../lib/posts";

type PostDetailHeaderProps = {
  post: SignalPost;
};

export function PostDetailHeader({ post }: PostDetailHeaderProps) {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-5">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground">
          <ArrowLeft size={16} aria-hidden="true" />
          시그널 목록
        </Link>
        <a
          href={post.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground"
        >
          원문
          <ExternalLink size={15} aria-hidden="true" />
        </a>
      </div>
    </header>
  );
}
