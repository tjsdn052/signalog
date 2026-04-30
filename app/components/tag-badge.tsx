import { Tag } from "lucide-react";

type TagBadgeProps = {
  children: string;
  showIcon?: boolean;
};

export function TagBadge({ children, showIcon = false }: TagBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1 text-sm text-muted">
      {showIcon ? <Tag size={13} aria-hidden="true" /> : null}
      {children}
    </span>
  );
}
