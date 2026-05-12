import Link from "next/link";
import type { SignalPost } from "../lib/posts";
import { POST_CATEGORIES } from "@/server/posts/categories";

type CategorySidebarProps = {
  posts: SignalPost[];
  variant?: "panel" | "sheet";
};

type CategorySummary = {
  name: string;
  count: number;
};

function getCategorySummaries(posts: SignalPost[]): CategorySummary[] {
  const categoryCounts = new Map<string, number>();

  for (const post of posts) {
    categoryCounts.set(post.category, (categoryCounts.get(post.category) ?? 0) + 1);
  }

  return POST_CATEGORIES.map((category) => ({
    name: category,
    count: categoryCounts.get(category) ?? 0,
  }));
}

function getCategoryHref(category: string) {
  const params = new URLSearchParams({ category });

  return `/posts?${params.toString()}`;
}

export function CategorySidebar({ posts, variant = "panel" }: CategorySidebarProps) {
  const categories = getCategorySummaries(posts);
  const isSheet = variant === "sheet";
  const categoryListClassName = isSheet
    ? "mt-5 flex flex-col gap-2"
    : "mt-5 flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0";
  const categoryLinkClassName = isSheet
    ? "inline-flex w-full items-center justify-between gap-4 rounded-md border-2 border-line px-3 py-2 text-sm"
    : "inline-flex shrink-0 items-center justify-between gap-4 rounded-md border-2 border-line px-3 py-2 text-sm lg:w-full";

  return (
    <aside className={isSheet ? "" : "border-2 border-line bg-panel p-5 lg:sticky lg:top-6 lg:self-start"}>
      <div>
        <p className="text-sm font-medium text-accent">Categories</p>
        <h2 className="mt-2 text-2xl font-semibold">카테고리</h2>
      </div>

      <div className={categoryListClassName}>
        <Link
          href="/posts"
          className={`${categoryLinkClassName} bg-foreground font-medium text-background`}
        >
          전체
          <span className="font-mono text-xs">{posts.length}</span>
        </Link>
        {categories.map((category) => (
          <Link
            key={category.name}
            href={getCategoryHref(category.name)}
            className={`${categoryLinkClassName} text-muted hover:text-foreground`}
          >
            {category.name}
            <span className="font-mono text-xs">{category.count}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
}
