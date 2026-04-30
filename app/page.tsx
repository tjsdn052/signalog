import { LatestPostCarousel } from "./components/latest-post-carousel";
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

      <LatestPostCarousel posts={latestPosts} />

      <TimelinePreview events={timelineEvents} />
    </main>
  );
}
