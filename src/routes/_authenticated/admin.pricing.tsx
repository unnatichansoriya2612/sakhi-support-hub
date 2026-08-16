import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, adminNav } from "@/components/site/DashboardShell";
import { RoleGate } from "@/components/site/RoleGate";
import { EmptyState } from "@/components/site/EmptyState";

export const Route = createFileRoute("/_authenticated/admin/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Sakhi" },
      { name: "description", content: "Platform default hourly rate." },
      { property: "og:title", content: "Pricing — Sakhi" },
      { property: "og:description", content: "Platform default hourly rate." },
    ],
  }),
  component: () => (
    <RoleGate allow={["admin"]}>
      <PageAuthenticatedAdminPricing />
    </RoleGate>
  ),
});

function PageAuthenticatedAdminPricing() {
  return (
    <DashboardShell nav={adminNav} title="Pricing" description="Platform default hourly rate.">
      <EmptyState title="Nothing here yet" description="This section is ready and will fill up as activity comes in." />
    </DashboardShell>
  );
}
