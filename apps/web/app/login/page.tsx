"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "../../lib/auth-client";
import { LoginForm } from "./_components/sign-in";
import { RegisterForm } from "./_components/sign-up";

export default function AuthPage() {
  const { data: session, isPending: isLoading } = authClient.useSession();

  const [activeForm, setActiveForm] = useState<"login" | "register">(
    "login",
  );

  const router = useRouter();

  useEffect(() => {
    if (!isLoading && session) {
      router.replace("/dashboard");
    }
  }, [session, isLoading, router]);

  if (isLoading || session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080d1a]">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <div className="size-4 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500" />
          Carregando...
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080d1a] px-4 py-10">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid size-10 place-items-center rounded-xl bg-blue-600 text-sm font-extrabold text-white shadow-lg shadow-blue-600/20">
            P
          </div>

          <h1 className="text-lg font-semibold tracking-tight text-white">
            Propeller
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Organize seu trabalho em um só lugar.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-800 bg-[#0d1424] p-6 shadow-2xl shadow-black/20 sm:p-8">
          {/* Tabs */}
          <div className="mb-7 grid grid-cols-2 rounded-lg bg-[#080d1a] p-1">
            <button
              type="button"
              onClick={() => setActiveForm("login")}
              className={[
                "rounded-md px-3 py-2 text-sm font-medium transition",
                activeForm === "login"
                  ? "bg-[#172238] text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-300",
              ].join(" ")}
            >
              Entrar
            </button>

            <button
              type="button"
              onClick={() => setActiveForm("register")}
              className={[
                "rounded-md px-3 py-2 text-sm font-medium transition",
                activeForm === "register"
                  ? "bg-[#172238] text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-300",
              ].join(" ")}
            >
              Criar conta
            </button>
          </div>

          {activeForm === "login" ? <LoginForm /> : <RegisterForm />}
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-slate-600">
          Ao continuar, você concorda com os termos de uso do Propeller.
        </p>
      </div>
    </main>
  );
}
