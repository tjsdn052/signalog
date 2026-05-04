"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminUser } from "@/server/auth/admin";
import { isPostCategory } from "@/server/posts/categories";
import { isPostTag } from "@/server/posts/tags";
import { updateDraftPost } from "@/server/repositories/posts";

function getRequiredString(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${key} 값이 필요합니다.`);
  }

  return value.trim();
}

export async function updateDraftPostAction(formData: FormData) {
  await requireAdminUser();

  const id = getRequiredString(formData, "id");
  const signalScore = Number(getRequiredString(formData, "signalScore"));

  if (!Number.isFinite(signalScore) || signalScore < 0 || signalScore > 100) {
    throw new Error("Signal score는 0부터 100 사이여야 합니다.");
  }

  await updateDraftPost({
    id,
    title: getRequiredString(formData, "title"),
    excerpt: getRequiredString(formData, "excerpt"),
    summary: getRequiredString(formData, "summary"),
    category: getCategory(formData),
    signalScore,
    tags: getTags(formData),
  });

  revalidatePath("/admin/posts");
  revalidatePath(`/admin/posts/${id}`);
  redirect("/admin/posts");
}

function getCategory(formData: FormData) {
  const category = getRequiredString(formData, "category");

  if (!isPostCategory(category)) {
    throw new Error("허용되지 않은 category입니다.");
  }

  return category;
}

function getTags(formData: FormData) {
  const tags = formData.getAll("tags");

  return tags.map((tag) => {
    if (typeof tag !== "string" || !isPostTag(tag)) {
      throw new Error("허용되지 않은 tag입니다.");
    }

    return tag;
  });
}
