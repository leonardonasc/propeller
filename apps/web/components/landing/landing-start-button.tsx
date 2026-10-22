"use client";

import { ArrowRight } from "lucide-react";
import { useLandingSession } from "./landing-session";

export default function LandingStartButton({ variant = "primary" }: { variant?: "primary" | "outline" }) {
  const { session, isPending, start } = useLandingSession();
  const className = variant === "outline"
    ? "group inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-white/15 text-sm font-semibold text-white transition hover:bg-white/5 disabled:opacity-60"
    : "group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:opacity-60 sm:w-auto";
  return <button type="button" onClick={start} disabled={isPending} className={className}>
    {session ? "Abrir dashboard" : "Começar gratuitamente"}<ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
  </button>;
}
