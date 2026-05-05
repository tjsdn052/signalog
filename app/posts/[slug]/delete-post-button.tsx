"use client";

import { useFormStatus } from "react-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function DeletePostButton() {
  const { pending } = useFormStatus();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          disabled={pending}
          className="inline-flex h-9 items-center justify-center border-2 border-line px-3 text-sm font-medium text-foreground hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-50"
        >
          삭제
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>게시글을 삭제할까요?</AlertDialogTitle>
          <AlertDialogDescription>
            삭제하면 목록과 상세 페이지에서 바로 사라집니다. 이 작업은 되돌릴 수 없습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>취소</AlertDialogCancel>
          <AlertDialogAction asChild>
            <button
              type="submit"
              disabled={pending}
              className="inline-flex h-8 items-center justify-center rounded-lg bg-destructive/10 px-2.5 text-sm font-medium text-destructive hover:bg-destructive/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {pending ? "삭제 중" : "삭제"}
            </button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
