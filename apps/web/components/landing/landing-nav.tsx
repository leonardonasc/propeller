"use client";

import { useEffect, useState } from "react";
import { ArrowRight, ChevronRight, Menu, X } from "lucide-react";
import PropellerIcon from "../propeller-icon";
import { useLandingSession } from "./landing-session";

const navigation = [
  { label: "História", href: "/historia" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Recursos", href: "#recursos" },
  { label: "Preços", href: "#precos" },
];

export default function LandingNav() {
  const { session, isPending, start } = useLandingSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [mobileMenuOpen]);

  return <header className="absolute top-0 z-50 w-full bg-transparent"><div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
    <nav aria-label="Navegação principal" className="flex h-14 items-center justify-between rounded-2xl border border-white/10 bg-[#080d1a]/80 px-3 shadow-lg shadow-black/10 backdrop-blur-xl sm:px-4">
      <a href="/" className="flex items-center gap-2.5 rounded-lg px-2 py-1.5"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white"><PropellerIcon size={17}/></span><span className="text-sm font-semibold tracking-tight">Propeller</span></a>
      <div className="hidden items-center gap-1 md:flex">{navigation.map(item=><a key={item.href} href={item.href} className="rounded-lg px-3 py-2 text-xs font-medium text-slate-400 transition hover:bg-white/5 hover:text-white">{item.label}</a>)}</div>
      <div className="hidden items-center gap-2 md:flex">{!session&&<button type="button" onClick={()=>start()} className="rounded-lg px-3 py-2 text-xs font-medium text-slate-400 transition hover:text-white">Entrar</button>}<button type="button" onClick={start} disabled={isPending} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60">{session?"Dashboard":"Começar"}<ArrowRight size={14}/></button></div>
      <button type="button" onClick={()=>setMobileMenuOpen(open=>!open)} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 transition hover:bg-white/5 md:hidden" aria-label={mobileMenuOpen?"Fechar menu":"Abrir menu"} aria-expanded={mobileMenuOpen} aria-controls="landing-mobile-menu">{mobileMenuOpen?<X size={19}/>:<Menu size={19}/>}</button>
    </nav>
    {mobileMenuOpen&&<div id="landing-mobile-menu" className="mt-2 rounded-2xl border border-white/10 bg-[#0d1424] p-2 shadow-xl md:hidden">{navigation.map(item=><a key={item.href} href={item.href} onClick={()=>setMobileMenuOpen(false)} className="flex items-center justify-between rounded-xl px-4 py-3 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white">{item.label}<ChevronRight size={15} className="text-slate-400"/></a>)}<div className="my-2 h-px bg-white/5"/>{!session&&<button type="button" onClick={()=>{setMobileMenuOpen(false);start()}} className="w-full rounded-xl px-4 py-3 text-left text-sm text-slate-300">Entrar</button>}<button type="button" onClick={()=>{setMobileMenuOpen(false);start()}} disabled={isPending} className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60">{session?"Ir para dashboard":"Começar agora"}<ArrowRight size={15}/></button></div>}
  </div></header>;
}
