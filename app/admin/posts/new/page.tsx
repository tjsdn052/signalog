import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { requireAdminUser } from "@/server/auth/admin";
import { POST_CATEGORIES } from "@/server/posts/categories";
import { POST_TAGS } from "@/server/posts/tags";
import { listAdminTagNames } from "@/server/repositories/posts";
import { SaveButton } from "../[id]/saveButton";
import { TagSelector } from "../[id]/tagSelector";
import { MarkdownEditorField } from "../markdownEditorField";
import { createManualPostAction } from "./actions";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "글 작성 | 시그널로그",
};

export default async function AdminNewPostPage() {
  await requireAdminUser();

  const tagNames = await listAdminTagNames();

  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-4xl px-5 py-12">
        <div className="mb-8 border-b-2 border-line pb-8">
          <Link href="/admin/posts" className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground">
            <ArrowLeft size={16} aria-hidden="true" />
            Draft 목록
          </Link>
          <p className="mt-6 text-sm font-medium text-accent">Admin</p>
          <h1 className="mt-2 text-4xl font-semibold leading-tight sm:text-5xl">글 작성</h1>
          <p className="mt-4 max-w-2xl leading-7 text-muted">
            수집된 글이 아니어도 직접 draft 게시글을 작성할 수 있습니다.
          </p>
        </div>

        <form action={createManualPostAction} className="space-y-5">
          <label className="block">
            <span className="text-sm font-medium text-muted">Title</span>
            <input
              name="title"
              className="mt-2 h-11 w-full border-2 border-line bg-panel px-3 text-foreground outline-none focus:bg-foreground focus:text-background"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-muted">Excerpt</span>
            <textarea
              name="excerpt"
              className="mt-2 min-h-28 w-full resize-y border-2 border-line bg-panel p-3 leading-7 text-foreground outline-none focus:bg-foreground focus:text-background"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-muted">Summary</span>
            <textarea
              name="summary"
              className="mt-2 min-h-32 w-full resize-y border-2 border-line bg-panel p-3 leading-7 text-foreground outline-none focus:bg-foreground focus:text-background"
              required
            />
          </label>

          <div className="block">
            <span className="text-sm font-medium text-muted">Content Markdown</span>
            <MarkdownEditorField name="contentMarkdown" />
          </div>

          <label className="block">
            <span className="text-sm font-medium text-muted">Source URL</span>
            <input
              name="sourceUrl"
              type="url"
              placeholder="비우면 내부 작성 글로 저장됩니다"
              className="mt-2 h-11 w-full border-2 border-line bg-panel px-3 text-foreground outline-none focus:bg-foreground focus:text-background"
            />
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-muted">Category</span>
              <select
                name="category"
                defaultValue="Developer Tools"
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
                defaultValue={50}
                className="mt-2 h-11 w-full border-2 border-line bg-panel px-3 text-foreground outline-none focus:bg-foreground focus:text-background"
                required
              />
            </label>
          </div>

          <TagSelector availableTags={Array.from(new Set([...POST_TAGS, ...tagNames]))} selectedTags={[]} />

          <div className="flex justify-end border-t-2 border-line pt-6">
            <SaveButton />
          </div>
        </form>
      </section>
    </main>
  );
}
