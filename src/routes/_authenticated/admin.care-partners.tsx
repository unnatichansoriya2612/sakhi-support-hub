import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, adminNav } from "@/components/site/DashboardShell";
import { RoleGate } from "@/components/site/RoleGate";
import { EmptyState } from "@/components/site/EmptyState";

export const Route = createFileRoute("/_authenticated/admin/care-partners")({
  head: () => ({
    meta: [
      { title: "Care Partners — Sakhi" },
      { name: "description", content: "Approved and pending Care Partners." },
      { property: "og:title", content: "Care Partners — Sakhi" },
      { property: "og:description", content: "Approved and pending Care Partners." },
    ],
  }),
  component: () => (
    <RoleGate allow={["admin"]}>
      <PageAuthenticatedAdminCarePartners />
    </RoleGate>
  ),
});

function PageAuthenticatedAdminCarePartners() {
  return (
    <DashboardShell nav={adminNav} title="Care Partners" description="Approved and pending Care Partners.">
      <EmptyState title="Nothing here yet" description="This section is ready and will fill up as activity comes in." />
    </DashboardShell>
  );
}
