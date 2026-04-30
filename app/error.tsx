"use client";

import { RotateCcw, TriangleAlert } from "lucide-react";
import Link from "next/link";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-4xl px-5 py-16">
        <div className="border-2 border-line bg-panel p-6 sm:p-8">
          <div className="flex items-center gap-3 text-sm font-medium text-muted">
            <TriangleAlert size={18} aria-hidden="true" />
            Error
          </div>
          <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-normal sm:text-6xl">
            페이지를 불러오지 못했습니다.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
            일시적인 오류가 발생했습니다. 다시 시도하거나 홈으로 돌아가 다른 시그널을 확인하세요.
          </p>
          {error.digest ? (
            <p className="mt-4 font-mono text-xs text-muted">Digest: {error.digest}</p>
          ) : null}
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2.5 text-sm font-medium text-background"
            >
              <RotateCcw size={16} aria-hidden="true" />
              다시 시도
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-md border-2 border-line bg-panel px-4 py-2.5 text-sm font-medium"
            >
              홈으로
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
