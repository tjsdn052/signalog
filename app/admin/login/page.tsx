import { redirect } from "next/navigation";
import { isSupabaseAuthConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "관리자 로그인 | 시그널로그",
};

export default async function AdminLoginPage() {
  const isConfigured = isSupabaseAuthConfigured();

  if (isConfigured) {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      redirect("/admin/posts");
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
            <LoginForm />
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
