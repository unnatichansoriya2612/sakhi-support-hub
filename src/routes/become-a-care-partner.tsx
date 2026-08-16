import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/site/Section";
import { PlaceholderImage } from "@/components/site/PlaceholderImage";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { formatCurrency } from "@/lib/format";

export const Route = createFileRoute("/become-a-care-partner")({
  head: () => ({
    meta: [
      { title: "Become a Care Partner — Sakhi" },
      {
        name: "description",
        content:
          "Join Sakhi as a trained Care Partner. Set your own availability, accept the bookings you want, and earn by the hour with training and support behind you.",
      },
      { property: "og:title", content: "Become a Care Partner — Sakhi" },
      { property: "og:description", content: "Work on your own schedule, in your own area, with training and support." },
    ],
  }),
  component: BecomePartner,
});

function BecomePartner() {
  const { user, role } = useAuth();
  const { data: settings } = useQuery({
    queryKey: ["platform-settings"],
    queryFn: async () => {
      const { data } = await supabase.from("platform_settings").select("*").eq("id", 1).maybeSingle();
      return data;
    },
  });

  const applyTo = !user ? "/auth" : role === "care_partner" ? "/partner/application" : "/auth";

  return (
    <>
      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Work with Sakhi"
              title="Become a Care Partner"
              description="Sakhi Care Partners are trained women who support other women for a few hours at a time. You choose your area, your days and your hours."
            />
            <p className="mt-6 text-sm text-muted-foreground">
              Current platform rate:{" "}
              <span className="font-semibold text-foreground">
                {formatCurrency(settings?.default_hourly_rate ?? 250)} per hour
              </span>
              . You are paid for your time, not per task.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to={applyTo}>
                  {role === "care_partner" ? "Continue your application" : "Create a Care Partner account"}
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/safety">Read the safety rules</Link>
              </Button>
            </div>
            {!user ? (
              <p className="mt-4 text-xs text-muted-foreground">
                Choose "Care Partner" as your account type when you sign up.
              </p>
            ) : null}
          </div>
          <PlaceholderImage name="care-partner" alt="A Sakhi Care Partner" ratio="portrait" />
        </div>
      </Section>

      <Section muted>
        <SectionHeading title="What you need" center />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { t: "Be a woman aged 18+", b: "Sakhi is a women-to-women platform, on both sides of every booking." },
            { t: "Valid ID for verification", b: "Our team verifies identity and background before approval." },
            { t: "Willingness to train", b: "Complete Sakhi's safety, conduct and boundaries training." },
            { t: "Basic home skills", b: "Simple cooking, tea, light household help and errands." },
            { t: "Warmth and patience", b: "Companionship matters as much as the practical tasks." },
            { t: "A phone", b: "To manage availability and respond to booking requests." },
          ].map((item) => (
            <div key={item.t} className="surface-card p-6">
              <h3 className="text-lg">{item.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.b}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading title="Your journey" />
        <ol className="mt-8 grid gap-4 md:grid-cols-2">
          {[
            "Sign up and choose the Care Partner account type.",
            "Submit your application: bio, experience, service area, languages and supported tasks.",
            "Wait for verification and training to be marked complete by the Sakhi team.",
            "Once approved, publish your availability.",
            "Receive booking requests and accept the ones that suit you.",
            "Complete bookings, collect reviews and track your earnings.",
          ].map((step, i) => (
            <li key={step} className="surface-card flex gap-5 p-6">
              <span className="font-display text-2xl text-primary">{String(i + 1).padStart(2, "0")}</span>
              <p className="text-sm text-muted-foreground">{step}</p>
            </li>
          ))}
        </ol>
      </Section>
    </>
  );
}
