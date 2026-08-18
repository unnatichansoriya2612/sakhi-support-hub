import { Link } from "@tanstack/react-router";

const columns = [
  {
    title: "Sakhi",
    links: [
      { to: "/about", label: "About" },
      { to: "/how-it-works", label: "How It Works" },
      { to: "/what-we-offer", label: "What We Offer" },
      { to: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Care Partners",
    links: [
      { to: "/become-a-care-partner", label: "Become a Care Partner" },
      { to: "/care-partners", label: "Browse Care Partners" },
      { to: "/safety", label: "Safety & Trust" },
    ],
  },
  {
    title: "Policies",
    links: [
      { to: "/terms", label: "Terms & Conditions" },
      { to: "/privacy", label: "Privacy Policy" },
      { to: "/cancellation", label: "Cancellation & Refund Policy" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-sand">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl text-primary">सखी</span>
            <span className="text-sm font-semibold tracking-[0.22em] text-muted-foreground">SAKHI</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            When you're away from home, you still deserve to be cared for.
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            Sakhi provides non-medical care and companionship only.
          </p>
        </div>
        {columns.map((column) => (
          <div key={column.title}>
            <h4 className="text-sm font-semibold">{column.title}</h4>
            <ul className="mt-4 space-y-2">
              {column.links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border/70">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Sakhi. All rights reserved.</span>
          <span>Women-to-women care, built on trust.</span>
        </div>
      </div>
    </footer>
  );
}
