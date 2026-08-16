import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, adminNav } from "@/components/site/DashboardShell";
import { RoleGate } from "@/components/site/RoleGate";
import { EmptyState } from "@/components/site/EmptyState";

export const Route = createFileRoute("/_authenticated/admin/bookings")({
  head: () => ({
    meta: [
      { title: "Bookings — Sakhi" },
      { name: "description", content: "All bookings on the platform." },
      { property: "og:title", content: "Bookings — Sakhi" },
      { property: "og:description", content: "All bookings on the platform." },
    ],
  }),
  component: () => (
    <RoleGate allow={["admin"]}>
      <PageAuthenticatedAdminBookings />
    </RoleGate>
  ),
});

function PageAuthenticatedAdminBookings() {
  return (
    <DashboardShell nav={adminNav} title="Bookings" description="All bookings on the platform.">
      <EmptyState title="Nothing here yet" description="This section is ready and will fill up as activity comes in." />
    </DashboardShell>
  );
}
