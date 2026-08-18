import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { DashboardShell, customerNav } from "@/components/site/DashboardShell";
import { RoleGate } from "@/components/site/RoleGate";
import { StatCard } from "@/components/site/StatCard";
import { StatusBadge } from "@/components/site/StatusBadge";
import { EmptyState } from "@/components/site/EmptyState";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { formatCurrency, formatDate, formatTime, todayISO } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Customer Dashboard — Sakhi" },
      { name: "description", content: "Track your upcoming Sakhi bookings, hours booked and total spend." },
      { property: "og:title", content: "Customer Dashboard — Sakhi" },
      { property: "og:description", content: "Your bookings and care history at a glance." },
    ],
  }),
  component: () => (
    <RoleGate allow={["customer"]}>
      <CustomerDashboard />
    </RoleGate>
  ),
});

function CustomerDashboard() {
  const { user, profile } = useAuth();

  const { data: bookings } = useQuery({
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

  const all = bookings ?? [];
  const today = todayISO();
  const upcoming = all
    .filter((b) => b.date >= today && !["cancelled", "rejected", "completed"].includes(b.status))
    .sort((a, b) => a.date.localeCompare(b.date));
  const completed = all.filter((b) => b.status === "completed");
  const hours = completed.reduce((sum, b) => sum + Number(b.duration_hours), 0);
  const spend = completed.reduce((sum, b) => sum + Number(b.total_amount), 0);

  return (
    <DashboardShell
      nav={customerNav}
      eyebrow="Customer"
      title={`Namaste, ${profile?.full_name?.split(" ")[0] ?? "there"}`}
      description="Book a trained Care Partner by the hour, and keep track of every visit here."
      actions={
        <Button asChild>
          <Link to="/book">Book care</Link>
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Upcoming" value={upcoming.length} hint="Live bookings" />
        <StatCard label="Completed" value={completed.length} hint="Visits finished" />
        <StatCard label="Hours booked" value={hours.toFixed(1)} hint="Across completed visits" />
        <StatCard label="Total spend" value={formatCurrency(spend)} hint="Completed visits only" />
      </div>

      <h2 className="mt-12 text-xl">Upcoming bookings</h2>
      {upcoming.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            title="Nothing booked yet"
            description="Choose a Care Partner and book her time — cooking, companionship, errands and more are all included."
            action={
              <Button asChild>
                <Link to="/care-partners">Browse Care Partners</Link>
              </Button>
            }
          />
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {upcoming.map((booking) => (
            <li key={booking.id} className="surface-card flex flex-wrap items-center justify-between gap-4 p-5">
              <div>
                <p className="font-medium">
                  {(booking as { care_partners?: { profiles?: { full_name?: string } } }).care_partners
                    ?.profiles?.full_name ?? "Care Partner"}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatDate(booking.date)} · {formatTime(booking.start_time)} –{" "}
                  {formatTime(booking.end_time)} · {Number(booking.duration_hours)} hrs
                </p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={booking.status} />
                <span className="font-display text-lg">{formatCurrency(booking.total_amount)}</span>
                <Button asChild size="sm" variant="outline">
                  <Link to="/bookings/$id" params={{ id: booking.id }}>
                    Details
                  </Link>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </DashboardShell>
  );
}
