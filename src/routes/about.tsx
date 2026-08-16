import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/site/Section";
import { PlaceholderImage } from "@/components/site/PlaceholderImage";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Sakhi — Women-to-Women Care" },
      {
        name: "description",
        content:
          "Sakhi exists so that women living away from home still have someone to turn to on the hard days. Learn about our mission, values and model.",
      },
      { property: "og:title", content: "About Sakhi" },
      { property: "og:description", content: "Why we built a women-to-women, time-based care platform." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <>
      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="About us"
              title="सखी means a woman's closest friend."
              description="Millions of women live away from their families for study and work. On a bad day there is no one to make tea, cook something simple, or sit beside them. Sakhi is our answer to that gap."
            />
            <p className="mt-6 text-sm text-muted-foreground">
              We are not a maid agency and we are not a clinic. We are a network of trained women who
              show up for other women, for a few hours at a time, and help with whatever reasonable
              non-medical thing is needed that day.
            </p>
          </div>
          <PlaceholderImage name="care-partner" alt="A Sakhi Care Partner" ratio="portrait" />
        </div>
      </Section>

      <Section muted>
        <SectionHeading title="What we stand for" center />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { t: "Dignity", b: "Both sides of every booking are treated with respect. Care work is real work." },
            { t: "Safety", b: "Verification, training and clear boundaries come before growth." },
            { t: "Honesty", b: "One hourly rate, shown up front. No packages, no upselling." },
            { t: "Warmth", b: "Comfort and company matter as much as the cooking and the cleaning." },
          ].map((v) => (
            <div key={v.t} className="surface-card p-6">
              <h3 className="text-lg">{v.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{v.b}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="surface-card flex flex-col items-start gap-6 p-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl">Want to be part of it?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Book care for yourself, or join us as a Care Partner.
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild>
              <Link to="/book">Book Care</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/become-a-care-partner">Become a Care Partner</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
