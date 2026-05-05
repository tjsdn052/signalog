"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminUser } from "@/server/auth/admin";
import { createManualDraftPost } from "@/server/repositories/posts";
import { getCategory, getContentMarkdown, getOptionalUrl, getRequiredString, getSignalScore, getTags } from "../form-utils";

export async function createManualPostAction(formData: FormData) {
  await requireAdminUser();

  await createManualDraftPost({
    title: getRequiredString(formData, "title"),
    excerpt: getRequiredString(formData, "excerpt"),
    summary: getRequiredString(formData, "summary"),
    contentMarkdown: getContentMarkdown(formData),
    sourceUrl: getOptionalUrl(formData, "sourceUrl"),
    category: getCategory(formData),
    signalScore: getSignalScore(formData),
    tags: getTags(formData),
  });

  revalidatePath("/admin/posts");
  revalidatePath("/admin/posts/new");
  redirect("/admin/posts");
}
