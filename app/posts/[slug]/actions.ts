"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPostHref } from "@/app/lib/urls";
import { requireAdminUser } from "@/server/auth/admin";
import { deletePost } from "@/server/repositories/posts";

export async function deletePostAction(formData: FormData) {
  await requireAdminUser();

  const postId = formData.get("postId");

  if (typeof postId !== "string" || postId.length === 0) {
    throw new Error("삭제할 게시글 ID가 필요합니다.");
  }

  const slug = formData.get("slug");

  await deletePost(postId);

  revalidatePath("/");
  revalidatePath("/posts");

  if (typeof slug === "string" && slug.length > 0) {
    revalidatePath(getPostHref(slug));
  }

  redirect("/posts");
}
