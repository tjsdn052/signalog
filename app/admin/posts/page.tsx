import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { isSupabaseAdminConfigured } from "@/lib/supabase/admin";
import { listAdminPosts } from "@/server/repositories/posts";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "관리자 게시글 | 시그널로그",
  description: "수집된 draft 게시글을 확인합니다.",
};

export default async function AdminPostsPage() {
  const isConfigured = isSupabaseAdminConfigured();
  const posts = isConfigured ? await listAdminPosts("draft") : [];

  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="mb-8 border-b-2 border-line pb-8">
          <p className="text-sm font-medium text-accent">Admin</p>
          <h1 className="mt-2 text-4xl font-semibold leading-tight sm:text-5xl">Draft 게시글</h1>
          <p className="mt-4 max-w-2xl leading-7 text-muted">
            수집 파이프라인이 생성한 초안 글을 확인합니다.
          </p>
        </div>

        {!isConfigured ? (
          <div className="border-2 border-line bg-panel p-5 text-muted">
            Supabase 환경변수가 설정되지 않았습니다.
          </div>
        ) : null}

        {isConfigured && posts.length === 0 ? (
          <div className="border-2 border-line bg-panel p-5 text-muted">
            아직 draft 게시글이 없습니다.
          </div>
        ) : null}

        {posts.length > 0 ? (
          <div className="overflow-x-auto border-2 border-line">
            <table className="w-full min-w-200 border-collapse text-left">
              <thead className="border-b-2 border-line text-sm text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Score</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                  <th className="px-4 py-3 font-medium">Source</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b-2 border-line last:border-b-0">
                    <td className="px-4 py-4 align-top">
                      <div className="font-medium">{post.title}</div>
                      <div className="mt-2 line-clamp-2 text-sm leading-6 text-muted">{post.excerpt}</div>
                      <div className="mt-2 font-mono text-xs text-muted">{post.slug}</div>
                    </td>
                    <td className="px-4 py-4 align-top text-sm text-muted">{post.category}</td>
                    <td className="px-4 py-4 align-top font-mono text-sm">{post.signalScore}</td>
                    <td className="px-4 py-4 align-top font-mono text-xs text-muted">
                      {new Date(post.createdAt).toLocaleDateString("ko-KR")}
                    </td>
                    <td className="px-4 py-4 align-top">
                      <Link
                        href={post.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
                      >
                        원문
                        <ExternalLink size={14} aria-hidden="true" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>
    </main>
  );
}
