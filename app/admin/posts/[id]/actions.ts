"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminUser } from "@/server/auth/admin";
import { updateDraftPost } from "@/server/repositories/posts";
import { getCategory, getContentMarkdown, getRequiredString, getSignalScore, getTags } from "../form-utils";

export async function updateDraftPostAction(formData: FormData) {
  await requireAdminUser();

  const id = getRequiredString(formData, "id");

  await updateDraftPost({
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
  redirect("/admin/posts");
}
