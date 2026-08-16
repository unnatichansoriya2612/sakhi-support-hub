import type { ReactNode } from "react";
import { DashboardNav, type NavItem } from "@/components/site/DashboardNav";
import { PageHeader } from "@/components/site/PageHeader";

export const customerNav: NavItem[] = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/book", label: "Book Care" },
  { to: "/bookings", label: "My Bookings" },
  { to: "/notifications", label: "Notifications" },
  { to: "/profile", label: "Profile" },
];

export const partnerNav: NavItem[] = [
  { to: "/partner", label: "Dashboard" },
  { to: "/partner/application", label: "Application" },
  { to: "/partner/bookings", label: "Bookings" },
  { to: "/partner/availability", label: "Availability" },
  { to: "/partner/training", label: "Training" },
  { to: "/partner/earnings", label: "Earnings" },
  { to: "/profile", label: "Profile" },
];

export const adminNav: NavItem[] = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/care-partners", label: "Care Partners" },
  { to: "/admin/applications", label: "Applications" },
  { to: "/admin/verification", label: "Verification" },
  { to: "/admin/training", label: "Training" },
  { to: "/admin/tasks", label: "Tasks" },
  { to: "/admin/pricing", label: "Pricing" },
  { to: "/admin/bookings", label: "Bookings" },
  { to: "/admin/reviews", label: "Reviews" },
  { to: "/admin/complaints", label: "Complaints" },
];

export function DashboardShell({
  nav,
  eyebrow,
  title,
  description,
  actions,
  children,
}: {
  nav: NavItem[];
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="container-page py-10">
      <DashboardNav items={nav} />
      <div className="mt-6">
        <PageHeader eyebrow={eyebrow} title={title} description={description} actions={actions} />
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}
