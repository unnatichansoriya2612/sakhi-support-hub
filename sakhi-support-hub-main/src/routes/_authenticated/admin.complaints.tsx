import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, adminNav } from "@/components/site/DashboardShell";
import { RoleGate } from "@/components/site/RoleGate";
import { EmptyState } from "@/components/site/EmptyState";

export const Route = createFileRoute("/_authenticated/admin/complaints")({
  head: () => ({
    meta: [
      { title: "Complaints — Sakhi" },
      { name: "description", content: "Safety and service complaints." },
      { property: "og:title", content: "Complaints — Sakhi" },
      { property: "og:description", content: "Safety and service complaints." },
    ],
  }),
  component: () => (
    <RoleGate allow={["admin"]}>
      <PageAuthenticatedAdminComplaints />
    </RoleGate>
  ),
});

function PageAuthenticatedAdminComplaints() {
  return (
    <DashboardShell nav={adminNav} title="Complaints" description="Safety and service complaints.">
      <EmptyState title="Nothing here yet" description="This section is ready and will fill up as activity comes in." />
    </DashboardShell>
  );
}
