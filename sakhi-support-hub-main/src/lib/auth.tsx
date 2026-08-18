import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type { AppRole, Profile } from "@/types/database";

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  role: AppRole | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  session: null,
  user: null,
  profile: null,
  role: null,
  loading: true,
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadUserData(userId: string) {
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    setProfile(profileData ?? null);

   const { data: roleData, error } = await supabase
  .from("user_roles")
  .select("role")
  .eq("user_id", userId)
  .limit(1)
  .maybeSingle();

if (error) {
  console.error("Error loading user role:", error);
  setRole(null);
  return;
}

    setRole((roleData?.role as AppRole) ?? null);
  }

  useEffect(() => {
    let active = true;

    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        if (!active) return;

        setSession(nextSession);

        if (nextSession?.user) {
          setTimeout(() => {
            void loadUserData(nextSession.user.id);
          }, 0);
        } else {
          setProfile(null);
          setRole(null);
        }
      },
    );

    void supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;

      setSession(data.session);

      if (data.session?.user) {
        await loadUserData(data.session.user.id);
      }

      setLoading(false);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      role,
      loading,
      refreshProfile: async () => {
        if (session?.user) {
          await loadUserData(session.user.id);
        }
      },
    }),
    [session, profile, role, loading],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function homeForRole(role: AppRole | null | undefined) {
  if (role === "admin") return "/admin";
  if (role === "care_partner") return "/partner";
  return "/dashboard";
}

