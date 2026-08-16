import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, adminNav } from "@/components/site/DashboardShell";
import { RoleGate } from "@/components/site/RoleGate";
import { EmptyState } from "@/components/site/EmptyState";

export const Route = createFileRoute("/_authenticated/admin/reviews")({
  head: () => ({
    meta: [
      { title: "Reviews — Sakhi" },
      { name: "description", content: "Customer reviews of Care Partners." },
      { property: "og:title", content: "Reviews — Sakhi" },
      { property: "og:description", content: "Customer reviews of Care Partners." },
    ],
  }),
  component: () => (
    <RoleGate allow={["admin"]}>
      <PageAuthenticatedAdminReviews />
    </RoleGate>
  ),
});

function PageAuthenticatedAdminReviews() {
  return (
    <DashboardShell nav={adminNav} title="Reviews" description="Customer reviews of Care Partners.">
      <EmptyState title="Nothing here yet" description="This section is ready and will fill up as activity comes in." />
    </DashboardShell>
  );
}
