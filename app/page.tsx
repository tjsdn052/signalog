import { Search } from "lucide-react";
import { PostCard } from "./components/post-card";
import { SiteHeader } from "./components/site-header";
import { TimelinePreview } from "./components/timeline-preview";
import { TrendingPostCarousel } from "./components/trending-post-carousel";
import { posts, timelineEvents } from "./lib/posts";

export default function Home() {
  const [, ...latestPosts] = posts;

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <TrendingPostCarousel posts={posts} />

      <section id="signals" className="mx-auto max-w-6xl px-5 py-12">
        <div className="mb-6 flex items-end justify-between gap-6">
          <div>
            <p className="text-sm font-medium text-accent">Latest Signals</p>
            <h2 className="mt-2 text-2xl font-semibold">최근 수집된 글</h2>
          </div>
          <div className="hidden items-center gap-2 border-2 border-line bg-panel px-3 py-2 text-sm text-muted sm:flex">
            <Search size={15} aria-hidden="true" />
            검색은 곧 추가됩니다
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {latestPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <TimelinePreview events={timelineEvents} />
    </main>
  );
}
