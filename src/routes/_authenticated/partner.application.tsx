import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, partnerNav } from "@/components/site/DashboardShell";
import { RoleGate } from "@/components/site/RoleGate";
import { EmptyState } from "@/components/site/EmptyState";

export const Route = createFileRoute("/_authenticated/partner/application")({
  head: () => ({
    meta: [
      { title: "Application — Sakhi" },
      { name: "description", content: "Your onboarding application status." },
      { property: "og:title", content: "Application — Sakhi" },
      { property: "og:description", content: "Your onboarding application status." },
    ],
  }),
  component: () => (
    <RoleGate allow={["care_partner"]}>
      <PageAuthenticatedPartnerApplication />
    </RoleGate>
  ),
});

function PageAuthenticatedPartnerApplication() {
  return (
    <DashboardShell nav={partnerNav} title="Application" description="Your onboarding application status.">
      <EmptyState title="Nothing here yet" description="This section is ready and will fill up as activity comes in." />
    </DashboardShell>
  );
}
