import { Ban, CalendarClock } from "lucide-react";
import { BannedSignOut } from "./sign-out";

export default async function BannedPage({
  searchParams,
}: {
  searchParams: Promise<{ until?: string; disabled?: string }>;
}) {
  const { until, disabled: isDeactivated } = await searchParams;
  const expiration = until ? new Date(until) : null;
  const isTemporary = expiration && !Number.isNaN(expiration.getTime());

  return (
    <main className="grid min-h-screen place-items-center bg-[#080d1a] px-5 py-12 text-white">
      <section className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0d1424] p-8 text-center shadow-2xl sm:p-10">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-red-500/10 text-red-400">
          <Ban size={25} />
        </div>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-red-300">{isDeactivated === "1" ? "Conta desativada" : "Acesso suspenso"}</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">{isDeactivated === "1" ? "Esta conta foi desativada" : isTemporary ? "Sua conta está temporariamente suspensa" : "Sua conta foi suspensa permanentemente"}</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          O acesso ao Propeller foi suspenso. Se você acredita que isso aconteceu por engano, entre em contato com o suporte.
        </p>
        {isTemporary && (
          <p className="mt-5 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300">
            <CalendarClock size={16} />
            Suspensão até {expiration.toLocaleString("pt-BR", { dateStyle: "long", timeStyle: "short" })}
          </p>
        )}
        <div className="mt-7"><BannedSignOut /></div>
      </section>
    </main>
  );
}
