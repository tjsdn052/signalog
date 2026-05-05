import { Clock3, Languages } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import type { SignalPost } from "../lib/posts";
import { getPostHref } from "../lib/urls";

type PostCardProps = {
  post: SignalPost;
};

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="h-55 w-full rounded-none border-2 border-line bg-panel py-0 shadow-none ring-0 sm:h-60">
      <CardContent className="flex h-full flex-col p-4 sm:p-5">
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
        <h3 className="mt-3 line-clamp-2 text-xl font-semibold leading-snug">
          <Link href={getPostHref(post.slug)} className="hover:underline">
            {post.title}
          </Link>
        </h3>
        <p className="mt-3 line-clamp-2 leading-7 text-muted">{post.excerpt}</p>
      </CardContent>
    </Card>
  );
}
