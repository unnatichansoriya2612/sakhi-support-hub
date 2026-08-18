import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/lib/supabase";
import { useAuth, homeForRole } from "@/lib/auth";

const searchSchema = z.object({
  mode: z.enum(["login", "signup"]).optional(),
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Log in or Sign up — Sakhi" },
      {
        name: "description",
        content: "Access your Sakhi account to book a Care Partner, manage bookings, or work as a Care Partner.",
      },
      { property: "og:title", content: "Log in or Sign up — Sakhi" },
      { property: "og:description", content: "Sign in to Sakhi to book care or manage your Care Partner account." },
    ],
  }),
  component: AuthPage,
});

const signupSchema = z.object({
  full_name: z.string().trim().min(2, "Please enter your full name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(255),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number")
    .max(20)
    .regex(/^[0-9+\-\s()]+$/, "Phone can only contain digits and + - ( )"),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
  role: z.enum(["customer", "care_partner"]),
});

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});

function AuthPage() {
  const search = useSearch({ from: "/auth" });
  const navigate = useNavigate();
  const { user, role, loading } = useAuth();
  const [tab, setTab] = useState(search.mode ?? "login");

  useEffect(() => {
    if (!loading && user && role) {
      void navigate({ to: search.redirect ?? homeForRole(role), replace: true });
    }
  }, [loading, user, role, navigate, search.redirect]);

  return (
    <div className="container-page flex justify-center py-16">
      <div className="w-full max-w-md">
        <div className="text-center">
          <span className="font-display text-4xl text-primary">सखी</span>
          <h1 className="mt-3 text-2xl">Welcome to Sakhi</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            When you're away from home, you still deserve to be cared for.
          </p>
        </div>

        <div className="surface-card mt-8 p-6">
          <Tabs value={tab} onValueChange={(v) => setTab(v as "login" | "signup")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Log in</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="pt-6">
              <LoginForm />
            </TabsContent>
            <TabsContent value="signup" className="pt-6">
              <SignupForm onDone={() => setTab("login")} />
            </TabsContent>
          </Tabs>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By continuing you agree to our{" "}
          <Link to="/terms" className="underline">
            Terms
          </Link>
          ,{" "}
          <Link to="/safety" className="underline">
            Safety Rules
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [forgot, setForgot] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Check your details");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Welcome back");
  }

  async function sendReset() {
    const parsed = z.string().email().safeParse(email.trim());
    if (!parsed.success) {
      toast.error("Enter your email address first");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (error) toast.error(error.message);
    else toast.success("Password reset link sent. Check your email.");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="login-email">Email</Label>
        <Input
          id="login-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      {!forgot ? (
        <div className="space-y-2">
          <Label htmlFor="login-password">Password</Label>
          <Input
            id="login-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      ) : null}

      {forgot ? (
        <div className="space-y-3">
          <Button type="button" className="w-full" disabled={busy} onClick={sendReset}>
            Send reset link
          </Button>
          <Button type="button" variant="ghost" className="w-full" onClick={() => setForgot(false)}>
            Back to log in
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Signing in..." : "Log in"}
          </Button>
          <button
            type="button"
            className="w-full text-center text-xs text-muted-foreground underline"
            onClick={() => setForgot(true)}
          >
            Forgot your password?
          </button>
        </div>
      )}
    </form>
  );
}

function SignupForm({ onDone }: { onDone: () => void }) {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    role: "customer" as "customer" | "care_partner",
  });
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = signupSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Check your details");
      return;
    }
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          full_name: parsed.data.full_name,
          phone: parsed.data.phone,
          role: parsed.data.role,
        },
      },
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (!data.session) {
      setSent(true);
      toast.success("Account created. Check your email to confirm it.");
      onDone();
      return;
    }
    toast.success("Account created");
  }

  if (sent) {
    return (
      <div className="space-y-3 text-center">
        <h3 className="text-lg">Check your email</h3>
        <p className="text-sm text-muted-foreground">
          We sent a confirmation link to {form.email}. Click it, then log in.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="su-name">Full name</Label>
        <Input
          id="su-name"
          value={form.full_name}
          onChange={(e) => set("full_name", e.target.value)}
          maxLength={100}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="su-email">Email</Label>
        <Input
          id="su-email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          maxLength={255}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="su-phone">Phone</Label>
        <Input
          id="su-phone"
          type="tel"
          autoComplete="tel"
          value={form.phone}
          onChange={(e) => set("phone", e.target.value)}
          maxLength={20}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="su-password">Password</Label>
        <Input
          id="su-password"
          type="password"
          autoComplete="new-password"
          value={form.password}
          onChange={(e) => set("password", e.target.value)}
          minLength={8}
          required
        />
        <p className="text-xs text-muted-foreground">At least 8 characters.</p>
      </div>
      <div className="space-y-2">
        <Label>Account type</Label>
        <RadioGroup
          value={form.role}
          onValueChange={(v) => set("role", v as "customer" | "care_partner")}
          className="grid grid-cols-1 gap-2 sm:grid-cols-2"
        >
          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary/5">
            <RadioGroupItem value="customer" className="mt-0.5" />
            <span>
              <span className="font-semibold">Customer</span>
              <span className="mt-0.5 block text-xs text-muted-foreground">I want to book care</span>
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary/5">
            <RadioGroupItem value="care_partner" className="mt-0.5" />
            <span>
              <span className="font-semibold">Care Partner</span>
              <span className="mt-0.5 block text-xs text-muted-foreground">I want to give care</span>
            </span>
          </label>
        </RadioGroup>
      </div>
      <Button type="submit" className="w-full" disabled={busy}>
        {busy ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}
