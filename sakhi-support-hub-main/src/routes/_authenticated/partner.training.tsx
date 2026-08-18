import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, partnerNav } from "@/components/site/DashboardShell";
import { RoleGate } from "@/components/site/RoleGate";
import { supabase } from "@/integrations/supabase/client";

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
  const [records, setRecords] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadTraining() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data: carePartner } = await supabase
        .from("care_partners")
        .select("id")
        .eq("profile_id", user.id)
        .maybeSingle();

      if (!carePartner) {
        setLoading(false);
        return;
      }

      const { data: trainingData, error } = await supabase
        .from("training_records")
        .select("*")
        .eq("care_partner_id", carePartner.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      setRecords(trainingData || []);
      setLoading(false);
    }

    loadTraining();
  }, []);

  return (
    <DashboardShell
      nav={partnerNav}
      title="Training"
      description="Your Sakhi training records."
    >
      {loading ? (
        <p>Loading training records...</p>
      ) : records.length === 0 ? (
        <div className="rounded-xl border p-6">
          <h2 className="text-xl font-semibold">No training records yet</h2>
          <p className="mt-2 text-muted-foreground">
            Your training records will appear here once they are added.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map((record) => (
            <div key={record.id} className="rounded-xl border p-6">
              <h2 className="text-lg font-semibold">
                {record.training_name}
              </h2>

              <p className="mt-2">
                <strong>Status:</strong>{" "}
                {record.status}
              </p>

              {record.completed_at && (
                <p className="mt-1">
                  <strong>Completed:</strong>{" "}
                  {new Date(record.completed_at).toLocaleDateString()}
                </p>
              )}

              {record.notes && (
                <p className="mt-1">
                  <strong>Notes:</strong> {record.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}

