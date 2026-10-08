"use client";

import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  Clock3,
  FolderKanban,
  LayoutDashboard,
  ListTodo,
  Menu,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "../lib/auth-client";
import ProductPreview from "../components/landing/product-preview";
import LandingNav from "../components/landing/landing-nav";
import PublicFooter from "../components/public-footer";

export default function HomePage() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const handleStart = () => {
    router.push(session ? "/dashboard" : "/login");
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#080d1a] text-white">
      {/* NAVBAR */}
      <LandingNav
        session={session}
        isPending={isPending}
        router={router}
        onStart={handleStart}
      />

      {/* HERO */}
      <section
        id="inicio"
        className="relative overflow-hidden px-5 pb-0 pt-40 sm:px-8 sm:pt-44 lg:px-10 lg:pt-48"
      >
        <div className="pointer-events-none absolute left-1/2 top-20 h-125 w-175 -translate-x-1/2 rounded-full bg-blue-600/10 blur-[120px]" />

        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mx-auto mb-7 flex w-fit items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/5 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-300 sm:text-xs">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />

            Seu espaço para fazer acontecer
          </div>

          <h1 className="mx-auto max-w-4xl text-[clamp(2.8rem,8vw,6.8rem)] font-medium leading-[0.93] tracking-[-0.055em] text-white">
            Organize o trabalho.
            <br />
            <span className="text-slate-400">
              Mova seus planos.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base sm:leading-7 lg:text-lg">
            O Propeller reúne projetos, tarefas, rotina e tudo que
            você precisa para transformar ideias em progresso real —
            sem complicar o seu dia.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleStart}
              disabled={isPending}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:opacity-60 sm:w-auto"
            >
              {session
                ? "Abrir dashboard"
                : "Começar gratuitamente"}

              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </button>

          </div>
        </div>

        {/* Hero features */}
        <div className="relative mx-auto mt-20 grid max-w-4xl grid-cols-1 divide-y divide-white/10 border-y border-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {[
            {
              icon: Target,
              title: "Clareza",
              text: "Saiba o que importa agora.",
            },
            {
              icon: FolderKanban,
              title: "Organização",
              text: "Tudo no lugar certo.",
            },
            {
              icon: Sparkles,
              title: "Progresso",
              text: "Veja suas ideias avançarem.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="flex items-center justify-center gap-3 px-5 py-5 sm:flex-col sm:py-7"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-blue-400">
                <Icon size={16} />
              </div>

              <div className="text-left sm:text-center">
                <p className="text-xs font-medium text-slate-200">
                  {title}
                </p>

                <p className="mt-1 text-[11px] text-slate-500">
                  {text}
                </p>
              </div>
            </div>
          ))}
        </div>

        <ProductPreview />

      </section>

      <PublicFooter />
    </main>
  );
}