import type { ReactNode } from "react";

export function LegalPage({
  title,
  updated = "This policy was last reviewed in 2026.",
  intro,
  children,
}: {
  title: string;
  updated?: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <div className="container-page py-16">
      <div className="max-w-3xl">
        <h1 className="text-4xl">{title}</h1>
        <p className="mt-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">{updated}</p>
        {intro ? <p className="mt-6 text-muted-foreground">{intro}</p> : null}
        <div className="mt-10 space-y-8">{children}</div>
      </div>
    </div>
  );
}

export function LegalSection({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-xl">{heading}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}

export function LegalList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
