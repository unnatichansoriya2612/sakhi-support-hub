import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, adminNav } from "@/components/site/DashboardShell";
import { RoleGate } from "@/components/site/RoleGate";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/training")({
  head: () => ({
    meta: [
      { title: "Training — Sakhi" },
      { name: "description", content: "Training records across Care Partners." },
      { property: "og:title", content: "Training — Sakhi" },
      { property: "og:description", content: "Training records across Care Partners." },
    ],
  }),
  component: () => (
    <RoleGate allow={["admin"]}>
      <PageAuthenticatedAdminTraining />
    </RoleGate>
  ),
});

function PageAuthenticatedAdminTraining() {
  const [records, setRecords] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadTraining() {
      const { data, error } = await supabase
        .from("training_records")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      setRecords(data || []);
      setLoading(false);
    }

    loadTraining();
  }, []);

  return (
    <DashboardShell
      nav={adminNav}
      title="Training"
      description="Training records across Care Partners."
    >
      {loading ? (
        <p>Loading training records...</p>
      ) : records.length === 0 ? (
        <div className="rounded-xl border p-6">
          <h2 className="text-xl font-semibold">No training records yet</h2>
          <p className="mt-2 text-muted-foreground">
            Training records will appear here when they are added.
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
                <strong>Status:</strong> {record.status}
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

