import {
  Bot,
  CalendarDays,
  Clock3,
  Languages,
  Tag,
  TrendingUp,
} from "lucide-react";
import { notFound } from "next/navigation";
import { isSupabaseAdminConfigured } from "@/lib/supabase/admin";
import { getPublishedPostBySlug } from "@/server/repositories/posts";
import { getPostBySlug } from "../../lib/posts";

type PostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params;
  const post = isSupabaseAdminConfigured() ? await getPublishedPostBySlug(slug) : getPostBySlug(slug);

  if (!post) {
    return {
      title: "게시글을 찾을 수 없음 | 시그널로그",
    };
  }

  return {
    title: `${post.title} | 시그널로그`,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = isSupabaseAdminConfigured() ? await getPublishedPostBySlug(slug) : getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <article className="mx-auto max-w-4xl px-5 py-10">
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
          <span className="inline-flex items-center gap-1.5 rounded-md border-2 border-line bg-panel px-2.5 py-1">
            <TrendingUp size={14} aria-hidden="true" />
            Signal {post.signalScore}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays size={14} aria-hidden="true" />
            {post.publishedAt}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock3 size={14} aria-hidden="true" />
            {post.readingMinutes}분 읽기
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Languages size={14} aria-hidden="true" />
            한국어 번역
          </span>
        </div>

        <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-normal sm:text-5xl">
          {post.title}
        </h1>
        <p className="mt-5 text-lg leading-8 text-muted">{post.excerpt}</p>

        <section className="mt-8 border-2 border-line bg-panel p-5">
          <div className="flex items-center gap-2 text-sm font-medium text-accent">
            <Bot size={16} aria-hidden="true" />
            AI 요약
          </div>
          <p className="mt-3 leading-7 text-muted">{post.summary}</p>
        </section>

        <div className="mt-8 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1.5 rounded-md border-2 border-line px-2.5 py-1 text-sm text-muted">
              <Tag size={13} aria-hidden="true" />
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-10 border-t-2 border-line pt-8">
          <p className="text-sm text-muted">
            출처:{" "}
            <a href={post.sourceUrl} target="_blank" rel="noreferrer" className="font-medium text-foreground underline">
              {post.source}
            </a>
          </p>
        </div>

        <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert">
          {post.body.map((paragraph) => (
            <p key={paragraph} className="mb-5 text-lg leading-9 text-foreground">
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    </main>
  );
}
