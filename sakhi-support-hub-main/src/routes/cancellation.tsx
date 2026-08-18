import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, LegalSection, LegalList } from "@/components/site/LegalPage";

export const Route = createFileRoute("/cancellation")({
  head: () => ({
    meta: [
      { title: "Cancellation & Refund Policy — Sakhi" },
      {
        name: "description",
        content:
          "When you can cancel a Sakhi booking, what it costs, how refunds work, and what happens if a Care Partner cancels or a booking ends early.",
      },
      { property: "og:title", content: "Cancellation & Refund Policy — Sakhi" },
      { property: "og:description", content: "Cancellation windows, charges and refunds for Sakhi bookings." },
    ],
  }),
  component: Cancellation,
});

function Cancellation() {
  return (
    <LegalPage
      title="Cancellation & Refund Policy"
      intro="Plans change. This policy explains what happens when a booking is cancelled by either side."
    >
      <LegalSection heading="1. When a customer can cancel">
        <p>
          You can cancel while a booking is still <strong>pending</strong>, <strong>accepted</strong>{" "}
          or <strong>confirmed</strong>. Once a booking is <strong>in progress</strong> or{" "}
          <strong>completed</strong>, it can no longer be cancelled from the app.
        </p>
      </LegalSection>

      <LegalSection heading="2. Cancellation charges">
        <LegalList
          items={[
            "More than 12 hours before the start time: no charge, full refund.",
            "Between 2 and 12 hours before the start time: 25% of the booking total.",
            "Less than 2 hours before the start time: 50% of the booking total.",
            "No-show at the address: 100% of the booking total.",
          ]}
        />
        <p>
          A cancellation charge respects the Care Partner's blocked time — she has already turned down
          other bookings for those hours.
        </p>
      </LegalSection>

      <LegalSection heading="3. If the Care Partner cancels or rejects">
        <p>
          If a Care Partner rejects a request or cancels a confirmed booking, you are not charged and
          any amount already paid is refunded in full. The time slot is released immediately so you can
          book someone else.
        </p>
      </LegalSection>

      <LegalSection heading="4. Ending a booking early">
        <LegalList
          items={[
            "If you end the booking early by choice, the full booked time is chargeable.",
            "If the Care Partner leaves early for a safety reason, only the time actually worked is charged.",
            "If a Care Partner refuses a prohibited request and the customer ends the booking, the full booked time remains chargeable.",
          ]}
        />
      </LegalSection>

      <LegalSection heading="5. Refund timelines">
        <p>
          Approved refunds are issued to the original payment method. Depending on your bank, refunds
          usually appear within 5-7 working days.
        </p>
      </LegalSection>

      <LegalSection heading="6. Disputes">
        <p>
          If you believe a charge is wrong, raise a complaint from the booking's detail page. The Sakhi
          admin team will review the booking history, reviews and both accounts before deciding.
        </p>
      </LegalSection>

      <LegalSection heading="7. Safety overrides everything">
        <p>
          Any booking involving a prohibited request, harassment or an unsafe environment is cancelled
          immediately, with account action against the party at fault. Safety decisions are not subject
          to the standard refund grid.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
