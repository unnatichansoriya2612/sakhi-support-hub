import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { DashboardShell, customerNav } from "@/components/site/DashboardShell";
import { RoleGate } from "@/components/site/RoleGate";
import { StatusBadge } from "@/components/site/StatusBadge";
import { EmptyState } from "@/components/site/EmptyState";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { formatCurrency, formatDate, formatTime } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/bookings/")({
  head: () => ({
    meta: [
      { title: "My Bookings — Sakhi" },
      { name: "description", content: "Every Sakhi booking you have made, with status, hours and totals." },
      { property: "og:title", content: "My Bookings — Sakhi" },
      { property: "og:description", content: "Past and upcoming Care Partner visits." },
    ],
  }),
  component: () => (
    <RoleGate allow={["customer"]}>
      <BookingsList />
    </RoleGate>
  ),
});

function BookingsList() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["bookings", "customer", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*, care_partners(id, profiles!care_partners_profile_id_fkey(full_name))")
        .eq("customer_id", user!.id)
        .order("date", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <DashboardShell nav={customerNav} eyebrow="Customer" title="My bookings" description="Every visit you've requested, in one place.">
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : (data ?? []).length === 0 ? (
        <EmptyState
          title="No bookings yet"
          description="When you book a Care Partner, it will show up here."
          action={<Button asChild><Link to="/book">Book care</Link></Button>}
        />
      ) : (
        <ul className="space-y-3">
          {(data ?? []).map((b) => (
            <li key={b.id} className="surface-card flex flex-wrap items-center justify-between gap-4 p-5">
              <div>
                <p className="font-medium">
                  {(b as { care_partners?: { profiles?: { full_name?: string } } }).care_partners?.profiles?.full_name ?? "Care Partner"}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatDate(b.date)} · {formatTime(b.start_time)} – {formatTime(b.end_time)} · {Number(b.duration_hours)} hrs
                </p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={b.status} />
                <span className="font-display text-lg">{formatCurrency(b.total_amount)}</span>
                <Button asChild size="sm" variant="outline">
                  <Link to="/bookings/$id" params={{ id: b.id }}>Details</Link>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </DashboardShell>
  );
}
