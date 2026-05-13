"use client";

import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function LogoutButton() {
  const router = useRouter();

  async function handleClick() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut().catch(() => null);
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex h-9 items-center justify-center rounded-md border-2 border-line px-3 text-sm font-medium hover:bg-foreground hover:text-background"
    >
      로그아웃
    </button>
  );
}
