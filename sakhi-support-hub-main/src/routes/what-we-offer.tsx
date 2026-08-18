import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/site/Section";
import { PlaceholderImage } from "@/components/site/PlaceholderImage";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/what-we-offer")({
  head: () => ({
    meta: [
      { title: "What We Offer — Sakhi" },
      {
        name: "description",
        content:
          "Cooking, tea, light household help, errands, hot water, gentle comfort massage and companionship — all included in your Care Partner's booked time.",
      },
      { property: "og:title", content: "What We Offer — Sakhi" },
      { property: "og:description", content: "Capabilities included in your Care Partner's time — never priced separately." },
    ],
  }),
  component: WhatWeOffer,
});

function WhatWeOffer() {
  const { data: tasks } = useQuery({
    queryKey: ["care-tasks", "active"],
    queryFn: async () => {
      const { data } = await supabase
        .from("care_tasks")
        .select("*")
        .eq("is_active", true)
        .order("created_at");
      return data ?? [];
    },
  });

  return (
    <>
      <Section>
        <SectionHeading
          eyebrow="What we offer"
          title="One Care Partner. Whatever reasonable help you need in that time."
          description="These are the kinds of support your Care Partner can provide. They are capabilities included in her time — not separate services, and never separately priced."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {(tasks ?? []).map((task) => (
            <div key={task.id} className="surface-card p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                {task.category}
              </p>
              <h3 className="mt-2 text-lg">{task.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{task.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section muted>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading title="What is never included" />
            <ul className="mt-6 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              <li>Diagnosing any illness or health condition</li>
              <li>Prescribing, administering or advising on medicines</li>
              <li>Medical treatment or any medical procedure</li>
              <li>Any sexual or intimate service of any kind</li>
              <li>Dangerous, illegal or degrading tasks</li>
              <li>Heavy or unsafe work outside her training</li>
              <li>Therapeutic, clinical or physiotherapy-style massage</li>
            </ul>
            <p className="mt-6 text-sm text-muted-foreground">
              Massage on Sakhi is only ever a gentle, comfort-oriented hand or leg massage. Your Care
              Partner can refuse any request she finds unsafe or inappropriate, and the booking stays
              protected.
            </p>
            <Button asChild className="mt-8" variant="outline">
              <Link to="/safety">Safety & Trust</Link>
            </Button>
          </div>
          <PlaceholderImage name="cooking" alt="Home-style cooking support" ratio="wide" />
        </div>
      </Section>
    </>
  );
}
