import { redirect } from "next/navigation";
import { isSupabaseAuthConfigured } from "@/lib/supabase/config";
import { getAdminAccess } from "@/server/auth/admin";
import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "관리자 로그인 | 시그널로그",
};

export default async function AdminLoginPage() {
  const isConfigured = isSupabaseAuthConfigured();
  let forbiddenEmail: string | null = null;

  if (isConfigured) {
    const access = await getAdminAccess();

    if (access.status === "allowed") {
      redirect("/admin/posts");
    }

    if (access.status === "forbidden") {
      forbiddenEmail = access.user?.email ?? null;
    }
  }

  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-xl px-5 py-12">
        <div className="border-2 border-line bg-panel p-6">
          <p className="text-sm font-medium text-accent">Admin</p>
          <h1 className="mt-2 text-4xl font-semibold leading-tight">로그인</h1>
          <p className="mt-4 leading-7 text-muted">
            관리자 계정으로 로그인하면 수집된 draft 게시글을 확인할 수 있습니다.
          </p>

          {isConfigured ? (
            <>
              {forbiddenEmail ? (
                <div className="mt-6 border-2 border-line p-4 text-sm leading-6 text-muted">
                  `{forbiddenEmail}` 계정은 관리자 권한이 없습니다. Supabase `profiles.role`을 `admin`으로 변경하세요.
                </div>
              ) : null}
              <LoginForm />
            </>
          ) : (
            <div className="mt-8 border-2 border-line p-4 text-sm leading-6 text-muted">
              Supabase Auth 환경변수가 필요합니다. `NEXT_PUBLIC_SUPABASE_ANON_KEY`를 추가하세요.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
