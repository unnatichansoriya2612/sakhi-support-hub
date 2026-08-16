import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, partnerNav } from "@/components/site/DashboardShell";
import { RoleGate } from "@/components/site/RoleGate";
import { EmptyState } from "@/components/site/EmptyState";

export const Route = createFileRoute("/_authenticated/partner/training")({
  head: () => ({
    meta: [
      { title: "Training — Sakhi" },
      { name: "description", content: "Your Sakhi training records." },
      { property: "og:title", content: "Training — Sakhi" },
      { property: "og:description", content: "Your Sakhi training records." },
    ],
  }),
  component: () => (
    <RoleGate allow={["care_partner"]}>
      <PageAuthenticatedPartnerTraining />
    </RoleGate>
  ),
});

function PageAuthenticatedPartnerTraining() {
  return (
    <DashboardShell nav={partnerNav} title="Training" description="Your Sakhi training records.">
      <EmptyState title="Nothing here yet" description="This section is ready and will fill up as activity comes in." />
    </DashboardShell>
  );
}
