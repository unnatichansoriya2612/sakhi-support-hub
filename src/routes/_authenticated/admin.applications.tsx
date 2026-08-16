import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, adminNav } from "@/components/site/DashboardShell";
import { RoleGate } from "@/components/site/RoleGate";
import { EmptyState } from "@/components/site/EmptyState";

export const Route = createFileRoute("/_authenticated/admin/applications")({
  head: () => ({
    meta: [
      { title: "Applications — Sakhi" },
      { name: "description", content: "Care Partner applications awaiting review." },
      { property: "og:title", content: "Applications — Sakhi" },
      { property: "og:description", content: "Care Partner applications awaiting review." },
    ],
  }),
  component: () => (
    <RoleGate allow={["admin"]}>
      <PageAuthenticatedAdminApplications />
    </RoleGate>
  ),
});

function PageAuthenticatedAdminApplications() {
  return (
    <DashboardShell nav={adminNav} title="Applications" description="Care Partner applications awaiting review.">
      <EmptyState title="Nothing here yet" description="This section is ready and will fill up as activity comes in." />
    </DashboardShell>
  );
}
