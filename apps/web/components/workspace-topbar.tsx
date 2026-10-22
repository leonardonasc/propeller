"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { NotificationCenter } from "./notification-center";

const sections: Record<string, string> = {
  "/dashboard": "Visão geral",
  "/projects": "Projetos",
  "/calendar": "Agenda",
  "/profile": "Meu perfil",
  "/admin": "Administração",
};

export function WorkspaceTopbar() {
  const pathname = usePathname();
  const [today, setToday] = useState("");
  const searchParams = useSearchParams();
  const archivedProjects = searchParams.get("archived") === "true";
  const section = Object.entries(sections).find(([href]) => pathname.startsWith(href))?.[1] ?? "Workspace";
  const showBack = pathname !== "/dashboard";
  const backHref = pathname.startsWith("/projects/") || (pathname === "/projects" && archivedProjects) ? "/projects" : "/dashboard";

  useEffect(() => {
    setToday(new Intl.DateTimeFormat("pt-BR", { dateStyle: "full" }).format(new Date()));
  }, []);

  return <div className="mb-6 flex items-center justify-between border-b border-border/80 pb-3 pt-1 md:mb-7 md:pb-4">
    <div className="flex min-w-0 items-center gap-3">
      {showBack && <Link href={backHref} aria-label="Voltar" title="Voltar" className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 text-xs font-medium text-muted-foreground transition hover:border-primary/50 hover:bg-secondary hover:text-foreground"><ArrowLeft size={15}/><span>Voltar</span></Link>}
      <p className="truncate text-xs font-medium text-muted-foreground"><span className="text-foreground">Propeller</span><span className="mx-2 text-border">/</span>{section}</p>
    </div>
    <div className="flex shrink-0 items-center gap-4"><p className="hidden text-xs text-muted-foreground md:block">{today}</p><NotificationCenter /></div>
  </div>;
}
