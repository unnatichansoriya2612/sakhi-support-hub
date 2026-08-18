import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Clock,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  UserCheck,
  CalendarCheck,
  MessageCircleHeart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Section, SectionHeading } from "@/components/site/Section";
import { PlaceholderImage } from "@/components/site/PlaceholderImage";
import { supabase } from "@/lib/supabase";
import { formatCurrency } from "@/lib/format";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sakhi — Book a Trusted Care Partner by the Hour" },
      {
        name: "description",
        content:
          "Sakhi is a women-to-women care platform. Book one trained female Care Partner for the time you need — cooking, comfort, errands and companionship.",
      },
      { property: "og:title", content: "Sakhi — Book a Trusted Care Partner by the Hour" },
      {
        property: "og:description",
        content: "One booking. One Care Partner. Flexible, safe, non-medical support for the time you need.",
      },
    ],
  }),
  component: Home,
});

const faqs = [
  {
    q: "Am I booking a service or a person?",
    a: "You book a person for a block of time. During those hours your Care Partner can help with any reasonable, safe, non-medical task you need — there is no separate price per task.",
  },
  {
    q: "Is Sakhi a medical service?",
    a: "No. Sakhi is strictly non-medical. Care Partners never diagnose, prescribe, treat or perform any medical procedure.",
  },
  {
    q: "Who are the Care Partners?",
    a: "Verified, trained women. Every Care Partner is reviewed by our team, completes safety training and is approved before she can receive a single booking.",
  },
  {
    q: "How is the price calculated?",
    a: "Hourly rate × number of hours. You always see the full total before you confirm.",
  },
  {
    q: "Can a Care Partner refuse a task?",
    a: "Yes, always. Care Partners can decline anything unsafe, inappropriate, medical or outside their training.",
  },
];

