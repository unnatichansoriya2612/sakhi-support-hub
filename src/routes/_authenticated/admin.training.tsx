import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, adminNav } from "@/components/site/DashboardShell";
import { RoleGate } from "@/components/site/RoleGate";
import { EmptyState } from "@/components/site/EmptyState";

export const Route = createFileRoute("/_authenticated/admin/training")({
  head: () => ({
    meta: [
      { title: "Training — Sakhi" },
      { name: "description", content: "Training records across Care Partners." },
      { property: "og:title", content: "Training — Sakhi" },
      { property: "og:description", content: "Training records across Care Partners." },
    ],
  }),
  component: () => (
    <RoleGate allow={["admin"]}>
      <PageAuthenticatedAdminTraining />
    </RoleGate>
  ),
});

function PageAuthenticatedAdminTraining() {
  return (
    <DashboardShell nav={adminNav} title="Training" description="Training records across Care Partners.">
      <EmptyState title="Nothing here yet" description="This section is ready and will fill up as activity comes in." />
    </DashboardShell>
  );
}
