import { Rss } from "lucide-react";
import Link from "next/link";

type SiteHeaderProps = {
  maxWidthClassName?: string;
};

export function SiteHeader({ maxWidthClassName = "max-w-6xl" }: SiteHeaderProps) {
  return (
    <header className="border-b border-line">
      <div className={`mx-auto flex ${maxWidthClassName} items-center justify-between px-5 py-5`}>
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
          <Link className="hover:text-foreground" href="/#signals">
            오늘의 시그널
          </Link>
          <Link className="hover:text-foreground" href="/#timeline">
            연대표
          </Link>
          <Link className="hover:text-foreground" href="/#topics">
            토픽
          </Link>
        </nav>
      </div>
    </header>
  );
}
