import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/site/Section";
import { EmptyState } from "@/components/site/EmptyState";
import { StatusBadge } from "@/components/site/StatusBadge";
import { supabase } from "@/lib/supabase";
import { formatCurrency } from "@/lib/format";

export const Route = createFileRoute("/care-partners/")({
  head: () => ({
    meta: [
      { title: "Browse Approved Care Partners — Sakhi" },
      {
        name: "description",
        content:
          "Meet Sakhi's verified, trained Care Partners. See their experience, languages, service area, supported tasks and hourly rate before you book.",
      },
      { property: "og:title", content: "Browse Approved Care Partners — Sakhi" },
      { property: "og:description", content: "Verified, trained women available to support you by the hour." },
    ],
  }),
  component: BrowsePartners,
});

export function usePartnersQuery() {
  return useQuery({
    queryKey: ["care-partners", "approved"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("care_partners")
        .select("*, profiles!care_partners_profile_id_fkey(id, full_name, avatar_url, city)")
        .eq("approval_status", "approved")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

function BrowsePartners() {
  const { data: partners, isLoading } = usePartnersQuery();

  const { data: ratings } = useQuery({
    queryKey: ["reviews", "aggregate"],
    queryFn: async () => {
      const { data } = await supabase.from("reviews").select("care_partner_id, rating");
      const map: Record<string, { total: number; count: number }> = {};
      for (const row of data ?? []) {
        const entry = (map[row.care_partner_id] ??= { total: 0, count: 0 });
        entry.total += row.rating;
        entry.count += 1;
      }
      return map;
    },
  });

  return (
    <Section>
      <SectionHeading
        eyebrow="Care Partners"
        title="Approved, verified and ready to help"
        description="Only Care Partners who have completed verification and training and been approved by our team appear here. You book her time — everything she can help with is included."
      />

      {isLoading ? (
        <p className="mt-10 text-sm text-muted-foreground">Loading Care Partners...</p>
      ) : (partners ?? []).length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="No approved Care Partners yet"
            description="New Care Partners are being verified and trained. Please check back shortly."
            action={
              <Button asChild variant="outline">
                <Link to="/become-a-care-partner">Become a Care Partner</Link>
              </Button>
            }
          />
        </div>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(partners ?? []).map((partner) => {
            const agg = ratings?.[partner.id];
            return (
              <div key={partner.id} className="surface-card flex flex-col p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg">{partner.profiles?.full_name || "Care Partner"}</h3>
                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="size-3" />
                      {partner.service_area || partner.profiles?.city || "Service area on request"}
                    </p>
                  </div>
                  <StatusBadge status={partner.verification_status} />
                </div>
                <p className="mt-4 line-clamp-3 text-sm text-muted-foreground">
                  {partner.bio || "This Care Partner has not added a bio yet."}
                </p>
                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span>{partner.experience_years} yrs experience</span>
                  <span>{partner.languages}</span>
                  {agg ? (
                    <span className="flex items-center gap-1">
                      <Star className="size-3 fill-current text-warning" />
                      {(agg.total / agg.count).toFixed(1)} ({agg.count})
                    </span>
                  ) : null}
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                  <span className="font-display text-xl">
                    {formatCurrency(partner.hourly_rate)}
                    <span className="text-sm font-normal text-muted-foreground">/hr</span>
                  </span>
                  <Button asChild size="sm">
                    <Link to="/care-partners/$id" params={{ id: partner.id }}>
                      View profile
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Section>
  );
}
