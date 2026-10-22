"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "../../lib/auth-client";

const LandingSessionContext = createContext<{
  session: typeof authClient.$Infer.Session | null;
  isPending: boolean;
  start: () => void;
} | null>(null);

export function LandingSessionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const value = {
    session: session ?? null,
    isPending,
    start: () => router.push(session ? "/dashboard" : "/login"),
  };
  return <LandingSessionContext.Provider value={value}>{children}</LandingSessionContext.Provider>;
}

export function useLandingSession() {
  const context = useContext(LandingSessionContext);
  if (!context) throw new Error("LandingSessionProvider ausente.");
  return context;
}
