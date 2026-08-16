import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, partnerNav } from "@/components/site/DashboardShell";
import { RoleGate } from "@/components/site/RoleGate";
import { EmptyState } from "@/components/site/EmptyState";

export const Route = createFileRoute("/_authenticated/partner/bookings")({
  head: () => ({
    meta: [
      { title: "Partner Bookings — Sakhi" },
      { name: "description", content: "Requests and confirmed visits." },
      { property: "og:title", content: "Partner Bookings — Sakhi" },
      { property: "og:description", content: "Requests and confirmed visits." },
    ],
  }),
  component: () => (
    <RoleGate allow={["care_partner"]}>
      <PageAuthenticatedPartnerBookings />
    </RoleGate>
  ),
});

function PageAuthenticatedPartnerBookings() {
  return (
    <DashboardShell nav={partnerNav} title="Partner Bookings" description="Requests and confirmed visits.">
      <EmptyState title="Nothing here yet" description="This section is ready and will fill up as activity comes in." />
    </DashboardShell>
  );
}
