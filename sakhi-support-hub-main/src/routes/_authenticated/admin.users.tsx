import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, adminNav } from "@/components/site/DashboardShell";
import { RoleGate } from "@/components/site/RoleGate";
import { EmptyState } from "@/components/site/EmptyState";

export const Route = createFileRoute("/_authenticated/admin/users")({
  head: () => ({
    meta: [
      { title: "Users — Sakhi" },
      { name: "description", content: "All Sakhi accounts." },
      { property: "og:title", content: "Users — Sakhi" },
      { property: "og:description", content: "All Sakhi accounts." },
    ],
  }),
  component: () => (
    <RoleGate allow={["admin"]}>
      <PageAuthenticatedAdminUsers />
    </RoleGate>
  ),
});

function PageAuthenticatedAdminUsers() {
  return (
    <DashboardShell nav={adminNav} title="Users" description="All Sakhi accounts.">
      <EmptyState title="Nothing here yet" description="This section is ready and will fill up as activity comes in." />
    </DashboardShell>
  );
}
