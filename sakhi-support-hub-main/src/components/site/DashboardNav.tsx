import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export type NavItem = { to: string; label: string };

export function DashboardNav({ items }: { items: NavItem[] }) {
  return (
    <nav className="-mx-1 flex gap-1 overflow-x-auto pb-2">
      {items.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className={cn(
            "shrink-0 rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted",
          )}
          activeProps={{ className: "bg-primary text-primary-foreground hover:bg-primary" }}
          activeOptions={{ exact: true }}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
