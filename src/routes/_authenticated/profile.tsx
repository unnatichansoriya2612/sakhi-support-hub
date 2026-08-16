import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, customerNav } from "@/components/site/DashboardShell";
import { RoleGate } from "@/components/site/RoleGate";
import { EmptyState } from "@/components/site/EmptyState";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Sakhi" },
      { name: "description", content: "Your Sakhi account details." },
      { property: "og:title", content: "Profile — Sakhi" },
      { property: "og:description", content: "Your Sakhi account details." },
    ],
  }),
  component: () => (
    <RoleGate allow={["customer","care_partner","admin"]}>
      <PageAuthenticatedProfile />
    </RoleGate>
  ),
});

function PageAuthenticatedProfile() {
  return (
    <DashboardShell nav={customerNav} title="Profile" description="Your Sakhi account details.">
      <EmptyState title="Nothing here yet" description="This section is ready and will fill up as activity comes in." />
    </DashboardShell>
  );
}
