import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, customerNav } from "@/components/site/DashboardShell";
import { RoleGate } from "@/components/site/RoleGate";
import { supabase } from "@/integrations/supabase/client";

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
    <RoleGate allow={["customer", "care_partner", "admin"]}>
      <PageAuthenticatedProfile />
    </RoleGate>
  ),
});

function PageAuthenticatedProfile() {
  const [profile, setProfile] = React.useState<any>(null);
  const [carePartner, setCarePartner] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      setProfile(profileData);

      const { data: carePartnerData } = await supabase
        .from("care_partners")
        .select("*")
        .eq("profile_id", user.id)
        .maybeSingle();

      setCarePartner(carePartnerData);
      setLoading(false);
    }

    loadProfile();
  }, []);

  if (loading) {
    return (
      <DashboardShell
        nav={customerNav}
        title="Profile"
        description="Your Sakhi account details."
      >
        <p>Loading profile...</p>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      nav={customerNav}
      title="Profile"
      description="Your Sakhi account details."
    >
      <div className="space-y-6">
        <div className="rounded-xl border p-6">
          <h2 className="text-xl font-semibold mb-4">Account Details</h2>

          <div className="space-y-3">
            <p>
              <strong>Name:</strong>{" "}
              {profile?.full_name || "Not provided"}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {profile?.email || "Not provided"}
            </p>

            <p>
              <strong>Phone:</strong>{" "}
              {profile?.phone || "Not provided"}
            </p>

            <p>
              <strong>City:</strong>{" "}
              {profile?.city || "Not provided"}
            </p>

            <p>
              <strong>Role:</strong>{" "}
              {profile?.role || "Not provided"}
            </p>
          </div>
        </div>

        {carePartner && (
          <div className="rounded-xl border p-6">
            <h2 className="text-xl font-semibold mb-4">
              Care Partner Details
            </h2>

            <div className="space-y-3">
              <p>
                <strong>Bio:</strong>{" "}
                {carePartner.bio || "Not provided"}
              </p>

              <p>
                <strong>Experience:</strong>{" "}
                {carePartner.experience_years ?? 0} years
              </p>

              <p>
                <strong>Languages:</strong>{" "}
                {carePartner.languages || "Not provided"}
              </p>

              <p>
                <strong>Service Area:</strong>{" "}
                {carePartner.service_area || "Not provided"}
              </p>

              <p>
                <strong>Hourly Rate:</strong>{" "}
                ₹{carePartner.hourly_rate ?? 0}
              </p>

              <p>
                <strong>Application Status:</strong>{" "}
                {carePartner.approval_status || "Not submitted"}
              </p>

              <p>
                <strong>Verification Status:</strong>{" "}
                {carePartner.verification_status || "Pending"}
              </p>

              <p>
                <strong>Training Status:</strong>{" "}
                {carePartner.training_status || "Not started"}
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
