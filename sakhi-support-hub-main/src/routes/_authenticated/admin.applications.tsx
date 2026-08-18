import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, adminNav } from "@/components/site/DashboardShell";
import { RoleGate } from "@/components/site/RoleGate";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/applications")({
  head: () => ({
    meta: [
      { title: "Applications — Sakhi" },
      {
        name: "description",
        content: "Care Partner applications awaiting review.",
      },
      { property: "og:title", content: "Applications — Sakhi" },
      {
        property: "og:description",
        content: "Care Partner applications awaiting review.",
      },
    ],
  }),

  component: () => (
    <RoleGate allow={["admin"]}>
      <PageAuthenticatedAdminApplications />
    </RoleGate>
  ),
});

function PageAuthenticatedAdminApplications() {
  const [applications, setApplications] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadApplications() {
      const { data, error } = await supabase
        .from("care_partners")
        .select("*")
        .eq("approval_status", "pending")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      setApplications(data || []);
      setLoading(false);
    }

    loadApplications();
  }, []);

  async function approveApplication(id: string) {
    const { error } = await supabase
      .from("care_partners")
      .update({
        approval_status: "approved",
      })
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    setApplications((current) =>
      current.filter((application) => application.id !== id)
    );
  }

  async function rejectApplication(id: string) {
    const { error } = await supabase
      .from("care_partners")
      .update({
        approval_status: "rejected",
      })
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    setApplications((current) =>
      current.filter((application) => application.id !== id)
    );
  }

  return (
    <DashboardShell
      nav={adminNav}
      title="Applications"
      description="Care Partner applications awaiting review."
    >
      {loading ? (
        <p>Loading applications...</p>
      ) : applications.length === 0 ? (
        <div className="rounded-xl border p-6">
          <h2 className="text-xl font-semibold">
            No pending applications
          </h2>

          <p className="mt-2 text-muted-foreground">
            New Care Partner applications will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <div
              key={application.id}
              className="rounded-xl border p-6"
            >
              <h2 className="text-lg font-semibold">
                Care Partner Application
              </h2>

              <p className="mt-2">
                <strong>Bio:</strong> {application.bio}
              </p>

              <p className="mt-1">
                <strong>Experience:</strong>{" "}
                {application.experience_years} years
              </p>

              <p className="mt-1">
                <strong>Languages:</strong>{" "}
                {application.languages}
              </p>

              <p className="mt-1">
                <strong>Service Area:</strong>{" "}
                {application.service_area}
              </p>

              <p className="mt-1">
                <strong>Hourly Rate:</strong> ₹
                {application.hourly_rate}
              </p>

              <p className="mt-1">
                <strong>Status:</strong>{" "}
                {application.approval_status}
              </p>

              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  className="rounded-lg bg-green-600 px-4 py-2 text-white"
                  onClick={() =>
                    approveApplication(application.id)
                  }
                >
                  Approve
                </button>

                <button
                  type="button"
                  className="rounded-lg bg-red-600 px-4 py-2 text-white"
                  onClick={() =>
                    rejectApplication(application.id)
                  }
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}

