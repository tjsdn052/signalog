"use server";

import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/server/auth/admin";
import { deletePost, publishAllDraftPosts, publishPost } from "@/server/repositories/posts";

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

export async function publishAllDraftPostsAction() {
  await requireAdminUser();

  const publishedPosts = await publishAllDraftPosts();

  revalidatePath("/");
  revalidatePath("/posts");
  revalidatePath("/admin/posts");

  for (const post of publishedPosts) {
    revalidatePath(`/posts/${post.slug}`);
  }
}

export async function deleteDraftPostAction(formData: FormData) {
  await requireAdminUser();

  const postId = formData.get("postId");

  if (typeof postId !== "string" || postId.length === 0) {
    throw new Error("삭제할 draft 게시글 ID가 필요합니다.");
  }

  await deletePost(postId);

  revalidatePath("/");
  revalidatePath("/posts");
  revalidatePath("/admin/posts");
}
