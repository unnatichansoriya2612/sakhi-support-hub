import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Ban, BadgeCheck, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/site/Section";
import { PlaceholderImage } from "@/components/site/PlaceholderImage";

export const Route = createFileRoute("/safety")({
  head: () => ({
    meta: [
      { title: "Safety & Trust — Sakhi" },
      {
        name: "description",
        content:
          "How Sakhi keeps both customers and Care Partners safe: verification, training, strict non-medical boundaries and the right to refuse unsafe tasks.",
      },
      { property: "og:title", content: "Safety & Trust — Sakhi" },
      { property: "og:description", content: "Verification, training and strict non-medical boundaries on every booking." },
    ],
  }),
  component: Safety,
});

const pillars = [
  { icon: BadgeCheck, t: "Verified identity", b: "Every Care Partner's identity and background documents are reviewed by our admin team before approval." },
  { icon: GraduationCap, t: "Mandatory training", b: "Safety, conduct, boundaries and basic home-care training must be completed before any booking." },
  { icon: ShieldCheck, t: "Admin oversight", b: "Approvals, complaints, reviews and bookings are all monitored by the Sakhi team." },
  { icon: Ban, t: "The right to refuse", b: "Care Partners can decline any task that is unsafe, illegal, intimate, medical or outside training." },
];

function Safety() {
  return (
    <>
      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Safety & trust"
              title="Care only works when both women feel safe."
              description="Sakhi is a women-to-women platform with hard limits. These rules are not fine print — they are enforced in our product, our approvals and our policies."
            />
          </div>
          <PlaceholderImage name="safety" alt="Safety at Sakhi" ratio="wide" />
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {pillars.map((p) => (
            <div key={p.t} className="surface-card p-6">
              <p.icon className="size-6 text-primary" />
              <h3 className="mt-4 text-lg">{p.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.b}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section muted>
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="surface-card p-8">
            <h2 className="text-xl">Sakhi provides non-medical support only</h2>
            <p className="mt-3 text-sm text-muted-foreground">A Care Partner must never:</p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              <li>Diagnose any illness or condition</li>
              <li>Prescribe or administer medicines</li>
              <li>Provide medical treatment or advice</li>
              <li>Perform any medical procedure, injection or dressing</li>
              <li>Provide any sexual or intimate service</li>
              <li>Perform dangerous or illegal tasks</li>
              <li>Perform unsafe or heavy work outside her training</li>
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              If you have a medical emergency, contact emergency services or a qualified doctor
              immediately. Sakhi is not a substitute for medical care.
            </p>
          </div>
          <div className="surface-card p-8">
            <h2 className="text-xl">About massage on Sakhi</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              The only massage offered on Sakhi is a <strong>gentle, comfort-oriented hand or leg
              massage</strong>. It is a small comfort, like a warm compress or a cup of tea.
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              <li>It is never therapeutic, clinical or physiotherapy-style.</li>
              <li>It is never full-body, intimate or oil-based spa treatment.</li>
              <li>It stops immediately whenever either woman asks.</li>
              <li>Requesting anything beyond this is a violation and can end your account.</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeading title="Reporting and accountability" />
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
          Every booking can be reported. Complaints go straight to the Sakhi admin team, who can
          investigate, suspend accounts and remove Care Partners or customers from the platform. You
          can raise a complaint from any booking's detail page.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link to="/terms">Terms & Conditions</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/cancellation">Cancellation & Refund Policy</Link>
          </Button>
        </div>
      </Section>
    </>
  );
}
