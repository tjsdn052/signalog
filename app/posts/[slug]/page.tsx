import { notFound } from "next/navigation";
import { AiSummaryBox } from "../../components/ai-summary-box";
import { PostBody } from "../../components/post-body";
import { PostDetailHeader } from "../../components/post-detail-header";
import { PostFooterActions } from "../../components/post-footer-actions";
import { PostMeta } from "../../components/post-meta";
import { PostSource } from "../../components/post-source";
import { TagBadge } from "../../components/tag-badge";
import { getPostBySlug, posts } from "../../lib/posts";

type PostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

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
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <PostDetailHeader post={post} />

      <article className="mx-auto max-w-4xl px-5 py-10">
        <PostMeta post={post} showDate showSignal />

        <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-normal sm:text-5xl">
          {post.title}
        </h1>
        <p className="mt-5 text-lg leading-8 text-muted">{post.excerpt}</p>

        <AiSummaryBox summary={post.summary} />

        <div className="mt-8 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <TagBadge key={tag} showIcon>
              {tag}
            </TagBadge>
          ))}
        </div>

        <PostSource post={post} />
        <PostBody paragraphs={post.body} />
        <PostFooterActions post={post} />
      </article>
    </main>
  );
}
