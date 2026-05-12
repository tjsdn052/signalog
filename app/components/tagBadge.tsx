import { Badge } from "@/components/ui/badge";

type TagBadgeProps = {
  children: string;
};

export function TagBadge({ children }: TagBadgeProps) {
  return (
    <Badge
      variant="outline"
      className="rounded-md border-2 border-line bg-transparent px-2.5 py-1 text-xs font-normal text-muted"
    >
      {children}
    </Badge>
  );
}
