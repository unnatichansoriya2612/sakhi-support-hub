import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/site/Section";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How It Works — Sakhi" },
      {
        name: "description",
        content:
          "Book one trained Care Partner for a block of time on Sakhi. Choose your Sakhi, pick date and hours, confirm the total, and ask for what you need.",
      },
      { property: "og:title", content: "How It Works — Sakhi" },
      { property: "og:description", content: "One booking, one Care Partner, time-based pricing. Here is the full flow." },
    ],
  }),
  component: HowItWorks,
});

const customerSteps = [
  { title: "Create your account", body: "Sign up as a Customer with your name, email and phone. It takes a minute." },
  { title: "Browse approved Care Partners", body: "Only Care Partners who are verified, trained and approved by our team can appear here." },
  { title: "Check her availability", body: "Each Care Partner publishes the dates and time windows she is free." },
  { title: "Choose date, start time and duration", body: "Duration is in hours. Your Care Partner is yours for that whole block." },
  { title: "Add address and instructions", body: "Tell her where to come and anything useful — allergies, building access, what you'd like help with." },
  { title: "Review the total", body: "Hourly rate × hours. The full amount is shown before you confirm anything." },
  { title: "Accept the terms and confirm", body: "You confirm you have read our Terms, Safety Rules and Cancellation Policy. This acceptance is stored with the booking." },
  { title: "She accepts, and the day arrives", body: "Track the booking through pending, accepted, confirmed, in progress and completed." },
  { title: "Review her afterwards", body: "Once a booking is completed, you can leave a rating and comment." },
];

const partnerSteps = [
  { title: "Apply", body: "Submit your application with your bio, experience, service area and languages." },
  { title: "Verification", body: "Our team reviews your identity and background documents." },
  { title: "Training", body: "Complete Sakhi's safety, conduct and boundaries training." },
  { title: "Approval", body: "Once approved, you become visible to customers and can receive bookings." },
  { title: "Set availability", body: "Publish the dates and hours you are free. You are never auto-assigned outside them." },
  { title: "Accept or decline", body: "Every request is yours to accept or reject. Completed bookings roll into your earnings." },
];

function HowItWorks() {
  return (
    <>
      <Section>
        <SectionHeading
          eyebrow="How it works"
          title="You book time, not tasks."
          description="A Sakhi booking is one trained Care Partner for a set number of hours. Within those hours she can help with any reasonable, safe, non-medical task — and you can change what you need as the time goes on."
        />
      </Section>

      <Section muted className="pt-0 sm:pt-0">
        <h2 className="text-2xl">For customers</h2>
        <ol className="mt-8 space-y-4">
          {customerSteps.map((step, i) => (
            <li key={step.title} className="surface-card flex gap-5 p-6">
              <span className="font-display text-2xl text-primary">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="text-base font-semibold">{step.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <h2 className="text-2xl">For Care Partners</h2>
        <ol className="mt-8 grid gap-4 md:grid-cols-2">
          {partnerSteps.map((step, i) => (
            <li key={step.title} className="surface-card flex gap-5 p-6">
              <span className="font-display text-2xl text-primary">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="text-base font-semibold">{step.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/book">Book Care</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/become-a-care-partner">Become a Care Partner</Link>
          </Button>
        </div>
      </Section>
    </>
  );
}
