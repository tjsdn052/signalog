import { Search } from "lucide-react";
import Link from "next/link";
import { PostCard } from "../components/post-card";
import { posts } from "../lib/posts";
import { isSupabasePublicConfigured } from "@/lib/supabase/config";
import { searchPublishedPosts } from "@/server/repositories/posts";

const SEARCH_RESULT_LIMIT = 10;

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

function normalizeQuery(query?: string) {
  return query?.trim().replace(/\s+/g, " ").slice(0, 80) ?? "";
}

function searchLocalPosts(query: string) {
  const normalizedQuery = query.toLowerCase();

  if (!normalizedQuery) {
    return [];
  }

  return posts.filter((post) =>
    [post.title, post.excerpt, post.summary, post.category, post.tags.join(" "), post.body.join(" ")]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery),
  );
}

export const metadata = {
  title: "검색 | 시그널로그",
  description: "시그널로그 게시글 검색 결과",
};

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = normalizeQuery(q);
  const searchResult = isSupabasePublicConfigured()
    ? await searchPublishedPosts({ query, limit: SEARCH_RESULT_LIMIT })
    : {
        posts: searchLocalPosts(query),
        total: searchLocalPosts(query).length,
      };

  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="mb-8 border-b-2 border-line pb-8">
          <p className="text-sm font-medium text-accent">Search</p>
          <h1 className="mt-2 text-4xl font-semibold leading-tight sm:text-5xl">검색 결과</h1>
          <form action="/search" className="mt-6 flex max-w-2xl items-center gap-3 border-2 border-line bg-panel px-3">
            <Search size={18} aria-hidden="true" className="text-muted" />
            <label htmlFor="search-page-query" className="sr-only">
              게시글 검색
            </label>
            <input
              id="search-page-query"
              name="q"
              type="search"
              defaultValue={query}
              placeholder="검색어를 입력하세요"
              className="h-12 min-w-0 flex-1 bg-transparent text-foreground placeholder:text-muted outline-none"
            />
            <button
              type="submit"
              className="inline-flex h-9 items-center justify-center border-2 border-line px-3 text-sm font-medium hover:bg-foreground hover:text-background"
            >
              검색
            </button>
          </form>
          {query ? (
            <p className="mt-4 text-sm text-muted">
              `{query}` 검색 결과 {searchResult.total}개
            </p>
          ) : (
            <p className="mt-4 text-sm text-muted">검색어를 입력하면 게시글 제목, 요약, 본문에서 찾아줍니다.</p>
          )}
        </div>

        {query && searchResult.posts.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {searchResult.posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : null}

        {query && searchResult.posts.length === 0 ? (
          <div className="border-2 border-line bg-panel p-5 text-muted">
            검색 결과가 없습니다.
          </div>
        ) : null}

        <div className="mt-8 border-t-2 border-line pt-6">
          <Link href="/posts" className="text-sm font-medium text-muted hover:text-foreground">
            전체 게시글 보기
          </Link>
        </div>
      </section>
    </main>
  );
}
