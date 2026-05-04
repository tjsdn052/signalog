"use server";

import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/server/auth/admin";
import { publishPost } from "@/server/repositories/posts";

export async function publishPostAction(formData: FormData) {
  await requireAdminUser();

  const postId = formData.get("postId");

  if (typeof postId !== "string" || postId.length === 0) {
    throw new Error("게시할 draft 게시글 ID가 필요합니다.");
  }

  const publishedPost = await publishPost(postId);

  revalidatePath("/");
  revalidatePath("/posts");
  revalidatePath("/admin/posts");
  revalidatePath(`/posts/${publishedPost.slug}`);
}
