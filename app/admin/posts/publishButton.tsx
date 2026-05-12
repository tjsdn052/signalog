"use client";

import { Send } from "lucide-react";
import { useFormStatus } from "react-dom";

export function PublishButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="inline-flex h-8 w-full items-center justify-center gap-1 border-2 border-line px-2 text-xs font-medium whitespace-nowrap hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-50"
      disabled={pending}
    >
      <Send size={15} aria-hidden="true" />
      {pending ? "게시중" : "게시"}
    </button>
  );
}
