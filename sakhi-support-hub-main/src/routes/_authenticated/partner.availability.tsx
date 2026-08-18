import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, partnerNav } from "@/components/site/DashboardShell";
import { RoleGate } from "@/components/site/RoleGate";
import { EmptyState } from "@/components/site/EmptyState";

export const Route = createFileRoute("/_authenticated/partner/availability")({
  head: () => ({
    meta: [
      { title: "Availability — Sakhi" },
      { name: "description", content: "Publish the hours you can work." },
      { property: "og:title", content: "Availability — Sakhi" },
      { property: "og:description", content: "Publish the hours you can work." },
    ],
  }),
  component: () => (
    <RoleGate allow={["care_partner"]}>
      <PageAuthenticatedPartnerAvailability />
    </RoleGate>
  ),
});

function PageAuthenticatedPartnerAvailability() {
  return (
    <DashboardShell nav={partnerNav} title="Availability" description="Publish the hours you can work.">
      <EmptyState title="Nothing here yet" description="This section is ready and will fill up as activity comes in." />
    </DashboardShell>
  );
}
