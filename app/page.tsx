import {
  ArrowUpRight,
  CalendarDays,
  Clock3,
  Languages,
  Rss,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { posts, timelineEvents } from "./lib/posts";

export default function Home() {
  const [featuredPost, ...latestPosts] = posts;

  return (
    <main className="min-h-screen">
      <header className="border-b-2 border-line">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-md bg-foreground text-background">
              <Rss size={18} aria-hidden="true" />
            </span>
            <span>
              <span className="block text-base font-semibold">시그널로그</span>
              <span className="block text-xs text-muted">Signalog</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-muted sm:flex">
            <a className="hover:text-foreground" href="#signals">
              오늘의 시그널
            </a>
            <a className="hover:text-foreground" href="#timeline">
              연대표
            </a>
            <a className="hover:text-foreground" href="#topics">
              토픽
            </a>
          </nav>
        </div>
      </header>

      <section className="border-b-2 border-line">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:py-16">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-md border-2 border-line bg-panel px-3 py-1.5 text-sm text-muted">
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
                className="inline-flex items-center gap-2 rounded-md border-2 border-line bg-panel px-4 py-2.5 text-sm font-medium"
              >
                <CalendarDays size={16} aria-hidden="true" />
                연대표 보기
              </a>
            </div>
          </div>

          <article className="border-2 border-line bg-panel p-5">
            <div className="flex items-center justify-between gap-3 text-sm text-muted">
              <span className="inline-flex items-center gap-2">
                <TrendingUp size={15} aria-hidden="true" />
                Signal {featuredPost.signalScore}
              </span>
              <span>{featuredPost.category}</span>
            </div>
            <h2 className="mt-6 text-2xl font-semibold leading-snug">
              <Link href={`/posts/${featuredPost.slug}`} className="hover:underline">
                {featuredPost.title}
              </Link>
            </h2>
            <p className="mt-4 leading-7 text-muted">{featuredPost.excerpt}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {featuredPost.tags.map((tag) => (
                <span key={tag} className="rounded-md border-2 border-line px-2.5 py-1 text-xs text-muted">
                  {tag}
                </span>
              ))}
            </div>
            <Link
              href={`/posts/${featuredPost.slug}`}
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-accent"
            >
              번역 요약 읽기
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </article>
        </div>
      </section>

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
            <article key={post.slug} className="border-2 border-line bg-panel p-5">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
                <span>{post.category}</span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 size={14} aria-hidden="true" />
                  {post.readingMinutes}분
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Languages size={14} aria-hidden="true" />
                  번역됨
                </span>
              </div>
              <h3 className="mt-4 text-xl font-semibold leading-snug">
                <Link href={`/posts/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              </h3>
              <p className="mt-3 line-clamp-3 leading-7 text-muted">{post.excerpt}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="timeline" className="border-t-2 border-line">
        <div className="mx-auto max-w-6xl px-5 py-12">
          <p className="text-sm font-medium text-accent">Timeline</p>
          <h2 className="mt-2 text-2xl font-semibold">기술 흐름 연대표</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-4">
            {timelineEvents.map((event) => (
              <div key={event.year} className="border-l-2 border-line pl-4">
                <span className="font-mono text-sm text-accent">{event.year}</span>
                <h3 className="mt-2 font-semibold">{event.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{event.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
