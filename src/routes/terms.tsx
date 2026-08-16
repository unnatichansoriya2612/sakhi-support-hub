import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, LegalSection, LegalList } from "@/components/site/LegalPage";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Sakhi" },
      {
        name: "description",
        content:
          "The terms that govern the use of Sakhi, including booking rules, time-based pricing, prohibited requests and account termination.",
      },
      { property: "og:title", content: "Terms & Conditions — Sakhi" },
      { property: "og:description", content: "Rules for using the Sakhi women-to-women care platform." },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <LegalPage
      title="Terms & Conditions"
      intro="By creating an account, making a booking or working as a Care Partner on Sakhi, you agree to these terms."
    >
      <LegalSection heading="1. What Sakhi is">
        <p>
          Sakhi is a women-to-women platform that connects customers with trained female Care Partners
          for time-based, non-medical support. Sakhi is a marketplace and coordination platform. It is
          not a hospital, clinic, nursing service, staffing agency or medical provider.
        </p>
      </LegalSection>

      <LegalSection heading="2. Eligibility">
        <LegalList
          items={[
            "You must be at least 18 years old.",
            "Sakhi is women-to-women; both customers and Care Partners are women.",
            "You must provide accurate account information and keep it up to date.",
            "Admin accounts are never available at signup and cannot be self-assigned.",
          ]}
        />
      </LegalSection>

      <LegalSection heading="3. Bookings are time-based">
        <p>
          A booking is one Care Partner for a set number of hours. You are paying for her time, not
          for individual tasks. There is no separate price for cooking, cleaning, errands, comfort
          massage or companionship.
        </p>
        <p>
          Total amount = hourly rate × duration in hours. The hourly rate is set by Sakhi and shown
          before you confirm. A Care Partner can only receive bookings after she has been approved.
        </p>
      </LegalSection>

      <LegalSection heading="4. Non-medical support only">
        <p>Care Partners must never, under any circumstance:</p>
        <LegalList
          items={[
            "Diagnose illnesses or health conditions",
            "Prescribe, supply or administer medicines",
            "Provide medical treatment or medical advice",
            "Perform medical procedures of any kind",
            "Provide sexual or intimate services of any kind",
            "Perform dangerous or illegal tasks",
            "Perform unsafe or heavy work outside their training",
          ]}
        />
        <p>
          Massage on Sakhi means only gentle, comfort-oriented hand or leg massage. Any request beyond
          that is a serious violation of these terms.
        </p>
      </LegalSection>

      <LegalSection heading="5. Right to refuse">
        <p>
          A Care Partner may refuse any task she considers unsafe, inappropriate, illegal, medical or
          beyond her training, and may end a booking early if she feels unsafe. Refusal on these
          grounds is never a breach of the booking.
        </p>
      </LegalSection>

      <LegalSection heading="6. Customer responsibilities">
        <LegalList
          items={[
            "Provide a safe, respectful environment and an accurate address.",
            "Give reasonable instructions within the scope of non-medical support.",
            "Never ask for anything prohibited under section 4.",
            "Pay the confirmed total for the booked time.",
          ]}
        />
      </LegalSection>

      <LegalSection heading="7. Acceptance of terms at booking">
        <p>
          Before confirming any booking you must tick: "I agree to Sakhi's Terms & Conditions, Safety
          Rules and Cancellation Policy." This acceptance is recorded and stored with the booking.
        </p>
      </LegalSection>

      <LegalSection heading="8. Reviews and complaints">
        <p>
          Customers may review completed bookings. Either party may raise a complaint, which is
          reviewed by the Sakhi admin team. Abusive, false or defamatory reviews may be removed.
        </p>
      </LegalSection>

      <LegalSection heading="9. Suspension and termination">
        <p>
          Sakhi may suspend or remove any account that violates these terms, our Safety Rules, or the
          law — including any request for prohibited services.
        </p>
      </LegalSection>

      <LegalSection heading="10. Limitation of liability">
        <p>
          Sakhi coordinates bookings between adults. To the extent permitted by law, Sakhi is not
          liable for indirect or consequential loss arising from a booking. Nothing in these terms
          excludes liability that cannot lawfully be excluded.
        </p>
      </LegalSection>

      <LegalSection heading="11. Changes">
        <p>
          We may update these terms. Continued use of Sakhi after an update means you accept the
          revised terms.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
