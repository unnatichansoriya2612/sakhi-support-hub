import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, adminNav } from "@/components/site/DashboardShell";
import { RoleGate } from "@/components/site/RoleGate";
import { EmptyState } from "@/components/site/EmptyState";

export const Route = createFileRoute("/_authenticated/admin/verification")({
  head: () => ({
    meta: [
      { title: "Verification — Sakhi" },
      { name: "description", content: "Identity and background verification records." },
      { property: "og:title", content: "Verification — Sakhi" },
      { property: "og:description", content: "Identity and background verification records." },
    ],
  }),
  component: () => (
    <RoleGate allow={["admin"]}>
      <PageAuthenticatedAdminVerification />
    </RoleGate>
  ),
});

function PageAuthenticatedAdminVerification() {
  return (
    <DashboardShell nav={adminNav} title="Verification" description="Identity and background verification records.">
      <EmptyState title="Nothing here yet" description="This section is ready and will fill up as activity comes in." />
    </DashboardShell>
  );
}
