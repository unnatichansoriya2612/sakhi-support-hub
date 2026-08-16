import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, partnerNav } from "@/components/site/DashboardShell";
import { RoleGate } from "@/components/site/RoleGate";
import { EmptyState } from "@/components/site/EmptyState";

export const Route = createFileRoute("/_authenticated/partner/")({
  head: () => ({
    meta: [
      { title: "Care Partner Dashboard — Sakhi" },
      { name: "description", content: "Your upcoming visits, hours and earnings." },
      { property: "og:title", content: "Care Partner Dashboard — Sakhi" },
      { property: "og:description", content: "Your upcoming visits, hours and earnings." },
    ],
  }),
  component: () => (
    <RoleGate allow={["care_partner"]}>
      <PageAuthenticatedPartner />
    </RoleGate>
  ),
});

function PageAuthenticatedPartner() {
  return (
    <DashboardShell nav={partnerNav} title="Care Partner Dashboard" description="Your upcoming visits, hours and earnings.">
      <EmptyState title="Nothing here yet" description="This section is ready and will fill up as activity comes in." />
    </DashboardShell>
  );
}
