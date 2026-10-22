"use client";

import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Project } from "../../../src/schemas/project";
import { ProjectCard } from "./project-card";

export function ProjectList({ projects, archived = false, toolbarActions }: { projects: Project[]; archived?: boolean; toolbarActions?: ReactNode }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 9;
  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");
    if (!normalizedQuery) return projects;

    return projects.filter((project) =>
      `${project.name} ${project.description ?? ""}`
        .toLocaleLowerCase("pt-BR")
        .includes(normalizedQuery),
    );
  }, [projects, query]);
  const pageCount = Math.max(1, Math.ceil(filteredProjects.length / pageSize));
  const visibleProjects = filteredProjects.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
      <label className="relative block w-full min-w-0 sm:w-[calc((100%_-_0.75rem)/2)] xl:w-[calc((100%_-_1.5rem)/3)]">
        <Search
          size={17}
          aria-hidden="true"
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => { setQuery(event.target.value); setPage(1); }}
          placeholder="Buscar projetos por nome ou descrição..."
          aria-label="Buscar projetos"
          className="h-10 w-full rounded-lg border border-input bg-card pl-10 pr-3.5 text-sm text-card-foreground shadow-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10"
        />
      </label>
      {toolbarActions && <div className="flex shrink-0 flex-wrap items-center gap-2">{toolbarActions}</div>}
      </div>

      {filteredProjects.length ? (
        <section aria-label="Projetos filtrados" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visibleProjects.map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              name={project.name}
              description={project.description}
              archived={archived}
            />
          ))}
        </section>
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center">
          <p className="font-medium">Nenhum projeto encontrado</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Tente buscar por outro nome ou descrição.
          </p>
        </div>
      )}
      {filteredProjects.length > pageSize && (
        <nav aria-label="Paginação dos projetos" className="flex items-center justify-center gap-4">
          <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1} className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-medium transition hover:border-primary/50 disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft size={16} />Anterior</button>
          <span className="text-sm text-muted-foreground">Página {page} de {pageCount}</span>
          <button type="button" onClick={() => setPage((current) => Math.min(pageCount, current + 1))} disabled={page === pageCount} className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-medium transition hover:border-primary/50 disabled:cursor-not-allowed disabled:opacity-40">Próxima<ChevronRight size={16} /></button>
        </nav>
      )}
    </div>
  );
}
