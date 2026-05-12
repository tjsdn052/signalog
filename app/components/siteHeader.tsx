import { Rss, Search, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { getAdminAccess } from "@/server/auth/admin";
import { LogoutButton } from "../admin/components/logoutButton";
import type { SignalPost } from "../lib/posts";
import { TagSidebarSheet } from "./tagSidebarSheet";

type SiteHeaderProps = {
  posts: SignalPost[];
};

export async function SiteHeader({ posts }: SiteHeaderProps) {
  const adminAccess = await getAdminAccess();
  const isAdmin = adminAccess.status === "allowed";

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
        <div className="flex items-center gap-2">
          {isAdmin ? (
            <>
            <Link
              href="/admin/posts"
              className="inline-flex h-10 items-center gap-2 border-2 border-line bg-panel px-3 text-sm font-medium text-foreground hover:bg-foreground hover:text-background md:hidden"
            >
              <ShieldCheck size={15} aria-hidden="true" />
              관리자
            </Link>
            <div className="hidden items-center gap-2 md:flex">
              <Link
                href="/admin/posts"
                className="inline-flex h-10 items-center gap-2 border-2 border-line bg-panel px-3 text-sm font-medium text-foreground hover:bg-foreground hover:text-background"
              >
                <ShieldCheck size={15} aria-hidden="true" />
                관리자
              </Link>
              <span className="max-w-40 truncate text-xs text-muted">{adminAccess.user.email}</span>
              <LogoutButton />
            </div>
            </>
          ) : null}
          <form action="/search" className="hidden h-10 w-72 items-center gap-3 border-2 border-line bg-panel px-3 text-sm text-muted sm:flex">
            <Search size={16} aria-hidden="true" />
            <label htmlFor="site-search-query" className="sr-only">
              게시글 검색
            </label>
            <input
              id="site-search-query"
              name="q"
              type="search"
              placeholder="게시글 검색"
              className="min-w-0 flex-1 bg-transparent text-foreground placeholder:text-muted outline-none"
            />
          </form>
        </div>
      </div>
    </header>
  );
}