function Home() {
  const { data: settings } = useQuery({
    queryKey: ["platform-settings"],
    queryFn: async () => {
      const { data } = await supabase.from("platform_settings").select("*").eq("id", 1).maybeSingle();
      return data;
    },
  });

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

  const rate = settings?.default_hourly_rate ?? 250;

  return (
    <>
      <section className="warm-gradient">
        <div className="container-page grid items-center gap-12 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-clay">
              Women-to-women care
            </p>
            <h1 className="mt-4 font-display text-6xl leading-none text-primary sm:text-7xl">सखी</h1>
            <p className="mt-2 text-2xl font-semibold tracking-[0.14em] text-foreground">SAKHI</p>
            <p className="mt-6 max-w-xl font-display text-2xl leading-snug text-foreground sm:text-3xl">
              "When you're away from home, you still deserve to be cared for."
            </p>
            <p className="mt-5 max-w-xl text-muted-foreground">
              Book one trained female Care Partner for the hours you need. She helps with cooking, tea,
              light household work, errands, comfort and company — all within your booked time.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/book">Book Care</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/become-a-care-partner">Become a Care Partner</Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Time-based pricing from{" "}
              <span className="font-semibold text-foreground">{formatCurrency(rate)}/hour</span> · No
              per-task charges
            </p>
          </div>
          <PlaceholderImage
            name="hero"
            alt="A Care Partner sharing a warm moment with a customer at home"
            ratio="portrait"
            className="shadow-lift"
          />
        </div>
      </section>

      <Section>
        <SectionHeading
          eyebrow="The problem"
          title="Living away from family is hard on the days you feel low."
          description="A fever, a long work week, period pain, recovery after travel, or simply a heavy day. There is no one to make hot tea, cook something simple, fold the laundry, or just sit beside you."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Clock,
              title: "Help is priced by task, not by need",
              body: "Most services make you choose a package. Real life doesn't work in packages.",
            },
            {
              icon: ShieldCheck,
              title: "Safety is a real worry",
              body: "Letting a stranger into your home is a decision, not a transaction.",
            },
            {
              icon: HeartHandshake,
              title: "Nobody offers plain comfort",
              body: "Company, warmth and a steady presence are not something you can order online.",
            },
          ].map((item) => (
            <div key={item.title} className="surface-card p-6">
              <item.icon className="size-6 text-primary" />
              <h3 className="mt-4 text-lg">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section muted>
        <SectionHeading eyebrow="How it works" title="One booking. One Care Partner. Your time." center />
        <div className="mt-12 grid gap-6 md:grid-cols-4">
          {[
            { icon: UserCheck, title: "Choose your Sakhi", body: "Browse approved, verified Care Partners near you." },
            { icon: CalendarCheck, title: "Pick date & hours", body: "Select a date, a start time and how many hours you need." },
            { icon: Sparkles, title: "Confirm & pay by time", body: "Hourly rate × hours. The total is shown before you confirm." },
            { icon: MessageCircleHeart, title: "Ask as you go", body: "Within those hours, request any reasonable non-medical help." },
          ].map((step, i) => (
            <div key={step.title} className="surface-card p-6">
              <span className="font-display text-3xl text-accent-foreground/70">0{i + 1}</span>
              <step.icon className="mt-3 size-5 text-primary" />
              <h3 className="mt-3 text-base font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button asChild variant="outline">
            <Link to="/how-it-works">See the full flow</Link>
          </Button>
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Care tasks"
              title="Everything below is included in her time."
              description="These are capabilities, not products. There is no separate price for cooking, comfort massage or errands — you are paying for your Care Partner's time."
            />
            <div className="mt-8 flex flex-wrap gap-2">
              {(tasks ?? []).map((task) => (
                <span
                  key={task.id}
                  className="rounded-full border border-border bg-card px-4 py-2 text-sm"
                >
                  {task.name}
                </span>
              ))}
            </div>
            <Button asChild className="mt-8" variant="outline">
              <Link to="/what-we-offer">What we offer</Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <PlaceholderImage name="cooking" alt="Simple home-style cooking" ratio="square" />
            <PlaceholderImage name="companionship" alt="Companionship and conversation" ratio="square" />
          </div>
        </div>
      </Section>

      <Section muted>
        <SectionHeading eyebrow="Why Sakhi" title="Built for trust, not for volume." center />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { title: "Women only, always", body: "Every Care Partner and every booking is women-to-women. That is the whole point." },
            { title: "Trained and verified", body: "Identity verification and safety training are completed before approval." },
            { title: "Honest, time-based pricing", body: "One hourly rate. No hidden add-ons, no per-task upselling." },
            { title: "Flexible within the hour", body: "Change your mind mid-booking. Ask for tea instead of laundry. It's your time." },
            { title: "Clear boundaries", body: "Strictly non-medical. Nothing unsafe, intimate or illegal — ever." },
            { title: "Accountable", body: "Reviews, complaints and admin oversight on every booking." },
          ].map((item) => (
            <div key={item.title} className="surface-card p-6">
              <h3 className="text-lg">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <PlaceholderImage name="safety" alt="Safety and verification at Sakhi" ratio="wide" />
          <div>
            <SectionHeading
              eyebrow="Safety & trust"
              title="You should never have to wonder who is at your door."
            />
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              {[
                "Identity and background verification before approval.",
                "Mandatory safety and conduct training.",
                "Strictly non-medical support — no diagnosis, medicines or procedures.",
                "Massage is only ever gentle, comfort-oriented hand or leg massage.",
                "Care Partners may refuse any unsafe or inappropriate request.",
                "Every booking can be reported and reviewed.",
              ].map((line) => (
                <li key={line} className="flex gap-3">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <Button asChild className="mt-8" variant="outline">
              <Link to="/safety">Read our safety rules</Link>
            </Button>
          </div>
        </div>
      </Section>

      <Section muted>
        <div className="surface-card grid gap-8 p-8 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:p-12">
          <div>
            <SectionHeading
              eyebrow="Work with us"
              title="Become a Care Partner"
              description="Earn on your own schedule, in your own area, with training and support behind you. Set your availability, accept only the bookings that work for you."
            />
            <Button asChild className="mt-8" size="lg">
              <Link to="/become-a-care-partner">Apply to join</Link>
            </Button>
          </div>
          <PlaceholderImage name="care-partner" alt="A Sakhi Care Partner" ratio="square" />
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="FAQ" title="Questions people ask us first" center />
        <div className="mx-auto mt-10 max-w-3xl">
          <Accordion type="single" collapsible>
            {faqs.map((faq) => (
              <AccordionItem key={faq.q} value={faq.q}>
                <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="mt-8 text-center">
            <Button asChild variant="outline">
              <Link to="/faq">All questions</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
