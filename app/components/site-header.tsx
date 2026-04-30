import { Rss, Search } from "lucide-react";
import Link from "next/link";
import type { SignalPost } from "../lib/posts";
import { TagSidebarSheet } from "./tag-sidebar-sheet";

type SiteHeaderProps = {
  posts: SignalPost[];
};

export function SiteHeader({ posts }: SiteHeaderProps) {
  return (
    <header className="border-b-2 border-line">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <div className="flex items-center gap-3">
          <TagSidebarSheet posts={posts} />
          <Link href="/" className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-md bg-foreground text-background">
              <Rss size={18} aria-hidden="true" />
            </span>
            <span>
              <span className="block text-base font-semibold">SIG</span>
              <span className="block text-xs text-muted">Signalog</span>
            </span>
          </Link>
        </div>
        <label className="hidden h-10 w-72 items-center gap-3 border-2 border-line bg-panel px-3 text-sm text-muted sm:flex">
          <Search size={16} aria-hidden="true" />
          <span className="sr-only">게시글 검색</span>
          <input
            type="search"
            placeholder=""
            className="min-w-0 flex-1 bg-transparent text-foreground placeholder:text-muted outline-none"
          />
        </label>
      </div>
    </header>
  );
}
