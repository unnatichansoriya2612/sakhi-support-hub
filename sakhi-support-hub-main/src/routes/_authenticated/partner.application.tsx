import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, partnerNav } from "@/components/site/DashboardShell";
import { RoleGate } from "@/components/site/RoleGate";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/partner/application")({
  head: () => ({
    meta: [
      { title: "Application — Sakhi" },
      {
        name: "description",
        content: "Complete your Care Partner application.",
      },
    ],
  }),
  component: () => (
    <RoleGate allow={["care_partner"]}>
      <PageAuthenticatedPartnerApplication />
    </RoleGate>
  ),
});

function PageAuthenticatedPartnerApplication() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [bio, setBio] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [languages, setLanguages] = useState("");
  const [serviceArea, setServiceArea] = useState("");
  const [hourlyRate, setHourlyRate] = useState<number>(0);

  useEffect(() => {
    loadApplication();
  }, []);

  async function loadApplication() {
    setLoading(true);
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("Please log in again.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("care_partners")
      .select(
        "id, bio, experience_years, languages, service_area, hourly_rate, approval_status"
      )
      .eq("profile_id", user.id)
      .maybeSingle();

    if (error) {
      console.error(error);
      setMessage(error.message);
      setLoading(false);
      return;
    }

    if (data) {
      setBio(data.bio ?? "");
      setExperienceYears(
        data.experience_years !== null
          ? String(data.experience_years)
          : ""
      );
      setLanguages(data.languages ?? "");
      setServiceArea(data.service_area ?? "");
      setHourlyRate(data.hourly_rate ?? 0);
    }

    setLoading(false);
  }

  async function saveApplication(submit = false) {
    setSaving(true);
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("Please log in again.");
      setSaving(false);
      return;
    }

    const updateData = {
      bio,
      experience_years: experienceYears
        ? Number(experienceYears)
        : 0,
      languages,
      service_area: serviceArea,
      hourly_rate: Number(hourlyRate),
      ...(submit
        ? { approval_status: "pending" as const }
        : {}),
    };

    const { error } = await supabase
      .from("care_partners")
      .update(updateData)
      .eq("profile_id", user.id);

    if (error) {
      console.error(error);
      setMessage(error.message);
      setSaving(false);
      return;
    }

    setMessage(
      submit
        ? "Application submitted successfully!"
        : "Profile saved successfully!"
    );

    setSaving(false);
  }

  if (loading) {
    return (
      <DashboardShell
        nav={partnerNav}
        title="Application"
        description="Complete your onboarding application."
      >
        <p>Loading your application...</p>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      nav={partnerNav}
      title="Care Partner Application"
      description="Complete your profile to apply as a Care Partner."
    >
      <div className="max-w-2xl space-y-6">
        <div>
          <h2 className="text-xl font-semibold">
            Complete your profile
          </h2>

          <p className="text-sm text-muted-foreground">
            Fill in your details so the Sakhi team can review
            your application.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium">
              About you
            </label>

            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us a little about yourself..."
              className="min-h-28 w-full rounded-md border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Experience (years)
            </label>

            <input
              type="number"
              min="0"
              value={experienceYears}
              onChange={(e) =>
                setExperienceYears(e.target.value)
              }
              placeholder="e.g. 2"
              className="w-full rounded-md border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Languages
            </label>

            <input
              type="text"
              value={languages}
              onChange={(e) =>
                setLanguages(e.target.value)
              }
              placeholder="e.g. Hindi, English"
              className="w-full rounded-md border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Service area
            </label>

            <input
              type="text"
              value={serviceArea}
              onChange={(e) =>
                setServiceArea(e.target.value)
              }
              placeholder="e.g. Jabalpur"
              className="w-full rounded-md border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Hourly rate (optional)
            </label>

            <input
              type="number"
              min="0"
              value={hourlyRate}
              onChange={(e) =>
                setHourlyRate(Number(e.target.value))
              }
              placeholder="e.g. 250"
              className="w-full rounded-md border p-3"
            />

            <p className="mt-1 text-xs text-muted-foreground">
              You can leave this empty.
            </p>
          </div>
        </div>

        {message && (
          <p className="rounded-md border p-3 text-sm">
            {message}
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => saveApplication(false)}
            disabled={saving}
            className="rounded-md border px-4 py-2"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>

          <button
            type="button"
            onClick={() => saveApplication(true)}
            disabled={saving}
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
          >
            {saving ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </div>
    </DashboardShell>
  );
}