import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, adminNav } from "@/components/site/DashboardShell";
import { RoleGate } from "@/components/site/RoleGate";
import { EmptyState } from "@/components/site/EmptyState";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Sakhi" },
      { name: "description", content: "Platform overview for the Sakhi team." },
      { property: "og:title", content: "Admin Dashboard — Sakhi" },
      { property: "og:description", content: "Platform overview for the Sakhi team." },
    ],
  }),
  component: () => (
    <RoleGate allow={["admin"]}>
      <PageAuthenticatedAdmin />
    </RoleGate>
  ),
});

function PageAuthenticatedAdmin() {
  return (
    <DashboardShell nav={adminNav} title="Admin Dashboard" description="Platform overview for the Sakhi team.">
      <EmptyState title="Nothing here yet" description="This section is ready and will fill up as activity comes in." />
    </DashboardShell>
  );
}
