"use client";

import { Trash2 } from "lucide-react";
import { useFormStatus } from "react-dom";

export function DeleteButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="inline-flex h-9 w-24 items-center justify-center gap-1.5 border-2 border-line px-3 text-sm font-medium text-muted hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-50"
      disabled={pending}
    >
      <Trash2 size={15} aria-hidden="true" />
      {pending ? "삭제 중" : "삭제"}
    </button>
  );
}
