import Link from "next/link"

import { getProjects } from "../../src/services/projects"

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <main className="bg-background text-foreground">
      <div className="py-8">
        <header className="mb-8 flex items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Projetos
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Organize seus projetos e acompanhe o que está sendo
              construído.
            </p>
          </div>

          <Link
            href="/projects/new"
            className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-accent"
          >
            Novo projeto
          </Link>
        </header>

        {projects.length === 0 ? (
          <EmptyProjects />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                name={project.name}
                description={project.description}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

function ProjectCard({
  id,
  name,
  description,
}: {
  id: string
  name: string
  description: string | null
}) {
  return (
    <Link
      href={`/projects/${id}`}
      className="group rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/40"
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-sm font-semibold text-primary">
          {name.charAt(0).toUpperCase()}
        </div>

        <span className="text-muted-foreground transition-colors group-hover:text-foreground">
          →
        </span>
      </div>

      <h2 className="font-semibold transition-colors group-hover:text-primary">
        {name}
      </h2>

      <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>

      <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
        <span className="text-xs text-muted-foreground">
          Projeto
        </span>

        <span className="flex items-center gap-2 text-xs text-emerald-400">
          <span className="size-1.5 rounded-full bg-emerald-400" />
          Ativo
        </span>
      </div>
    </Link>
  )
}

function EmptyProjects() {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card">
      <div className="mb-4 flex size-10 items-center justify-center rounded-md bg-primary/10 text-lg text-primary">
        +
      </div>

      <h2 className="font-semibold">
        Nenhum projeto ainda
      </h2>

      <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">
        Crie seu primeiro projeto para começar a organizar suas
        tarefas e acompanhar seu progresso.
      </p>

      <Link
        href="/projects/new"
        className="mt-5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-accent"
      >
        Criar primeiro projeto
      </Link>
    </div>
  )
}