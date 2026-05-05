import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdminUser } from "@/server/auth/admin";
import { POST_CATEGORIES } from "@/server/posts/categories";
import { POST_TAGS } from "@/server/posts/tags";
import { getAdminDraftPost, listAdminTagNames } from "@/server/repositories/posts";
import { MarkdownEditorField } from "../markdown-editor-field";
import { updateDraftPostAction } from "./actions";
import { SaveButton } from "./save-button";
import { TagSelector } from "./tag-selector";

type AdminPostEditPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Draft 편집 | 시그널로그",
};

export default async function AdminPostEditPage({ params }: AdminPostEditPageProps) {
  await requireAdminUser();

  const { id } = await params;
  const [post, tagNames] = await Promise.all([getAdminDraftPost(id), listAdminTagNames()]);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-4xl px-5 py-12">
        <div className="mb-8 border-b-2 border-line pb-8">
          <Link href="/admin/posts" className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground">
            <ArrowLeft size={16} aria-hidden="true" />
            Draft 목록
          </Link>
          <p className="mt-6 text-sm font-medium text-accent">Admin</p>
          <h1 className="mt-2 text-4xl font-semibold leading-tight sm:text-5xl">Draft 편집</h1>
          <p className="mt-4 font-mono text-xs text-muted">{post.slug}</p>
        </div>

        <form action={updateDraftPostAction} className="space-y-5">
          <input type="hidden" name="id" value={post.id} />

          <label className="block">
            <span className="text-sm font-medium text-muted">Title</span>
            <input
              name="title"
              defaultValue={post.title}
              className="mt-2 h-11 w-full border-2 border-line bg-panel px-3 text-foreground outline-none focus:bg-foreground focus:text-background"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-muted">Excerpt</span>
            <textarea
              name="excerpt"
              defaultValue={post.excerpt}
              className="mt-2 min-h-28 w-full resize-y border-2 border-line bg-panel p-3 leading-7 text-foreground outline-none focus:bg-foreground focus:text-background"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-muted">AI Summary</span>
            <textarea
              name="summary"
              defaultValue={post.summary}
              className="mt-2 min-h-40 w-full resize-y border-2 border-line bg-panel p-3 leading-7 text-foreground outline-none focus:bg-foreground focus:text-background"
              required
            />
          </label>

          <div className="block">
            <span className="text-sm font-medium text-muted">Content Markdown</span>
            <MarkdownEditorField name="contentMarkdown" initialMarkdown={post.contentMarkdown} />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-muted">Category</span>
              <select
                name="category"
                defaultValue={post.category}
                className="mt-2 h-11 w-full border-2 border-line bg-panel px-3 text-foreground outline-none focus:bg-foreground focus:text-background"
                required
              >
                {POST_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-muted">Signal Score</span>
              <input
                name="signalScore"
                type="number"
                min="0"
                max="100"
                defaultValue={post.signalScore}
                className="mt-2 h-11 w-full border-2 border-line bg-panel px-3 text-foreground outline-none focus:bg-foreground focus:text-background"
                required
              />
            </label>
          </div>

          <TagSelector availableTags={Array.from(new Set([...POST_TAGS, ...tagNames]))} selectedTags={post.tags} />

          <div className="flex flex-col gap-3 border-t-2 border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href={post.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
            >
              원문 보기
              <ExternalLink size={14} aria-hidden="true" />
            </Link>
            <SaveButton />
          </div>
        </form>
      </section>
    </main>
  );
}
