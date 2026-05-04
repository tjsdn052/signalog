"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const supabase = createSupabaseBrowserClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setIsSubmitting(false);
      setError(signInError.message);
      return;
    }

    setIsRedirecting(true);
    router.push("/admin/posts");
    router.refresh();
  }

  const isPending = isSubmitting || isRedirecting;

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <label className="block">
        <span className="text-sm font-medium text-muted">Email</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-2 h-11 w-full border-2 border-line bg-panel px-3 text-foreground outline-none focus:bg-foreground focus:text-background"
          required
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-muted">Password</span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 h-11 w-full border-2 border-line bg-panel px-3 text-foreground outline-none focus:bg-foreground focus:text-background"
          required
        />
      </label>

      {error ? <p className="border-2 border-line p-3 text-sm text-muted">{error}</p> : null}

      <button
        type="submit"
        className="inline-flex h-11 w-full items-center justify-center rounded-md border-2 border-line bg-panel px-4 text-sm font-medium text-foreground hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isPending}
      >
        {isRedirecting ? "이동 중" : isSubmitting ? "로그인 중" : "로그인"}
      </button>
    </form>
  );
}
