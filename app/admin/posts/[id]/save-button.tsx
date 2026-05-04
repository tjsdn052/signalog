"use client";

import { useFormStatus } from "react-dom";

export function SaveButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="inline-flex h-10 items-center justify-center border-2 border-line bg-foreground px-4 text-sm font-medium text-background hover:bg-panel hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
      disabled={pending}
    >
      {pending ? "저장 중" : "저장"}
    </button>
  );
}
