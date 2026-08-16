import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Star, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/site/Section";
import { StatusBadge } from "@/components/site/StatusBadge";
import { PlaceholderImage } from "@/components/site/PlaceholderImage";
import { supabase } from "@/lib/supabase";
import { formatCurrency, formatDate, formatTime, todayISO } from "@/lib/format";

export const Route = createFileRoute("/care-partners/$id")({
  head: () => ({
    meta: [
      { title: "Care Partner Profile — Sakhi" },
      {
        name: "description",
        content: "See this Sakhi Care Partner's experience, supported tasks, availability, reviews and hourly rate.",
      },
      { property: "og:title", content: "Care Partner Profile — Sakhi" },
      { property: "og:description", content: "Experience, supported tasks, availability and reviews." },
    ],
  }),
  component: PartnerProfile,
});

function PartnerProfile() {
  const { id } = Route.useParams();

  const { data: partner, isLoading } = useQuery({
    queryKey: ["care-partner", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("care_partners")
        .select("*, profiles!care_partners_profile_id_fkey(id, full_name, avatar_url, city)")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: tasks } = useQuery({
    queryKey: ["care-partner-tasks", id],
    queryFn: async () => {
      const { data } = await supabase
        .from("care_partner_tasks")
        .select("care_task_id, care_tasks(id, name, description, is_active)")
        .eq("care_partner_id", id);
      return (data ?? []).map((row) => row.care_tasks).filter(Boolean);
    },
  });

  const { data: slots } = useQuery({
    queryKey: ["availability", id],
    queryFn: async () => {
      const { data } = await supabase
        .from("availability")
        .select("*")
        .eq("care_partner_id", id)
        .eq("is_available", true)
        .gte("date", todayISO())
        .order("date")
        .order("start_time");
      return data ?? [];
    },
  });

  const { data: reviews } = useQuery({
    queryKey: ["reviews", id],
    queryFn: async () => {
      const { data } = await supabase
        .from("reviews")
        .select("*, profiles!reviews_customer_id_fkey(full_name)")
        .eq("care_partner_id", id)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  if (isLoading) {
    return <Section><p className="text-sm text-muted-foreground">Loading profile...</p></Section>;
  }

  if (!partner) {
    return (
      <Section>
        <h1 className="text-2xl">Care Partner not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This profile may not be approved yet, or the link is incorrect.
        </p>
        <Button asChild className="mt-6" variant="outline">
          <Link to="/care-partners">Back to all Care Partners</Link>
        </Button>
      </Section>
    );
  }

  const avg =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : null;

  return (
    <Section>
      <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
        <div>
          <Link to="/care-partners" className="text-xs text-muted-foreground underline">
            ← All Care Partners
          </Link>
          <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl">{partner.profiles?.full_name || "Care Partner"}</h1>
              <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="size-4" />
                {partner.service_area || partner.profiles?.city || "Service area on request"}
              </p>
            </div>
            <div className="flex gap-2">
              <StatusBadge status={partner.verification_status} />
              <StatusBadge status={partner.training_status} />
            </div>
          </div>

          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            {partner.bio || "This Care Partner has not added a bio yet."}
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="surface-card p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Experience</p>
              <p className="mt-1 font-display text-xl">{partner.experience_years} years</p>
            </div>
            <div className="surface-card p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Languages</p>
              <p className="mt-1 text-sm">{partner.languages}</p>
            </div>
            <div className="surface-card p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Rating</p>
              <p className="mt-1 flex items-center gap-1 font-display text-xl">
                {avg ? (
                  <>
                    <Star className="size-4 fill-current text-warning" />
                    {avg.toFixed(1)}
                  </>
                ) : (
                  "New"
                )}
              </p>
            </div>
          </div>

          <h2 className="mt-12 text-xl">Supported tasks</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            All of these are included in her booked time. Nothing here is priced separately.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(tasks ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground">
                She has not selected specific tasks yet — she can still help with any reasonable
                non-medical support during your booking.
              </p>
            ) : (
              (tasks ?? []).map((task) => (
                <span key={task!.id} className="rounded-full border border-border bg-card px-4 py-2 text-sm">
                  {task!.name}
                </span>
              ))
            )}
          </div>

          <h2 className="mt-12 text-xl">Upcoming availability</h2>
          {(slots ?? []).length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">
              No published availability right now. You can still send a booking request for a time that
              suits you.
            </p>
          ) : (
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {(slots ?? []).map((slot) => (
                <li key={slot.id} className="surface-card flex items-center gap-3 p-4 text-sm">
                  <CalendarDays className="size-4 text-primary" />
                  <span>
                    {formatDate(slot.date)} · {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <h2 className="mt-12 text-xl">Reviews</h2>
          {(reviews ?? []).length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">No reviews yet.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {(reviews ?? []).map((review) => (
                <li key={review.id} className="surface-card p-5">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={
                            i < review.rating ? "size-4 fill-current text-warning" : "size-4 text-border"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">
                      {(review as { profiles?: { full_name?: string } }).profiles?.full_name ?? "Customer"}
                    </span>
                  </div>
                  {review.comment ? (
                    <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <PlaceholderImage name="care-partner" alt="Care Partner portrait" ratio="square" />
          <div className="surface-card mt-4 p-6">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Hourly rate</p>
            <p className="mt-1 font-display text-3xl">
              {formatCurrency(partner.hourly_rate)}
              <span className="text-base font-normal text-muted-foreground">/hour</span>
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              You book her time. Every supported task above is included.
            </p>
            <Button asChild className="mt-5 w-full">
              <Link to="/book" search={{ partner: partner.id }}>
                Book this Care Partner
              </Link>
            </Button>
          </div>
        </aside>
      </div>
    </Section>
  );
}
