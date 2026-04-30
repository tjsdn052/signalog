import { ArrowLeft, SearchX } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-4xl px-5 py-16">
        <div className="border-2 border-line bg-panel p-6 sm:p-8">
          <div className="flex items-center gap-3 text-sm font-medium text-muted">
            <SearchX size={18} aria-hidden="true" />
            404
          </div>
          <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-normal sm:text-6xl">
            요청한 시그널을 찾을 수 없습니다.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
            주소가 바뀌었거나 아직 수집되지 않은 글일 수 있습니다. 홈에서 최신 기술 신호를 다시 확인해보세요.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2.5 text-sm font-medium text-background"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              홈으로
            </Link>
            <Link
              href="/#signals"
              className="inline-flex items-center gap-2 rounded-md border-2 border-line bg-panel px-4 py-2.5 text-sm font-medium"
            >
              최근 글 보기
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
