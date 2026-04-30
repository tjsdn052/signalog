import type { SignalPost } from "../lib/posts";

type TagSidebarProps = {
  posts: SignalPost[];
};

type TagSummary = {
  name: string;
  count: number;
};

function getTagSummaries(posts: SignalPost[]): TagSummary[] {
  const tagCounts = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }
  }

  return [...tagCounts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function TagSidebar({ posts }: TagSidebarProps) {
  const tags = getTagSummaries(posts);

  return (
    <aside className="border-2 border-line bg-panel p-5 lg:sticky lg:top-6 lg:self-start">
      <div>
        <p className="text-sm font-medium text-accent">Topics</p>
        <h2 className="mt-2 text-2xl font-semibold">태그</h2>
      </div>

      <div className="mt-5 flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
        <a
          href="#signals"
          className="inline-flex shrink-0 items-center justify-between gap-4 rounded-md border-2 border-line bg-foreground px-3 py-2 text-sm font-medium text-background lg:w-full"
        >
          전체
          <span className="font-mono text-xs">{posts.length}</span>
        </a>
        {tags.map((tag) => (
          <a
            key={tag.name}
            href="#signals"
            className="inline-flex shrink-0 items-center justify-between gap-4 rounded-md border-2 border-line px-3 py-2 text-sm text-muted hover:text-foreground lg:w-full"
          >
            {tag.name}
            <span className="font-mono text-xs">{tag.count}</span>
          </a>
        ))}
      </div>
    </aside>
  );
}
