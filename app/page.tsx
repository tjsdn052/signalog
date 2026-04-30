import {
  CalendarDays,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { FeaturedPostCard } from "./components/featured-post-card";
import { PostCard } from "./components/post-card";
import { SiteHeader } from "./components/site-header";
import { TimelinePreview } from "./components/timeline-preview";
import { posts, timelineEvents } from "./lib/posts";

export default function Home() {
  const [featuredPost, ...latestPosts] = posts;

  return (
    <main className="min-h-screen">
      <SiteHeader />

      <section className="border-b border-line">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:py-16">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-line bg-panel px-3 py-1.5 text-sm text-muted">
              <Sparkles size={15} aria-hidden="true" />
              AI가 수집하고 번역한 기술 트렌드
            </div>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-normal sm:text-6xl">
              오늘의 기술 신호가 내일의 연대기가 됩니다.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
              시그널로그는 핫한 개발/AI 게시글을 모으고 번역하며, 시간이 지나도 다시 읽을 수 있는 기술 흐름으로 정리합니다.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#signals"
                className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2.5 text-sm font-medium text-background"
              >
                <TrendingUp size={16} aria-hidden="true" />
                시그널 보기
              </a>
              <a
                href="#timeline"
                className="inline-flex items-center gap-2 rounded-md border border-line bg-panel px-4 py-2.5 text-sm font-medium"
              >
                <CalendarDays size={16} aria-hidden="true" />
                연대표 보기
              </a>
            </div>
          </div>

          <FeaturedPostCard post={featuredPost} />
        </div>
      </section>

      <section id="signals" className="mx-auto max-w-6xl px-5 py-12">
        <div className="mb-6 flex items-end justify-between gap-6">
          <div>
            <p className="text-sm font-medium text-accent">Latest Signals</p>
            <h2 className="mt-2 text-2xl font-semibold">최근 수집된 글</h2>
          </div>
          <div className="hidden items-center gap-2 border border-line bg-panel px-3 py-2 text-sm text-muted sm:flex">
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
