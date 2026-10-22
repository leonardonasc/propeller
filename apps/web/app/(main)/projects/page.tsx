import { ArchiveIcon, FolderKanban } from "lucide-react";
import { getProjects } from "../../src/services/projects";
import ProjectCreateButton from "./project-create-button";
import { EmptyProjects } from "./_components/empty-projects";
import { ProjectList } from "./_components/project-list";
import { PageHeader } from "../_components/page-header";
import Link from "next/link";
import { headers } from "next/headers";
import { getUser } from "../../src/services/users";

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<{ archived?: string }> }) {
  const archived = (await searchParams).archived === "true";
  const projects = await getProjects(archived);
  const cookie = (await headers()).get("cookie") || "";
  const user = await getUser({ cookie });
  const isFree = user.plan !== "premium";

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Workspace"
        icon={FolderKanban}
        backHref={archived ? "/projects" : "/dashboard"}
        title={archived ? "Projetos arquivados" : "Projetos"}
        description={archived ? "Projetos guardados para consultar ou restaurar depois." : "Organize seu trabalho e acompanhe o que está sendo construído."}
        actions={!archived ? <>
          <Link href="/projects?archived=true" className="inline-flex h-10 items-center rounded-lg border border-border bg-card px-3 text-sm font-medium transition hover:border-primary/50 hover:bg-secondary">
            <ArchiveIcon size={16} />
          </Link>
          <ProjectCreateButton disabled={isFree && projects.length >= 3} />
        </> : <Link href="/projects" className="inline-flex h-10 items-center rounded-lg border border-border bg-card px-3 text-sm font-medium transition hover:border-primary/50 hover:bg-secondary">
          Ver projetos ativos
        </Link>}
      />

      {!archived && <p className="text-xs text-muted-foreground">{isFree ? `${projects.length} de 3 projetos ativos` : `${projects.length} projetos ativos`}</p>}

      {projects.length === 0 ? (
        archived ? <div className="rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center"><p className="font-medium">Nenhum projeto arquivado</p><p className="mt-1 text-sm text-muted-foreground">Quando arquivar um projeto, ele aparecerá aqui.</p></div> : <EmptyProjects />
      ) : (
        <ProjectList projects={projects} archived={archived} />
      )}
    </div>
  );
}
