import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, customerNav } from "@/components/site/DashboardShell";
import { RoleGate } from "@/components/site/RoleGate";
import { EmptyState } from "@/components/site/EmptyState";

export const Route = createFileRoute("/_authenticated/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — Sakhi" },
      { name: "description", content: "Updates about your Sakhi bookings." },
      { property: "og:title", content: "Notifications — Sakhi" },
      { property: "og:description", content: "Updates about your Sakhi bookings." },
    ],
  }),
  component: () => (
    <RoleGate allow={["customer"]}>
      <PageAuthenticatedNotifications />
    </RoleGate>
  ),
});

function PageAuthenticatedNotifications() {
  return (
    <DashboardShell nav={customerNav} title="Notifications" description="Updates about your Sakhi bookings.">
      <EmptyState title="Nothing here yet" description="This section is ready and will fill up as activity comes in." />
    </DashboardShell>
  );
}
