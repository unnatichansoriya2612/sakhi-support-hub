import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/site/Section";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Sakhi" },
      {
        name: "description",
        content:
          "Answers about Sakhi bookings, time-based pricing, Care Partner verification, safety boundaries, cancellations and reviews.",
      },
      { property: "og:title", content: "Frequently Asked Questions — Sakhi" },
      { property: "og:description", content: "Everything about bookings, pricing, safety and cancellations." },
    ],
  }),
  component: Faq,
});

const groups = [
  {
    title: "Bookings & pricing",
    items: [
      ["What exactly am I booking?", "One trained female Care Partner for a block of time. Within those hours she can help with any reasonable, safe, non-medical task."],
      ["How is the price calculated?", "Hourly rate × number of hours = total. You see the total before confirming. There is never a separate charge per task."],
      ["Can I book more than one Care Partner?", "Each booking is one Care Partner for one time block. You can make separate bookings if you genuinely need more help."],
      ["Can I change what I ask for during the booking?", "Yes. That is the point of time-based booking. Ask for tea instead of laundry — it is your time."],
      ["What if the Care Partner is already booked?", "The system prevents double bookings. If a slot overlaps with an existing booking for that Care Partner, you will be asked to choose a different time."],
    ],
  },
  {
    title: "Safety & boundaries",
    items: [
      ["Is Sakhi medical care?", "No. Sakhi is strictly non-medical. No diagnosis, no medicines, no treatment, no procedures."],
      ["What kind of massage is offered?", "Only a gentle, comfort-oriented hand or leg massage. Nothing therapeutic, clinical, full-body or intimate."],
      ["Can a Care Partner refuse a task?", "Always. She can decline anything unsafe, illegal, intimate, medical or outside her training, without losing the booking."],
      ["Are Care Partners verified?", "Yes. Identity verification and safety training must be completed and approved before she can receive any booking."],
      ["How do I report a problem?", "Open the booking's detail page and raise a complaint. It goes directly to the Sakhi admin team."],
    ],
  },
  {
    title: "Accounts & cancellations",
    items: [
      ["Who can use Sakhi?", "Sakhi is a women-to-women platform. Both customers and Care Partners are women."],
      ["Can I cancel a booking?", "Yes, while the booking is still pending, accepted or confirmed. See our Cancellation & Refund Policy for timing and charges."],
      ["Can I become an admin?", "No. Admin access is never selectable at signup and cannot be self-assigned. It is granted directly in the database by the platform owner."],
      ["When can I review a Care Partner?", "Once a booking is marked completed, you can leave one rating and comment for it."],
    ],
  },
];

function Faq() {
  return (
    <Section>
      <SectionHeading eyebrow="FAQ" title="Frequently asked questions" />
      <div className="mt-12 space-y-12">
        {groups.map((group) => (
          <div key={group.title}>
            <h2 className="text-xl">{group.title}</h2>
            <Accordion type="single" collapsible className="mt-4">
              {group.items.map(([q, a]) => (
                <AccordionItem key={q} value={q}>
                  <AccordionTrigger className="text-left">{q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </div>
      <div className="mt-12 flex flex-wrap gap-3">
        <Button asChild>
          <Link to="/book">Book Care</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/safety">Safety & Trust</Link>
        </Button>
      </div>
    </Section>
  );
}
