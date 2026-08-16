import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DashboardShell, customerNav } from "@/components/site/DashboardShell";
import { RoleGate } from "@/components/site/RoleGate";
import { StatusBadge } from "@/components/site/StatusBadge";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { formatCurrency, formatDate, formatTime } from "@/lib/format";
import { CANCELLABLE_STATUSES } from "@/types/database";

export const Route = createFileRoute("/_authenticated/bookings/$id")({
  head: () => ({
    meta: [
      { title: "Booking Details — Sakhi" },
      { name: "description", content: "View and manage a single Sakhi Care Partner booking." },
      { property: "og:title", content: "Booking Details — Sakhi" },
      { property: "og:description", content: "Time, address, status and total for this visit." },
    ],
  }),
  component: () => (
    <RoleGate allow={["customer"]}>
      <BookingDetailPage />
    </RoleGate>
  ),
});

function BookingDetailPage() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: booking, isLoading } = useQuery({
    queryKey: ["booking", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*, care_partners(id, profiles!care_partners_profile_id_fkey(full_name, phone))")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  async function cancel() {
    const { error } = await supabase
      .from("bookings")
      .update({ status: "cancelled", cancelled_by: user!.id, cancel_reason: "Cancelled by customer" })
      .eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Booking cancelled.");
    await queryClient.invalidateQueries();
  }

  if (isLoading) {
    return (
      <DashboardShell nav={customerNav} title="Booking">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </DashboardShell>
    );
  }
  if (!booking) {
    return (
      <DashboardShell nav={customerNav} title="Booking not found">
        <Button asChild variant="outline"><Link to="/bookings">Back to bookings</Link></Button>
      </DashboardShell>
    );
  }

  const partnerName =
    (booking as { care_partners?: { profiles?: { full_name?: string } } }).care_partners?.profiles?.full_name ??
    "Care Partner";

  return (
    <DashboardShell
      nav={customerNav}
      eyebrow="Booking"
      title={partnerName}
      description={`${formatDate(booking.date)} · ${formatTime(booking.start_time)} – ${formatTime(booking.end_time)}`}
      actions={<StatusBadge status={booking.status} />}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="surface-card p-6">
          <h2 className="text-lg">Visit details</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-6"><dt className="text-muted-foreground">Duration</dt><dd>{Number(booking.duration_hours)} hours</dd></div>
            <div className="flex justify-between gap-6"><dt className="text-muted-foreground">Hourly rate</dt><dd>{formatCurrency(booking.hourly_rate)}</dd></div>
            <div className="flex justify-between gap-6"><dt className="text-muted-foreground">Total</dt><dd className="font-medium">{formatCurrency(booking.total_amount)}</dd></div>
            <div className="flex justify-between gap-6"><dt className="text-muted-foreground">Address</dt><dd className="text-right">{booking.address}</dd></div>
          </dl>
          {booking.instructions ? (
            <p className="mt-4 rounded-lg bg-sand p-4 text-sm text-muted-foreground">{booking.instructions}</p>
          ) : null}
        </div>

        <div className="surface-card p-6">
          <h2 className="text-lg">Manage</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Care Partners provide non-medical support only. If anything felt unsafe, tell us and we will act.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {CANCELLABLE_STATUSES.includes(booking.status) ? (
              <Button variant="outline" onClick={cancel}>Cancel booking</Button>
            ) : null}
            <Button asChild variant="outline"><Link to="/bookings">All bookings</Link></Button>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
