import { Rss } from "lucide-react";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b-2 border-line">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-md bg-foreground text-background">
            <Rss size={18} aria-hidden="true" />
          </span>
          <span>
            <span className="block text-base font-semibold">시그널로그</span>
            <span className="block text-xs text-muted">Signalog</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted sm:flex">
          <a className="hover:text-foreground" href="#signals">
            오늘의 시그널
          </a>
          <a className="hover:text-foreground" href="#timeline">
            연대표
          </a>
          <a className="hover:text-foreground" href="#topics">
            토픽
          </a>
        </nav>
      </div>
    </header>
  );
}
