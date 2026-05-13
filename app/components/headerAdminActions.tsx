"use client";

import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { isSupabaseAuthConfigured } from "@/lib/supabase/config";
import { LogoutButton } from "../admin/components/logoutButton";

type AdminSessionState = {
  email: string;
  isAdmin: boolean;
};

export function HeaderAdminActions() {
  const [adminSession, setAdminSession] = useState<AdminSessionState | null>(null);

  useEffect(() => {
    if (!isSupabaseAuthConfigured()) {
      return;
    }

    let isMounted = true;

    async function loadAdminSession() {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        await supabase.auth.signOut().catch(() => null);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (!isMounted || profileError || profile?.role !== "admin") {
        return;
      }

      setAdminSession({
        email: user.email ?? "admin",
        isAdmin: true,
      });
    }

    loadAdminSession().catch(() => null);

    return () => {
      isMounted = false;
    };
  }, []);

  if (!adminSession?.isAdmin) {
    return null;
  }

  return (
    <>
      <Link
        href="/admin/posts"
        className="inline-flex h-10 items-center gap-2 border-2 border-line bg-panel px-3 text-sm font-medium text-foreground hover:bg-foreground hover:text-background md:hidden"
      >
        <ShieldCheck size={15} aria-hidden="true" />
        관리자
      </Link>
      <div className="hidden items-center gap-2 md:flex">
        <Link
          href="/admin/posts"
          className="inline-flex h-10 items-center gap-2 border-2 border-line bg-panel px-3 text-sm font-medium text-foreground hover:bg-foreground hover:text-background"
        >
          <ShieldCheck size={15} aria-hidden="true" />
          관리자
        </Link>
        <span className="max-w-40 truncate text-xs text-muted">{adminSession.email}</span>
        <LogoutButton />
      </div>
    </>
  );
}
