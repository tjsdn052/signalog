import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { PostCard } from "../components/post-card";
import { isSupabaseAdminConfigured } from "@/lib/supabase/admin";
import { listPublishedPosts } from "@/server/repositories/posts";
import { posts } from "../lib/posts";

const POSTS_PER_PAGE = 10;

type PostsPageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

function getCurrentPage(page?: string) {
  const parsedPage = Number(page);

  if (!Number.isInteger(parsedPage) || parsedPage < 1) {
    return 1;
  }

  return parsedPage;
}

export const metadata = {
  title: "전체 게시글 | 시그널로그",
  description: "AI가 수집하고 번역한 기술 시그널 전체 목록",
};

export const dynamic = "force-dynamic";

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const { page } = await searchParams;
  const requestedPage = getCurrentPage(page);
  const publishedPostList = isSupabaseAdminConfigured()
    ? await listPublishedPosts({
        limit: POSTS_PER_PAGE,
        offset: (requestedPage - 1) * POSTS_PER_PAGE,
      })
    : {
        posts: posts.slice((requestedPage - 1) * POSTS_PER_PAGE, requestedPage * POSTS_PER_PAGE),
        total: posts.length,
      };
  const totalPages = Math.max(1, Math.ceil(publishedPostList.total / POSTS_PER_PAGE));
  const currentPage = Math.min(requestedPage, totalPages);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts =
    currentPage === requestedPage
      ? publishedPostList.posts
      : isSupabaseAdminConfigured()
        ? (await listPublishedPosts({ limit: POSTS_PER_PAGE, offset: startIndex })).posts
        : posts.slice(startIndex, startIndex + POSTS_PER_PAGE);
  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="mb-8 flex flex-col gap-4 border-b-2 border-line pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-accent">All Signals</p>
            <h1 className="mt-2 text-4xl font-semibold leading-tight sm:text-5xl">전체 게시글</h1>
            <p className="mt-4 max-w-2xl leading-7 text-muted">
              수집된 기술 시그널을 최신순으로 모았습니다.
            </p>
          </div>
          <div className="text-sm text-muted">
            {publishedPostList.total}개 중 {paginatedPosts.length > 0 ? startIndex + 1 : 0}-
            {startIndex + paginatedPosts.length}개
          </div>
        </div>

        {paginatedPosts.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {paginatedPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="border-2 border-line bg-panel p-5 text-muted">
            아직 게시된 글이 없습니다.
          </div>
        )}

        <div className="mt-8 flex items-center justify-between border-t-2 border-line pt-6">
          <Link
            aria-disabled={!hasPreviousPage}
            className={`inline-flex items-center gap-2 rounded-md border-2 border-line px-3 py-2 text-sm font-medium ${
              hasPreviousPage ? "text-foreground hover:bg-foreground hover:text-background" : "pointer-events-none text-muted opacity-50"
            }`}
            href={`/posts?page=${currentPage - 1}`}
          >
            <ChevronLeft size={16} aria-hidden="true" />
            이전
          </Link>

          <div className="font-mono text-sm text-muted">
            {currentPage} / {totalPages}
          </div>

          <Link
            aria-disabled={!hasNextPage}
            className={`inline-flex items-center gap-2 rounded-md border-2 border-line px-3 py-2 text-sm font-medium ${
              hasNextPage ? "text-foreground hover:bg-foreground hover:text-background" : "pointer-events-none text-muted opacity-50"
            }`}
            href={`/posts?page=${currentPage + 1}`}
          >
            다음
            <ChevronRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
