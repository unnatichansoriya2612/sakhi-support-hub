import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, adminNav } from "@/components/site/DashboardShell";
import { RoleGate } from "@/components/site/RoleGate";
import { EmptyState } from "@/components/site/EmptyState";

export const Route = createFileRoute("/_authenticated/admin/tasks")({
  head: () => ({
    meta: [
      { title: "Care Tasks — Sakhi" },
      { name: "description", content: "The informational catalogue of supported tasks." },
      { property: "og:title", content: "Care Tasks — Sakhi" },
      { property: "og:description", content: "The informational catalogue of supported tasks." },
    ],
  }),
  component: () => (
    <RoleGate allow={["admin"]}>
      <PageAuthenticatedAdminTasks />
    </RoleGate>
  ),
});

function PageAuthenticatedAdminTasks() {
  return (
    <DashboardShell nav={adminNav} title="Care Tasks" description="The informational catalogue of supported tasks.">
      <EmptyState title="Nothing here yet" description="This section is ready and will fill up as activity comes in." />
    </DashboardShell>
  );
}
