"use client";

import { Trash2 } from "lucide-react";
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
} from "@/components/ui/alertDialog";

export function DeleteAllButton() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          className="inline-flex h-9 items-center justify-center gap-1.5 border-2 border-line px-3 text-sm font-medium whitespace-nowrap text-muted hover:bg-foreground hover:text-background"
        >
          <Trash2 size={15} aria-hidden="true" />
          전체 삭제
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>전체 게시글을 삭제할까요?</AlertDialogTitle>
          <AlertDialogDescription>
            draft와 이미 게시된 글을 모두 삭제합니다. 삭제된 게시글은 되돌릴 수 없습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction asChild>
            <button type="submit">전체 삭제</button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
