import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, adminNav } from "@/components/site/DashboardShell";
import { RoleGate } from "@/components/site/RoleGate";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/care-partners")({
  head: () => ({
    meta: [
      { title: "Care Partners — Sakhi" },
      { name: "description", content: "Approved and pending Care Partners." },
      { property: "og:title", content: "Care Partners — Sakhi" },
      { property: "og:description", content: "Approved and pending Care Partners." },
    ],
  }),
  component: () => (
    <RoleGate allow={["admin"]}>
      <PageAuthenticatedAdminCarePartners />
    </RoleGate>
  ),
});

function PageAuthenticatedAdminCarePartners() {
  const [partners, setPartners] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadCarePartners() {
      const { data, error } = await supabase
        .from("care_partners")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      setPartners(data || []);
      setLoading(false);
    }

    loadCarePartners();
  }, []);

  return (
    <DashboardShell
      nav={adminNav}
      title="Care Partners"
      description="Approved and pending Care Partners."
    >
      {loading ? (
        <p>Loading care partners...</p>
      ) : partners.length === 0 ? (
        <div className="rounded-xl border p-6">
          <h2 className="text-xl font-semibold">
            No Care Partner applications yet
          </h2>
          <p className="mt-2 text-muted-foreground">
            Applications submitted by Care Partners will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {partners.map((partner) => (
            <div key={partner.id} className="rounded-xl border p-6">
              <h2 className="text-lg font-semibold">
                Care Partner Application
              </h2>

              <p className="mt-2">
                <strong>Service Area:</strong> {partner.service_area}
              </p>

              <p className="mt-1">
                <strong>Languages:</strong> {partner.languages}
              </p>

              <p className="mt-1">
                <strong>Experience:</strong>{" "}
                {partner.experience_years} years
              </p>

              <p className="mt-1">
                <strong>Hourly Rate:</strong> ₹{partner.hourly_rate}
              </p>

              <p className="mt-1">
                <strong>Status:</strong> {partner.approval_status}
              </p>

              <p className="mt-1">
                <strong>Verification:</strong>{" "}
                {partner.verification_status}
              </p>

              <p className="mt-1">
                <strong>Training:</strong> {partner.training_status}
              </p>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}

