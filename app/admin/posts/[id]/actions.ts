"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPostHref } from "@/app/lib/urls";
import { requireAdminUser } from "@/server/auth/admin";
import { updateAdminPost } from "@/server/repositories/posts";
import { getCategory, getContentMarkdown, getRequiredString, getSignalScore, getTags } from "../form-utils";

export async function updateDraftPostAction(formData: FormData) {
  await requireAdminUser();

  const id = getRequiredString(formData, "id");

  const post = await updateAdminPost({
    id,
    title: getRequiredString(formData, "title"),
    excerpt: getRequiredString(formData, "excerpt"),
    summary: getRequiredString(formData, "summary"),
    contentMarkdown: getContentMarkdown(formData),
    category: getCategory(formData),
    signalScore: getSignalScore(formData),
    tags: getTags(formData),
  });

  revalidatePath("/admin/posts");
  revalidatePath(`/admin/posts/${id}`);
  revalidatePath("/");
  revalidatePath("/posts");

  if (post.status === "published") {
    revalidatePath(getPostHref(post.slug));
    redirect(getPostHref(post.slug));
  }

  redirect("/admin/posts");
}
