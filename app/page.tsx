import { LatestPostCarousel } from "./components/latest-post-carousel";
import { TimelinePreview } from "./components/timeline-preview";
import { TrendingPostCarousel } from "./components/trending-post-carousel";
import { isSupabaseAdminConfigured } from "@/lib/supabase/admin";
import { listFeaturedPublishedPosts, listPublishedPosts } from "@/server/repositories/posts";
import { posts, timelineEvents } from "./lib/posts";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [featuredPosts, latestPostList] = isSupabaseAdminConfigured()
    ? await Promise.all([listFeaturedPublishedPosts(5), listPublishedPosts({ limit: 5 })])
    : [posts, { posts: posts.slice(1), total: posts.length - 1 }];

  return (
    <main className="min-h-screen">
      <TrendingPostCarousel posts={featuredPosts} />

      <div className="mx-auto max-w-6xl px-5 py-12">
        <LatestPostCarousel posts={latestPostList.posts} />
      </div>

      <TimelinePreview events={timelineEvents} />
    </main>
  );
}
