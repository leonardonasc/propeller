"use client";

import Link from "next/link";
import { Archive, ArrowUpRight, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { setProjectArchived } from "../../../src/services/projects-client";

interface ProjectCardProps { id: string; name: string; description: string | null; archived?: boolean }

export function ProjectCard({ id, name, description, archived = false }: ProjectCardProps) {
  async function toggleArchive() {
    try { await setProjectArchived(id, !archived); window.dispatchEvent(new Event("propeller:projects-changed")); toast.success(archived ? "Projeto restaurado." : "Projeto arquivado."); window.location.reload(); }
    catch { toast.error("Não foi possível atualizar o projeto."); }
  }
  return (
    <article className="group rounded-xl border border-border bg-card p-5 transition duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-xl hover:shadow-black/10">
      <Link href={`/projects/${id}`} className="block">
        <div className="mb-6 flex items-start justify-between gap-4"><div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">{name.charAt(0).toUpperCase()}</div><ArrowUpRight size={17} className="text-muted-foreground transition group-hover:text-primary"/></div>
        <h2 className="font-semibold transition-colors group-hover:text-primary">{name}</h2>
        <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-muted-foreground">{description || "Sem descrição para este projeto."}</p>
      </Link>
      <div className="mt-5 flex items-center justify-between border-t border-border pt-4"><span className="text-xs text-muted-foreground">{archived ? "Arquivado" : "Projeto ativo"}</span><button type="button" onClick={toggleArchive} className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground">{archived ? <RotateCcw size={14}/> : <Archive size={14}/>} {archived ? "Restaurar" : "Arquivar"}</button></div>
    </article>
  );
}
