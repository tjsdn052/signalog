"use client";

import { useFormStatus } from "react-dom";

export function DeletePostButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(event) => {
        if (!window.confirm("이 게시글을 삭제할까요? 삭제 후에는 되돌릴 수 없습니다.")) {
          event.preventDefault();
        }
      }}
      className="inline-flex h-9 items-center justify-center border-2 border-line px-3 text-sm font-medium text-foreground hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "삭제 중" : "삭제"}
    </button>
  );
}
