import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useAuth, homeForRole } from "@/lib/auth";
import type { AppRole } from "@/types/database";

export function RoleGate({ allow, children }: { allow: AppRole[]; children: ReactNode }) {
  const { role, loading } = useAuth();

  if (loading || !role) {
    return (
      <div className="container-page py-20">
        <p className="text-sm text-muted-foreground">Loading your account...</p>
      </div>
    );
  }

  if (!allow.includes(role)) {
    return (
      <div className="container-page py-20">
        <div className="surface-card mx-auto max-w-lg p-10 text-center">
          <h1 className="text-2xl">This area isn't for your account</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            You're signed in as a {role.replace("_", " ")}. Head back to your own dashboard.
          </p>
          <Button asChild className="mt-6">
            <Link to={homeForRole(role)}>Go to my dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
