import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, partnerNav } from "@/components/site/DashboardShell";
import { RoleGate } from "@/components/site/RoleGate";
import { EmptyState } from "@/components/site/EmptyState";

export const Route = createFileRoute("/_authenticated/partner/earnings")({
  head: () => ({
    meta: [
      { title: "Earnings — Sakhi" },
      { name: "description", content: "Hours worked and amounts earned." },
      { property: "og:title", content: "Earnings — Sakhi" },
      { property: "og:description", content: "Hours worked and amounts earned." },
    ],
  }),
  component: () => (
    <RoleGate allow={["care_partner"]}>
      <PageAuthenticatedPartnerEarnings />
    </RoleGate>
  ),
});

function PageAuthenticatedPartnerEarnings() {
  return (
    <DashboardShell nav={partnerNav} title="Earnings" description="Hours worked and amounts earned.">
      <EmptyState title="Nothing here yet" description="This section is ready and will fill up as activity comes in." />
    </DashboardShell>
  );
}
