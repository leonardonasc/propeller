import { ArrowRight, FolderKanban, Sparkles, Target } from "lucide-react";
import LandingNav from "../components/landing/landing-nav";
import ProductPreview from "../components/landing/product-preview";
import { PricingSection } from "../components/landing/pricing-section";
import PublicFooter from "../components/public-footer";
import LandingStartButton from "../components/landing/landing-start-button";
import { LandingSessionProvider } from "../components/landing/landing-session";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Organize projetos, tarefas e rotina",
  description: "Organize projetos, tarefas e rotina em um só lugar. Transforme ideias em progresso com o Propeller.",
};

const features = [
  { icon: Target, title: "Clareza", text: "Saiba o que importa agora." },
  { icon: FolderKanban, title: "Organização", text: "Tudo no lugar certo." },
  { icon: Sparkles, title: "Progresso", text: "Veja suas ideias avançarem." },
];

export default function HomePage() {
  return (
    <LandingSessionProvider>
    <main className="min-h-screen overflow-x-hidden bg-[#080d1a] text-white">
      <LandingNav />
      <section id="inicio" className="relative overflow-hidden px-5 pb-0 pt-40 sm:px-8 sm:pt-44 lg:px-10 lg:pt-48">
        <div className="pointer-events-none absolute left-1/2 top-20 h-125 w-175 -translate-x-1/2 rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mx-auto mb-7 flex w-fit items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/5 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-300 sm:text-xs">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" /> Seu espaço para fazer acontecer
          </div>
          <h1 className="mx-auto max-w-4xl text-[clamp(2.8rem,8vw,6.8rem)] font-medium leading-[0.93] tracking-[-0.055em] text-white">
            Organize o trabalho.<br /><span className="text-slate-400">Mova seus planos.</span>
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base sm:leading-7 lg:text-lg">
            O Propeller reúne projetos, tarefas, rotina e tudo que você precisa para transformar ideias em progresso real — sem complicar o seu dia.
          </p>
          <div className="mt-8 flex justify-center"><LandingStartButton /></div>
        </div>
        <div className="relative mx-auto mt-20 grid max-w-4xl grid-cols-1 divide-y divide-white/10 border-y border-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-center justify-center gap-3 px-5 py-5 sm:flex-col sm:py-7">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-blue-400"><Icon size={16} /></div>
              <div className="text-left sm:text-center"><p className="text-xs font-medium text-slate-200">{title}</p><p className="mt-1 text-[11px] text-slate-400">{text}</p></div>
            </div>
          ))}
        </div>
        <ProductPreview />
      </section>
      <PricingSection />
      <PublicFooter />
    </main>
    </LandingSessionProvider>
  );
}
