import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { humanize } from "@/lib/format";

const tone: Record<string, string> = {
  pending: "bg-warning/15 text-warning-foreground border-warning/30",
  not_started: "bg-muted text-muted-foreground border-border",
  not_submitted: "bg-muted text-muted-foreground border-border",
  in_review: "bg-warning/15 text-warning-foreground border-warning/30",
  in_progress: "bg-accent/40 text-accent-foreground border-accent",
  accepted: "bg-accent/40 text-accent-foreground border-accent",
  confirmed: "bg-accent/40 text-accent-foreground border-accent",
  approved: "bg-success/15 text-success border-success/30",
  verified: "bg-success/15 text-success border-success/30",
  completed: "bg-success/15 text-success border-success/30",
  resolved: "bg-success/15 text-success border-success/30",
  open: "bg-warning/15 text-warning-foreground border-warning/30",
  investigating: "bg-accent/40 text-accent-foreground border-accent",
  rejected: "bg-destructive/10 text-destructive border-destructive/25",
  cancelled: "bg-destructive/10 text-destructive border-destructive/25",
  dismissed: "bg-muted text-muted-foreground border-border",
  failed: "bg-destructive/10 text-destructive border-destructive/25",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <Badge
      variant="outline"
      className={cn("border font-medium", tone[status] ?? "bg-muted text-muted-foreground", className)}
    >
      {humanize(status)}
    </Badge>
  );
}
