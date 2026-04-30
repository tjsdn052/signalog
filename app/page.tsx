import { LatestPostCarousel } from "./components/latest-post-carousel";
import { SiteHeader } from "./components/site-header";
import { TimelinePreview } from "./components/timeline-preview";
import { TrendingPostCarousel } from "./components/trending-post-carousel";
import { posts, timelineEvents } from "./lib/posts";

export default function Home() {
  const [, ...latestPosts] = posts;

  return (
    <main className="min-h-screen">
      <SiteHeader posts={posts} />
      <TrendingPostCarousel posts={posts} />

      <div className="mx-auto max-w-6xl px-5 py-12">
        <LatestPostCarousel posts={latestPosts} />
      </div>

      <TimelinePreview events={timelineEvents} />
    </main>
  );
}
