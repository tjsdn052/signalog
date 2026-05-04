import { redirect } from "next/navigation";
import { isSupabaseAuthConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function requireAdminUser() {
  if (!isSupabaseAuthConfigured()) {
    redirect("/admin/login");
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return user;
}
