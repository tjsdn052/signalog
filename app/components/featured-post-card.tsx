import { ArrowUpRight, TrendingUp } from "lucide-react";
import Link from "next/link";
import type { SignalPost } from "../lib/posts";
import { TagBadge } from "./tag-badge";

type FeaturedPostCardProps = {
  post: SignalPost;
};

export function FeaturedPostCard({ post }: FeaturedPostCardProps) {
  return (
    <article className="border border-line bg-panel p-5">
      <div className="flex items-center justify-between gap-3 text-sm text-muted">
        <span className="inline-flex items-center gap-2">
          <TrendingUp size={15} aria-hidden="true" />
          Signal {post.signalScore}
        </span>
        <span>{post.category}</span>
      </div>
      <h2 className="mt-6 text-2xl font-semibold leading-snug">
        <Link href={`/posts/${post.slug}`} className="hover:underline">
          {post.title}
        </Link>
      </h2>
      <p className="mt-4 leading-7 text-muted">{post.excerpt}</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <TagBadge key={tag}>{tag}</TagBadge>
        ))}
      </div>
      <Link
        href={`/posts/${post.slug}`}
        className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-accent"
      >
        번역 요약 읽기
        <ArrowUpRight size={16} aria-hidden="true" />
      </Link>
    </article>
  );
}
