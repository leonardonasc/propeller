"use client";

import { ArrowRight, Check, Sparkles } from "lucide-react";

export function PricingSection({ onStart }: { onStart: () => void }) {
  return (
    <section id="precos" className="relative overflow-hidden border-y border-white/10 bg-[#0b1220] px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
      <div className="pointer-events-none absolute left-1/2 top-0 size-96 -translate-x-1/2 rounded-full bg-blue-600/10 blur-[120px]" />
      <div className="relative mx-auto max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">Planos</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Um plano para cada etapa</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400 sm:text-base">Comece de graça e escolha mais espaço quando seus projetos crescerem.</p>
        </div>
        <div className="mx-auto mt-10 grid max-w-3xl gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-white/10 bg-[#080d1a]/80 p-6 sm:p-8">
            <div className="flex items-center justify-between"><h3 className="text-lg font-semibold text-white">Free</h3><span className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-slate-400">Para começar</span></div>
            <p className="mt-5 text-4xl font-semibold tracking-tight text-white">R$ 0<span className="ml-1 text-sm font-normal text-slate-500">/ sempre</span></p>
            <p className="mt-2 min-h-10 text-sm text-slate-400">O essencial para organizar seu trabalho individual.</p>
            <ul className="mt-6 space-y-3 text-sm text-slate-300">{["Projetos e tarefas", "Quadro visual por status", "Comentários nas tarefas"].map((feature) => <li key={feature} className="flex items-center gap-2.5"><Check size={15} className="text-blue-400" />{feature}</li>)}</ul>
            <button type="button" onClick={onStart} className="mt-8 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-white/15 text-sm font-semibold text-white transition hover:bg-white/5">Começar gratuitamente<ArrowRight size={15} /></button>
          </article>
          <article className="relative rounded-2xl border border-blue-400/40 bg-gradient-to-b from-blue-500/10 to-[#080d1a]/90 p-6 shadow-xl shadow-blue-950/30 sm:p-8">
            <span className="absolute -top-3 right-6 inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white"><Sparkles size={12} />Em breve</span>
            <div className="flex items-center justify-between"><h3 className="text-lg font-semibold text-white">Premium</h3><span className="rounded-full border border-blue-300/20 px-2.5 py-1 text-[11px] text-blue-200">Para crescer</span></div>
            <p className="mt-5 text-4xl font-semibold tracking-tight text-white">R$ 19,90<span className="ml-1 text-sm font-normal text-slate-400">/ mês</span></p>
            <p className="mt-2 min-h-10 text-sm text-slate-400">Mais capacidade e recursos para projetos maiores.</p>
            <ul className="mt-6 space-y-3 text-sm text-slate-300">{["Projetos ilimitados", "Acompanhamento avançado", "Recursos exclusivos"].map((feature) => <li key={feature} className="flex items-center gap-2.5"><Check size={15} className="text-blue-300" />{feature}</li>)}</ul>
            <button type="button" disabled onClick={onStart} className="mt-8 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-white/15 text-sm font-semibold text-white/50 hover:cursor-not-allowed transition hover:bg-white/5">Em breve</button>
          </article>
        </div>
        <p className="mt-5 text-center text-xs text-slate-500">O plano Premium ainda não está disponível para contratação.</p>
      </div>
    </section>
  );
}
