import Link from "next/link";
import type { SignalPost } from "../lib/posts";
import { PostMeta } from "./post-meta";

type PostCardProps = {
  post: SignalPost;
};

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="border border-line bg-panel p-5">
      <PostMeta post={post} />
      <h3 className="mt-4 text-xl font-semibold leading-snug">
        <Link href={`/posts/${post.slug}`} className="hover:underline">
          {post.title}
        </Link>
      </h3>
      <p className="mt-3 line-clamp-3 leading-7 text-muted">{post.excerpt}</p>
    </article>
  );
}
