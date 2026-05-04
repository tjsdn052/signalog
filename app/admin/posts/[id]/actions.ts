"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminUser } from "@/server/auth/admin";
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
    category: getRequiredString(formData, "category"),
    signalScore,
  });

  revalidatePath("/admin/posts");
  revalidatePath(`/admin/posts/${id}`);
  redirect("/admin/posts");
}
