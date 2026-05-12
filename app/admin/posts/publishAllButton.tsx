"use client";

import { CheckCheck } from "lucide-react";
import { useFormStatus } from "react-dom";

export function PublishAllButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="inline-flex h-9 items-center justify-center gap-1.5 border-2 border-line px-3 text-sm font-medium whitespace-nowrap hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-50"
      disabled={pending}
    >
      <CheckCheck size={15} aria-hidden="true" />
      {pending ? "게시 중" : "전체 게시"}
    </button>
  );
}
