import { CheckCircle2, FolderKanban, ListTodo } from "lucide-react";
import Link from "next/link";
import { headers } from "next/headers";
import { getProjects } from "../../src/services/projects";
import { getUser } from "../../src/services/users";
import StatCard from "./_components/stat-card";
import { DashboardHeader } from "./_components/dashboard-header";

export default async function DashboardPage() {
  const cookie = (await headers()).get("cookie") || "";
  const [user, projects] = await Promise.all([
    getUser({ cookie }),
    getProjects(),
  ]);

  return (
    <div className="space-y-8">
      <DashboardHeader userName={user?.name ?? "Olá"} />
      <section aria-label="Resumo do workspace" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Link href="/projects" className="rounded-xl transition hover:-translate-y-0.5">
          <StatCard label="Projetos" value={String(projects.length)} icon={<FolderKanban size={18} />} />
        </Link>
      </section>
    </div>
  );
}
