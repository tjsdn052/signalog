import type { SignalPost } from "../lib/posts";

type PostSourceProps = {
  post: SignalPost;
};

export function PostSource({ post }: PostSourceProps) {
  return (
    <div className="mt-10 border-t border-line pt-8">
      <p className="text-sm text-muted">
        출처:{" "}
        <a href={post.sourceUrl} target="_blank" rel="noreferrer" className="font-medium text-foreground underline">
          {post.source}
        </a>
      </p>
    </div>
  );
}
