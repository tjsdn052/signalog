import { LatestPostCarousel } from "./components/latest-post-carousel";
import { SiteHeader } from "./components/site-header";
import { TagSidebar } from "./components/tag-sidebar";
import { TimelinePreview } from "./components/timeline-preview";
import { TrendingPostCarousel } from "./components/trending-post-carousel";
import { posts, timelineEvents } from "./lib/posts";

export default function Home() {
  const [, ...latestPosts] = posts;

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <TrendingPostCarousel posts={posts} />

      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-12 lg:grid-cols-[220px_minmax(0,1fr)]">
        <TagSidebar posts={posts} />
        <LatestPostCarousel posts={latestPosts} />
      </div>

      <TimelinePreview events={timelineEvents} />
    </main>
  );
}
