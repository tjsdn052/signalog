import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { isSupabaseAuthConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type AdminAccess =
  | { status: "allowed"; user: User }
  | { status: "missing-config" | "unauthenticated" | "forbidden"; user: User | null };

export async function getAdminAccess(): Promise<AdminAccess> {
  if (!isSupabaseAuthConfigured()) {
    return { status: "missing-config", user: null };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { status: "unauthenticated", user: null };
  }

  const { data: profile, error } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();

  if (error || profile?.role !== "admin") {
    return { status: "forbidden", user };
  }

  return { status: "allowed", user };
}

export async function requireAdminUser() {
  const access = await getAdminAccess();

  if (access.status !== "allowed") {
    redirect("/admin/login");
  }

  return access.user;
}
