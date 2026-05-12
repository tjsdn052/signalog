"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CategorySidebar, type CategoryCount } from "./categorySidebar";

type CategorySidebarSheetProps = {
  categoryCounts: CategoryCount[];
  totalCount: number;
};

export function CategorySidebarSheet({ categoryCounts, totalCount }: CategorySidebarSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          aria-label="카테고리 메뉴 열기"
          className="size-9 rounded-md border-2 border-line bg-panel text-foreground hover:bg-foreground hover:text-background"
          size="icon"
          variant="outline"
        >
          <Menu size={18} aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-80 border-r-2 border-line bg-background p-0 text-foreground sm:max-w-90"
      >
        <SheetHeader className="border-b-2 border-line p-5">
          <SheetTitle className="text-2xl font-semibold">카테고리 탐색</SheetTitle>
          <SheetDescription className="text-muted">
            관심 있는 기술 신호를 카테고리별로 훑어보세요.
          </SheetDescription>
        </SheetHeader>
        <div className="p-5">
          <CategorySidebar categoryCounts={categoryCounts} totalCount={totalCount} variant="sheet" />
        </div>
      </SheetContent>
    </Sheet>
  );
}
